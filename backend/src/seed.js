import { getDb } from "./db.js";

const db = await getDb();

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
  { name: "Microphone USB", price: 520000, stock: 7 }
];

await db.exec("DELETE FROM order_items;");
await db.exec("DELETE FROM orders;");
await db.exec("DELETE FROM products;");

for (const p of products) {
  await db.run(
    "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)",
    [p.name, p.price, p.stock]
  );
}

console.log("Seed done.");
await db.close();
