import { Example } from "@prisma/client";
import prisma from "../../prisma";

export const updateExampleService = async (
  id: number,
  body: Partial<Example>
) => {
  try {
    const example = await prisma.example.findFirst({
      where: { id },
    });

    if (!example) {
      throw new Error("Invalid example id");
    }

    return await prisma.example.update({
      where: { id },
      data: body,
    });
  } catch (error) {
    throw error;
  }
};
