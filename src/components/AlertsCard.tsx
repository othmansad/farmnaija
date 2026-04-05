import { useApp } from "@/contexts/AppContext";
import { fetchAlertsForState, type FarmAlert } from "@/services/alertsService";
import { trackEvent } from "@/services/analytics";
import { AlertTriangle, Bug, CloudRain, Sprout, Info } from "lucide-react";
import { useState, useEffect } from "react";

const alertIcons: Record<string, typeof AlertTriangle> = {
  pest: Bug,
  weather: CloudRain,
  season: Sprout,
  general: Info,
};

const alertEmojis: Record<string, string> = {
  pest: "🐛",
  weather: "⛈️",
  season: "🌱",
  general: "📢",
};

const alertColors: Record<string, string> = {
  pest: "border-l-destructive bg-destructive/5",
  weather: "border-l-harvest bg-harvest/5",
  season: "border-l-primary bg-primary/5",
  general: "border-l-muted-foreground bg-muted/30",
};

const CACHE_KEY = "farmwise-alerts-cache";

const AlertsCard = () => {
  const { stateId, language } = useApp();
  const [alerts, setAlerts] = useState<FarmAlert[]>([]);

  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "[]");
      const filtered = cached.filter((a: FarmAlert) => a.state_id === stateId || a.state_id === "all");
      if (filtered.length > 0) setAlerts(filtered);
    } catch { /* ignore */ }

    fetchAlertsForState(stateId).then(data => {
      setAlerts(data);
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      if (data.length > 0) trackEvent("alert_view", stateId);
    });
  }, [stateId]);

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map(alert => {
        const Icon = alertIcons[alert.alert_type] || Info;
        const emoji = alertEmojis[alert.alert_type] || "📢";
        return (
          <div key={alert.id} className={`card-farm border-l-4 ${alertColors[alert.alert_type] || alertColors.general}`}>
            <div className="flex items-start gap-3">
              <div className="text-lg flex-shrink-0 mt-0.5">{emoji}</div>
              <div>
                <h4 className="font-bold text-sm">
                  {language === "ha" && alert.title_ha ? alert.title_ha : alert.title_en}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {language === "ha" && alert.message_ha ? alert.message_ha : alert.message_en}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertsCard;
