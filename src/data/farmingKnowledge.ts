import type { Language } from "./translations";

export interface CropInfo {
  id: string;
  name: Record<Language, string>;
  icon: string;
  plantingSeason: string;
  harvestSeason: string;
  rainfallNeeds: string; // mm per year
  soilType: string;
  tips: Record<Language, string>;
}

export const crops: Record<string, CropInfo> = {
  maize: {
    id: "maize",
    name: { en: "Maize", ha: "Masara" },
    icon: "🌽",
    plantingSeason: "Apr-May",
    harvestSeason: "Aug-Sep",
    rainfallNeeds: "500-800mm",
    soilType: "Well-drained loamy",
    tips: {
      en: "Plant at start of rains. Space 75cm between rows. Apply NPK fertilizer at 3 weeks.",
      ha: "Shuka a farkon damina. Bar tazarar 75cm tsakanin layuka. Sa taki NPK bayan mako 3.",
    },
  },
  rice: {
    id: "rice",
    name: { en: "Rice", ha: "Shinkafa" },
    icon: "🌾",
    plantingSeason: "Jun-Jul",
    harvestSeason: "Oct-Nov",
    rainfallNeeds: "1000-1500mm",
    soilType: "Clay or waterlogged",
    tips: {
      en: "Needs standing water. Best in lowland or irrigated areas. Transplant seedlings at 3 weeks.",
      ha: "Yana buƙatar ruwa mai tsayawa. Ya fi kyau a ƙananan wurare. Dasa shuki bayan mako 3.",
    },
  },
  cassava: {
    id: "cassava",
    name: { en: "Cassava", ha: "Rogo" },
    icon: "🌿",
    plantingSeason: "Apr-Jun",
    harvestSeason: "12-18 months",
    rainfallNeeds: "800-1200mm",
    soilType: "Sandy loam, well-drained",
    tips: {
      en: "Plant stem cuttings at 45° angle. Tolerates poor soil. Weed at 3 and 8 weeks.",
      ha: "Shuka yankan kara a kusurwar 45°. Yana iya jure ƙasa marar kyau. Cire ciyawa a mako 3 da 8.",
    },
  },
  yam: {
    id: "yam",
    name: { en: "Yam", ha: "Doya" },
    icon: "🍠",
    plantingSeason: "Mar-Apr",
    harvestSeason: "Aug-Oct",
    rainfallNeeds: "1000-1500mm",
    soilType: "Deep, fertile loamy",
    tips: {
      en: "Plant setts in mounds. Needs staking for vines. Apply organic manure before planting.",
      ha: "Shuka a tudu. Yana buƙatar goyo don ɓoyayyen ganye. Sa taki kafin shuka.",
    },
  },
  groundnut: {
    id: "groundnut",
    name: { en: "Groundnut", ha: "Gyaɗa" },
    icon: "🥜",
    plantingSeason: "May-Jun",
    harvestSeason: "Sep-Oct",
    rainfallNeeds: "400-600mm",
    soilType: "Sandy loam",
    tips: {
      en: "Needs well-drained sandy soil. Plant when soil is moist. Good for crop rotation after cereals.",
      ha: "Yana buƙatar ƙasa mai yashi. Shuka lokacin da ƙasa tana da danshi. Ya yi kyau don juyawar amfanin gona.",
    },
  },
  millet: {
    id: "millet",
    name: { en: "Millet", ha: "Gero" },
    icon: "🌾",
    plantingSeason: "Jun-Jul",
    harvestSeason: "Sep-Oct",
    rainfallNeeds: "300-500mm",
    soilType: "Sandy, light soils",
    tips: {
      en: "Drought-tolerant. Good for dry areas. Thin seedlings to 20cm spacing after 2 weeks.",
      ha: "Yana iya jure fari. Ya yi kyau a wurare masu bushewa. Rage shuki zuwa tazarar 20cm bayan mako 2.",
    },
  },
  sorghum: {
    id: "sorghum",
    name: { en: "Sorghum", ha: "Dawa" },
    icon: "🌾",
    plantingSeason: "Jun-Jul",
    harvestSeason: "Oct-Nov",
    rainfallNeeds: "400-700mm",
    soilType: "Variety of soils, clay-loam",
    tips: {
      en: "Tolerates drought and waterlogging. Space 30cm in rows. Bird-scare near harvest time.",
      ha: "Yana iya jure fari da ambaliyar ruwa. Bar tazarar 30cm a layuka. Kori tsuntsaye lokacin girbi.",
    },
  },
};

