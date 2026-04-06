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
      <div className="flex items-center gap-2.5 mb-3">
        <div className="icon-badge bg-primary/12">
          <Sprout className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-extrabold text-base">🌱 {t("recommendedCrops", language)}</h3>
      </div>
      {stateData && (
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed font-medium">{stateData.farmingNotes[language]}</p>
      )}
      <div className="grid grid-cols-3 gap-2.5">
        {crops.map((crop) => (
          <div
            key={crop.id}
            className="bg-muted/30 rounded-2xl p-3.5 text-center hover:bg-muted/60 transition-all duration-200 active:scale-95 border border-transparent hover:border-border cursor-default"
          >
            <div className="text-3xl mb-1.5 drop-shadow-sm">{crop.icon}</div>
            <div className="text-xs font-extrabold">{crop.name[language]}</div>
            <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">{crop.plantingSeason}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropRecommendations;
