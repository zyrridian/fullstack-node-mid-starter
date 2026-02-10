import React, { useMemo, useReducer, useState } from "react";
import Products from "./pages/Products.jsx";
import Cart from "./pages/Cart.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";

function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i,
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };
    }
    case "setQty": {
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: action.qty } : i))
          .filter((i) => i.qty > 0),
      };
    }
    case "remove":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "clear":
      return { items: [] };
    default:
      return state;
  }
}

export default function App() {
  const [page, setPage] = useState("products");
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });

  const total = useMemo(
    () => cart.items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [cart.items],
  );

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: 24,
        maxWidth: 960,
        margin: "0 auto",
        minHeight: "100vh",
        background: "#fff",
      }}
    >
      <header
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 32,
          paddingBottom: 16,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <h2
          style={{
            margin: 0,
            cursor: "pointer",
            fontSize: 20,
            fontWeight: 500,
            flex: 1,
          }}
          onClick={() => setPage("products")}
        >
          Mini Store
        </h2>
        <button
          onClick={() => setPage("products")}
          style={{
            padding: "8px 16px",
            border:
              page === "products" ? "1px solid #333" : "1px solid #e0e0e0",
            background: "#fff",
            cursor: "pointer",
            borderRadius: 4,
            fontSize: 14,
            fontWeight: page === "products" ? 500 : 400,
          }}
        >
          Products
        </button>
        <button
          onClick={() => setPage("cart")}
          style={{
            padding: "8px 16px",
            border: page === "cart" ? "1px solid #333" : "1px solid #e0e0e0",
            background: "#fff",
            cursor: "pointer",
            borderRadius: 4,
            fontSize: 14,
            fontWeight: page === "cart" ? 500 : 400,
          }}
        >
          Cart ({cart.items.length})
        </button>
        <button
          onClick={() => setPage("orders")}
          style={{
            padding: "8px 16px",
            border: page === "orders" ? "1px solid #333" : "1px solid #e0e0e0",
            background: "#fff",
            cursor: "pointer",
            borderRadius: 4,
            fontSize: 14,
            fontWeight: page === "orders" ? 500 : 400,
          }}
        >
          Orders
        </button>
      </header>

      {page === "products" && (
        <Products onAdd={(p) => dispatch({ type: "add", item: p })} />
      )}
      {page === "cart" && (
        <Cart
          cart={cart}
          dispatch={dispatch}
          total={total}
          onBack={() => setPage("products")}
        />
      )}
      {page === "orders" && <OrderHistory onBack={() => setPage("products")} />}

      <footer
        style={{
          marginTop: 48,
          paddingTop: 16,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <small style={{ color: "#999", fontSize: 12 }}>
          Mini Store — Fullstack Take-Home (Node.js Mid)
        </small>
      </footer>
    </div>
  );
}
