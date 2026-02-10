import React, { useMemo, useReducer, useState } from "react";
import Products from "./pages/Products.jsx";
import Cart from "./pages/Cart.jsx";

function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          )
        };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };
    }
    case "setQty": {
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: action.qty } : i))
          .filter((i) => i.qty > 0)
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
    [cart.items]
  );

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16, maxWidth: 960, margin: "0 auto" }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, cursor: "pointer" }} onClick={() => setPage("products")}>Mini Store</h2>
        <button onClick={() => setPage("products")}>Products</button>
        <button onClick={() => setPage("cart")}>
          Cart ({cart.items.length}) — Rp {total.toLocaleString("id-ID")}
        </button>
      </header>

      {page === "products" && (
        <Products onAdd={(p) => dispatch({ type: "add", item: p })} />
      )}
      {page === "cart" && (
        <Cart cart={cart} dispatch={dispatch} total={total} onBack={() => setPage("products")} />
      )}

      <footer style={{ marginTop: 24, opacity: 0.7 }}>
        <small>
          Catatan: ini starter minimal. Kandidat diharapkan melengkapi UX (loading, error, pagination), dan endpoint backend.
        </small>
      </footer>
    </div>
  );
}
