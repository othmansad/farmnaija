import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/data/translations";
import { fetchWeather, getWeatherIcon, getWeatherDescription, type WeatherData } from "@/services/weather";
import { Droplets, Wind } from "lucide-react";

const CACHE_KEY = "farmwise-weather-cache";
const CACHE_TTL = 15 * 60 * 1000;

function getCachedWeather(lat: number, lon: number): WeatherData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, lat: cLat, lon: cLon, ts } = JSON.parse(raw);
    if (cLat === lat && cLon === lon && Date.now() - ts < CACHE_TTL) return data;
  } catch { /* ignore */ }
  return null;
}

function setCachedWeather(lat: number, lon: number, data: WeatherData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, lat, lon, ts: Date.now() }));
  } catch { /* ignore */ }
}

export const useWeatherData = () => {
  const { lga } = useApp();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lga) return;
    const cached = getCachedWeather(lga.lat, lga.lon);
    if (cached) {
      setWeather(cached);
      setLoading(false);
    }
    setLoading(prev => cached ? false : true);
    fetchWeather(lga.lat, lga.lon)
      .then(data => {
        setWeather(data);
        setCachedWeather(lga.lat, lga.lon, data);
      })
      .catch(err => {
        console.error(err);
        if (!cached) setWeather(null);
      })
      .finally(() => setLoading(false));
  }, [lga?.lat, lga?.lon]);

  return { weather, loading };
};

const WeatherCard = () => {
  const { language } = useApp();
  const { weather, loading } = useWeatherData();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="card-farm">
          <div className="h-5 w-32 bg-muted rounded animate-pulse mb-4" />
          <div className="flex items-center justify-between">
            <div className="h-14 w-28 bg-muted rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-7 w-20 bg-muted rounded-xl animate-pulse" />
              <div className="h-7 w-20 bg-muted rounded-xl animate-pulse" />
              <div className="h-7 w-20 bg-muted rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
        <div className="card-farm">
          <div className="h-5 w-24 bg-muted rounded animate-pulse mb-3" />
          <div className="flex gap-2.5 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 w-16 bg-muted rounded-2xl animate-pulse flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const { current } = weather;

  return (
    <div className="space-y-4">
      <div className="card-farm relative overflow-hidden">
        <div className="absolute -top-6 -right-6 text-7xl opacity-15 select-none">
          {getWeatherIcon(current.weatherCode)}
        </div>
        <h3 className="font-extrabold mb-3 flex items-center gap-2.5 text-base">
          <span className="text-2xl drop-shadow-sm">{getWeatherIcon(current.weatherCode)}</span>
          {t("currentWeather", language)}
        </h3>
        <div className="flex items-center justify-between relative">
          <div>
            <div className="text-5xl font-black text-foreground tracking-tight">{current.temperature}°<span className="text-2xl font-extrabold text-muted-foreground">C</span></div>
            <div className="text-sm text-muted-foreground font-semibold mt-1">{getWeatherDescription(current.weatherCode)}</div>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-xl">
              <Droplets className="w-4 h-4 text-primary" />
              <span className="font-bold">{current.humidity}%</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-xl">
              <Wind className="w-4 h-4 text-muted-foreground" />
              <span className="font-bold">{current.windSpeed} km/h</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-xl">
              <span>🌧️</span>
              <span className="font-bold text-xs">{current.precipitation > 0 ? t("rainExpected", language) : t("noRain", language)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-farm">
        <h3 className="font-extrabold mb-3 text-base">{t("forecast", language)}</h3>
        <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {weather.forecast.map((day, i) => (
            <div
              key={day.date}
              className={`flex-shrink-0 text-center p-3 rounded-2xl transition-all duration-200 ${
                i === 0
                  ? "bg-primary/10 ring-2 ring-primary/20 shadow-sm"
                  : "bg-muted/40 hover:bg-muted/60"
              }`}
              style={{ minWidth: 64 }}
            >
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{t(day.dayName.toLowerCase(), language) || day.dayName}</div>
              <div className="text-xl my-1.5">{getWeatherIcon(day.weatherCode)}</div>
              <div className="text-xs font-black">{day.tempMax}°</div>
              <div className="text-[11px] text-muted-foreground font-semibold">{day.tempMin}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