export interface StateFarmingData {
  suitableCrops: string[]; // crop IDs
  soilTypes: string;
  rainfallRange: string;
  farmingNotes: Record<Language, string>;
}

export const stateFarmingData: Record<string, StateFarmingData> = {
  nasarawa: {
    suitableCrops: ["yam", "cassava", "rice", "maize", "groundnut", "sorghum"],
    soilTypes: "Loamy, clay-loam",
    rainfallRange: "1000-1500mm",
    farmingNotes: {
      en: "Nasarawa has fertile Guinea savanna soils. Good for root crops and cereals. Two growing seasons possible in southern LGAs.",
      ha: "Nasarawa tana da ƙasa mai albarka ta Guinea savanna. Ya yi kyau don amfanin gona na tushe da hatsi.",
    },
  },
  benue: {
    suitableCrops: ["yam", "cassava", "rice", "maize", "groundnut", "sorghum"],
    soilTypes: "Alluvial, loamy, clay",
    rainfallRange: "1000-1800mm",
    farmingNotes: {
      en: "Benue is Nigeria's 'Food Basket'. Rich alluvial soils along Benue River. Excellent for yam, rice, and cassava.",
      ha: "Benue ita ce 'Kwandon Abincin' Najeriya. Ƙasa mai albarka a bakin Kogin Benue.",
    },
  },
  kaduna: {
    suitableCrops: ["maize", "sorghum", "groundnut", "millet", "cassava", "yam"],
    soilTypes: "Sandy loam, laterite",
    rainfallRange: "800-1200mm",
    farmingNotes: {
      en: "Kaduna spans Guinea and Sudan savanna. Southern areas suit root crops, northern areas suit grains and groundnut.",
      ha: "Kaduna tana tsakanin savanna ta Guinea da Sudan. Kudu ya dace da amfanin gona na tushe, arewa ya dace da hatsi.",
    },
  },
  plateau: {
    suitableCrops: ["maize", "rice", "groundnut", "cassava", "yam", "millet"],
    soilTypes: "Volcanic, laterite, loamy",
    rainfallRange: "1200-1500mm",
    farmingNotes: {
      en: "Plateau has cooler temperatures due to elevation. Good for temperate and tropical crops. Rich volcanic soils in some areas.",
      ha: "Plateau tana da yanayi mai sanyi saboda tsayin ƙasa. Ya yi kyau don amfanin gona masu yawa.",
    },
  },
  kano: {
    suitableCrops: ["groundnut", "millet", "sorghum", "maize", "rice"],
    soilTypes: "Sandy, laterite",
    rainfallRange: "600-900mm",
    farmingNotes: {
      en: "Kano is in Sudan savanna with shorter rainy season. Irrigation farming along Hadejia River. Strong groundnut and grain production.",
      ha: "Kano tana cikin savanna ta Sudan mai gajeren lokacin damina. Noman ban ruwa a bakin Kogin Hadejia.",
    },
  },
  abuja: {
    suitableCrops: ["maize", "yam", "cassava", "rice", "groundnut", "sorghum"],
    soilTypes: "Laterite, loamy, clay",
    rainfallRange: "1100-1600mm",
    farmingNotes: {
      en: "FCT Abuja has Guinea savanna vegetation. Peri-urban farming opportunities. Good rainfall supports diverse crops.",
      ha: "FCT Abuja tana da ciyawar savanna ta Guinea. Damina mai kyau tana tallafawa amfanin gona iri-iri.",
    },
  },
  niger: {
    suitableCrops: ["rice", "maize", "yam", "cassava", "groundnut", "millet", "sorghum"],
    soilTypes: "Alluvial, sandy loam, clay",
    rainfallRange: "900-1400mm",
    farmingNotes: {
      en: "Niger State is a major rice producer. Extensive fadama (floodplain) farming. Large Jebba and Kainji dam irrigation schemes.",
      ha: "Jihar Niger babbar mai samar da shinkafa ce. Noman fadama mai yawa. Manyan tsare-tsaren ban ruwa na Jebba da Kainji.",
    },
  },
};

