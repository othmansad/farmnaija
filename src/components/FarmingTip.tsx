import { useApp } from "@/contexts/AppContext";
import { t, type Language } from "@/data/translations";
import { Lightbulb } from "lucide-react";

const tips: Record<Language, string[]> = {
  en: [
    "Plant early maturing crops like cowpea before the rainy season to maximize yield.",
    "Apply organic manure to improve soil fertility before planting.",
    "Practice crop rotation to prevent soil nutrient depletion.",
    "Use mulching to conserve soil moisture during dry spells.",
    "Store harvested grains in airtight containers to prevent pest damage.",
    "Test your soil pH before applying fertilizer for best results.",
    "Intercrop cereals with legumes to fix nitrogen naturally.",
  ],
  ha: [
    "Ka shuka amfanin gona da ke yin girma da wuri kamar wake kafin lokacin damina.",
    "Ka sa takin zamani don inganta haihuwar ƙasa kafin shuka.",
    "Ka yi juyawar amfanin gona don hana raguwar abincin ƙasa.",
    "Ka yi amfani da ciyawa don adana danshi a ƙasa lokacin rani.",
    "Ka ajiye hatsin da aka girbe a cikin kwantena masu rufewa don hana ƙwari.",
    "Ka gwada pH na ƙasar ka kafin ka sa taki don samun sakamako mafi kyau.",
    "Ka haɗa shuka hatsi da wake don ƙara nitrogen a cikin ƙasa.",
  ],
};

const FarmingTip = () => {
  const { language } = useApp();
  const dayIndex = new Date().getDate() % tips[language].length;
  const tip = tips[language][dayIndex];

  return (
    <div className="card-farm border-l-4 border-l-harvest">
      <div className="flex items-start gap-3">
        <div className="bg-harvest/20 p-2 rounded-lg">
          <Lightbulb className="w-5 h-5 text-harvest-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-1">{t("tipOfTheDay", language)}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
        </div>
      </div>
    </div>
  );
};

export default FarmingTip;
