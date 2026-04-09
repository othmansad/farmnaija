import {
  CalendarDays,
  BarChart3,
  BookOpen,
  Users,
  Newspaper,
  Sprout,
  ChevronRight,
  X,
  Home,
  Crown,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { usePremium } from "@/contexts/PremiumContext";
import { PremiumModal } from "@/components/PremiumModal";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const features = [
  { title: "Farm Planner", titleHa: "Tsarin Noma", url: "/planner", icon: CalendarDays, color: "text-primary", bg: "bg-primary/10", borderColor: "border-primary/20", desc: "Plan your farming season", descHa: "Tsara lokacin noma", emoji: "📅" },
  { title: "Analytics", titleHa: "Nazari", url: "/analytics", icon: BarChart3, color: "text-accent", bg: "bg-accent/10", borderColor: "border-accent/20", desc: "Track crop & weather data", descHa: "Bibiyar bayanai", emoji: "📊" },
  { title: "Learn", titleHa: "Koyi", url: "/learn", icon: BookOpen, color: "text-secondary", bg: "bg-secondary/10", borderColor: "border-secondary/20", desc: "Farming guides & tips", descHa: "Jagororin noma", emoji: "📚" },
  { title: "Community", titleHa: "Al'umma", url: "/community", icon: Users, color: "text-harvest", bg: "bg-harvest/10", borderColor: "border-harvest/20", desc: "Connect with farmers", descHa: "Haɗa kai da manoma", emoji: "👥" },
  { title: "News", titleHa: "Labarai", url: "/news", icon: Newspaper, color: "text-earth", bg: "bg-earth/10", borderColor: "border-earth/20", desc: "Agricultural updates", descHa: "Sabuntawar noma", emoji: "📰" },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useApp();
  const { canAccessPremium } = usePremium();
  const [premiumModal, setPremiumModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState("");

  const handleNavClick = (url: string, featureTitle?: string) => {
    if (url === "/") {
      navigate(url);
      toggleSidebar();
      return;
    }
    // Premium gate
    if (!canAccessPremium) {
      setSelectedFeature(featureTitle || "");
      setPremiumModal(true);
      return;
    }
    navigate(url);
    toggleSidebar();
  };

  return (
    <>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="p-4">
          {!collapsed && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-harvest/15 p-2 rounded-xl">
                  <Crown className="w-5 h-5 text-harvest" />
                </div>
                <div>
                  <h2 className="font-black text-sm tracking-tight text-foreground">
                    {language === "en" ? "Pro Features" : "Fasalolin Pro"}
                  </h2>
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    {language === "en" ? "Advanced farming tools" : "Kayan aikin noma na zamani"}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <Crown className="w-5 h-5 text-harvest" />
            </div>
          )}
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Home button */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="h-auto py-0">
                    <button
                      onClick={() => handleNavClick("/")}
                      className={`flex w-full ${collapsed ? 'flex-col items-center gap-1 px-1 py-2.5' : 'items-center gap-3 px-3 py-3.5'} rounded-2xl transition-all duration-200 hover:bg-muted/60 border border-transparent hover:border-border/50 hover:shadow-sm ${location.pathname === "/" ? "bg-primary/10 border-primary/20 font-extrabold shadow-sm" : ""}`}
                    >
                      <div className="bg-primary/10 p-2.5 rounded-xl flex-shrink-0 shadow-sm">
                        <Home className="w-5 h-5 text-primary" />
                      </div>
                      {collapsed ? (
                        <span className="text-[9px] font-black tracking-tight truncate mt-0.5">
                          {language === "en" ? "Home" : "Gida"}
                        </span>
                      ) : (
                        <>
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-black tracking-tight truncate">
                              {language === "en" ? "Home" : "Gida"}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-semibold truncate mt-0.5">
                              {language === "en" ? "Back to dashboard" : "Komawa dashboard"}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-primary opacity-50 flex-shrink-0" />
                        </>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <div className="my-1 mx-3 border-t border-border/30" />

                <SidebarGroupLabel className="text-farm-label px-4">
                  {!collapsed && (language === "en" ? "Pro Features" : "Fasalolin Pro")}
                </SidebarGroupLabel>

                <TooltipProvider delayDuration={0}>
                  {features.map((item) => {
                    const label = language === "en" ? item.title : item.titleHa;
                    const desc = language === "en" ? item.desc : item.descHa;

                    const linkContent = (
                      <button
                        onClick={() => handleNavClick(item.url, item.title)}
                        className={`flex w-full ${collapsed ? 'flex-col items-center gap-1 px-1 py-2.5' : 'items-center gap-3 px-3 py-3.5'} rounded-2xl transition-all duration-200 hover:bg-muted/60 border border-transparent hover:border-border/50 hover:shadow-sm ${location.pathname === item.url ? `${item.bg} ${item.borderColor} border font-extrabold shadow-sm` : ""}`}
                      >
                        <div className={`relative ${item.bg} p-2.5 rounded-xl flex-shrink-0 shadow-sm`}>
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                          {!canAccessPremium && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-harvest rounded-full flex items-center justify-center shadow">
                              <Crown className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        {collapsed ? (
                          <span className="text-[9px] font-black tracking-tight truncate mt-0.5">{label}</span>
                        ) : (
                          <>
                            <div className="flex-1 min-w-0 text-left">
                              <div className="text-[13px] font-black tracking-tight truncate">{label}</div>
                              <div className="text-[10px] text-muted-foreground font-semibold truncate mt-0.5">{desc}</div>
                            </div>
                            {!canAccessPremium ? (
                              <span className="text-[9px] font-black text-harvest bg-harvest/15 px-2 py-0.5 rounded-full flex-shrink-0">PRO</span>
                            ) : (
                              <ChevronRight className={`w-4 h-4 ${item.color} opacity-50 flex-shrink-0`} />
                            )}
                          </>
                        )}
                      </button>
                    );

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild className="h-auto py-0">
                          {collapsed ? (
                            <Tooltip>
                              <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                              <TooltipContent side="right" className="font-bold">
                                <p className="font-bold text-sm">{label}</p>
                                <p className="text-[10px] text-muted-foreground font-medium">{desc}</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            linkContent
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </TooltipProvider>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          {!collapsed && (
            <div className="bg-muted/50 rounded-2xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground font-semibold">
                🌾 FarmWise Nigeria
              </p>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>

      <PremiumModal
        open={premiumModal}
        onClose={() => setPremiumModal(false)}
        featureName={selectedFeature}
      />
    </>
  );
}
