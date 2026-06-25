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
      <footer className="relative z-10 mt-12 pb-28 pt-10 px-4 sm:px-6 bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌾</span>
                <span className="font-display italic text-2xl leading-none">
                  {t("appName", language)}
                </span>
              </div>
              <p className="text-[12px] font-medium text-primary-foreground/75 leading-relaxed">
                {language === "en"
                  ? "Smart farming companion built for Nigerian farmers — weather, planning, market insights, and expert advice in one place."
                  : "Abokin noma mai hankali da aka gina don manoman Najeriya — yanayi, tsari, da shawarwarin gwani a wuri ɗaya."}
              </p>
              <div className="flex gap-2 pt-1">
                <a href="mailto:hello@farmwise.ng" aria-label="Email" className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all">
                  <Mail className="w-4 h-4" />
                </a>
                <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" aria-label="GitHub" className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all">
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Explore */}
            <div className="space-y-3">
              <h4 className="font-display italic text-base text-accent">
                {language === "en" ? "Explore" : "Bincika"}
              </h4>
              <ul className="space-y-2 text-[12px] font-semibold text-primary-foreground/80">
                <li><Link to="/planner" className="hover:text-accent transition-colors">{language === "en" ? "Farm Planner" : "Tsarin Gona"}</Link></li>
                <li><Link to="/analytics" className="hover:text-accent transition-colors">{language === "en" ? "Analytics" : "Nazari"}</Link></li>
                <li><Link to="/learn" className="hover:text-accent transition-colors">{language === "en" ? "Learn" : "Koyi"}</Link></li>
                <li><Link to="/news" className="hover:text-accent transition-colors">{language === "en" ? "News" : "Labarai"}</Link></li>
              </ul>
            </div>

            {/* Community */}
            <div className="space-y-3">
              <h4 className="font-display italic text-base text-accent">
                {language === "en" ? "Community" : "Al'umma"}
              </h4>
              <ul className="space-y-2 text-[12px] font-semibold text-primary-foreground/80">
                <li><Link to="/community" className="hover:text-accent transition-colors">{language === "en" ? "Farmer Groups" : "Ƙungiyoyi"}</Link></li>
                <li><Link to="/community" className="hover:text-accent transition-colors">{language === "en" ? "Forum" : "Tattaunawa"}</Link></li>
                <li><Link to="/community" className="hover:text-accent transition-colors">{language === "en" ? "Expert Q&A" : "Gwani Q&A"}</Link></li>
                <li><Link to="/chat" className="hover:text-accent transition-colors">{language === "en" ? "AI Assistant" : "Mataimaki AI"}</Link></li>
              </ul>
            </div>

            {/* Account */}
            <div className="space-y-3">
              <h4 className="font-display italic text-base text-accent">
                {language === "en" ? "Account" : "Asusu"}
              </h4>
              <ul className="space-y-2 text-[12px] font-semibold text-primary-foreground/80">
                {user ? (
                  <li><Link to="/account" className="hover:text-accent transition-colors">{language === "en" ? "My Account" : "Asusuna"}</Link></li>
                ) : (
                  <li><Link to="/auth" className="hover:text-accent transition-colors">{language === "en" ? "Sign In" : "Shiga"}</Link></li>
                )}
                <li><a href="#" className="hover:text-accent transition-colors">{language === "en" ? "Pro Plans" : "Tsare-tsare"}</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">{language === "en" ? "Privacy" : "Sirri"}</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">{language === "en" ? "Terms" : "Sharuɗɗa"}</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter strip */}
          <div className="border-t border-primary-foreground/15 pt-6 pb-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div>
              <p className="font-display italic text-lg leading-tight">
                {language === "en" ? "Grow with us." : "Yi girma da mu."}
              </p>
              <p className="text-[11px] font-semibold text-primary-foreground/65 uppercase tracking-[0.18em]">
                {language === "en" ? "Weekly tips · zero spam" : "Shawara mako-mako"}
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2 w-full sm:w-auto"
            >
              <input
                type="email"
                required
                placeholder={language === "en" ? "your@email.com" : "imel@misali.com"}
                className="flex-1 sm:w-64 px-4 py-2.5 rounded-full bg-primary-foreground/10 placeholder:text-primary-foreground/40 text-[13px] font-semibold border border-primary-foreground/15 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full gradient-harvest text-harvest-foreground text-[11px] font-black uppercase tracking-[0.14em] active:scale-95 transition-all"
              >
                {language === "en" ? "Join" : "Shiga"}
              </button>
            </form>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-primary-foreground/15 pt-5 flex flex-col sm:flex-row gap-2 items-center justify-between text-[11px] font-bold text-primary-foreground/60">
            <p>© {new Date().getFullYear()} FarmWise Nigeria · {language === "en" ? "All rights reserved" : "Duk haƙƙoƙin an kiyaye"}</p>
            <p className="flex items-center gap-1">🌾 {language === "en" ? "Built for Nigerian farmers" : "An gina don manoman Najeriya"}</p>
          </div>
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
