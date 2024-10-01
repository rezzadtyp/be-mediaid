import { Example } from "@prisma/client";
import prisma from "../../prisma";

export const createExampleService = async (body: Example) => {
  try {
    return await prisma.example.create({
      data: body,
    });
  } catch (error) {
    throw error;
  }
};
