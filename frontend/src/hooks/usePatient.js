import { useState, useEffect } from "react";

const STORAGE_KEY = "careorder_patient_profile";

export function usePatient() {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPatient(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const savePatient = (profile) => {
    const data = { ...profile, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setPatient(data);
  };

  const clearPatient = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPatient(null);
  };

  return { patient, savePatient, clearPatient };
}
