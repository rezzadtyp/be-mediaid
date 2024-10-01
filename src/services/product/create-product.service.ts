import { Product } from "@prisma/client";
import prisma from "../../prisma";

interface CreateProductBody
  extends Omit<Product, "id" | "createdAt" | "deletedAt" | "updatedAt"> {}

export const createProductService = async (body: CreateProductBody) => {
  try {
    const { name, description, price, best_seller, features } = body;

    const existingProduct = await prisma.product.findFirst({
      where: { name },
    });

    if (existingProduct) {
      throw new Error("Product already exist");
    }

    const createProduct = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: price,
        best_seller: best_seller,
        features: features,
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
      message: "Create Event Success!",
      data: createProduct,
    };
  } catch (error) {
    throw error;
  }
};
