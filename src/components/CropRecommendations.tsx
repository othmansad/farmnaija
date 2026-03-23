import { useApp } from "@/contexts/AppContext";
import { t, type Language } from "@/data/translations";
import { Sprout } from "lucide-react";

interface Crop {
  name: Record<Language, string>;
  icon: string;
  season: string;
}

const crops: Crop[] = [
  { name: { en: "Yam", ha: "Doya" }, icon: "🍠", season: "Mar-Apr" },
  { name: { en: "Cassava", ha: "Rogo" }, icon: "🌿", season: "Apr-Jun" },
  { name: { en: "Rice", ha: "Shinkafa" }, icon: "🌾", season: "Jun-Jul" },
  { name: { en: "Maize", ha: "Masara" }, icon: "🌽", season: "Apr-May" },
  { name: { en: "Groundnut", ha: "Gyaɗa" }, icon: "🥜", season: "May-Jun" },
  { name: { en: "Sorghum", ha: "Dawa" }, icon: "🌾", season: "Jun-Jul" },
];

const CropRecommendations = () => {
  const { language } = useApp();

  return (
    <div className="card-farm">
      <div className="flex items-center gap-2 mb-3">
        <Sprout className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">{t("recommendedCrops", language)}</h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {crops.map((crop) => (
          <div key={crop.name.en} className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">{crop.icon}</div>
            <div className="text-xs font-medium">{crop.name[language]}</div>
            <div className="text-xs text-muted-foreground">{crop.season}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropRecommendations;
