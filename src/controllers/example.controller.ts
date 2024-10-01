import { NextFunction, Request, Response } from "express";
import { createExampleService } from "../services/example/create-example.service";
import { deleteExampleService } from "../services/example/delete-example.service";
import { getExampleService } from "../services/example/get-example.service";
import { getExamplesService } from "../services/example/get-examples.service";
import { updateExampleService } from "../services/example/update-example.service";

export const getExamplesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 10,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
    };
    const result = await getExamplesService(query);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getExampleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const result = await getExampleService(id);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const createExampleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createExampleService(req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateExampleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const result = await updateExampleService(id, req.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteExampleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteExampleService(id);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
