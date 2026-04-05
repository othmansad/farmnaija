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
          <div className="bg-primary/10 p-2 rounded-xl">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-bold">{t("location", language)}</h3>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-xs text-primary font-bold flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
        >
          {t("changeLocation", language)}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      <div className="flex items-center justify-between bg-muted/50 rounded-xl px-3 py-2.5">
        <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          📍 {lga?.name || "—"}, {stateName}
        </div>
        <button
          onClick={saveCurrentLocation}
          className="text-primary p-1.5 bg-primary/10 rounded-lg active:scale-95 transition-transform"
          title={language === "en" ? "Save location" : "Ajiye wuri"}
        >
          <BookmarkPlus className="w-4 h-4" />
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-3 border-t pt-3">
          <div>
            <label className="text-farm-label text-xs">{t("selectState", language)}</label>
            <select
              value={stateId}
              onChange={(e) => setStateId(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl border bg-background text-sm font-semibold"
            >
              {Object.entries(states).map(([id, s]) => (
                <option key={id} value={id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-farm-label text-xs">{t("selectLGA", language)}</label>
            <select
              value={lga?.name || ""}
              onChange={(e) => {
                const found = currentState?.lgas.find(l => l.name === e.target.value);
                if (found) setLga(found);
              }}
              className="w-full mt-1 p-2.5 rounded-xl border bg-background text-sm font-semibold"
            >
              {currentState?.lgas.map((l) => (
                <option key={l.name} value={l.name}>{l.name}</option>
              ))}
            </select>
          </div>

          {savedLocations.length > 0 && (
            <div>
              <label className="text-farm-label text-xs">
                {language === "en" ? "Saved Locations" : "Wuraren da aka Ajiye"}
              </label>
              <div className="mt-1 space-y-1.5">
                {savedLocations.map((loc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-muted/50 rounded-xl px-3 py-2.5 text-sm"
                  >
                    <button
                      onClick={() => {
                        switchToLocation(loc);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2 text-left flex-1 font-semibold active:scale-95 transition-transform"
                    >
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {loc.label}
                    </button>
                    <button
                      onClick={() => removeSavedLocation(i)}
                      className="text-destructive p-1.5 rounded-lg hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
