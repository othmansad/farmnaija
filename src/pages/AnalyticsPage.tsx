import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/contexts/PremiumContext";
import { PremiumModal } from "@/components/PremiumModal";
import { useSidebar } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  BarChart3, Home, Menu, CloudRain, TrendingUp, DollarSign, Loader2, Sun, Droplets, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { fetchWeather, type WeatherData } from "@/services/weather";
import { supabase } from "@/integrations/supabase/client";

// Mock market price data — Nigerian crops, NGN per 100kg bag
const MARKET_PRICES = [
  { crop: "Maize", icon: "🌽", price: 45000, change: 5.2, history: [38000, 40000, 41000, 42500, 43000, 44000, 45000] },
  { crop: "Rice", icon: "🌾", price: 78000, change: -2.1, history: [82000, 81000, 80000, 79500, 79000, 78500, 78000] },
  { crop: "Cassava", icon: "🥔", price: 28000, change: 8.4, history: [22000, 23500, 24000, 25500, 26000, 27000, 28000] },
  { crop: "Yam", icon: "🍠", price: 95000, change: 3.6, history: [88000, 89000, 90000, 91500, 92500, 93500, 95000] },
  { crop: "Tomato", icon: "🍅", price: 35000, change: 12.5, history: [25000, 27000, 29000, 31000, 32000, 33500, 35000] },
  { crop: "Groundnut", icon: "🥜", price: 62000, change: -1.4, history: [64000, 63500, 63200, 62800, 62500, 62200, 62000] },
];

const MONTHS_LABEL = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

