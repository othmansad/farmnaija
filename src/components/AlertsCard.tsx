import { useApp } from "@/contexts/AppContext";
import { getAlertsForState, type FarmAlert } from "@/services/adminStore";
import { AlertTriangle, Bug, CloudRain, Sprout, Info } from "lucide-react";
import { useState, useEffect } from "react";

const alertIcons: Record<string, typeof AlertTriangle> = {
  pest: Bug,
  weather: CloudRain,
  season: Sprout,
  general: Info,
};

const alertColors: Record<string, string> = {
  pest: "border-l-destructive bg-destructive/5",
  weather: "border-l-yellow-500 bg-yellow-500/5",
  season: "border-l-primary bg-primary/5",
  general: "border-l-muted-foreground bg-muted/50",
};

const AlertsCard = () => {
  const { stateId, language } = useApp();
  const [alerts, setAlerts] = useState<FarmAlert[]>([]);

  useEffect(() => {
    setAlerts(getAlertsForState(stateId));
  }, [stateId]);

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map(alert => {
        const Icon = alertIcons[alert.type] || Info;
        return (
          <div key={alert.id} className={`card-farm border-l-4 ${alertColors[alert.type] || alertColors.general}`}>
            <div className="flex items-start gap-3">
              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">{alert.title[language] || alert.title.en}</h4>
                <p className="text-sm text-muted-foreground">{alert.message[language] || alert.message.en}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertsCard;
