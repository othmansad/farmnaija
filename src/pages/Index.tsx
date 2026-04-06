import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/data/translations";
import Header from "@/components/Header";
import LocationSelector from "@/components/LocationSelector";
import WeatherCard from "@/components/WeatherCard";
import WeatherAdviceCard from "@/components/WeatherAdviceCard";
import FarmingTip from "@/components/FarmingTip";
import CropRecommendations from "@/components/CropRecommendations";
import SavedLocationsCard from "@/components/SavedLocationsCard";
import AlertsCard from "@/components/AlertsCard";
import { Bot } from "lucide-react";
import { useEffect } from "react";
import { trackEvent } from "@/services/analytics";

const Index = () => {
  const { language, stateId } = useApp();

  useEffect(() => {
    trackEvent("page_view", "dashboard");
  }, []);

  useEffect(() => {
    trackEvent("state_select", stateId);
  }, [stateId]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 px-4 py-6 space-y-4 pb-32 max-w-lg mx-auto w-full">
        <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
          <AlertsCard />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "50ms" }}>
          <LocationSelector />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
          <WeatherAdviceCard />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
          <FarmingTip />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
          <WeatherCard />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "250ms" }}>
          <CropRecommendations />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "300ms" }}>
          <SavedLocationsCard />
        </div>
      </main>

      <Link
        to="/chat"
        className="fixed bottom-5 right-4 left-4 max-w-sm mx-auto gradient-header text-primary-foreground rounded-2xl shadow-xl active:scale-[0.97] transition-all duration-200 z-50 flex items-center justify-center gap-3 py-4"
        style={{ boxShadow: "0 8px 32px -6px hsl(148 50% 26% / 0.5)" }}
      >
        <Bot className="w-5 h-5" />
        <span className="text-sm font-black tracking-wide">
          {language === "en" ? "🧑‍🌾 Ask Your Farming Assistant" : "🧑‍🌾 Tambayi Mai Ba da Shawara"}
        </span>
      </Link>
    </div>
  );
};

export default Index;