const AnalyticsPage = () => {
  const { language, lga, stateName } = useApp();
  const { user } = useAuth();
  const { canAccessPremium } = usePremium();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [yields, setYields] = useState<{ crop: string; planted: number; harvested: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canAccessPremium) setShowModal(true);
  }, [canAccessPremium]);

  useEffect(() => {
    if (!lga) return;
    fetchWeather(lga.lat, lga.lon)
      .then(setWeather)
      .catch(() => {});
  }, [lga]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const load = async () => {
      const { data } = await supabase
        .from("planting_events")
        .select("crop_name,status")
        .eq("user_id", user.id);
      if (data) {
        const grouped: Record<string, { planted: number; harvested: number }> = {};
        data.forEach((row: any) => {
          if (!grouped[row.crop_name]) grouped[row.crop_name] = { planted: 0, harvested: 0 };
          grouped[row.crop_name].planted += 1;
          if (row.status === "harvested") grouped[row.crop_name].harvested += 1;
        });
        setYields(Object.entries(grouped).map(([crop, v]) => ({ crop, ...v })));
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const weatherData = weather?.forecast.map(d => ({
    day: d.dayName,
    max: d.tempMax,
    min: d.tempMin,
    rain: d.precipSum,
  })) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 gradient-header px-4 sm:px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground p-1.5 rounded-lg hover:bg-primary-foreground/10">
            <Home className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="bg-primary-foreground/15 backdrop-blur-sm p-2 rounded-xl">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-primary-foreground font-black text-lg tracking-tight">
              {language === "en" ? "Analytics" : "Nazari"}
            </span>
          </div>
        </div>
        <button onClick={toggleSidebar} className="text-primary-foreground p-2 rounded-xl hover:bg-primary-foreground/10">
          <Menu className="w-5 h-5" />
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 space-y-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight">{language === "en" ? "Farm Analytics" : "Nazarin Gona"}</h1>
          <p className="text-xs text-muted-foreground font-semibold mt-1">
            {stateName} • {language === "en" ? "Live data & trends" : "Bayanai masu rai"}
          </p>
        </div>

        <Tabs defaultValue="weather" className="w-full">
          <TabsList className="grid grid-cols-3 w-full h-11">
            <TabsTrigger value="weather" className="text-xs font-bold gap-1.5"><CloudRain className="w-3.5 h-3.5" />{language === "en" ? "Weather" : "Yanayi"}</TabsTrigger>
            <TabsTrigger value="yield" className="text-xs font-bold gap-1.5"><TrendingUp className="w-3.5 h-3.5" />{language === "en" ? "Yield" : "Amfani"}</TabsTrigger>
            <TabsTrigger value="market" className="text-xs font-bold gap-1.5"><DollarSign className="w-3.5 h-3.5" />{language === "en" ? "Market" : "Kasuwa"}</TabsTrigger>
          </TabsList>

          {/* WEATHER */}
          <TabsContent value="weather" className="space-y-4 mt-4">
            {weather ? (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <Card className="p-3"><div className="flex items-center gap-2"><Sun className="w-4 h-4 text-harvest" /><div><p className="text-[10px] text-muted-foreground font-semibold">Now</p><p className="font-black text-lg">{weather.current.temperature}°</p></div></div></Card>
                  <Card className="p-3"><div className="flex items-center gap-2"><Droplets className="w-4 h-4 text-accent" /><div><p className="text-[10px] text-muted-foreground font-semibold">Humidity</p><p className="font-black text-lg">{weather.current.humidity}%</p></div></div></Card>
                  <Card className="p-3"><div className="flex items-center gap-2"><CloudRain className="w-4 h-4 text-primary" /><div><p className="text-[10px] text-muted-foreground font-semibold">Rain</p><p className="font-black text-lg">{weather.current.precipitation}mm</p></div></div></Card>
                </div>

                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-black">{language === "en" ? "7-Day Temperature" : "Yanayin Kwana 7"}</CardTitle></CardHeader>
                  <CardContent>
                    <ChartContainer config={{ max: { label: "Max", color: "hsl(var(--harvest))" }, min: { label: "Min", color: "hsl(var(--accent))" } }} className="h-48 w-full">
                      <AreaChart data={weatherData}>
                        <defs>
                          <linearGradient id="maxFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--harvest))" stopOpacity={0.6} /><stop offset="95%" stopColor="hsl(var(--harvest))" stopOpacity={0} /></linearGradient>
                          <linearGradient id="minFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} /><stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} /></linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="max" stroke="hsl(var(--harvest))" fill="url(#maxFill)" strokeWidth={2} />
                        <Area type="monotone" dataKey="min" stroke="hsl(var(--accent))" fill="url(#minFill)" strokeWidth={2} />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-black">{language === "en" ? "Rainfall Forecast (mm)" : "Hasashen Ruwan Sama (mm)"}</CardTitle></CardHeader>
                  <CardContent>
                    <ChartContainer config={{ rain: { label: "Rain", color: "hsl(var(--primary))" } }} className="h-44 w-full">
                      <BarChart data={weatherData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="rain" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            )}
          </TabsContent>

          {/* YIELD */}
          <TabsContent value="yield" className="space-y-4 mt-4">
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : yields.length === 0 ? (
              <Card className="p-8 text-center">
                <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="font-bold text-sm">{language === "en" ? "No yield data yet" : "Babu bayanan amfani"}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === "en" ? "Add planting events in the Planner to track your yields." : "Ƙara abubuwa a Mai Tsarawa."}
                </p>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-black">{language === "en" ? "Crops Planted vs Harvested" : "Shukar Vs Girbi"}</CardTitle></CardHeader>
                  <CardContent>
                    <ChartContainer config={{ planted: { label: "Planted", color: "hsl(var(--primary))" }, harvested: { label: "Harvested", color: "hsl(var(--harvest))" } }} className="h-56 w-full">
                      <BarChart data={yields}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="crop" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="planted" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="harvested" fill="hsl(var(--harvest))" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-2">
                  <Card className="p-4">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Total Planted</p>
                    <p className="text-2xl font-black mt-1">{yields.reduce((s, y) => s + y.planted, 0)}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Harvest Rate</p>
                    <p className="text-2xl font-black mt-1">
                      {Math.round((yields.reduce((s, y) => s + y.harvested, 0) / Math.max(1, yields.reduce((s, y) => s + y.planted, 0))) * 100)}%
                    </p>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* MARKET */}
          <TabsContent value="market" className="space-y-3 mt-4">
            <p className="text-[10px] text-muted-foreground font-semibold px-1">
              {language === "en" ? "Avg. price per 100kg bag (NGN) — last 7 weeks" : "Matsakaicin farashi a kowane bahar 100kg (NGN)"}
            </p>
            {MARKET_PRICES.map((m) => {
              const up = m.change >= 0;
              const data = m.history.map((v, i) => ({ week: MONTHS_LABEL[i], price: v }));
              return (
                <Card key={m.crop}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{m.icon}</span>
                        <div>
                          <p className="font-black text-sm">{m.crop}</p>
                          <p className="text-xs text-muted-foreground font-semibold">₦{m.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={up ? "bg-primary/10 text-primary border-primary/30" : "bg-destructive/10 text-destructive border-destructive/30"}>
                        {up ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                        {Math.abs(m.change)}%
                      </Badge>
                    </div>
                    <ChartContainer config={{ price: { label: "Price", color: "hsl(var(--primary))" } }} className="h-20 w-full">
                      <LineChart data={data}>
                        <Line type="monotone" dataKey="price" stroke={up ? "hsl(var(--primary))" : "hsl(var(--destructive))"} strokeWidth={2} dot={false} />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>

      <PremiumModal open={showModal} onClose={() => { setShowModal(false); if (!canAccessPremium) navigate("/"); }} featureName={language === "en" ? "Analytics" : "Nazari"} />
    </div>
  );
};

export default AnalyticsPage;
