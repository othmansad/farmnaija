import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/contexts/PremiumContext";
import { PremiumModal } from "@/components/PremiumModal";
import { useNavigate } from "react-router-dom";
import { CalendarDays, BarChart3, BookOpen, Users, Newspaper, Crown } from "lucide-react";
import { useState } from "react";

const items = [
  { title: "Planner", titleHa: "Tsari", url: "/planner", icon: CalendarDays, color: "text-primary", bg: "bg-primary/10" },
  { title: "Analytics", titleHa: "Nazari", url: "/analytics", icon: BarChart3, color: "text-accent", bg: "bg-accent/10" },
  { title: "Learn", titleHa: "Koyi", url: "/learn", icon: BookOpen, color: "text-secondary", bg: "bg-secondary/10" },
  { title: "Community", titleHa: "Al'umma", url: "/community", icon: Users, color: "text-harvest", bg: "bg-harvest/10" },
  { title: "News", titleHa: "Labarai", url: "/news", icon: Newspaper, color: "text-primary", bg: "bg-primary/10" },
];

export const QuickFeatures = () => {
  const { language } = useApp();
  const { user } = useAuth();
  const { canAccessPremium } = usePremium();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [feature, setFeature] = useState("");

  const go = (url: string, title: string) => {
    if (!user) return navigate("/auth");
    if (!canAccessPremium) {
      setFeature(title);
      setModal(true);
      return;
    }
    navigate(url);
  };

  return (
    <>
      <div className="flex gap-2 overflow-x-auto -mx-3 px-3 pb-1 scrollbar-none snap-x">
        {items.map((it) => {
          const Icon = it.icon;
          const label = language === "en" ? it.title : it.titleHa;
          return (
            <button
              key={it.url}
              onClick={() => go(it.url, it.title)}
              className="snap-start shrink-0 group flex flex-col items-center gap-1.5 bg-card/85 backdrop-blur border border-border/60 rounded-2xl px-3 py-2.5 min-w-[78px] active:scale-95 hover:shadow-md hover:border-border transition-all"
            >
              <div className={`relative ${it.bg} p-2 rounded-xl shadow-sm`}>
                <Icon className={`w-4 h-4 ${it.color}`} />
                {!canAccessPremium && user && (
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-harvest rounded-full flex items-center justify-center">
                    <Crown className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
              <span className="text-[10px] font-black tracking-tight text-foreground">{label}</span>
            </button>
          );
        })}
      </div>
      <PremiumModal open={modal} onClose={() => setModal(false)} featureName={feature} />
    </>
  );
};
