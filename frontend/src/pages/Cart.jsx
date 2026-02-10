import React, { useMemo, useState } from "react";
import { apiPost } from "../api.js";

export default function Cart({ cart, dispatch, total, onBack }) {
  const [customerName, setCustomerName] = useState("");
  const [checkout, setCheckout] = useState({ loading: false, error: null, success: null });

  const itemsPayload = useMemo(() => cart.items.map((i) => ({ product_id: i.id, qty: i.qty })), [cart.items]);

  async function onCheckout() {
    setCheckout({ loading: true, error: null, success: null });
    try {
      const res = await apiPost("/orders", { customer_name: customerName, items: itemsPayload });
      setCheckout({ loading: false, error: null, success: res });
      dispatch({ type: "clear" });
    } catch (err) {
      setCheckout({ loading: false, error: err, success: null });
    }
  }

  return (
    <div>
      <button onClick={onBack}>← Back</button>
      <h3>Cart</h3>

      {cart.items.length === 0 ? (
        <p>Cart kosong.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {cart.items.map((i) => (
            <div key={i.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{i.name}</div>
                <div>Rp {Number(i.price).toLocaleString("id-ID")}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="number"
                  min="0"
                  value={i.qty}
                  onChange={(e) => dispatch({ type: "setQty", id: i.id, qty: Number(e.target.value) })}
                  style={{ width: 70, padding: 6 }}
                />
                <button onClick={() => dispatch({ type: "remove", id: i.id })}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 12, fontWeight: 700 }}>
        Total: Rp {total.toLocaleString("id-ID")}
      </div>

      <div style={{ marginTop: 12, display: "grid", gap: 8, maxWidth: 420 }}>
        <label>
          Customer name
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nama pembeli"
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <button
          onClick={onCheckout}
          disabled={checkout.loading || cart.items.length === 0 || customerName.trim().length < 2}
        >
          {checkout.loading ? "Processing..." : "Checkout"}
        </button>

        {checkout.error && (
          <pre style={{ background: "#f6f6f6", padding: 12, overflow: "auto" }}>
            Error: {JSON.stringify(checkout.error?.data || checkout.error, null, 2)}
          </pre>
        )}
        {checkout.success && (
          <div style={{ padding: 12, border: "1px solid #cfc", borderRadius: 8 }}>
            Success! Order ID: <b>{checkout.success.id}</b>
          </div>
        )}
      </div>
    </div>
  );
}