export function getCropsForState(stateId: string): CropInfo[] {
  const data = stateFarmingData[stateId];
  if (!data) return [];
  return data.suitableCrops.map(id => crops[id]).filter(Boolean);
}

export function getCropDataSummary(stateId: string, language: Language): string {
  const data = stateFarmingData[stateId];
  if (!data) return "No farming data available for this state.";

  const cropList = data.suitableCrops
    .map(id => {
      const c = crops[id];
      if (!c) return null;
      return `${c.name[language]} (${c.plantingSeason}, needs ${c.rainfallNeeds})`;
    })
    .filter(Boolean)
    .join("; ");

  return `Suitable crops: ${cropList}. Soil types: ${data.soilTypes}. Annual rainfall: ${data.rainfallRange}. ${data.farmingNotes[language]}`;
}

export function getWeatherAdvice(
  temp: number,
  humidity: number,
  precipitation: number,
  rainDaysAhead: number,
  language: Language
): string {
  const advice: string[] = [];

  if (language === "en") {
    if (precipitation > 0 && rainDaysAhead >= 3) {
      advice.push("Good rains ahead — excellent time for planting or transplanting.");
    } else if (rainDaysAhead >= 1 && rainDaysAhead < 3) {
      advice.push("Some rain expected — prepare your fields for planting.");
    } else if (rainDaysAhead === 0 && precipitation === 0) {
      advice.push("Dry spell expected — delay planting. Irrigate existing crops if possible.");
    }

    if (humidity > 80) {
      advice.push("High humidity — watch for fungal diseases. Avoid applying fertilizer in wet conditions.");
    }
    if (humidity < 30) {
      advice.push("Very dry air — mulch around plants to conserve soil moisture.");
    }

    if (temp > 35) {
      advice.push("Very hot — provide shade for young seedlings. Water in early morning or evening.");
    }
    if (temp < 15) {
      advice.push("Cool temperatures — some crops may grow slowly. Avoid planting heat-loving crops.");
    }

    if (precipitation > 20) {
      advice.push("Heavy rain — avoid applying fertilizer as it will wash away. Check for waterlogging.");
    }
  } else {
    if (precipitation > 0 && rainDaysAhead >= 3) {
      advice.push("Ruwan sama mai kyau yana zuwa — lokaci mai kyau don shuka.");
    } else if (rainDaysAhead >= 1 && rainDaysAhead < 3) {
      advice.push("Ana sa ran ɗan ruwan sama — shirya gonar ku don shuka.");
    } else if (rainDaysAhead === 0 && precipitation === 0) {
      advice.push("Lokacin rani — jinkirta shuka. Yi ban ruwa idan zai yiwu.");
    }

    if (humidity > 80) {
      advice.push("Yawan danshi — kula da cututtukan fungi. Kada ku sa taki a jiƙe.");
    }
    if (humidity < 30) {
      advice.push("Bushewar iska — yi amfani da ciyawa don adana danshi.");
    }

    if (temp > 35) {
      advice.push("Zafi sosai — ba da inuwa ga ƙananan shuki. Shayar da ruwa da safe ko maraice.");
    }
    if (temp < 15) {
      advice.push("Sanyi — wasu amfanin gona za su yi girma a hankali.");
    }

    if (precipitation > 20) {
      advice.push("Ruwan sama mai yawa — kada ku sa taki saboda ruwa zai wanke shi.");
    }
  }

  return advice.length > 0 ? advice.join(" ") : (language === "en" ? "Weather conditions are moderate — continue normal farming activities." : "Yanayi ya yi daidai — ci gaba da ayyukan noma na yau da kullun.");
}
