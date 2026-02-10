import { setupTestApp } from "./_helpers.js";

describe("POST /orders", () => {
  test("creates order, decrements stock, returns 201", async () => {
    const { agent, db } = await setupTestApp();

    const before = await db.get("SELECT stock FROM products WHERE name = 'Keyboard'");
    expect(before.stock).toBe(5);

    const res = await agent.post("/orders").send({
      customer_name: "Budi",
      items: [{ product_id: 1, qty: 2 }]
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("total");
    expect(res.body.total).toBe(300000);

    const after = await db.get("SELECT stock FROM products WHERE name = 'Keyboard'");
    expect(after.stock).toBe(3);

    await db.close();
  });

  test("returns 409 when out of stock and does not decrement", async () => {
    const { agent, db } = await setupTestApp();

    const res = await agent.post("/orders").send({
      customer_name: "Budi",
      items: [{ product_id: 2, qty: 2 }] // Mouse stock = 1
    });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toHaveProperty("code");

    const after = await db.get("SELECT stock FROM products WHERE id = 2");
    expect(after.stock).toBe(1);

    await db.close();
  });
});
