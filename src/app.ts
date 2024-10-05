import express from "express";
import categoryRouter from "./category/category.routes";
import productRouter from "./product/product.route"
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/categories",categoryRouter)
app.use("/api/v1/products",productRouter)


app.use(globalErrorHandler);

export default app;
