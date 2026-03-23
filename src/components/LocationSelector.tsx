import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/data/translations";
import { states } from "@/data/locations";
import { MapPin, ChevronDown, BookmarkPlus, Trash2 } from "lucide-react";

const LocationSelector = () => {
  const {
    language, stateId, setStateId, lga, setLga, stateName,
    savedLocations, saveCurrentLocation, removeSavedLocation, switchToLocation,
  } = useApp();
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

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          📍 {lga?.name || "—"}, {stateName}
        </div>
        <button
          onClick={saveCurrentLocation}
          className="text-xs text-primary flex items-center gap-1"
          title={language === "en" ? "Save location" : "Ajiye wuri"}
        >
          <BookmarkPlus className="w-4 h-4" />
        </button>
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

          {savedLocations.length > 0 && (
            <div>
              <label className="text-farm-label">
                {language === "en" ? "Saved Locations" : "Wuraren da aka Ajiye"}
              </label>
              <div className="mt-1 space-y-1">
                {savedLocations.map((loc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2 text-sm"
                  >
                    <button
                      onClick={() => {
                        switchToLocation(loc);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2 text-left flex-1"
                    >
                      <MapPin className="w-3 h-3 text-primary" />
                      {loc.label}
                    </button>
                    <button
                      onClick={() => removeSavedLocation(i)}
                      className="text-destructive p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
