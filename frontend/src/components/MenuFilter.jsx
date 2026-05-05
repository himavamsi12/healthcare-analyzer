import React, { useState } from "react";
import { api } from "../utils/api";

const STATUS = {
  safe:    { label: "Safe to eat",  icon: "✓", color: "#16a34a", light: "#dcfce7", border: "#86efac", badge: "linear-gradient(135deg,#16a34a,#15803d)" },
  caution: { label: "Eat less",     icon: "!", color: "#d97706", light: "#fef3c7", border: "#fcd34d", badge: "linear-gradient(135deg,#d97706,#b45309)" },
  unsafe:  { label: "Avoid",        icon: "✕", color: "#dc2626", light: "#fee2e2", border: "#fca5a5", badge: "linear-gradient(135deg,#dc2626,#b91c1c)" },
};

const COND_LABEL = { diabetes: "Type 2 Diabetes", kidney: "Chronic Kidney Disease", hypertension: "Hypertension" };

function MenuItem({ item, onAdd, inCart }) {
  const cfg = STATUS[item.status] || STATUS.caution;
  return (
    <div style={{ ...s.item, background: cfg.light, borderColor: cfg.border, opacity: item.status === "unsafe" ? 0.8 : 1 }}>
      <div style={s.itemTop}>
        {/* Veg dot */}
        <div style={{ ...s.vegBox, borderColor: item.isVeg ? "#16a34a" : "#dc2626" }}>
          <div style={{ ...s.vegDot, background: item.isVeg ? "#16a34a" : "#dc2626" }} />
        </div>

        <div style={s.itemInfo}>
          <div style={s.itemName}>{item.name}</div>
          <div style={s.itemDesc}>{item.description}</div>
          <div style={s.itemMeta}>
            <span style={s.metaChip}>₹{item.price}</span>
            <span style={s.metaChip}>{item.calories} kcal</span>
            <span style={s.metaChip}>{item.category}</span>
          </div>
        </div>

        <div style={s.itemRight}>
          <div style={{ ...s.statusBadge, background: cfg.badge }}>
            <span style={s.badgeIcon}>{cfg.icon}</span>
            {cfg.label}
          </div>
          {item.status !== "unsafe" && (
            <button
              style={{ ...s.addBtn, background: inCart ? "#e2e8f0" : "#0f172a", color: inCart ? "var(--text-3)" : "#fff" }}
              onClick={() => onAdd(item)}
              disabled={inCart}
            >
              {inCart ? "Added ✓" : "+ Add"}
            </button>
          )}
        </div>
      </div>

      {/* Reason row */}
      <div style={{ ...s.reason, borderColor: cfg.border, color: cfg.color }}>
        <div style={{ ...s.reasonDot, background: cfg.color }} />
        {item.reason}
      </div>
    </div>
  );
}

