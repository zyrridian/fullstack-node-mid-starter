import dotenv from "dotenv";
dotenv.config();

const isProd = process.env.NODE_ENV === "production";

export const config = {
  port: Number(process.env.PORT || 3001),
  // In production (Vercel), only /tmp is writable. Fall back to it automatically.
  dbPath:
    process.env.DB_PATH || (isProd ? "/tmp/prod.sqlite" : ".data/dev.sqlite"),
  nodeEnv: process.env.NODE_ENV || "development",
};
