import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";

const router = Router();

router.get("/", getProduct);
router.get("/all", getProducts);
router.post("/", createProduct);
router.patch("/", updateProduct);
router.delete("/", deleteProduct);

export default router;
