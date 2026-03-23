import { useApp } from "@/contexts/AppContext";
import { t } from "@/data/translations";
import { MapPin, Globe } from "lucide-react";

const Header = () => {
  const { language, setLanguage, stateName, lga } = useApp();

  return (
    <header className="sticky top-0 z-50 bg-primary px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🌾</span>
        <span className="text-primary-foreground font-bold text-lg">{t("appName", language)}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-primary-foreground/80 text-xs">
          <MapPin className="w-3 h-3" />
          <span>{lga?.name}, {stateName}</span>
        </div>
        <button
          onClick={() => setLanguage(language === "en" ? "ha" : "en")}
          className="flex items-center gap-1 bg-primary-foreground/15 text-primary-foreground text-xs px-2 py-1 rounded-full"
        >
          <Globe className="w-3 h-3" />
          {language === "en" ? "HA" : "EN"}
        </button>
      </div>
    </header>
  );
};

export default Header;
