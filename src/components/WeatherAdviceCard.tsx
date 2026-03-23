import { useApp } from "@/contexts/AppContext";
import { useWeatherData } from "@/components/WeatherCard";
import { getWeatherAdvice } from "@/data/farmingKnowledge";
import { CloudRain } from "lucide-react";

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
    <div className="card-farm border-l-4 border-l-primary">
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <CloudRain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-1">
            {language === "en" ? "Weather Farming Advice" : "Shawarar Noma ta Yanayi"}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{advice}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherAdviceCard;
