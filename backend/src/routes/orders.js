import { z } from "zod";
import { badRequest, notFound, conflict } from "../errors.js";
import { withTransaction } from "../db.js";

const bodySchema = z.object({
  customer_name: z.string().min(2),
  items: z.array(z.object({
    product_id: z.coerce.number().int().positive(),
    qty: z.coerce.number().int().positive()
  })).min(1)
});

export function ordersRouter({ db }) {
  const router = (await import("express")).default.Router();

  router.post("/", async (req, res) => {
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      throw badRequest("INVALID_BODY", "Body tidak valid", parsed.error.flatten());
    }
    const { customer_name, items } = parsed.data;

    // TODO: implement atomic order creation:
    // - validate products exist
    // - check stock >= qty for each item
    // - decrement stock atomically (no stock minus)
    // - create order + order_items with price_snapshot
    // - return 201 with created order summary (id, total)
    //
    // Recommended approach on SQLite (fast + safe):
    // inside transaction:
    //   for each item:
    //     UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?;
    //     if changes == 0 -> throw conflict OUT_OF_STOCK
    //     SELECT price FROM products WHERE id = ?; (or read before update)
    //
    // Note: also handle product not found -> 404

    return res.status(501).json({
      error: { code: "NOT_IMPLEMENTED", message: "Implement POST /orders" }
    });
  });

  router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw badRequest("INVALID_ID", "id tidak valid");
    }

    // TODO: implement fetch order + items, 404 if not found
    return res.status(501).json({
      error: { code: "NOT_IMPLEMENTED", message: "Implement GET /orders/:id" }
    });
  });

  return router;
}
