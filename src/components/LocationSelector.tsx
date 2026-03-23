import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/data/translations";
import { states } from "@/data/locations";
import { MapPin, ChevronDown } from "lucide-react";

const LocationSelector = () => {
  const { language, stateId, setStateId, lga, setLga, stateName } = useApp();
  const [open, setOpen] = useState(false);

  const currentState = states[stateId];

  return (
    <div className="card-farm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">{t("location", language)}</h3>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-xs text-primary flex items-center gap-1"
        >
          {t("changeLocation", language)}
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      <div className="text-sm text-muted-foreground">
        📍 {lga?.name || "—"}, {stateName}
      </div>

      {open && (
        <div className="mt-3 space-y-3 border-t pt-3">
          <div>
            <label className="text-farm-label">{t("selectState", language)}</label>
            <select
              value={stateId}
              onChange={(e) => setStateId(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg border bg-background text-sm"
            >
              {Object.entries(states).map(([id, s]) => (
                <option key={id} value={id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-farm-label">{t("selectLGA", language)}</label>
            <select
              value={lga?.name || ""}
              onChange={(e) => {
                const found = currentState?.lgas.find(l => l.name === e.target.value);
                if (found) setLga(found);
              }}
              className="w-full mt-1 p-2 rounded-lg border bg-background text-sm"
            >
              {currentState?.lgas.map((l) => (
                <option key={l.name} value={l.name}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
