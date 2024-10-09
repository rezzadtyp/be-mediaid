import { NextFunction, Request, Response } from "express";
import { createOrderService } from "../services/transaction/order/create-order.service";
import { getOrderService } from "../services/transaction/order/get-order.service";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await createOrderService(req.body);

    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getOrderService(req.params.id);

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
