import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const TRIAL_DAYS = 7;
const TRIAL_KEY = "farmwise-trial-start";
const SUB_KEY = "farmwise-subscribed";

interface PremiumContextType {
  isSubscribed: boolean;
  isTrialActive: boolean;
  trialDaysLeft: number;
  hasTrialStarted: boolean;
  startTrial: () => void;
  subscribe: () => void;
  canAccessPremium: boolean;
}

const PremiumContext = createContext<PremiumContextType | null>(null);

function getTrialInfo() {
  const start = localStorage.getItem(TRIAL_KEY);
  if (!start) return { hasTrialStarted: false, isTrialActive: false, trialDaysLeft: TRIAL_DAYS };
  const elapsed = (Date.now() - parseInt(start)) / (1000 * 60 * 60 * 24);
  const daysLeft = Math.max(0, Math.ceil(TRIAL_DAYS - elapsed));
  return { hasTrialStarted: true, isTrialActive: daysLeft > 0, trialDaysLeft: daysLeft };
}

export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  const [isSubscribed, setIsSubscribed] = useState(() => localStorage.getItem(SUB_KEY) === "true");
  const [trialInfo, setTrialInfo] = useState(getTrialInfo);

  const startTrial = () => {
    if (!trialInfo.hasTrialStarted) {
      localStorage.setItem(TRIAL_KEY, Date.now().toString());
      setTrialInfo(getTrialInfo());
    }
  };

  const subscribe = () => {
    localStorage.setItem(SUB_KEY, "true");
    setIsSubscribed(true);
  };

  const canAccessPremium = isSubscribed || trialInfo.isTrialActive;

  return (
    <PremiumContext.Provider value={{
      isSubscribed,
      isTrialActive: trialInfo.isTrialActive,
      trialDaysLeft: trialInfo.trialDaysLeft,
      hasTrialStarted: trialInfo.hasTrialStarted,
      startTrial,
      subscribe,
      canAccessPremium,
    }}>
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error("usePremium must be inside PremiumProvider");
  return ctx;
};
