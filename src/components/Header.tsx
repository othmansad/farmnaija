import { useApp } from "@/contexts/AppContext";
import { t } from "@/data/translations";
import { MapPin, Globe, Rocket } from "lucide-react";
import SettingsSheet from "@/components/SettingsSheet";
import { useSidebar } from "@/components/ui/sidebar";

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
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-50 gradient-header px-4 sm:px-6 lg:px-8 pt-5 pb-6 shadow-lg">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl drop-shadow-sm">🌾</span>
            <span className="text-primary-foreground font-black text-xl tracking-tight drop-shadow-sm">{t("appName", language)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="flex items-center gap-1.5 gradient-harvest text-harvest-foreground text-xs font-black px-3.5 py-2 rounded-full active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Rocket className="w-3.5 h-3.5" />
              {language === "en" ? "Get Started" : "Fara"}
            </button>
            <button
              onClick={() => setLanguage(language === "en" ? "ha" : "en")}
              className="flex items-center gap-1.5 bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground text-xs font-extrabold px-3 py-2 rounded-full active:scale-95 transition-all duration-200 hover:bg-primary-foreground/30"
            >
              <Globe className="w-3.5 h-3.5" />
              {language === "en" ? "HA" : "EN"}
            </button>
            <SettingsSheet />
          </div>
        </div>
        <div className="text-primary-foreground font-extrabold text-lg tracking-tight">
          {getGreeting(language)}
        </div>
        <div className="flex items-center gap-1.5 text-primary-foreground/65 text-xs mt-1 font-semibold">
          <MapPin className="w-3.5 h-3.5" />
          <span>{lga?.name}, {stateName}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
