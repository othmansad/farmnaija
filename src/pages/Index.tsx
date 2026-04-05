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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-4 space-y-4 pb-24 max-w-lg mx-auto w-full">
        <LocationSelector />
        <AlertsCard />
        <SavedLocationsCard />
        <WeatherAdviceCard />
        <FarmingTip />
        <WeatherCard />
        <CropRecommendations />
      </main>

      <Link
        to="/chat"
        className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full shadow-lg active:scale-95 transition-transform z-50 flex items-center gap-2 px-5 py-3"
      >
        <Bot className="w-5 h-5" />
        <span className="text-sm font-semibold">{t("farmingAssistant", language)}</span>
      </Link>
    </div>
  );
};

export default Index;
