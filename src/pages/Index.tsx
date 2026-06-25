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
import { QuickFeatures } from "@/components/QuickFeatures";
import farmwiseBg from "@/assets/farmwise-logo-bg.jpg";
import type { BgTheme } from "@/contexts/AppContext";

const Index = () => {
  const { language, stateId, bgTheme, setBgTheme } = useApp();
  const { setOpen } = useSidebar();
  const { user } = useAuth();

  const [booting, setBooting] = useState(true);

  const peekSidebar = () => setOpen(true);

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
          {/* Brand-tinted overlay tuned to logo's deep green */}
          <div
            aria-hidden
            className="fixed inset-0 -z-10"
            style={{
              background:
                "linear-gradient(180deg, hsl(148 50% 14% / 0.78) 0%, hsl(148 45% 10% / 0.88) 60%, hsl(var(--background) / 0.94) 100%)",
            }}
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
            {/* Quick access to all premium features */}
            <div className="animate-fade-up mb-3 sm:mb-4" style={{ animationDelay: "0ms" }}>
              <QuickFeatures />
            </div>

            <div className="animate-fade-up mb-3 sm:mb-4" style={{ animationDelay: "40ms" }}>
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

      {/* Fixed bottom bar — editorial pill */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-3 sm:px-4 pb-4 sm:pb-6 pt-4 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="max-w-md mx-auto">
          <div className="bg-primary rounded-full p-1.5 flex items-center gap-1.5 shadow-2xl ring-4 ring-background/80">
            {user ? (
              <Link
                to="/planner"
                onClick={peekSidebar}
                className="flex-1 py-3 px-4 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
              >
                <CalendarDays className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-[0.14em]">
                  {language === "en" ? "My Farm" : "Gonata"}
                </span>
              </Link>
            ) : (
              <Link
                to="/auth"
                onClick={peekSidebar}
                className="flex-1 py-3 px-4 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
              >
                <Rocket className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-[0.14em]">
                  {language === "en" ? "Get Started" : "Fara"}
                </span>
              </Link>
            )}
            <Link
              to="/chat"
              className="flex-1 py-3 px-4 gradient-harvest text-harvest-foreground rounded-full flex items-center justify-center gap-2 active:scale-[0.97] transition-all shadow-inner"
            >
              <Bot className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-[0.14em]">
                {language === "en" ? "Ask Assistant" : "Tambayi"}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-auto px-4 pb-28 pt-6 text-center">
        <div className="max-w-3xl mx-auto border-t border-border/40 pt-5 space-y-3">
          <div className="flex justify-center gap-4 text-muted-foreground">
            <a href="mailto:hello@farmwise.ng" aria-label="Email" className="hover:text-primary transition-colors"><Mail className="w-4 h-4" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-primary transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" aria-label="GitHub" className="hover:text-primary transition-colors"><Github className="w-4 h-4" /></a>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] font-bold text-muted-foreground">
            <Link to="/learn" className="hover:text-primary">{language === "en" ? "Learn" : "Koyi"}</Link>
            <Link to="/community" className="hover:text-primary">{language === "en" ? "Community" : "Al'umma"}</Link>
            <Link to="/news" className="hover:text-primary">{language === "en" ? "News" : "Labarai"}</Link>
            <Link to="/analytics" className="hover:text-primary">{language === "en" ? "Analytics" : "Nazari"}</Link>
          </div>
          <p className="text-[10px] font-semibold text-muted-foreground">
            🌾 © {new Date().getFullYear()} FarmWise Nigeria · {language === "en" ? "Built for Nigerian farmers" : "An gina don manoman Najeriya"}
          </p>
        </div>
      </footer>
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
