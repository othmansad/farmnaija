import { useApp } from "@/contexts/AppContext";
import { MapPin } from "lucide-react";

const SavedLocationsCard = () => {
  const { language, savedLocations, switchToLocation } = useApp();

  if (savedLocations.length === 0) return null;

  return (
    <div className="card-farm">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-sm">
          {language === "en" ? "Saved Locations" : "Wuraren da aka Ajiye"}
        </h3>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {savedLocations.map((loc, i) => (
          <button
            key={i}
            onClick={() => switchToLocation(loc)}
            className="flex-shrink-0 bg-muted/50 rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1 active:scale-95 transition-transform"
          >
            <MapPin className="w-3 h-3 text-primary" />
            {loc.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SavedLocationsCard;
