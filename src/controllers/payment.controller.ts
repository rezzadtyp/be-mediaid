import { NextFunction, Request, Response } from "express";
import { midtransNotificationHandlerService } from "../services/transaction/payment/midtrans-notification-handler";

export const PaymentProcess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await midtransNotificationHandlerService(req.body);

    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
