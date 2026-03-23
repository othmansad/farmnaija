import React, { createContext, useContext, useState, type ReactNode } from "react";
import { type Language } from "@/data/translations";
import { states, getDefaultState, getDefaultLGA, type LGA } from "@/data/locations";

export interface SavedLocation {
  stateId: string;
  lga: LGA;
  label: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  stateId: string;
  setStateId: (id: string) => void;
  lga: LGA | null;
  setLga: (lga: LGA | null) => void;
  stateName: string;
  savedLocations: SavedLocation[];
  saveCurrentLocation: () => void;
  removeSavedLocation: (index: number) => void;
  switchToLocation: (loc: SavedLocation) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("farmwise-lang") as Language) || "en";
  });
  const [stateId, setStateIdState] = useState(() => {
    return localStorage.getItem("farmwise-state") || getDefaultState();
  });
  const [lga, setLgaState] = useState<LGA | null>(() => {
    return loadJSON<LGA | null>("farmwise-lga", getDefaultLGA(getDefaultState()));
  });
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(() => {
    return loadJSON<SavedLocation[]>("farmwise-saved-locations", []);
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

  const saveCurrentLocation = () => {
    if (!lga) return;
    const exists = savedLocations.some(
      s => s.stateId === stateId && s.lga.name === lga.name
    );
    if (exists) return;
    const updated = [
      ...savedLocations,
      { stateId, lga, label: `${lga.name}, ${states[stateId]?.name || stateId}` },
    ];
    setSavedLocations(updated);
    localStorage.setItem("farmwise-saved-locations", JSON.stringify(updated));
  };

  const removeSavedLocation = (index: number) => {
    const updated = savedLocations.filter((_, i) => i !== index);
    setSavedLocations(updated);
    localStorage.setItem("farmwise-saved-locations", JSON.stringify(updated));
  };

  const switchToLocation = (loc: SavedLocation) => {
    setStateIdState(loc.stateId);
    localStorage.setItem("farmwise-state", loc.stateId);
    setLgaState(loc.lga);
    localStorage.setItem("farmwise-lga", JSON.stringify(loc.lga));
  };

  const stateName = states[stateId]?.name || stateId;

  return (
    <AppContext.Provider
      value={{
        language, setLanguage,
        stateId, setStateId,
        lga, setLga,
        stateName,
        savedLocations, saveCurrentLocation, removeSavedLocation, switchToLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};
