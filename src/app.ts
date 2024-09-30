import express, { Request, Response, NextFunction } from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";
import categoryRouter from "./category/category.routes";
import productRouter from "./product/product.route"
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/categories",categoryRouter)
app.use("/api/v1/products",productRouter)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        msg: err.message,
        path: "",
        location: "",
      },
    ],
  });
});

export default app;
