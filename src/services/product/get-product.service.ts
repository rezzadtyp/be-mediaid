import prisma from "../../prisma";

interface getProductParams {
  name: string;
}

export const getProductService = async (params: getProductParams) => {
  try {
    const { name } = params;

    const product = await prisma.product.findFirst({
      where: { name },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        best_seller: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  } catch (error) {
    throw error;
  }
};
