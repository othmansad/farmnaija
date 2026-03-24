// Admin data stored in localStorage

export interface FarmAlert {
  id: string;
  stateId: string;
  title: Record<string, string>;
  message: Record<string, string>;
  type: "pest" | "weather" | "season" | "general";
  createdAt: string;
  active: boolean;
}

export interface SeasonTip {
  id: string;
  stateId: string;
  tip: Record<string, string>;
  month: number; // 1-12
}

const ADMIN_PASSWORD_KEY = "farmwise-admin-pw";
const ALERTS_KEY = "farmwise-alerts";
const TIPS_KEY = "farmwise-season-tips";
const CUSTOM_CROPS_KEY = "farmwise-custom-crops";

const DEFAULT_ADMIN_PASSWORD = "farmwise2024";

export function checkAdminPassword(pw: string): boolean {
  const stored = localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_ADMIN_PASSWORD;
  return pw === stored;
}

export function setAdminPassword(pw: string) {
  localStorage.setItem(ADMIN_PASSWORD_KEY, pw);
}

// Alerts
export function getAlerts(): FarmAlert[] {
  try {
    return JSON.parse(localStorage.getItem(ALERTS_KEY) || "[]");
  } catch { return []; }
}

export function saveAlerts(alerts: FarmAlert[]) {
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
}

export function addAlert(alert: Omit<FarmAlert, "id" | "createdAt">) {
  const alerts = getAlerts();
  alerts.unshift({
    ...alert,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  });
  saveAlerts(alerts);
  return alerts;
}

export function removeAlert(id: string) {
  const alerts = getAlerts().filter(a => a.id !== id);
  saveAlerts(alerts);
  return alerts;
}

export function getAlertsForState(stateId: string): FarmAlert[] {
  return getAlerts().filter(a => a.active && (a.stateId === stateId || a.stateId === "all"));
}

// Season Tips
export function getSeasonTips(): SeasonTip[] {
  try {
    return JSON.parse(localStorage.getItem(TIPS_KEY) || "[]");
  } catch { return []; }
}

export function saveSeasonTips(tips: SeasonTip[]) {
  localStorage.setItem(TIPS_KEY, JSON.stringify(tips));
}

export function addSeasonTip(tip: Omit<SeasonTip, "id">) {
  const tips = getSeasonTips();
  tips.push({ ...tip, id: crypto.randomUUID() });
  saveSeasonTips(tips);
  return tips;
}

export function removeSeasonTip(id: string) {
  const tips = getSeasonTips().filter(t => t.id !== id);
  saveSeasonTips(tips);
  return tips;
}
