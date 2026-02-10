import express from "express";
import cors from "cors";
import morgan from "morgan";
import { productsRouter } from "./routes/products.js";
import { ordersRouter } from "./routes/orders.js";
import { notFoundHandler, errorHandler } from "./middleware/error.js";

export function createApp({ db }) {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use("/products", productsRouter({ db }));
  app.use("/orders", ordersRouter({ db }));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
