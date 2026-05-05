import React, { useState } from "react";
import { usePatient } from "./hooks/usePatient";
import PatientProfile from "./components/PatientProfile";
import RestaurantSearch from "./components/RestaurantSearch";
import MenuFilter from "./components/MenuFilter";
import GroceryRestock from "./components/GroceryRestock";

const CONDITION_LABEL = {
  diabetes: "Type 2 Diabetes",
  kidney: "Kidney Disease",
  hypertension: "Hypertension",
};
const CONDITION_COLOR = {
  diabetes: "#3b82f6",
  kidney: "#8b5cf6",
  hypertension: "#ef4444",
};

export default function App() {
  const { patient, savePatient, clearPatient } = usePatient();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleTabChange = (tab) => {
    if ((tab === "food" || tab === "grocery") && !patient) {
      setActiveTab("profile");
      return;
    }
    setActiveTab(tab);
    setSelectedRestaurant(null);
  };

  const condColor = patient ? CONDITION_COLOR[patient.condition] : "#64748b";

  return (
    <div style={s.app}>
      {/* ── Header ── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logo}>
            <div style={s.logoMark}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#FF6B35"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
              </svg>
            </div>
            <div>
              <div style={s.logoName}>Swiggy</div>
              <div style={s.logoSub}>Health-Aware Food for Caregivers</div>
            </div>
          </div>

          <div style={s.headerRight}>
            {patient ? (
              <div style={s.patientPill}>
                <div style={{ ...s.pillDot, background: condColor }} />
                <span style={s.pillName}>{patient.name}</span>
                <span style={{ ...s.pillTag, background: condColor + "18", color: condColor }}>
                  {CONDITION_LABEL[patient.condition]}
                </span>
                <button style={s.pillClose} onClick={clearPatient}>×</button>
              </div>
            ) : (
              <div style={s.noPatientHint}>
                Set up a patient profile to begin →
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Tab Bar ── */}
      <div style={s.tabBar}>
        <div style={s.tabInner}>
          {[
            { id: "profile", icon: "👤", label: "Patient Profile" },
            { id: "food",    icon: "🍽️", label: "Order Food" },
            { id: "grocery", icon: "🛒", label: "Weekly Groceries" },
          ].map((tab) => {
            const locked = (tab.id === "food" || tab.id === "grocery") && !patient;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                style={{
                  ...s.tab,
                  background: active ? "#fff" : "transparent",
                  color: active ? "var(--primary)" : locked ? "var(--text-3)" : "var(--text-2)",
                  fontWeight: active ? 600 : 400,
                  boxShadow: active ? "var(--shadow)" : "none",
                  cursor: locked ? "not-allowed" : "pointer",
                }}
                onClick={() => handleTabChange(tab.id)}
              >
                <span style={{ fontSize: 15 }}>{tab.icon}</span>
                {tab.label}
                {locked && <span style={s.lockIcon}>🔒</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main ── */}
      <main style={s.main}>
        <div className="fade-in" key={activeTab + (selectedRestaurant?.id || "")}>
          {activeTab === "profile" && (
            <PatientProfile patient={patient} onSave={(p) => { savePatient(p); handleTabChange("food"); }} />
          )}
          {activeTab === "food" && patient && (
            selectedRestaurant
              ? <MenuFilter patient={patient} restaurant={selectedRestaurant} onBack={() => setSelectedRestaurant(null)} />
              : <RestaurantSearch onSelect={setSelectedRestaurant} />
          )}
          {activeTab === "grocery" && patient && (
            <GroceryRestock patient={patient} />
          )}
        </div>
      </main>
    </div>
  );
}

const s = {
  app: { minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" },

  header: { background: "#fff", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 0 var(--border)" },
  headerInner: { maxWidth: 960, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 },

  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: { width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#fff4f0,#ffe8df)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid #ffd5c4" },
  logoName: { fontSize: 17, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" },
  logoSub: { fontSize: 10.5, color: "var(--text-3)", letterSpacing: "0.01em", marginTop: 1 },

  headerRight: { display: "flex", alignItems: "center", gap: 10 },
  patientPill: { display: "flex", alignItems: "center", gap: 7, background: "#f8fafc", border: "1.5px solid var(--border)", borderRadius: 100, padding: "5px 6px 5px 12px" },
  pillDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0, animation: "pulse-dot 2s ease infinite" },
  pillName: { fontSize: 13, fontWeight: 600, color: "var(--text)" },
  pillTag: { fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100 },
  pillClose: { background: "#f1f5f9", border: "none", borderRadius: "50%", width: 22, height: 22, fontSize: 14, color: "var(--text-3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", lineHeight: 1 },
  noPatientHint: { fontSize: 12, color: "var(--text-3)", fontStyle: "italic" },

  tabBar: { background: "#f8fafc", borderBottom: "1px solid var(--border)" },
  tabInner: { maxWidth: 960, margin: "0 auto", padding: "8px 24px", display: "flex", gap: 4 },
  tab: { display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 8, fontSize: 13, border: "none", transition: "all 0.15s", whiteSpace: "nowrap" },
  lockIcon: { fontSize: 10, opacity: 0.6 },

  main: { flex: 1, maxWidth: 960, width: "100%", margin: "0 auto", padding: "28px 24px", boxSizing: "border-box" },
};
