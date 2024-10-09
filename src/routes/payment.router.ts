import { Router } from "express";
import { PaymentProcess } from "../controllers/payment.controller";

const router = Router();

router.post("/midtrans/", PaymentProcess);

export default router;
