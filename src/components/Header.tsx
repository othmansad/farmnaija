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
    <header className="sticky top-0 z-50 gradient-header px-5 pt-5 pb-6 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl drop-shadow-sm">🌾</span>
          <span className="text-primary-foreground font-black text-xl tracking-tight drop-shadow-sm">{t("appName", language)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === "en" ? "ha" : "en")}
            className="flex items-center gap-1.5 bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground text-xs font-extrabold px-3 py-2 rounded-full active:scale-95 transition-all duration-200 hover:bg-primary-foreground/30"
          >
            <Globe className="w-3.5 h-3.5" />
            {language === "en" ? "HA" : "EN"}
          </button>
          <Link to="/admin" className="text-primary-foreground/60 hover:text-primary-foreground p-1.5 transition-colors duration-200">
            <Settings className="w-4.5 h-4.5" />
          </Link>
        </div>
      </div>
      <div className="text-primary-foreground font-extrabold text-lg tracking-tight">
        {getGreeting(language)}
      </div>
      <div className="flex items-center gap-1.5 text-primary-foreground/65 text-xs mt-1 font-semibold">
        <MapPin className="w-3.5 h-3.5" />
        <span>{lga?.name}, {stateName}</span>
      </div>
    </header>
  );
};

export default Header;
