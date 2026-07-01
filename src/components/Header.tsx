import { useApp } from "@/contexts/AppContext";
import { t } from "@/data/translations";
import { MapPin, Globe, Rocket, Menu } from "lucide-react";
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
    <header className="sticky top-0 z-50 gradient-header px-4 sm:px-6 lg:px-8 pt-3 pb-4 sm:pt-5 sm:pb-7 shadow-xl">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl drop-shadow-sm">🌾</span>
            <span className="font-display italic text-primary-foreground text-2xl sm:text-3xl leading-none drop-shadow-sm">
              {t("appName", language)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={toggleSidebar}
              className="hidden sm:inline-flex items-center gap-1.5 gradient-harvest text-harvest-foreground text-[11px] font-black uppercase tracking-widest px-3.5 py-2 rounded-full active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Rocket className="w-3.5 h-3.5" />
              {language === "en" ? "Get Started" : "Fara"}
            </button>
            <button
              onClick={() => setLanguage(language === "en" ? "ha" : "en")}
              className="flex items-center gap-1 bg-primary-foreground/15 backdrop-blur-sm text-primary-foreground text-[11px] font-extrabold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full active:scale-95 transition-all duration-200 hover:bg-primary-foreground/25 ring-1 ring-primary-foreground/15"
              aria-label={language === "en" ? "Switch language" : "Canza yare"}
            >
              <Globe className="w-3.5 h-3.5" />
              {language === "en" ? "HA" : "EN"}
            </button>
            <SettingsSheet />
          </div>
        </div>
        <div className="font-display italic text-primary-foreground text-3xl sm:text-4xl leading-[1.05] tracking-tight">
          {getGreeting(language)}
        </div>
        <div className="flex items-center gap-1.5 text-primary-foreground/70 text-[11px] sm:text-xs mt-2 font-semibold uppercase tracking-[0.18em]">
          <MapPin className="w-3.5 h-3.5 text-accent" />
          <span>{lga?.name}, {stateName}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
