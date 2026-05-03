import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import Header from "@/components/Header";
import LocationSelector from "@/components/LocationSelector";
import WeatherCard from "@/components/WeatherCard";
import WeatherAdviceCard from "@/components/WeatherAdviceCard";
import FarmingTip from "@/components/FarmingTip";
import CropRecommendations from "@/components/CropRecommendations";
import SavedLocationsCard from "@/components/SavedLocationsCard";
import AlertsCard from "@/components/AlertsCard";
import { Bot, Rocket, Image as ImageIcon, Square, Sparkles, CalendarDays, Mail, Github, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { trackEvent } from "@/services/analytics";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import farmwiseBg from "@/assets/farmwise-logo-bg.jpg";
import type { BgTheme } from "@/contexts/AppContext";

const Index = () => {
  const { language, stateId, bgTheme, setBgTheme } = useApp();
  const { toggleSidebar } = useSidebar();
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    trackEvent("page_view", "dashboard");
    // brief skeleton mount to avoid jarring pop-in while child fetches kick off
    const t = setTimeout(() => setBooting(false), 250);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    trackEvent("state_select", stateId);
  }, [stateId]);

  const cycleTheme = () => {
    const order: BgTheme[] = ["photo", "gradient", "solid"];
    const next = order[(order.indexOf(bgTheme) + 1) % order.length];
    setBgTheme(next);
  };

  const themeIcon = bgTheme === "photo" ? ImageIcon : bgTheme === "gradient" ? Sparkles : Square;
  const ThemeIcon = themeIcon;
  const themeLabel: Record<BgTheme, { en: string; ha: string }> = {
    photo: { en: "Photo", ha: "Hoto" },
    gradient: { en: "Gradient", ha: "Gradient" },
    solid: { en: "Solid", ha: "Sauki" },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Background layer */}
      {bgTheme === "photo" && (
        <>
          <div
            aria-hidden
            className="fixed inset-0 -z-10 bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${farmwiseBg})` }}
          />
          {/* Stronger overlay for legibility — both modes */}
          <div
            aria-hidden
            className="fixed inset-0 -z-10 bg-background/92 dark:bg-background/94 backdrop-blur-md"
          />
        </>
      )}
      {bgTheme === "gradient" && (
        <div
          aria-hidden
          className="fixed inset-0 -z-10"
          style={{
            background:
              "linear-gradient(160deg, hsl(var(--primary) / 0.18) 0%, hsl(var(--background)) 45%, hsl(var(--harvest) / 0.15) 100%)",
          }}
        />
      )}
      {/* solid: no extra layer; bg-background on parent */}

      <Header />

      <main className="flex-1 px-3 sm:px-5 lg:px-6 pt-3 sm:pt-5 pb-32 sm:pb-36 w-full max-w-5xl mx-auto">
        {/* Theme toggle */}
        <div className="flex justify-end mb-3">
          <button
            onClick={cycleTheme}
            aria-label={language === "en" ? "Change background theme" : "Canza yanayin baya"}
            className="inline-flex items-center gap-1.5 text-[11px] font-extrabold bg-card/80 backdrop-blur border border-border rounded-full px-3 py-1.5 shadow-sm hover:shadow-md active:scale-95 transition-all"
          >
            <ThemeIcon className="w-3.5 h-3.5 text-primary" />
            <span>{themeLabel[bgTheme][language]}</span>
          </button>
        </div>

        {booting ? (
          <HomeSkeleton />
        ) : (
          <>
            <div className="animate-fade-up mb-3 sm:mb-4" style={{ animationDelay: "0ms" }}>
              <AlertsCard />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
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

              <div className="space-y-3 sm:space-y-4">
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
          </>
        )}
      </main>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-3 sm:px-4 pb-4 sm:pb-5 pt-3 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="flex gap-2.5 sm:gap-3 max-w-md mx-auto">
          <button
            onClick={toggleSidebar}
            className="gradient-harvest text-harvest-foreground rounded-2xl shadow-lg active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2 py-3.5 sm:py-4 px-4 sm:px-5"
            style={{ boxShadow: "0 6px 24px -4px hsl(38 92% 50% / 0.45)" }}
          >
            <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-black tracking-wide whitespace-nowrap">
              {language === "en" ? "Get Started" : "Fara"}
            </span>
          </button>
          <Link
            to="/chat"
            className="flex-1 gradient-header text-primary-foreground rounded-2xl shadow-xl active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 py-3.5 sm:py-4"
            style={{ boxShadow: "0 8px 32px -6px hsl(148 50% 26% / 0.5)" }}
          >
            <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-black tracking-wide">
              {language === "en" ? "🧑‍🌾 Ask Assistant" : "🧑‍🌾 Tambayi"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = ({ h = "h-32" }: { h?: string }) => (
  <div className={`card-farm ${h} bg-muted/40 animate-pulse`} />
);

const HomeSkeleton = () => (
  <div className="space-y-3 sm:space-y-4">
    <SkeletonCard h="h-16" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      <div className="space-y-3 sm:space-y-4">
        <SkeletonCard h="h-20" />
        <SkeletonCard h="h-36" />
        <SkeletonCard h="h-24" />
      </div>
      <div className="space-y-3 sm:space-y-4">
        <SkeletonCard h="h-44" />
        <SkeletonCard h="h-40" />
        <SkeletonCard h="h-28" />
      </div>
    </div>
  </div>
);

export default Index;
