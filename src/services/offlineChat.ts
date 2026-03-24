import { crops, stateFarmingData, getCropDataSummary, getWeatherAdvice } from "@/data/farmingKnowledge";
import type { Language } from "@/data/translations";

interface OfflineChatParams {
  message: string;
  stateId: string;
  language: Language;
}

const keywords: Record<string, string[]> = {
  maize: ["maize", "corn", "masara"],
  rice: ["rice", "shinkafa", "paddy"],
  cassava: ["cassava", "rogo"],
  yam: ["yam", "doya"],
  groundnut: ["groundnut", "peanut", "gyada", "gyaɗa"],
  millet: ["millet", "gero"],
  sorghum: ["sorghum", "dawa"],
  planting: ["plant", "planting", "shuka", "when to plant", "season"],
  soil: ["soil", "kasa", "ƙasa", "land"],
  fertilizer: ["fertilizer", "taki", "npk", "manure"],
  water: ["water", "rain", "ruwa", "irrigation", "ban ruwa"],
  pest: ["pest", "insect", "disease", "kwari", "cuta"],
};

export function getOfflineResponse({ message, stateId, language }: OfflineChatParams): string {
  const lower = message.toLowerCase();
  const stateData = stateFarmingData[stateId];

  // Check for crop-specific questions
  for (const [cropId, kws] of Object.entries(keywords)) {
    if (cropId === "planting" || cropId === "soil" || cropId === "fertilizer" || cropId === "water" || cropId === "pest") continue;
    if (kws.some(kw => lower.includes(kw))) {
      const crop = crops[cropId];
      if (!crop) continue;
      const isSuitable = stateData?.suitableCrops.includes(cropId);
      if (language === "en") {
        if (isSuitable) {
          return `**${crop.name.en}** is suitable for your area!\n\n- 🌱 **Planting season:** ${crop.plantingSeason}\n- 🌾 **Harvest:** ${crop.harvestSeason}\n- 💧 **Rainfall needs:** ${crop.rainfallNeeds}\n- 🏔️ **Soil type:** ${crop.soilType}\n\n**Tips:** ${crop.tips.en}\n\n_Note: This is offline advice from stored data._`;
        } else {
          return `**${crop.name.en}** is not commonly grown in your state. Consider crops like: ${stateData?.suitableCrops.map(id => crops[id]?.name.en).filter(Boolean).join(", ")}.\n\n_Note: This is offline advice._`;
        }
      } else {
        if (isSuitable) {
          return `**${crop.name.ha}** ya dace da yankin ku!\n\n- 🌱 **Lokacin shuka:** ${crop.plantingSeason}\n- 🌾 **Girbi:** ${crop.harvestSeason}\n- 💧 **Ruwan sama:** ${crop.rainfallNeeds}\n- 🏔️ **Irin ƙasa:** ${crop.soilType}\n\n**Shawarwari:** ${crop.tips.ha}\n\n_Lura: Wannan shawarar ba ta kan layi ba._`;
        } else {
          return `**${crop.name.ha}** ba a saba noma a jihar ku ba. Ku yi la'akari da: ${stateData?.suitableCrops.map(id => crops[id]?.name.ha).filter(Boolean).join(", ")}.\n\n_Lura: Wannan shawarar ba ta kan layi ba._`;
        }
      }
    }
  }

  // Planting questions
  if (keywords.planting.some(kw => lower.includes(kw))) {
    const summary = getCropDataSummary(stateId, language);
    if (language === "en") {
      return `Here are the crops and planting info for your state:\n\n${summary}\n\n_Note: This is offline advice from stored data._`;
    } else {
      return `Ga amfanin gona da bayanan shuka na jihar ku:\n\n${summary}\n\n_Lura: Wannan shawarar ba ta kan layi ba._`;
    }
  }

  // General fallback
  if (language === "en") {
    const cropList = stateData?.suitableCrops.map(id => `${crops[id]?.icon} ${crops[id]?.name.en}`).join(", ") || "various crops";
    return `I'm currently offline, but I can still help with basic farming info!\n\n**Your area grows:** ${cropList}\n\nAsk me about any specific crop for planting tips.\n\n_When internet returns, I'll give you AI-powered advice with current weather data._`;
  } else {
    const cropList = stateData?.suitableCrops.map(id => `${crops[id]?.icon} ${crops[id]?.name.ha}`).join(", ") || "amfanin gona daban-daban";
    return `Ba ni da intanet yanzu, amma zan iya taimaka da bayanan noma!\n\n**Yankin ku yana noma:** ${cropList}\n\nTambaye ni game da kowace irin amfanin gona.\n\n_Idan intanet ya dawo, zan ba ku shawara ta AI tare da bayanan yanayi._`;
  }
}
