import { useApp } from "@/contexts/AppContext";
import { MapPin } from "lucide-react";

const SavedLocationsCard = () => {
  const { language, savedLocations, switchToLocation } = useApp();

  if (savedLocations.length === 0) return null;

  return (
    <div className="card-farm">
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-primary/10 p-2 rounded-xl">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-bold text-sm">
          📌 {language === "en" ? "Saved Locations" : "Wuraren da aka Ajiye"}
        </h3>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {savedLocations.map((loc, i) => (
          <button
            key={i}
            onClick={() => switchToLocation(loc)}
            className="flex-shrink-0 bg-muted/50 rounded-xl px-3.5 py-2.5 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-transform hover:bg-muted/80"
          >
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {loc.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SavedLocationsCard;
