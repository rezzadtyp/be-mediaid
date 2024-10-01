import { Prisma } from "@prisma/client";
import prisma from "../../prisma";
import { PaginationQueryParams } from "../../types/pagination.type";

interface getExamplesQuery extends PaginationQueryParams {}

export const getExamplesService = async (query: getExamplesQuery) => {
  try {
    const { page, sortBy, sortOrder, take } = query;

    const whereClause: Prisma.ExampleWhereInput = {};

    const examples = await prisma.example.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const count = await prisma.example.count({ where: whereClause });

    return {
      data: examples,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
