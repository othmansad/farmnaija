import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const TRIAL_DAYS = 7;

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

export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [trialStartedAt, setTrialStartedAt] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load profile from DB
  useEffect(() => {
    if (!user) {
      setIsSubscribed(false);
      setTrialStartedAt(null);
      setLoaded(true);
      return;
    }
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("is_subscribed, trial_started_at")
        .eq("id", user.id)
        .single();
      if (data) {
        setIsSubscribed(data.is_subscribed);
        setTrialStartedAt(data.trial_started_at);
      }
      setLoaded(true);
    };
    load();
  }, [user]);

  const getTrialInfo = () => {
    if (!trialStartedAt) return { hasTrialStarted: false, isTrialActive: false, trialDaysLeft: TRIAL_DAYS };
    const elapsed = (Date.now() - new Date(trialStartedAt).getTime()) / (1000 * 60 * 60 * 24);
    const daysLeft = Math.max(0, Math.ceil(TRIAL_DAYS - elapsed));
    return { hasTrialStarted: true, isTrialActive: daysLeft > 0, trialDaysLeft: daysLeft };
  };

  const trialInfo = getTrialInfo();

  const startTrial = async () => {
    if (trialInfo.hasTrialStarted || !user) return;
    const now = new Date().toISOString();
    setTrialStartedAt(now);
    await supabase
      .from("profiles")
      .update({ trial_started_at: now, updated_at: new Date().toISOString() })
      .eq("id", user.id);
  };

  const subscribe = async () => {
    if (!user) return;
    setIsSubscribed(true);
    await supabase
      .from("profiles")
      .update({ is_subscribed: true, subscribed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", user.id);
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
