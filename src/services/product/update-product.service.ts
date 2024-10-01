import { Product } from "@prisma/client";
import prisma from "../../prisma";

interface createProductParams {
  name: string;
}

export const updateProductService = async (
  query: createProductParams,
  body: Partial<Product>
) => {
  try {
    const { name } = query;

    const product = await prisma.product.findFirst({
      where: { name },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const id = product.id;

    const { id: _ignoreId, createdAt: _ignoreCreatedAt, ...updateData } = body;

    const updateProduct = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        best_seller: true,
        features: true,
      },
    });

    return {
      message: "Update Product Success",
      data: updateProduct,
    };
  } catch (error) {
    throw error;
  }
};
