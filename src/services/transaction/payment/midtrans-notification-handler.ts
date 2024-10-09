import prisma from "../../../prisma";
import { PaymentResponse } from "../../../types/midtrans-callback-response";

export const midtransNotificationHandlerService = async (
  body: PaymentResponse
) => {
  try {
    if (!body) {
      throw new Error("Midtrans callback failed: No body provided.");
    }

    const findOrder = await prisma.order.findFirst({
      where: { orderNumber: body.order_id },
      include: { Payment: true, OrderItem: true },
    });

    if (!findOrder) {
      throw new Error(`Order not found: ${body.order_id}`);
    }

    await prisma.$transaction(async (tx) => {
      // Handle "capture" status
      if (body.transaction_status === "capture") {
        if (body.fraud_status === "accept") {
          await tx.payment.update({
            where: { id: findOrder.Payment?.id },
            data: {
              paymentStatus: "COMPLETED",
              paymentMethod:
                body.payment_type === "qris" ? "QRIS" : "VIRTUAL_ACCOUNT",
            },
          });

          if (findOrder.status === "WAITING_FOR_PAYMENT") {
            await tx.order.update({
              where: { id: findOrder.id },
              data: { status: "ORDER_PROCESSED" },
            });
          }
        }
      }
      // Handle "settlement" status
      else if (body.transaction_status === "settlement") {
        await tx.payment.update({
          where: { id: findOrder.Payment?.id },
          data: {
            paymentStatus: "COMPLETED",
            paymentMethod:
              body.payment_type === "qris" ? "QRIS" : "VIRTUAL_ACCOUNT",
          },
        });

        if (findOrder.status === "WAITING_FOR_PAYMENT") {
          // Handle cancellation logic
          await tx.order.update({
            where: { id: findOrder.id },
            data: {
              status: "ORDER_CANCELLED",
            },
          });

          for (const orderItem of findOrder.OrderItem) {
            const product = await tx.product.findUnique({
              where: {
                id: orderItem.productId,
              },
            });

            if (!product) {
              throw new Error(
                `Product not found, productId: ${orderItem.productId}`
              );
            }

            // await tx.product.update({
            //   where: { id: product.id },
            //   data: {
            //     stock: {
            //       increment: orderItem.qty,
            //     },
            //   },
            // });
          }
        }
      }
      // Handle "cancel", "expired", "deny" statuses
      else if (
        body.transaction_status === "cancel" ||
        body.transaction_status === "expired" ||
        body.transaction_status === "deny"
      ) {
        await tx.payment.update({
          where: { id: findOrder.Payment?.id },
          data: {
            paymentStatus: "CANCELLED",
            paymentMethod:
              body.payment_type === "qris" ? "QRIS" : "VIRTUAL_ACCOUNT",
          },
        });

        await tx.order.update({
          where: { id: findOrder.id },
          data: {
            status: "ORDER_CANCELLED",
          },
        });
      }
    });

    return {
      message: "OK",
    };
  } catch (error) {
    console.error("Error in midtransNotificationHandlerService:", error);
    throw error;
  }
};
