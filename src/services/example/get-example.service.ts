import prisma from "../../prisma";

export const getExampleService = async (id: number) => {
  try {
    const example = await prisma.example.findFirst({
      where: { id },
    });

    if (!example) {
      throw new Error("Invalid example id");
    }

    return example;
  } catch (error) {
    throw error;
  }
};
