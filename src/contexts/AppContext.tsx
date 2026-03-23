import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type Language } from "@/data/translations";
import { states, getDefaultState, getDefaultLGA, type LGA } from "@/data/locations";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  stateId: string;
  setStateId: (id: string) => void;
  lga: LGA | null;
  setLga: (lga: LGA | null) => void;
  stateName: string;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("farmwise-lang") as Language) || "en";
  });
  const [stateId, setStateIdState] = useState(() => {
    return localStorage.getItem("farmwise-state") || getDefaultState();
  });
  const [lga, setLgaState] = useState<LGA | null>(() => {
    const saved = localStorage.getItem("farmwise-lga");
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return getDefaultLGA(getDefaultState());
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("farmwise-lang", lang);
  };

  const setStateId = (id: string) => {
    setStateIdState(id);
    localStorage.setItem("farmwise-state", id);
    const defaultLga = getDefaultLGA(id);
    setLga(defaultLga);
  };

  const setLga = (l: LGA | null) => {
    setLgaState(l);
    if (l) localStorage.setItem("farmwise-lga", JSON.stringify(l));
  };

  const stateName = states[stateId]?.name || stateId;

  return (
    <AppContext.Provider value={{ language, setLanguage, stateId, setStateId, lga, setLga, stateName }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};
