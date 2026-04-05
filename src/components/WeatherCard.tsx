import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { t } from "@/data/translations";
import { fetchWeather, getWeatherIcon, getWeatherDescription, type WeatherData } from "@/services/weather";
import { Droplets, Wind, Thermometer } from "lucide-react";

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
      <div className="card-farm animate-pulse-slow">
        <div className="h-24 bg-muted rounded-xl" />
      </div>
    );
  }

  if (!weather) return null;

  const { current } = weather;

  return (
    <div className="space-y-3">
      <div className="card-farm relative overflow-hidden">
        <div className="absolute -top-4 -right-4 text-6xl opacity-20">
          {getWeatherIcon(current.weatherCode)}
        </div>
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <span className="text-xl">{getWeatherIcon(current.weatherCode)}</span>
          {t("currentWeather", language)}
        </h3>
        <div className="flex items-center justify-between relative">
          <div>
            <div className="text-4xl font-extrabold text-foreground">{current.temperature}°C</div>
            <div className="text-sm text-muted-foreground font-medium mt-0.5">{getWeatherDescription(current.weatherCode)}</div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="font-semibold">{current.humidity}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Wind className="w-4 h-4 text-slate-500" />
              <span className="font-semibold">{current.windSpeed} km/h</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span>🌧️</span>
              <span className="font-semibold">{current.precipitation > 0 ? t("rainExpected", language) : t("noRain", language)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-farm">
        <h3 className="font-bold mb-3">{t("forecast", language)}</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {weather.forecast.map((day, i) => (
            <div key={day.date} className={`flex-shrink-0 text-center p-2.5 rounded-xl transition-colors ${i === 0 ? "bg-primary/10 ring-1 ring-primary/20" : "bg-muted/50"}`} style={{ minWidth: 60 }}>
              <div className="text-xs text-muted-foreground font-semibold">{t(day.dayName.toLowerCase(), language) || day.dayName}</div>
              <div className="text-lg my-1">{getWeatherIcon(day.weatherCode)}</div>
              <div className="text-xs font-bold">{day.tempMax}°</div>
              <div className="text-xs text-muted-foreground">{day.tempMin}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
