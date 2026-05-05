import React, { useState } from "react";

const CONDITIONS = [
  {
    value: "diabetes",
    label: "Type 2 Diabetes",
    icon: "🩺",
    color: "#3b82f6",
    grad: "linear-gradient(135deg,#eff6ff,#dbeafe)",
    border: "#bfdbfe",
    tags: ["Low GI foods", "No refined sugar", "No deep fried"],
  },
  {
    value: "kidney",
    label: "Kidney Disease",
    icon: "💜",
    color: "#8b5cf6",
    grad: "linear-gradient(135deg,#f5f3ff,#ede9fe)",
    border: "#ddd6fe",
    tags: ["Low potassium", "Low phosphorus", "Low sodium"],
  },
  {
    value: "hypertension",
    label: "Hypertension",
    icon: "❤️",
    color: "#ef4444",
    grad: "linear-gradient(135deg,#fef2f2,#fee2e2)",
    border: "#fecaca",
    tags: ["Low sodium", "No processed food", "Low saturated fat"],
  },
];

export default function PatientProfile({ patient, onSave }) {
  const [form, setForm] = useState(patient || { name: "", condition: "", restrictions: "" });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.condition) return;
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const ready = form.name.trim() && form.condition;

  return (
    <div style={s.wrap}>
      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroLeft}>
          <div style={s.heroLabel}>Step 1 of 3</div>
          <h1 style={s.heroTitle}>Set up patient profile</h1>
          <p style={s.heroDesc}>
            All health data is stored only on this device — never uploaded to any server.
          </p>
          <div style={s.heroBadge}>
            <span style={s.heroBadgeDot}>🔒</span>
            100% Private · localStorage only
          </div>
        </div>
        <div style={s.heroIllustration}>
          <div style={s.heroCircle}>👤</div>
        </div>
      </div>

      {/* Form card */}
      <div style={s.card}>
        <form onSubmit={handleSave} style={s.form}>

          {/* Name */}
          <div style={s.field}>
            <label style={s.label}>Patient Name</label>
            <input
              style={s.input}
              type="text"
              placeholder="e.g. Ramesh Kumar"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Condition */}
          <div style={s.field}>
            <label style={s.label}>Medical Condition</label>
            <div style={s.condGrid}>
              {CONDITIONS.map((c) => {
                const active = form.condition === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    style={{
                      ...s.condCard,
                      background: active ? c.grad : "#fafafa",
                      borderColor: active ? c.color : "var(--border)",
                      boxShadow: active ? `0 0 0 3px ${c.color}22, var(--shadow)` : "none",
                      transform: active ? "translateY(-2px)" : "none",
                    }}
                    onClick={() => setForm({ ...form, condition: c.value })}
                  >
                    {active && (
                      <div style={{ ...s.condCheck, background: c.color }}>✓</div>
                    )}
                    <span style={s.condIcon}>{c.icon}</span>
                    <span style={{ ...s.condName, color: active ? c.color : "var(--text)" }}>
                      {c.label}
                    </span>
                    <div style={s.condTags}>
                      {c.tags.map((t) => (
                        <span key={t} style={{ ...s.condTag, background: active ? c.color + "14" : "#f1f5f9", color: active ? c.color : "var(--text-3)", border: `1px solid ${active ? c.color + "30" : "transparent"}` }}>{t}</span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Restrictions */}
          <div style={s.field}>
            <label style={s.label}>
              Additional Restrictions
              <span style={s.optional}> — optional</span>
            </label>
            <textarea
              style={s.textarea}
              placeholder="e.g. vegetarian, no shellfish, low potassium..."
              value={form.restrictions}
              onChange={(e) => setForm({ ...form, restrictions: e.target.value })}
              rows={2}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              ...s.saveBtn,
              background: saved ? "#16a34a" : ready ? "var(--primary)" : "#cbd5e1",
              cursor: ready ? "pointer" : "not-allowed",
              boxShadow: ready ? "0 4px 14px rgba(255,107,53,0.35)" : "none",
            }}
            disabled={!ready}
          >
            {saved ? "✓  Profile Saved — Opening Menu Search…" : "Save Profile & Find Restaurants →"}
          </button>
        </form>
      </div>

      {/* Steps footer */}
      <div style={s.steps}>
        {[
          { n: "1", title: "Patient profile", active: true },
          { n: "2", title: "Filter restaurant menu" },
          { n: "3", title: "Auto-restock groceries" },
        ].map((step, i) => (
          <React.Fragment key={step.n}>
            <div style={s.step}>
              <div style={{ ...s.stepNum, background: step.active ? "var(--primary)" : "#e2e8f0", color: step.active ? "#fff" : "var(--text-3)" }}>{step.n}</div>
              <span style={{ ...s.stepLabel, color: step.active ? "var(--text)" : "var(--text-3)", fontWeight: step.active ? 600 : 400 }}>{step.title}</span>
            </div>
            {i < 2 && <div style={s.stepLine} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

const s = {
  wrap: { display: "flex", flexDirection: "column", gap: 16 },

  hero: { background: "linear-gradient(135deg,#fff4f0 0%,#ffe8df 50%,#ffd5c4 100%)", borderRadius: "var(--radius-lg)", padding: "32px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, border: "1px solid #ffd5c4" },
  heroLeft: { display: "flex", flexDirection: "column", gap: 8 },
  heroLabel: { fontSize: 11, fontWeight: 600, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em" },
  heroTitle: { fontSize: 26, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em", lineHeight: 1.2 },
  heroDesc: { fontSize: 14, color: "var(--text-2)", maxWidth: 380, lineHeight: 1.6 },
  heroBadge: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 100, padding: "4px 12px", width: "fit-content" },
  heroBadgeDot: { fontSize: 12 },
  heroIllustration: { flexShrink: 0 },
  heroCircle: { width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, boxShadow: "0 8px 24px rgba(255,107,53,0.15)", border: "2px solid rgba(255,255,255,0.9)" },

  card: { background: "#fff", borderRadius: "var(--radius)", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)", overflow: "hidden" },
  form: { padding: 28, display: "flex", flexDirection: "column", gap: 22 },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 13, fontWeight: 600, color: "var(--text)" },
  optional: { fontWeight: 400, color: "var(--text-3)", fontSize: 12 },

  input: { padding: "11px 14px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 14, color: "var(--text)", background: "#fafafa", transition: "all 0.15s" },
  textarea: { padding: "11px 14px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", fontSize: 14, color: "var(--text)", resize: "vertical", background: "#fafafa", transition: "all 0.15s" },

  condGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 },
  condCard: { position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "18px 12px 14px", border: "2px solid", borderRadius: 12, cursor: "pointer", transition: "all 0.2s", textAlign: "center" },
  condCheck: { position: "absolute", top: 8, right: 8, width: 20, height: 20, borderRadius: "50%", color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" },
  condIcon: { fontSize: 28 },
  condName: { fontSize: 12, fontWeight: 700, lineHeight: 1.2 },
  condTags: { display: "flex", flexDirection: "column", gap: 3, width: "100%" },
  condTag: { fontSize: 10, fontWeight: 500, padding: "2px 6px", borderRadius: 4, transition: "all 0.15s" },

  saveBtn: { padding: "13px 24px", borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: 700, color: "#fff", border: "none", transition: "all 0.2s", letterSpacing: "0.01em" },

  steps: { background: "#fff", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 0 },
  step: { display: "flex", alignItems: "center", gap: 8 },
  stepNum: { width: 26, height: 26, borderRadius: "50%", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  stepLabel: { fontSize: 13 },
  stepLine: { flex: 1, height: 1, background: "var(--border)", margin: "0 12px", minWidth: 40 },
};
