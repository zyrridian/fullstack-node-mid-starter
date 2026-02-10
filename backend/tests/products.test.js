import { setupTestApp } from "./_helpers.js";

describe("GET /products", () => {
  test("returns paginated list with meta", async () => {
    const { agent, db } = await setupTestApp();

    const res = await agent.get("/products?page=1&limit=2");
    // Kandidat diharapkan membuat ini PASS
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("meta");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toMatchObject({ page: 1, limit: 2 });
    expect(typeof res.body.meta.total).toBe("number");

    await db.close();
  });

  test("supports search by q", async () => {
    const { agent, db } = await setupTestApp();

    const res = await agent.get("/products?q=key");
    expect(res.status).toBe(200);
    // Expect only items matching
    const names = res.body.data.map((x) => x.name.toLowerCase());
    expect(names.every((n) => n.includes("key"))).toBe(true);

    await db.close();
  });
});
