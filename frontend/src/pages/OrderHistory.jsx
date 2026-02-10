import React, { useState } from "react";
import { apiGet } from "../api.js";

export default function OrderHistory({ onBack }) {
  const [orderId, setOrderId] = useState("");
  const [state, setState] = useState({
    loading: false,
    error: null,
    order: null,
  });

  async function fetchOrder() {
    if (!orderId.trim()) return;

    setState({ loading: true, error: null, order: null });
    try {
      const order = await apiGet(`/orders/${orderId}`);
      setState({ loading: false, error: null, order });
    } catch (err) {
      setState({ loading: false, error: err, order: null });
    }
  }

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          padding: "8px 16px",
          border: "1px solid #e0e0e0",
          background: "#fff",
          cursor: "pointer",
          borderRadius: 4,
          fontSize: 14,
          marginBottom: 16,
        }}
      >
        ← Back
      </button>
      <h3 style={{ margin: "0 0 16px 0", fontWeight: 500, fontSize: 18 }}>
        Order History
      </h3>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input
          type="number"
          placeholder="Enter Order ID..."
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchOrder()}
          style={{
            flex: 1,
            padding: "10px 12px",
            border: "1px solid #e0e0e0",
            borderRadius: 4,
            fontSize: 14,
          }}
        />
        <button
          onClick={fetchOrder}
          disabled={!orderId.trim() || state.loading}
          style={{
            padding: "10px 20px",
            border: "1px solid #333",
            background: !orderId.trim() || state.loading ? "#fafafa" : "#fff",
            cursor:
              orderId.trim() && !state.loading ? "pointer" : "not-allowed",
            borderRadius: 4,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {state.loading ? "Loading..." : "Search"}
        </button>
      </div>

      {state.error && (
        <div
          style={{
            background: "#fff5f5",
            border: "1px solid #fee",
            padding: 16,
            borderRadius: 4,
            fontSize: 14,
          }}
        >
          <strong>Error:</strong>{" "}
          {state.error?.data?.error?.message || "Order not found"}
        </div>
      )}

      {state.order && (
        <div
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#fafafa",
              padding: 16,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <h4 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 500 }}>
              Order #{state.order.id}
            </h4>
            <div style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>
              <div>
                Customer: <strong>{state.order.customer_name}</strong>
              </div>
              <div>
                Date: {new Date(state.order.created_at).toLocaleString("id-ID")}
              </div>
              <div>
                Total:{" "}
                <strong>
                  Rp {Number(state.order.total).toLocaleString("id-ID")}
                </strong>
              </div>
            </div>
          </div>

          <div style={{ padding: 16 }}>
            <h5
              style={{
                margin: "0 0 12px 0",
                fontSize: 14,
                fontWeight: 500,
                color: "#666",
              }}
            >
              Order Items
            </h5>
            <div style={{ display: "grid", gap: 8 }}>
              {state.order.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 12,
                    background: "#fafafa",
                    borderRadius: 4,
                    fontSize: 14,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.product_name}</div>
                    <div style={{ color: "#666", fontSize: 13 }}>
                      Rp {Number(item.price_snapshot).toLocaleString("id-ID")} ×{" "}
                      {item.qty}
                    </div>
                  </div>
                  <div style={{ fontWeight: 500 }}>
                    Rp{" "}
                    {(item.price_snapshot * item.qty).toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!state.loading && !state.error && !state.order && (
        <div
          style={{
            textAlign: "center",
            padding: 48,
            color: "#999",
            fontSize: 14,
          }}
        >
          Enter an order ID to view details
        </div>
      )}
    </div>
  );
}
