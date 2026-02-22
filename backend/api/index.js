import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getDb } from "../src/db.js";
import { createApp } from "../src/app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function initDb(db) {
  const schema = fs.readFileSync(
    path.join(__dirname, "../src/schema.sql"),
    "utf-8",
  );
  await db.exec(schema);

  const row = await db.get("SELECT COUNT(*) as count FROM products");
  if (row.count === 0) {
    const products = [
      { name: "Keyboard Mechanical", price: 350000, stock: 12 },
      { name: "Mouse Wireless", price: 180000, stock: 20 },
      { name: "Monitor 24 inch", price: 1450000, stock: 6 },
      { name: "Headset Gaming", price: 420000, stock: 10 },
      { name: "USB Hub 4-port", price: 90000, stock: 25 },
      { name: "SSD 1TB", price: 1150000, stock: 8 },
      { name: "RAM 16GB", price: 650000, stock: 14 },
      { name: "Webcam 1080p", price: 240000, stock: 9 },
      { name: "Laptop Stand", price: 120000, stock: 18 },
      { name: "Microphone USB", price: 520000, stock: 7 },
    ];
    for (const p of products) {
      await db.run(
        "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)",
        [p.name, p.price, p.stock],
      );
    }
    console.log("Auto-seed complete.");
  }
}

const db = await getDb();
await initDb(db);
const app = createApp({ db });

// Vercel calls this as a serverless function — no app.listen() needed
export default app;
