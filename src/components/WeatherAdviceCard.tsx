import { useApp } from "@/contexts/AppContext";
import { useWeatherData } from "@/components/WeatherCard";
import { getWeatherAdvice } from "@/data/farmingKnowledge";
import { CloudSun } from "lucide-react";

const WeatherAdviceCard = () => {
  const { language } = useApp();
  const { weather } = useWeatherData();

  if (!weather) return null;

  const rainDays = weather.forecast.filter(d => d.precipSum > 0).length;
  const advice = getWeatherAdvice(
    weather.current.temperature,
    weather.current.humidity,
    weather.current.precipitation,
    rainDays,
    language
  );

  return (
    <div className="card-farm border-l-4 border-l-primary relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-primary/5 translate-y-4 translate-x-4" />
      <div className="flex items-start gap-3 relative">
        <div className="bg-primary/10 p-2.5 rounded-xl flex-shrink-0">
          <CloudSun className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-sm mb-1">
            🌦️ {language === "en" ? "Weather Farming Advice" : "Shawarar Noma ta Yanayi"}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{advice}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherAdviceCard;
