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
import { Bot, Rocket } from "lucide-react";
import { useEffect } from "react";
import { trackEvent } from "@/services/analytics";
import { useSidebar } from "@/components/ui/sidebar";
import farmwiseBg from "@/assets/farmwise-bg.jpg";

const Index = () => {
  const { language, stateId } = useApp();
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    trackEvent("page_view", "dashboard");
  }, []);

  useEffect(() => {
    trackEvent("state_select", stateId);
  }, [stateId]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-36 w-full max-w-5xl mx-auto">
        {/* Full-width alerts */}
        <div className="animate-fade-up mb-4" style={{ animationDelay: "0ms" }}>
          <AlertsCard />
        </div>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="animate-fade-up" style={{ animationDelay: "50ms" }}>
              <LocationSelector />
            </div>
            <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
              <WeatherAdviceCard />
            </div>
            <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
              <FarmingTip />
            </div>
          </div>

          <div className="space-y-4">
            <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
              <WeatherCard />
            </div>
            <div className="animate-fade-up" style={{ animationDelay: "250ms" }}>
              <CropRecommendations />
            </div>
            <div className="animate-fade-up" style={{ animationDelay: "300ms" }}>
              <SavedLocationsCard />
            </div>
          </div>
        </div>
      </main>

      {/* Fixed bottom bar with both buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-3 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="flex gap-3 max-w-md mx-auto">
          <button
            onClick={toggleSidebar}
            className="gradient-harvest text-harvest-foreground rounded-2xl shadow-lg active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2 py-4 px-5"
            style={{ boxShadow: "0 6px 24px -4px hsl(38 92% 50% / 0.45)" }}
          >
            <Rocket className="w-5 h-5" />
            <span className="text-sm font-black tracking-wide whitespace-nowrap">
              {language === "en" ? "Get Started" : "Fara"}
            </span>
          </button>
          <Link
            to="/chat"
            className="flex-1 gradient-header text-primary-foreground rounded-2xl shadow-xl active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-3 py-4"
            style={{ boxShadow: "0 8px 32px -6px hsl(148 50% 26% / 0.5)" }}
          >
            <Bot className="w-5 h-5" />
            <span className="text-sm font-black tracking-wide">
              {language === "en" ? "🧑‍🌾 Ask Assistant" : "🧑‍🌾 Tambayi"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
