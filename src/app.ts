import cors from "cors";
import express, {
  NextFunction,
  Request,
  Response,
  json,
  urlencoded,
} from "express";
import helmet from "helmet";
import exampleRouter from "./routes/example.router";

const app = express();

// configure
app.use(helmet());
app.use(cors({ origin: [/http:\/\/localhost/] }));
app.use(json());
app.use(urlencoded({ extended: true }));

// routes
app.get("/", (_req, res) => res.send("Welcome to My API"));
app.use("/examples", exampleRouter);

// error
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  res.status(400).send({ message: err.message });
});

export default app;
