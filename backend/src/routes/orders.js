import express from "express";
import { z } from "zod";
import { badRequest, notFound, conflict } from "../errors.js";
import { withTransaction } from "../db.js";

const bodySchema = z.object({
  customer_name: z.string().min(2),
  items: z
    .array(
      z.object({
        product_id: z.coerce.number().int().positive(),
        qty: z.coerce.number().int().positive(),
      }),
    )
    .min(1),
});

export function ordersRouter({ db }) {
  const router = express.Router();

  router.post("/", async (req, res, next) => {
    try {
      const parsed = bodySchema.safeParse(req.body);
      if (!parsed.success) {
        throw badRequest(
          "INVALID_BODY",
          "Body tidak valid",
          parsed.error.flatten(),
        );
      }
      const { customer_name, items } = parsed.data;

      // Implement atomic order creation
      const orderId = await withTransaction(db, async () => {
        let total = 0;
        const itemsData = [];

        // Validate and reserve stock for each item
        for (const item of items) {
          // Get product details
          const product = await db.get(
            "SELECT id, price, stock FROM products WHERE id = ?",
            [item.product_id],
          );

          if (!product) {
            throw notFound(
              "PRODUCT_NOT_FOUND",
              `Product ${item.product_id} tidak ditemukan`,
            );
          }

          // Atomically decrement stock (fails if insufficient stock)
          const result = await db.run(
            "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
            [item.qty, item.product_id, item.qty],
          );

          if (result.changes === 0) {
            throw conflict(
              "OUT_OF_STOCK",
              `Stock tidak cukup untuk product ${item.product_id}`,
            );
          }

          // Calculate item total and store for order_items
          const itemTotal = product.price * item.qty;
          total += itemTotal;
          itemsData.push({
            product_id: item.product_id,
            qty: item.qty,
            price_snapshot: product.price,
          });
        }

        // Create order
        const orderResult = await db.run(
          "INSERT INTO orders (customer_name, total) VALUES (?, ?)",
          [customer_name, total],
        );

        const orderId = orderResult.lastID;

        // Create order items
        for (const itemData of itemsData) {
          await db.run(
            "INSERT INTO order_items (order_id, product_id, qty, price_snapshot) VALUES (?, ?, ?, ?)",
            [
              orderId,
              itemData.product_id,
              itemData.qty,
              itemData.price_snapshot,
            ],
          );
        }

        return { orderId, total };
      });

      return res.status(201).json({
        id: orderId.orderId,
        total: orderId.total,
      });
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        throw badRequest("INVALID_ID", "id tidak valid");
      }

      // Fetch order
      const order = await db.get(
        "SELECT id, customer_name, total, created_at FROM orders WHERE id = ?",
        [id],
      );

      if (!order) {
        throw notFound("ORDER_NOT_FOUND", "Order tidak ditemukan");
      }

      // Fetch order items with product names
      const items = await db.all(
        `SELECT oi.product_id, oi.qty, oi.price_snapshot, p.name as product_name
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [id],
      );

      return res.json({ ...order, items });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
