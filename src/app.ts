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
import orderRouter from "./routes/order.router";
import paymentRouter from "./routes/payment.router";

const app = express();

// configure
app.use(helmet());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// routes
app.get("/", (_req, res) => res.send("Welcome to Media ID API"));
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/payment", paymentRouter);

// error
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  res.status(400).send({ message: err.message });
});

export default app;
