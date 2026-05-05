import React, { useState } from "react";
import { api } from "../utils/api";

const CAT_ICON = { Grains: "🌾", Lentils: "🫘", Vegetables: "🥦", Fruits: "🍎", Protein: "🥩", Oils: "🫙", Condiments: "🧂" };
const COND_LABEL = { diabetes: "Type 2 Diabetes", kidney: "Chronic Kidney Disease", hypertension: "Hypertension" };
const COND_COLOR = { diabetes: "#3b82f6", kidney: "#8b5cf6", hypertension: "#ef4444" };

export default function GroceryRestock({ patient }) {
  const [suggestions, setSuggestions] = useState([]);
  const [approved, setApproved] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [ordered, setOrdered] = useState(null);
  const [error, setError] = useState(null);

  const generate = async () => {
    setLoading(true); setError(null); setDone(false); setOrdered(null);
    try {
      const data = await api.getRestockSuggestions({ name: patient.name, condition: patient.condition, restrictions: patient.restrictions });
      setSuggestions(data.suggestions);
      const init = {};
      data.suggestions.forEach((_, i) => { init[i] = true; });
      setApproved(init);
      setDone(true);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const toggle = (i) => setApproved((p) => ({ ...p, [i]: !p[i] }));

  const checkout = async () => {
    const items = suggestions.filter((_, i) => approved[i]);
    try {
      const r = await api.checkoutInstamart(items);
      setOrdered(r);
    } catch (e) { setError(e.message); }
  };

  const approvedItems = suggestions.filter((_, i) => approved[i]);
  const total = approvedItems.reduce((t, i) => t + (i.estimatedPrice || 0), 0);
  const condColor = COND_COLOR[patient.condition];

  return (
    <div style={s.wrap}>
      {/* Hero */}
      <div style={{ ...s.hero, background: `linear-gradient(135deg, ${condColor}12, ${condColor}06)`, borderColor: condColor + "30" }}>
        <div style={s.heroLeft}>
          <div style={{ ...s.heroLabel, color: condColor }}>Instamart · Weekly Restock</div>
          <h2 style={s.heroTitle}>Smart Grocery Suggestions</h2>
          <p style={s.heroDesc}>
            Based on past Instamart orders, Claude picks groceries safe for <strong>{patient.name}</strong>'s {COND_LABEL[patient.condition]} diet.
          </p>
        </div>
        <div style={s.heroRight}>
          <div style={s.heroStats}>
            <div style={s.heroStat}>
              <div style={s.heroStatNum}>3</div>
              <div style={s.heroStatLabel}>Past orders analysed</div>
            </div>
            <div style={s.heroStatDiv} />
            <div style={s.heroStat}>
              <div style={s.heroStatNum}>7–8</div>
              <div style={s.heroStatLabel}>Items suggested</div>
            </div>
          </div>
        </div>
      </div>

      {/* Prompt */}
      {!done && !loading && (
        <div style={s.promptCard}>
          <div style={s.promptContent}>
            <span style={s.promptEmoji}>📦</span>
            <div>
              <div style={s.promptTitle}>Generate this week's restock list</div>
              <div style={s.promptSub}>Approve each item before ordering — you're always in control</div>
            </div>
          </div>
          <button style={{ ...s.generateBtn, background: condColor, boxShadow: `0 4px 14px ${condColor}40` }} onClick={generate}>
            Analyse &amp; Suggest →
          </button>
          {error && <div style={s.errorMsg}>⚠ {error} <button style={s.retryBtn} onClick={generate}>Retry</button></div>}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={s.loadCard}>
          <div style={{ ...s.spinner, borderTopColor: condColor }} />
          <div>
            <div style={s.loadTitle}>Analysing purchase history…</div>
            <div style={s.loadSub}>Matching items safe for {COND_LABEL[patient.condition]}</div>
          </div>
        </div>
      )}

      {/* Success order banner */}
      {ordered && (
        <div style={s.successBanner}>
          <div style={s.successIcon}>✓</div>
          <div>
            <div style={s.successTitle}>Instamart order placed!</div>
            <div style={s.successSub}>{ordered.items?.length} items · ₹{ordered.total} · {ordered.estimatedDelivery} · Demo mode</div>
          </div>
          <button style={s.newListBtn} onClick={generate}>Generate new list</button>
        </div>
      )}

      {/* Suggestions */}
      {done && !loading && (
        <>
          <div style={s.listHeader}>
            <div style={s.listTitle}>{suggestions.length} items suggested</div>
            <div style={s.listSub}>{approvedItems.length} selected · est. ₹{total}</div>
          </div>

          <div style={s.grid}>
            {suggestions.map((item, i) => {
              const on = approved[i];
              const icon = CAT_ICON[item.category] || "🛒";
              return (
                <div
                  key={i}
                  style={{
                    ...s.itemCard,
                    borderColor: on ? condColor + "50" : "var(--border)",
                    background: on ? condColor + "08" : "#fafafa",
                    boxShadow: on ? `0 0 0 2px ${condColor}18, var(--shadow)` : "none",
                    opacity: on ? 1 : 0.55,
                  }}
                >
                  <div style={s.itemTop}>
                    <div style={{ ...s.catIcon, background: on ? condColor + "18" : "#f1f5f9" }}>{icon}</div>
                    <div style={s.itemInfo}>
                      <div style={s.itemName}>{item.name}</div>
                      <div style={s.itemQty}>{item.quantity} · {item.category}</div>
                    </div>
                    <div style={s.itemRight}>
                      <div style={s.itemPrice}>≈ ₹{item.estimatedPrice}</div>
                      <button
                        style={{
                          ...s.toggleBtn,
                          background: on ? condColor : "#e2e8f0",
                          color: on ? "#fff" : "var(--text-3)",
                          boxShadow: on ? `0 2px 6px ${condColor}40` : "none",
                        }}
                        onClick={() => toggle(i)}
                      >
                        {on ? "✓ Added" : "+ Add"}
                      </button>
                    </div>
                  </div>
                  <div style={{ ...s.itemReason, color: on ? condColor : "var(--text-3)", borderColor: on ? condColor + "30" : "transparent" }}>
                    {item.reason}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout bar */}
          {!ordered && (
            <div style={s.checkoutBar}>
              <div>
                <div style={s.checkoutTitle}>{approvedItems.length} of {suggestions.length} items approved</div>
                <div style={s.checkoutSub}>Estimated total: ₹{total}</div>
              </div>
              <button
                style={{
                  ...s.checkoutBtn,
                  background: approvedItems.length > 0 ? condColor : "#cbd5e1",
                  cursor: approvedItems.length > 0 ? "pointer" : "not-allowed",
                  boxShadow: approvedItems.length > 0 ? `0 4px 14px ${condColor}40` : "none",
                }}
                onClick={checkout}
                disabled={approvedItems.length === 0}
              >
                Order via Instamart
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const s = {
  wrap: { display: "flex", flexDirection: "column", gap: 16 },

  hero: { borderRadius: "var(--radius-lg)", border: "1.5px solid", padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" },
  heroLeft: { display: "flex", flexDirection: "column", gap: 8 },
  heroLabel: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" },
  heroTitle: { fontSize: 24, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em" },
  heroDesc: { fontSize: 13, color: "var(--text-2)", lineHeight: 1.6, maxWidth: 380 },
  heroRight: {},
  heroStats: { display: "flex", gap: 20, alignItems: "center", background: "rgba(255,255,255,0.7)", borderRadius: 12, padding: "14px 20px", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "var(--shadow)" },
  heroStat: { textAlign: "center" },
  heroStatNum: { fontSize: 24, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" },
  heroStatLabel: { fontSize: 11, color: "var(--text-3)", marginTop: 2 },
  heroStatDiv: { width: 1, height: 32, background: "var(--border)" },

  promptCard: { background: "#fff", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", padding: "20px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", boxShadow: "var(--shadow)" },
  promptContent: { display: "flex", alignItems: "center", gap: 14 },
  promptEmoji: { fontSize: 32, flexShrink: 0 },
  promptTitle: { fontSize: 15, fontWeight: 700, color: "var(--text)" },
  promptSub: { fontSize: 12, color: "var(--text-2)", marginTop: 3 },
  generateBtn: { color: "#fff", border: "none", borderRadius: 8, padding: "11px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", flexShrink: 0, transition: "all 0.15s" },
  errorMsg: { width: "100%", fontSize: 13, color: "#dc2626", display: "flex", gap: 8, alignItems: "center" },
  retryBtn: { background: "none", border: "none", color: "#dc2626", fontWeight: 700, cursor: "pointer", textDecoration: "underline" },

  loadCard: { background: "#fff", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", padding: "32px 28px", display: "flex", gap: 20, alignItems: "center", boxShadow: "var(--shadow)" },
  spinner: { width: 36, height: 36, border: "3px solid #f1f5f9", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 },
  loadTitle: { fontSize: 15, fontWeight: 600, color: "var(--text)" },
  loadSub: { fontSize: 12, color: "var(--text-2)", marginTop: 4 },

  successBanner: { display: "flex", alignItems: "center", gap: 14, background: "#dcfce7", border: "1.5px solid #86efac", borderRadius: "var(--radius)", padding: "16px 20px", flexWrap: "wrap" },
  successIcon: { width: 38, height: 38, borderRadius: "50%", background: "#16a34a", color: "#fff", fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  successTitle: { fontSize: 14, fontWeight: 700, color: "#15803d" },
  successSub: { fontSize: 12, color: "#166534", marginTop: 2 },
  newListBtn: { marginLeft: "auto", background: "none", border: "1.5px solid #86efac", borderRadius: 7, padding: "7px 14px", fontSize: 12, fontWeight: 600, color: "#15803d", cursor: "pointer" },

  listHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  listTitle: { fontSize: 14, fontWeight: 700, color: "var(--text)" },
  listSub: { fontSize: 12, color: "var(--text-2)" },

  grid: { display: "flex", flexDirection: "column", gap: 10 },
  itemCard: { borderRadius: "var(--radius-sm)", border: "1.5px solid", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8, transition: "all 0.2s" },
  itemTop: { display: "flex", alignItems: "flex-start", gap: 12 },
  catIcon: { width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, transition: "background 0.2s" },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: 700, color: "var(--text)" },
  itemQty: { fontSize: 11, color: "var(--text-3)", marginTop: 2 },
  itemRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 },
  itemPrice: { fontSize: 13, fontWeight: 700, color: "var(--text)" },
  toggleBtn: { border: "none", borderRadius: 6, padding: "6px 13px", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" },
  itemReason: { fontSize: 12, lineHeight: 1.5, padding: "6px 10px", borderRadius: 6, background: "rgba(255,255,255,0.5)", border: "1px solid", transition: "all 0.2s" },

  checkoutBar: { background: "#0f172a", borderRadius: "var(--radius)", padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" },
  checkoutTitle: { fontSize: 14, fontWeight: 700, color: "#fff" },
  checkoutSub: { fontSize: 12, color: "#94a3b8", marginTop: 3 },
  checkoutBtn: { color: "#fff", border: "none", borderRadius: 8, padding: "11px 22px", fontSize: 14, fontWeight: 700, transition: "all 0.2s", flexShrink: 0 },
};
