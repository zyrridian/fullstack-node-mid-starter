import React, { useMemo, useState } from "react";
import { apiPost } from "../api.js";

export default function Cart({ cart, dispatch, total, onBack }) {
  const [customerName, setCustomerName] = useState("");
  const [checkout, setCheckout] = useState({
    loading: false,
    error: null,
    success: null,
  });

  const itemsPayload = useMemo(
    () => cart.items.map((i) => ({ product_id: i.id, qty: i.qty })),
    [cart.items],
  );

  async function onCheckout() {
    setCheckout({ loading: true, error: null, success: null });
    try {
      const res = await apiPost("/orders", {
        customer_name: customerName,
        items: itemsPayload,
      });
      setCheckout({ loading: false, error: null, success: res });
      dispatch({ type: "clear" });
    } catch (err) {
      setCheckout({ loading: false, error: err, success: null });
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
      <h3 style={{ margin: "0 0 24px 0", fontSize: 18, fontWeight: 500 }}>
        Shopping Cart
      </h3>

      {cart.items.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999", padding: 48 }}>
          Your cart is empty
        </p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
          {cart.items.map((i) => (
            <div
              key={i.id}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: 4,
                padding: 16,
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 4 }}>
                  {i.name}
                </div>
                <div style={{ fontSize: 14, color: "#666" }}>
                  Rp {Number(i.price).toLocaleString("id-ID")}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="number"
                  min="1"
                  value={i.qty}
                  onChange={(e) =>
                    dispatch({
                      type: "setQty",
                      id: i.id,
                      qty: Number(e.target.value),
                    })
                  }
                  style={{
                    width: 70,
                    padding: "8px 10px",
                    border: "1px solid #e0e0e0",
                    borderRadius: 4,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                />
                <button
                  onClick={() => dispatch({ type: "remove", id: i.id })}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #e0e0e0",
                    background: "#fff",
                    cursor: "pointer",
                    borderRadius: 4,
                    fontSize: 13,
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: 24,
          padding: 16,
          background: "#fafafa",
          borderRadius: 4,
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
          Total Amount
        </div>
        <div style={{ fontSize: 20, fontWeight: 500 }}>
          Rp {total.toLocaleString("id-ID")}
        </div>
      </div>

      <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
        <label style={{ fontSize: 14 }}>
          <div style={{ marginBottom: 6, fontWeight: 500 }}>Customer Name</div>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter your name"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #e0e0e0",
              borderRadius: 4,
              fontSize: 14,
            }}
          />
        </label>

        <button
          onClick={onCheckout}
          disabled={
            checkout.loading ||
            cart.items.length === 0 ||
            customerName.trim().length < 2
          }
          style={{
            padding: "12px 20px",
            border: "1px solid #333",
            background:
              checkout.loading ||
              cart.items.length === 0 ||
              customerName.trim().length < 2
                ? "#fafafa"
                : "#333",
            color:
              checkout.loading ||
              cart.items.length === 0 ||
              customerName.trim().length < 2
                ? "#999"
                : "#fff",
            cursor:
              checkout.loading ||
              cart.items.length === 0 ||
              customerName.trim().length < 2
                ? "not-allowed"
                : "pointer",
            borderRadius: 4,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {checkout.loading ? "Processing..." : "Place Order"}
        </button>

        {checkout.error && (
          <div
            style={{
              background: "#fff5f5",
              border: "1px solid #fee",
              padding: 16,
              borderRadius: 4,
              fontSize: 14,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 8, color: "#d00" }}>
              Checkout Failed
            </div>
            <div style={{ lineHeight: 1.5 }}>
              {checkout.error?.data?.error?.message || "An error occurred during checkout"}
            </div>
            {checkout.error?.data?.error?.code && (
              <div style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
                Error code: {checkout.error.data.error.code}
              </div>
            )}
          </div>
        )}
        {checkout.success && (
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #d1fae5",
              padding: 16,
              borderRadius: 4,
              fontSize: 14,
            }}
          >
            <strong>Success!</strong> Order ID:{" "}
            <strong>#{checkout.success.id}</strong>
            <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
              You can view your order in the Orders page
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
