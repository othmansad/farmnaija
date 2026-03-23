import { useApp } from "@/contexts/AppContext";
import { t } from "@/data/translations";
import { getCropsForState, stateFarmingData } from "@/data/farmingKnowledge";
import { Sprout } from "lucide-react";

const CropRecommendations = () => {
  const { language, stateId } = useApp();
  const crops = getCropsForState(stateId);
  const stateData = stateFarmingData[stateId];

  return (
    <div className="card-farm">
      <div className="flex items-center gap-2 mb-2">
        <Sprout className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">{t("recommendedCrops", language)}</h3>
      </div>
      {stateData && (
        <p className="text-xs text-muted-foreground mb-3">{stateData.farmingNotes[language]}</p>
      )}
      <div className="grid grid-cols-3 gap-2">
        {crops.map((crop) => (
          <div key={crop.id} className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">{crop.icon}</div>
            <div className="text-xs font-medium">{crop.name[language]}</div>
            <div className="text-xs text-muted-foreground">{crop.plantingSeason}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropRecommendations;
