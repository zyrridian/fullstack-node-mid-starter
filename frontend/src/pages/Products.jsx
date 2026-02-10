import React, { useEffect, useMemo, useState } from "react";
import { apiGet } from "../api.js";

function useDebounced(value, ms) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export default function Products({ onAdd }) {
  const [q, setQ] = useState("");
  const dq = useDebounced(q, 300);

  const [page, setPage] = useState(1);
  const limit = 5;

  const [state, setState] = useState({
    loading: true,
    error: null,
    data: [],
    meta: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    apiGet(`/products?page=${page}&limit=${limit}&q=${encodeURIComponent(dq)}`)
      .then((res) => {
        if (cancelled) return;
        setState({
          loading: false,
          error: null,
          data: res.data || [],
          meta: res.meta || null,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setState((s) => ({ ...s, loading: false, error: err }));
      });
    return () => {
      cancelled = true;
    };
  }, [dq, page]);

  const totalPages = useMemo(() => {
    const total = state.meta?.total ?? 0;
    return Math.max(1, Math.ceil(total / limit));
  }, [state.meta]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <input
          placeholder="Search products..."
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          style={{
            flex: 1,
            padding: "10px 12px",
            border: "1px solid #e0e0e0",
            borderRadius: 4,
            fontSize: 14,
          }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            style={{
              padding: "10px 16px",
              border: "1px solid #e0e0e0",
              background: page <= 1 ? "#fafafa" : "#fff",
              cursor: page <= 1 ? "not-allowed" : "pointer",
              borderRadius: 4,
              fontSize: 14,
            }}
          >
            ← Prev
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
            style={{
              padding: "10px 16px",
              border: "1px solid #e0e0e0",
              background: page >= totalPages ? "#fafafa" : "#fff",
              cursor: page >= totalPages ? "not-allowed" : "pointer",
              borderRadius: 4,
              fontSize: 14,
            }}
          >
            Next →
          </button>
        </div>
      </div>

      {state.loading && (
        <p style={{ textAlign: "center", color: "#999", padding: 48 }}>
          Loading...
        </p>
      )}
      {state.error && (
        <div
          style={{
            background: "#fff5f5",
            border: "1px solid #fee",
            padding: 16,
            borderRadius: 4,
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          <strong>Error:</strong>{" "}
          {state.error?.data?.error?.message || "Failed to load products"}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {state.data.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 4,
              padding: 16,
              background: "#fff",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 8 }}>
              {p.name}
            </div>
            <div style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
              Rp {Number(p.price).toLocaleString("id-ID")}
            </div>
            <div style={{ fontSize: 13, color: "#999", marginBottom: 12 }}>
              Stock: {p.stock}
            </div>
            <button
              style={{
                marginTop: "auto",
                padding: "8px 12px",
                border: "1px solid #333",
                background: p.stock <= 0 ? "#fafafa" : "#fff",
                cursor: p.stock <= 0 ? "not-allowed" : "pointer",
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 500,
              }}
              onClick={() => onAdd({ id: p.id, name: p.name, price: p.price })}
              disabled={p.stock <= 0}
            >
              {p.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 24,
          textAlign: "center",
          fontSize: 13,
          color: "#999",
        }}
      >
        Page {page} of {totalPages}
      </div>
    </div>
  );
}
