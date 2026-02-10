import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { productsRouter } from "./routes/products.js";
import { ordersRouter } from "./routes/orders.js";
import { notFoundHandler, errorHandler } from "./middleware/error.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const swaggerDocument = YAML.load(join(__dirname, "../swagger.yaml"));

export function createApp({ db }) {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/health", (req, res) => res.json({ ok: true }));

  // API Documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use("/products", productsRouter({ db }));
  app.use("/orders", ordersRouter({ db }));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
