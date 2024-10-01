import { NextFunction, Request, Response } from "express";
import { getProductService } from "../services/product/get-product.service";
import { createProductService } from "../services/product/create-product.service";
import { updateProductService } from "../services/product/update-product.service";
import { deleteProductService } from "../services/product/delete-product.service";
import { getProductsService } from "../services/product/get-products.service";

// GET PRODUCT
export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      name: req.query.name as string,
    };

    const result = await getProductService(query);

    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

// GET PRODUCTS
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 8,
      page: parseInt(req.query.page as string) || 1,
      sortBy: parseInt(req.query.sortBy as string) || "createdAt",
      sortOrder: parseInt(req.query.sortOrder as string) || "desc",
      search: req.query.search as string,
    };
    const result = await getProductsService(query);

    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

// CREATE PRODUCT
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;

    const result = await createProductService(body);

    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

// UPDATE PRODUCT
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      name: req.query.name as string,
    };
    const body = req.body;
    const result = await updateProductService(query, body);

    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

// DELETE PRODUCT
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      name: req.query.name as string,
    };
    const result = await deleteProductService(query);

    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
