import { MidtransClient } from "midtrans-node-client";
import {
  MIDTRANS_CLIENT_KEY,
  MIDTRANS_SERVER_KEY,
  NEXT_BASE_URL,
} from "../../../config";
import { IOrderArgs } from "../../../types/order.type";
import prisma from "../../../prisma";
import { OrderStatus } from "@prisma/client";
import { scheduleJob } from "node-schedule";

const snap = new MidtransClient.Snap({
  isProduction: false,
  clientKey: MIDTRANS_CLIENT_KEY,
  serverKey: MIDTRANS_SERVER_KEY,
});

export const createOrderService = async (body: IOrderArgs) => {
  try {
    const { products, paymentMethod, phoneNumber } = body;

    // Ensure products is an array
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("Products must be an array and cannot be empty.");
    }

    const orderNumber = `ORDER-${new Date()
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14)}`;

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          phoneNumber,
          totalAmount: 0,
          status: "WAITING_FOR_PAYMENT",
        },
        include: {
          OrderItem: {
            include: {
              products: true,
            },
          },
        },
      });

      let totalAmount = 0;

      // Iterate over the products array
      for (const product of products) {
        const { name, qty } = product;

        const productDetails = await tx.product.findFirst({
          where: { name },
        });

        if (!productDetails) {
          throw new Error(`Product with name ${name} not found`);
        }

        const productTotal = productDetails.price * qty;
        totalAmount += productTotal;

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: productDetails.id,
            qty: qty,
            price: productDetails.price,
            total: productTotal,
          },
        });
      }

      const updateOrder = await tx.order.update({
        where: { id: newOrder.id },
        data: { totalAmount: totalAmount },
        include: { OrderItem: true },
      });

      const transactionPayload = {
        transaction_details: {
          order_id: newOrder.orderNumber,
          gross_amount: totalAmount,
          paymentMethod: paymentMethod,
        },
        customer_details: {
          phone: String(phoneNumber),
        },
        item_details: await Promise.all(
          products.map(async (product) => {
            const productDetails = await prisma.product.findFirst({
              where: { name: product.name },
            });

            if (!productDetails) {
              throw new Error("Product not found on transaction payload");
            }

            return {
              id: productDetails.id,
              price: productDetails.price,
              quantity: product.qty,
              name: product.name,
            };
          })
        ),

        callbacks: {
          finish: `${NEXT_BASE_URL}/order/order-details/${newOrder.id}`,
          error: `${NEXT_BASE_URL}/order/order-details/${newOrder.id}`,
          pending: `${NEXT_BASE_URL}/order/order-details/${newOrder.id}`,
        },
      };

      const transaction = await snap.createTransaction(transactionPayload);
      const transactionToken = transaction.token;

      if (paymentMethod === "QRIS") {
        await tx.payment.create({
          data: {
            amount: totalAmount,
            invoiceNumber: orderNumber,
            paymentMethod: "QRIS",
            snapRedirectUrl: transaction.redirect_url,
            snapToken: transactionToken,
            paymentStatus: "PENDING",
            orderId: newOrder.id,
          },
        });
      } else {
        await tx.payment.create({
          data: {
            amount: totalAmount,
            invoiceNumber: orderNumber,
            paymentMethod: "VIRTUAL_ACCOUNT",
            snapRedirectUrl: transaction.redirect_url,
            snapToken: transactionToken,
            paymentStatus: "PENDING",
            orderId: newOrder.id,
          },
        });
      }

      return updateOrder;
    });

    const schedule = new Date(Date.now() + 60 * 30 * 1000);
    scheduleJob("run every", schedule, async () => {
      const findOrder = await prisma.order.findFirst({
        where: { id: order.id },
        include: {
          OrderItem: true,
          Payment: true,
        },
      });

      await prisma.$transaction(async (tx) => {
        if (!findOrder) {
          throw new Error("Order not found");
        }

        if (findOrder.status === OrderStatus.WAITING_FOR_PAYMENT) {
          await tx.order.update({
            where: {
              id: findOrder.id,
            },
            data: {
              status: "ORDER_CANCELLED",
            },
          });

          await tx.payment.update({
            where: {
              id: findOrder.Payment?.id,
            },
            data: {
              paymentStatus: "CANCELLED",
            },
          });
        }
      });
    });

    return {
      order,
    };
  } catch (error) {
    throw error;
  }
};
