import express from "express";
import { z } from "zod";
import { badRequest } from "../errors.js";

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  q: z.string().optional(),
});

export function productsRouter({ db }) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const parsed = querySchema.safeParse(req.query);
      if (!parsed.success) {
        throw badRequest(
          "INVALID_QUERY",
          "Query tidak valid",
          parsed.error.flatten(),
        );
      }
      const { page, limit, q } = parsed.data;
      const offset = (page - 1) * limit;

      // Build query with optional search
      let whereClause = "";
      let params = [];
      
      if (q) {
        whereClause = "WHERE name LIKE ? COLLATE NOCASE";
        params.push(`%${q}%`);
      }

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM products ${whereClause}`;
      const { total } = await db.get(countQuery, params);

      // Get paginated data
      const dataQuery = `SELECT * FROM products ${whereClause} LIMIT ? OFFSET ?`;
      const data = await db.all(dataQuery, [...params, limit, offset]);

      return res.status(200).json({
        data,
        meta: { page, limit, total }
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
