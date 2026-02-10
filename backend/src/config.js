import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 3001),
  dbPath: process.env.DB_PATH || ".data/dev.sqlite",
  nodeEnv: process.env.NODE_ENV || "development"
};
