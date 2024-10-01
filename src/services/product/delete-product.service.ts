import prisma from "../../prisma";

interface deleteProductParams {
  name: string;
}

export const deleteProductService = async (params: deleteProductParams) => {
  try {
    const { name } = params;

    const product = await prisma.product.findFirst({
      where: { name },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const id = product.id;

    const deleteProduct = await prisma.product.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return deleteProduct;
  } catch (error) {
    throw error;
  }
};