export default function MenuFilter({ patient, restaurant, onBack }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [filter, setFilter] = useState("all");
  const [cart, setCart] = useState([]);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState(null);

  const analyse = async () => {
    setLoading(true); setError(null);
    try {
      const data = await api.filterMenu(restaurant.id, { name: patient.name, condition: patient.condition, restrictions: patient.restrictions });
      setMenu(data.filteredMenu);
      setDone(true);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const addToCart = (item) => {
    setCart((p) => p.find((c) => c.id === item.id) ? p : [...p, { ...item, quantity: 1 }]);
  };

  const placeOrder = async () => {
    try {
      const r = await api.placeOrder(restaurant.id, cart.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: 1 })));
      setOrderResult(r);
      setCart([]);
    } catch (e) { setError(e.message); }
  };

  const counts = { all: menu.length, safe: menu.filter(m => m.status === "safe").length, caution: menu.filter(m => m.status === "caution").length, unsafe: menu.filter(m => m.status === "unsafe").length };
  const shown = filter === "all" ? menu : menu.filter(m => m.status === filter);
  const cartTotal = cart.reduce((t, i) => t + i.price, 0);

  return (
    <div style={s.wrap}>
      {/* Top bar */}
      <div style={s.topBar}>
        <button style={s.backBtn} onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </button>
        <div style={s.topInfo}>
          <div style={s.topName}>{restaurant.name}</div>
          <div style={s.topSub}>Filtering for <strong>{patient.name}</strong> · {COND_LABEL[patient.condition]}</div>
        </div>
        {cart.length > 0 && !orderResult && (
          <button style={s.cartBtn} onClick={placeOrder}>
            🛒 {cart.length} item{cart.length > 1 ? "s" : ""} · Place Order
          </button>
        )}
      </div>

      {/* Order success */}
      {orderResult && (
        <div style={s.successCard}>
          <div style={s.successIcon}>✓</div>
          <div>
            <div style={s.successTitle}>Order placed with {orderResult.restaurant}!</div>
            <div style={s.successSub}>₹{orderResult.total} · {orderResult.estimatedDelivery} delivery · Demo mode</div>
          </div>
        </div>
      )}

      {/* Pre-analysis prompt */}
      {!done && !loading && (
        <div style={s.promptCard}>
          <div style={s.promptGrad}>
            <div style={s.promptEmoji}>🤖</div>
            <div style={s.promptRight}>
              <div style={s.promptTitle}>Ready to analyse the menu</div>
              <div style={s.promptDesc}>
                Every dish will be checked against <strong>{COND_LABEL[patient.condition]}</strong> guidelines and marked Safe, Caution, or Avoid — with a one-line medical reason.
              </div>
              <button style={s.analyseBtn} onClick={analyse}>
                Analyse Menu with AI →
              </button>
            </div>
          </div>
          {error && <div style={s.errorRow}>⚠ {error} <button style={s.retryLink} onClick={analyse}>Retry</button></div>}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={s.loadCard}>
          <div style={s.spinRing} />
          <div>
            <div style={s.loadTitle}>Analysing {restaurant.name}'s menu…</div>
            <div style={s.loadSub}>Checking each dish against {COND_LABEL[patient.condition]} rules</div>
          </div>
        </div>
      )}

      {/* Results */}
      {done && !loading && (
        <>
          {/* Summary pills */}
          <div style={s.summary}>
            <div style={s.summaryLeft}>
              {[
                { k: "all",     label: "All",     c: "#64748b", bg: "#f1f5f9", bd: "#e2e8f0" },
                { k: "safe",    label: "Safe",    c: "#16a34a", bg: "#dcfce7", bd: "#86efac" },
                { k: "caution", label: "Caution", c: "#d97706", bg: "#fef3c7", bd: "#fcd34d" },
                { k: "unsafe",  label: "Avoid",   c: "#dc2626", bg: "#fee2e2", bd: "#fca5a5" },
              ].map(({ k, label, c, bg, bd }) => (
                <button
                  key={k}
                  style={{
                    ...s.filterPill,
                    background: filter === k ? bg : "#fff",
                    borderColor: filter === k ? bd : "var(--border)",
                    color: filter === k ? c : "var(--text-2)",
                    fontWeight: filter === k ? 700 : 400,
                    boxShadow: filter === k ? `0 0 0 2px ${c}22` : "none",
                  }}
                  onClick={() => setFilter(k)}
                >
                  <span style={{ ...s.pillCount, background: bg, color: c, border: `1px solid ${bd}` }}>{counts[k]}</span>
                  {label}
                </button>
              ))}
            </div>
            <div style={s.summaryRight}>
              {counts.safe > 0 && <span style={s.sumStat}>✓ {counts.safe} safe</span>}
              {counts.caution > 0 && <span style={{ ...s.sumStat, color: "#d97706" }}>! {counts.caution} caution</span>}
              {counts.unsafe > 0 && <span style={{ ...s.sumStat, color: "#dc2626" }}>✕ {counts.unsafe} avoid</span>}
            </div>
          </div>

          {/* Menu list */}
          <div style={s.menuList}>
            {shown.map((item) => (
              <MenuItem key={item.id} item={item} onAdd={addToCart} inCart={cart.some(c => c.id === item.id)} />
            ))}
          </div>

          {/* Cart bar */}
          {cart.length > 0 && !orderResult && (
            <div style={s.cartBar}>
              <div style={s.cartItems}>
                {cart.map((i) => <span key={i.id} style={s.cartChip}>{i.name}</span>)}
              </div>
              <div style={s.cartRight}>
                <span style={s.cartTotal}>₹{cartTotal}</span>
                <button style={s.placeBtn} onClick={placeOrder}>Place Order</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const s = {
  wrap: { display: "flex", flexDirection: "column", gap: 16 },

  topBar: { background: "#fff", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "var(--shadow)" },
  backBtn: { display: "flex", alignItems: "center", gap: 5, background: "#f8fafc", border: "1px solid var(--border)", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 600, color: "var(--text-2)", cursor: "pointer", flexShrink: 0 },
  topInfo: { flex: 1 },
  topName: { fontSize: 16, fontWeight: 700, color: "var(--text)" },
  topSub: { fontSize: 12, color: "var(--text-2)", marginTop: 1 },
  cartBtn: { background: "var(--primary)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0, boxShadow: "0 2px 8px rgba(255,107,53,0.3)" },

  successCard: { display: "flex", alignItems: "center", gap: 14, background: "#dcfce7", border: "1.5px solid #86efac", borderRadius: "var(--radius)", padding: "16px 20px" },
  successIcon: { width: 38, height: 38, borderRadius: "50%", background: "#16a34a", color: "#fff", fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  successTitle: { fontSize: 14, fontWeight: 700, color: "#15803d" },
  successSub: { fontSize: 12, color: "#166534", marginTop: 2 },

  promptCard: { background: "#fff", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow-md)" },
  promptGrad: { background: "linear-gradient(135deg,#fff4f0,#ffe8df)", padding: "32px 28px", display: "flex", gap: 24, alignItems: "center" },
  promptEmoji: { fontSize: 56, flexShrink: 0 },
  promptRight: { display: "flex", flexDirection: "column", gap: 10 },
  promptTitle: { fontSize: 20, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" },
  promptDesc: { fontSize: 14, color: "var(--text-2)", lineHeight: 1.6, maxWidth: 420 },
  analyseBtn: { background: "var(--primary)", color: "#fff", border: "none", borderRadius: 8, padding: "11px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", width: "fit-content", boxShadow: "0 4px 14px rgba(255,107,53,0.35)" },
  errorRow: { padding: "10px 20px", background: "#fee2e2", color: "#dc2626", fontSize: 13, display: "flex", alignItems: "center", gap: 10 },
  retryLink: { background: "none", border: "none", color: "#dc2626", fontWeight: 700, cursor: "pointer", textDecoration: "underline", fontSize: 13 },

  loadCard: { background: "#fff", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", padding: "36px 28px", display: "flex", gap: 20, alignItems: "center", boxShadow: "var(--shadow)" },
  spinRing: { width: 40, height: 40, border: "3px solid #f1f5f9", borderTop: "3px solid var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 },
  loadTitle: { fontSize: 15, fontWeight: 600, color: "var(--text)" },
  loadSub: { fontSize: 13, color: "var(--text-2)", marginTop: 4 },

  summary: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  summaryLeft: { display: "flex", gap: 8, flexWrap: "wrap" },
  filterPill: { display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1.5px solid", borderRadius: 100, fontSize: 13, cursor: "pointer", transition: "all 0.15s" },
  pillCount: { fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 100 },
  summaryRight: { display: "flex", gap: 12, fontSize: 12, fontWeight: 600, color: "#16a34a" },
  sumStat: { color: "#16a34a" },

  menuList: { display: "flex", flexDirection: "column", gap: 10 },
  item: { borderRadius: "var(--radius-sm)", border: "1.5px solid", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10, transition: "all 0.15s" },
  itemTop: { display: "flex", gap: 12, alignItems: "flex-start" },
  vegBox: { width: 14, height: 14, border: "2px solid", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 },
  vegDot: { width: 6, height: 6, borderRadius: "50%" },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 3 },
  itemDesc: { fontSize: 12, color: "var(--text-2)", lineHeight: 1.4, marginBottom: 6 },
  itemMeta: { display: "flex", gap: 5, flexWrap: "wrap" },
  metaChip: { fontSize: 11, color: "var(--text-2)", background: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.07)", padding: "2px 7px", borderRadius: 4 },
  itemRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 },
  statusBadge: { display: "flex", alignItems: "center", gap: 5, color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100, letterSpacing: "0.02em" },
  badgeIcon: { fontSize: 10, fontWeight: 900 },
  addBtn: { border: "none", borderRadius: 6, padding: "6px 13px", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" },
  reason: { display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, padding: "7px 10px", borderRadius: 6, background: "rgba(255,255,255,0.55)", border: "1px solid", lineHeight: 1.5 },
  reasonDot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0, marginTop: 4 },

  cartBar: { background: "#0f172a", borderRadius: "var(--radius)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  cartItems: { flex: 1, display: "flex", gap: 6, flexWrap: "wrap" },
  cartChip: { fontSize: 12, background: "rgba(255,255,255,0.1)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "3px 10px" },
  cartRight: { display: "flex", alignItems: "center", gap: 12, flexShrink: 0 },
  cartTotal: { fontSize: 15, fontWeight: 700, color: "#fff" },
  placeBtn: { background: "var(--primary)", color: "#fff", border: "none", borderRadius: 7, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(255,107,53,0.4)" },
};
