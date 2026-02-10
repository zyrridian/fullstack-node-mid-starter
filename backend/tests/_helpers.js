import fs from "node:fs";
import path from "node:path";
import { getDb } from "../src/db.js";
import { createApp } from "../src/app.js";
import request from "supertest";

export async function setupTestApp() {
  const dbPath = ".data/test.sqlite";
  if (!fs.existsSync(".data")) fs.mkdirSync(".data");
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

  const db = await getDb(dbPath);

  // migrate
  const schema = fs.readFileSync(path.join(process.cwd(), "src/schema.sql"), "utf-8");
  await db.exec(schema);

  // seed (minimal)
  await db.run("INSERT INTO products (name, price, stock) VALUES (?, ?, ?)", ["Keyboard", 150000, 5]);
  await db.run("INSERT INTO products (name, price, stock) VALUES (?, ?, ?)", ["Mouse", 100000, 1]);
  await db.run("INSERT INTO products (name, price, stock) VALUES (?, ?, ?)", ["Monitor", 1200000, 10]);

  const app = createApp({ db });
  const agent = request(app);

  return { db, app, agent, dbPath };
}
