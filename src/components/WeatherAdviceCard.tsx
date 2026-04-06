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
      <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-primary/6" />
      <div className="absolute top-2 right-12 w-8 h-8 rounded-full bg-primary/4" />
      <div className="flex items-start gap-3.5 relative">
        <div className="icon-badge bg-primary/12">
          <CloudSun className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm mb-1.5">
            🌦️ {language === "en" ? "Weather Farming Advice" : "Shawarar Noma ta Yanayi"}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">{advice}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherAdviceCard;
