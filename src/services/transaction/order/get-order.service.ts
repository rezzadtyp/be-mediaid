import prisma from "../../../prisma";

export const getOrderService = async (orderId: string) => {
  try {
    const order = await prisma.order.findFirst({
      where: { orderNumber: orderId },
      include: {
        OrderItem: {
          include: {
            products: true,
          },
        },
        Payment: true,
      },
    });

    return {
      data: order,
    };
  } catch (error) {
    throw error;
  }
};
