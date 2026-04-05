import { useApp } from "@/contexts/AppContext";
import { t } from "@/data/translations";
import { MapPin, Globe, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const getGreeting = (language: "en" | "ha") => {
  const hour = new Date().getHours();
  if (language === "ha") {
    if (hour < 12) return "Ina kwana! ☀️";
    if (hour < 17) return "Ina wuni! 🌤️";
    return "Ina yini! 🌙";
  }
  if (hour < 12) return "Good Morning! ☀️";
  if (hour < 17) return "Good Afternoon! 🌤️";
  return "Good Evening! 🌙";
};

const Header = () => {
  const { language, setLanguage, stateName, lga } = useApp();

  return (
    <header className="sticky top-0 z-50 gradient-header px-4 pt-4 pb-5 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="text-primary-foreground font-extrabold text-lg tracking-tight">{t("appName", language)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setLanguage(language === "en" ? "ha" : "en")}
            className="flex items-center gap-1 bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground text-xs font-bold px-2.5 py-1.5 rounded-full active:scale-95 transition-transform"
          >
            <Globe className="w-3.5 h-3.5" />
            {language === "en" ? "HA" : "EN"}
          </button>
          <Link to="/admin" className="text-primary-foreground/70 hover:text-primary-foreground p-1">
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <div className="text-primary-foreground/90 text-sm font-semibold">
        {getGreeting(language)}
      </div>
      <div className="flex items-center gap-1 text-primary-foreground/70 text-xs mt-0.5">
        <MapPin className="w-3 h-3" />
        <span>{lga?.name}, {stateName}</span>
      </div>
    </header>
  );
};

export default Header;
