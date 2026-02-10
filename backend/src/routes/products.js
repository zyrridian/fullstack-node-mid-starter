import { z } from "zod";
import { badRequest } from "../errors.js";

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  q: z.string().optional()
});

export function productsRouter({ db }) {
  const router = (await import("express")).default.Router();

  router.get("/", async (req, res) => {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      throw badRequest("INVALID_QUERY", "Query tidak valid", parsed.error.flatten());
    }
    const { page, limit, q } = parsed.data;
    const offset = (page - 1) * limit;

    // TODO: implement case-insensitive search on name + pagination + total count
    // HINT: for SQLite, you can use `WHERE name LIKE ?` with `%${q}%` and optionally `COLLATE NOCASE`.
    // Response shape:
    // { data: [...], meta: { page, limit, total } }

    return res.status(501).json({
      error: { code: "NOT_IMPLEMENTED", message: "Implement GET /products" }
    });
  });

  return router;
}
