import React, { useState, useEffect } from "react";
import { api } from "../utils/api";

const CUISINE_COLORS = {
  "Biryani": "#f59e0b",
  "Mughlai": "#8b5cf6",
  "Andhra": "#ef4444",
  "Haleem": "#16a34a",
};

export default function RestaurantSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = async (q) => {
    setLoading(true);
    try {
      const data = await api.searchRestaurants(q);
      setRestaurants(data.restaurants);
    } catch {
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { search(""); }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(() => search(val), 280);
  };

  return (
    <div style={s.wrap}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Find a Restaurant</h2>
          <p style={s.sub}>Select a restaurant — Claude will analyse every dish for your patient</p>
        </div>
        <div style={s.aiChip}>
          <span>✦</span> AI-powered filtering
        </div>
      </div>

      {/* Search bar */}
      <div style={s.searchWrap}>
        <svg style={s.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input
          style={s.searchInput}
          type="text"
          placeholder="Search Paradise Biryani, cuisine type..."
          value={query}
          onChange={handleSearch}
        />
        {loading && <div style={s.miniSpin} />}
      </div>

      {/* Restaurant grid */}
      <div style={s.grid}>
        {restaurants.map((r) => (
          <button key={r.id} style={s.card} onClick={() => onSelect(r)}>
            {/* Colour band */}
            <div style={{ ...s.cardBand, background: r.id === "rest_001" ? "linear-gradient(135deg,#FF6B35,#ff8c60)" : r.id === "rest_002" ? "linear-gradient(135deg,#E63946,#f05f6b)" : "linear-gradient(135deg,#2D6A4F,#52b788)" }}>
              <div style={s.cardBandText}>{r.name[0]}</div>
              <div style={s.ratingBadge}>⭐ {r.rating}</div>
            </div>

            <div style={s.cardBody}>
              <div style={s.cardName}>{r.name}</div>
              <div style={s.cardCuisine}>{r.cuisine}</div>

              <div style={s.cardMeta}>
                <div style={s.metaItem}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  {r.deliveryTime}
                </div>
                <div style={s.metaDot} />
                <div style={s.metaItem}>₹{r.priceForTwo} for 2</div>
                <div style={s.metaDot} />
                <div style={s.metaItem}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {r.address.split(",")[0]}
                </div>
              </div>

              <div style={s.cardFooter}>
                <span style={s.filterBtn}>Analyse Menu with AI →</span>
              </div>
            </div>
          </button>
        ))}

        {!loading && restaurants.length === 0 && (
          <div style={s.empty}>No restaurants found for "{query}"</div>
        )}
      </div>
    </div>
  );
}

const s = {
  wrap: { display: "flex", flexDirection: "column", gap: 20 },

  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  title: { fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em" },
  sub: { fontSize: 13, color: "var(--text-2)", marginTop: 4 },
  aiChip: { display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "var(--primary)", background: "var(--primary-light)", border: "1px solid #ffd5c4", borderRadius: 100, padding: "5px 12px", flexShrink: 0 },

  searchWrap: { display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1.5px solid var(--border)", borderRadius: 10, padding: "10px 14px", boxShadow: "var(--shadow-sm)", transition: "border-color 0.15s" },
  searchIcon: { color: "var(--text-3)", flexShrink: 0 },
  searchInput: { flex: 1, border: "none", fontSize: 14, color: "var(--text)", background: "transparent", outline: "none" },
  miniSpin: { width: 16, height: 16, border: "2px solid var(--border)", borderTop: "2px solid var(--primary)", borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 },
  card: { background: "#fff", borderRadius: "var(--radius)", border: "1.5px solid var(--border)", cursor: "pointer", textAlign: "left", overflow: "hidden", transition: "all 0.2s", boxShadow: "var(--shadow)", display: "flex", flexDirection: "column" },

  cardBand: { height: 110, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" },
  cardBandText: { fontSize: 52, fontWeight: 900, color: "rgba(255,255,255,0.25)", userSelect: "none" },
  ratingBadge: { position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.35)", color: "#fff", fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: 20, backdropFilter: "blur(4px)" },

  cardBody: { padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 6, flex: 1 },
  cardName: { fontSize: 16, fontWeight: 700, color: "var(--text)" },
  cardCuisine: { fontSize: 12, color: "var(--text-3)", marginBottom: 2 },
  cardMeta: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-2)" },
  metaItem: { display: "flex", alignItems: "center", gap: 3 },
  metaDot: { width: 3, height: 3, borderRadius: "50%", background: "var(--text-3)" },

  cardFooter: { marginTop: "auto", paddingTop: 10 },
  filterBtn: { fontSize: 12, fontWeight: 600, color: "var(--primary)", background: "var(--primary-light)", padding: "5px 10px", borderRadius: 6, border: "1px solid #ffd5c4" },

  empty: { gridColumn: "1/-1", textAlign: "center", padding: "40px 0", color: "var(--text-3)", fontSize: 14 },
};
