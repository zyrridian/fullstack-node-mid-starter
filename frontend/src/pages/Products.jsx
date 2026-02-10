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

  const [state, setState] = useState({ loading: true, error: null, data: [], meta: null });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    apiGet(`/products?page=${page}&limit=${limit}&q=${encodeURIComponent(dq)}`)
      .then((res) => {
        if (cancelled) return;
        setState({ loading: false, error: null, data: res.data || [], meta: res.meta || null });
      })
      .catch((err) => {
        if (cancelled) return;
        setState((s) => ({ ...s, loading: false, error: err }));
      });
    return () => { cancelled = true; };
  }, [dq, page]);

  const totalPages = useMemo(() => {
    const total = state.meta?.total ?? 0;
    return Math.max(1, Math.ceil(total / limit));
  }, [state.meta]);

  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <input
          placeholder="Search product..."
          value={q}
          onChange={(e) => { setPage(1); setQ(e.target.value); }}
          style={{ flex: 1, padding: 8 }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
          <button onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>Next</button>
        </div>
      </div>

      {state.loading && <p>Loading...</p>}
      {state.error && (
        <pre style={{ background: "#f6f6f6", padding: 12, overflow: "auto" }}>
          Error: {JSON.stringify(state.error?.data || state.error, null, 2)}
        </pre>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        {state.data.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 600 }}>{p.name}</div>
            <div>Rp {Number(p.price).toLocaleString("id-ID")}</div>
            <div>Stock: {p.stock}</div>
            <button
              style={{ marginTop: 8 }}
              onClick={() => onAdd({ id: p.id, name: p.name, price: p.price })}
              disabled={p.stock <= 0}
            >
              Add to cart
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, opacity: 0.75 }}>
        Page {page} / {totalPages}
      </div>
    </div>
  );
}
