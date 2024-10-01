import prisma from "../../prisma";

export const deleteExampleService = async (id: number) => {
  try {
    const example = await prisma.example.findFirst({
      where: { id },
    });

    if (!example) {
      throw new Error("Invalid example id");
    }

    return await prisma.example.delete({ where: { id } });
  } catch (error) {
    throw error;
  }
};
