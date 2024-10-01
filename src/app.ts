import cors from "cors";
import express, {
  NextFunction,
  Request,
  Response,
  json,
  urlencoded,
} from "express";
import helmet from "helmet";
import productRouter from "./routes/product.router";
import { allowedOrigins } from "./config";

const app = express();

// configure
app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(json());
app.use(urlencoded({ extended: true }));

// routes
app.get("/", (_req, res) => res.send("Welcome to Media ID API"));
app.use("/api/product", productRouter);

// error
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  res.status(400).send({ message: err.message });
});

export default app;
