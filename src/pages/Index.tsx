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
      <main className="flex-1 px-4 py-5 space-y-4 pb-28 max-w-lg mx-auto w-full">
        <AlertsCard />
        <LocationSelector />
        <WeatherAdviceCard />
        <FarmingTip />
        <WeatherCard />
        <CropRecommendations />
        <SavedLocationsCard />
      </main>

      <Link
        to="/chat"
        className="fixed bottom-6 right-5 left-5 max-w-sm mx-auto gradient-header text-primary-foreground rounded-2xl shadow-xl active:scale-[0.98] transition-transform z-50 flex items-center justify-center gap-2.5 py-4"
      >
        <Bot className="w-5 h-5" />
        <span className="text-sm font-extrabold tracking-wide">
          {language === "en" ? "🧑‍🌾 Ask Your Farming Assistant" : "🧑‍🌾 Tambayi Mai Ba da Shawara"}
        </span>
      </Link>
    </div>
  );
};

export default Index;
