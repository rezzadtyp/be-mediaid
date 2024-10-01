import { Router } from "express";
import {
  createExampleController,
  deleteExampleController,
  getExampleController,
  getExamplesController,
  updateExampleController,
} from "../controllers/example.controller";

const router = Router();

router.get("/", getExamplesController);
router.get("/:id", getExampleController);
router.post("/", createExampleController);
router.patch("/:id", updateExampleController);
router.delete("/:id", deleteExampleController);

export default router;
