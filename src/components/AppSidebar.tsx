import {
  CalendarDays,
  BarChart3,
  BookOpen,
  Users,
  Newspaper,
  Sprout,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
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

const features = [
  { title: "Farm Planner", titleHa: "Tsarin Noma", url: "/planner", icon: CalendarDays, color: "text-primary", bg: "bg-primary/10", desc: "Plan your farming season" },
  { title: "Analytics", titleHa: "Nazari", url: "/analytics", icon: BarChart3, color: "text-accent", bg: "bg-accent/10", desc: "Track crop & weather data" },
  { title: "Learn", titleHa: "Koyi", url: "/learn", icon: BookOpen, color: "text-secondary", bg: "bg-secondary/10", desc: "Farming guides & tips" },
  { title: "Community", titleHa: "Al'umma", url: "/community", icon: Users, color: "text-harvest", bg: "bg-harvest/10", desc: "Connect with farmers" },
  { title: "News", titleHa: "Labarai", url: "/news", icon: Newspaper, color: "text-earth", bg: "bg-earth/10", desc: "Agricultural updates" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { language } = useApp();

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Sprout className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-black text-sm tracking-tight text-foreground">
                {language === "en" ? "Explore More" : "Bincika Ƙari"}
              </h2>
              <p className="text-[10px] text-muted-foreground font-semibold">
                {language === "en" ? "Advanced farming tools" : "Kayan aikin noma na zamani"}
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <Sprout className="w-5 h-5 text-primary" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup defaultOpen>
          <SidebarGroupLabel className="text-farm-label px-4">
            {!collapsed && (language === "en" ? "Features" : "Fasaloli")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {features.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-auto py-0">
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-muted/60"
                      activeClassName="bg-primary/10 text-primary font-extrabold"
                    >
                      <div className={`${item.bg} p-2 rounded-xl flex-shrink-0`}>
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold truncate">
                            {language === "en" ? item.title : item.titleHa}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-medium truncate">
                            {item.desc}
                          </div>
                        </div>
                      )}
                      {!collapsed && (
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
  );
}
