import type { Language } from "./translations";

export interface CropInfo {
  id: string;
  name: Record<Language, string>;
  icon: string;
  plantingSeason: string;
  harvestSeason: string;
  rainfallNeeds: string;
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
  cocoa: {
    id: "cocoa",
    name: { en: "Cocoa", ha: "Koko" },
    icon: "🫘",
    plantingSeason: "Mar-May",
    harvestSeason: "Sep-Dec",
    rainfallNeeds: "1500-2500mm",
    soilType: "Deep, well-drained forest soils",
    tips: {
      en: "Needs shade when young. Best in forest zones. Takes 3-5 years to first harvest.",
      ha: "Yana buƙatar inuwa lokacin ƙuruciya. Ya fi kyau a yankunan daji.",
    },
  },
  oilpalm: {
    id: "oilpalm",
    name: { en: "Oil Palm", ha: "Kwakwa" },
    icon: "🌴",
    plantingSeason: "Jun-Sep",
    harvestSeason: "Year-round",
    rainfallNeeds: "1500-3000mm",
    soilType: "Deep loamy, well-drained",
    tips: {
      en: "Perennial crop. Needs high rainfall. Space 9m apart in triangular pattern.",
      ha: "Amfanin gona na dindindin. Yana buƙatar ruwan sama mai yawa.",
    },
  },
  cowpea: {
    id: "cowpea",
    name: { en: "Cowpea", ha: "Wake" },
    icon: "🫘",
    plantingSeason: "Jul-Aug",
    harvestSeason: "Sep-Oct",
    rainfallNeeds: "300-600mm",
    soilType: "Sandy loam",
    tips: {
      en: "Drought-tolerant legume. Good for intercropping with cereals. Fixes nitrogen in soil.",
      ha: "Wake yana iya jure fari. Ya yi kyau don haɗa shuka da hatsi. Yana ƙara nitrogen a ƙasa.",
    },
  },
  tomato: {
    id: "tomato",
    name: { en: "Tomato", ha: "Tumatir" },
    icon: "🍅",
    plantingSeason: "Oct-Nov (dry season)",
    harvestSeason: "Jan-Mar",
    rainfallNeeds: "400-600mm",
    soilType: "Well-drained loamy",
    tips: {
      en: "Best grown in dry season with irrigation. Stake plants. Watch for blight disease.",
      ha: "Ya fi kyau a noma lokacin rani da ban ruwa. Yi goyon baya ga shuki.",
    },
  },
  rubber: {
    id: "rubber",
    name: { en: "Rubber", ha: "Roba" },
    icon: "🌳",
    plantingSeason: "Jun-Sep",
    harvestSeason: "Year-round (after 7 years)",
    rainfallNeeds: "1800-3000mm",
    soilType: "Deep laterite, well-drained",
    tips: {
      en: "Perennial tree crop. Takes 7 years to mature. Needs high rainfall and humidity.",
      ha: "Itacen amfanin gona na dindindin. Yana ɗaukar shekara 7 kafin ya balaga.",
    },
  },
};

export interface StateFarmingData {
  suitableCrops: string[];
  soilTypes: string;
  rainfallRange: string;
  farmingNotes: Record<Language, string>;
}

// Grouped by ecological zones for maintainability
const guineaSavanna: StateFarmingData = {
  suitableCrops: ["yam", "cassava", "maize", "rice", "groundnut", "sorghum", "cowpea"],
  soilTypes: "Loamy, clay-loam, laterite",
  rainfallRange: "1000-1500mm",
  farmingNotes: {
    en: "Guinea savanna zone with good rainfall. Supports root crops, cereals, and legumes.",
    ha: "Yankin savanna ta Guinea mai kyawon ruwan sama. Yana tallafawa amfanin gona na tushe, hatsi, da wake.",
  },
};

const sudanSavanna: StateFarmingData = {
  suitableCrops: ["groundnut", "millet", "sorghum", "maize", "cowpea", "rice"],
  soilTypes: "Sandy, laterite",
  rainfallRange: "500-1000mm",
  farmingNotes: {
    en: "Sudan savanna with shorter rainy season. Suitable for drought-tolerant grains and legumes.",
    ha: "Yankin savanna ta Sudan mai gajeren damina. Ya dace da hatsi da wake masu jure fari.",
  },
};

const sahelSavanna: StateFarmingData = {
  suitableCrops: ["millet", "sorghum", "cowpea", "groundnut"],
  soilTypes: "Sandy, arid",
  rainfallRange: "300-600mm",
  farmingNotes: {
    en: "Sahel zone with limited rainfall. Focus on drought-resistant crops and irrigation farming.",
    ha: "Yankin Sahel mai karancin ruwan sama. Mai da hankali kan amfanin gona masu jure fari da noman ban ruwa.",
  },
};

const rainforest: StateFarmingData = {
  suitableCrops: ["cassava", "yam", "rice", "oilpalm", "cocoa", "rubber", "maize"],
  soilTypes: "Deep loamy, forest soils, alluvial",
  rainfallRange: "1500-3000mm",
  farmingNotes: {
    en: "Rainforest zone with high rainfall. Ideal for tree crops, root crops, and rice.",
    ha: "Yankin daji mai yawan ruwan sama. Ya dace da itacen amfanin gona, tushe, da shinkafa.",
  },
};

const derivedSavanna: StateFarmingData = {
  suitableCrops: ["yam", "cassava", "maize", "rice", "groundnut", "cowpea", "sorghum"],
  soilTypes: "Loamy, laterite, clay",
  rainfallRange: "1000-1500mm",
  farmingNotes: {
    en: "Derived savanna transition zone. Good rainfall supports diverse food crops.",
    ha: "Yankin savanna mai sauyi. Ruwan sama mai kyau yana tallafawa amfanin gona iri-iri.",
  },
};

export const stateFarmingData: Record<string, StateFarmingData> = {
  // North-Central (Middle Belt)
  nasarawa: {
    suitableCrops: ["yam", "cassava", "rice", "maize", "groundnut", "sorghum", "cowpea"],
    soilTypes: "Loamy, clay-loam",
    rainfallRange: "1000-1500mm",
    farmingNotes: {
      en: "Nasarawa has fertile Guinea savanna soils. Good for root crops and cereals. Two growing seasons possible in southern LGAs.",
      ha: "Nasarawa tana da ƙasa mai albarka ta Guinea savanna. Ya yi kyau don amfanin gona na tushe da hatsi.",
    },
  },
  benue: {
    suitableCrops: ["yam", "cassava", "rice", "maize", "groundnut", "sorghum", "cowpea"],
    soilTypes: "Alluvial, loamy, clay",
    rainfallRange: "1000-1800mm",
    farmingNotes: {
      en: "Benue is Nigeria's 'Food Basket'. Rich alluvial soils along Benue River. Excellent for yam, rice, and cassava.",
      ha: "Benue ita ce 'Kwandon Abincin' Najeriya. Ƙasa mai albarka a bakin Kogin Benue.",
    },
  },
  plateau: {
    suitableCrops: ["maize", "rice", "groundnut", "cassava", "yam", "millet", "tomato", "cowpea"],
    soilTypes: "Volcanic, laterite, loamy",
    rainfallRange: "1200-1500mm",
    farmingNotes: {
      en: "Plateau has cooler temperatures due to elevation. Good for temperate and tropical crops. Rich volcanic soils in some areas.",
      ha: "Plateau tana da yanayi mai sanyi saboda tsayin ƙasa. Ya yi kyau don amfanin gona masu yawa.",
    },
  },
  niger: {
    suitableCrops: ["rice", "maize", "yam", "cassava", "groundnut", "millet", "sorghum"],
    soilTypes: "Alluvial, sandy loam, clay",
    rainfallRange: "900-1400mm",
    farmingNotes: {
      en: "Niger State is a major rice producer. Extensive fadama (floodplain) farming. Large irrigation schemes.",
      ha: "Jihar Niger babbar mai samar da shinkafa ce. Noman fadama mai yawa.",
    },
  },
  kogi: { ...derivedSavanna, farmingNotes: { en: "Kogi spans Guinea savanna and forest. Confluence of Niger and Benue rivers provides rich alluvial soils.", ha: "Kogi tana tsakanin savanna da daji. Mahaɗar Kogin Niger da Benue." } },
  kwara: { ...derivedSavanna, farmingNotes: { en: "Kwara bridges north and south Nigeria. Good for diverse crops with moderate rainfall.", ha: "Kwara tana haɗa arewa da kudu. Ya dace da amfanin gona iri-iri." } },
  abuja: {
    suitableCrops: ["maize", "yam", "cassava", "rice", "groundnut", "sorghum", "cowpea"],
    soilTypes: "Laterite, loamy, clay",
    rainfallRange: "1100-1600mm",
    farmingNotes: {
      en: "FCT Abuja has Guinea savanna vegetation. Peri-urban farming opportunities. Good rainfall supports diverse crops.",
      ha: "FCT Abuja tana da ciyawar savanna ta Guinea. Damina mai kyau tana tallafawa amfanin gona iri-iri.",
    },
  },

  // North-West
  kaduna: {
    suitableCrops: ["maize", "sorghum", "groundnut", "millet", "cassava", "yam", "cowpea", "tomato"],
    soilTypes: "Sandy loam, laterite",
    rainfallRange: "800-1200mm",
    farmingNotes: {
      en: "Kaduna spans Guinea and Sudan savanna. Southern areas suit root crops, northern areas suit grains.",
      ha: "Kaduna tana tsakanin savanna ta Guinea da Sudan. Kudu ya dace da tushe, arewa ya dace da hatsi.",
    },
  },
  kano: {
    suitableCrops: ["groundnut", "millet", "sorghum", "maize", "rice", "cowpea", "tomato"],
    soilTypes: "Sandy, laterite",
    rainfallRange: "600-900mm",
    farmingNotes: {
      en: "Kano is in Sudan savanna. Irrigation along Hadejia River. Strong groundnut and grain production.",
      ha: "Kano tana cikin savanna ta Sudan. Noman ban ruwa a bakin Kogin Hadejia.",
    },
  },
  katsina: { ...sudanSavanna, farmingNotes: { en: "Katsina in Sudan savanna. Major producer of cotton, groundnuts, and grains.", ha: "Katsina tana cikin savanna ta Sudan. Babbar mai samar da auduga da gyaɗa." } },
  kebbi: { ...sudanSavanna, suitableCrops: ["rice", "millet", "sorghum", "groundnut", "cowpea", "maize"], farmingNotes: { en: "Kebbi is a major rice-producing state. Fadama farming along rivers.", ha: "Kebbi babbar jihar noman shinkafa ce. Noman fadama a bakin koguna." } },
  sokoto: { ...sahelSavanna, farmingNotes: { en: "Sokoto in the Sahel zone. Limited rainfall but strong irrigation farming tradition.", ha: "Sokoto tana cikin yankin Sahel. Karancin damina amma al'adar noman ban ruwa mai ƙarfi." } },
  zamfara: { ...sudanSavanna, farmingNotes: { en: "Zamfara in Sudan savanna. Known for grain and livestock production.", ha: "Zamfara tana cikin savanna ta Sudan. Sananniya da samar da hatsi da kiwo." } },
  jigawa: { ...sudanSavanna, farmingNotes: { en: "Jigawa spans Sudan-Sahel zones. Hadejia-Nguru wetlands support rice and fishing.", ha: "Jigawa tana tsakanin Sudan da Sahel. Fadamar Hadejia-Nguru tana tallafawa shinkafa." } },

  // North-East
  adamawa: { ...guineaSavanna, farmingNotes: { en: "Adamawa has highland areas with cooler climate. Good for diverse food crops.", ha: "Adamawa tana da tsaunuka masu sanyi. Ya dace da amfanin gona iri-iri." } },
  bauchi: { ...sudanSavanna, farmingNotes: { en: "Bauchi spans multiple vegetation zones. Good for grains, groundnuts, and tomatoes.", ha: "Bauchi tana da yankuna daban-daban. Ya dace da hatsi, gyaɗa, da tumatir." } },
  borno: { ...sahelSavanna, farmingNotes: { en: "Borno in Sahel zone with Lake Chad basin. Focus on millet, sorghum, and irrigated crops.", ha: "Borno tana cikin Sahel da Tafkin Chadi. Noman gero, dawa, da ban ruwa." } },
  gombe: { ...sudanSavanna, farmingNotes: { en: "Gombe in Sudan savanna. Supports grains, groundnuts, and cotton.", ha: "Gombe tana cikin savanna ta Sudan. Tana tallafawa hatsi da gyaɗa." } },
  taraba: { ...guineaSavanna, farmingNotes: { en: "Taraba has diverse terrain from highlands to lowlands. Rich agricultural potential.", ha: "Taraba tana da ƙasa iri-iri daga tsaunuka zuwa kwari. Damar noma mai yawa." } },
  yobe: { ...sahelSavanna, farmingNotes: { en: "Yobe in Sahel zone. Focus on drought-resistant crops and irrigation.", ha: "Yobe tana cikin yankin Sahel. Amfanin gona masu jure fari da ban ruwa." } },

  // South-West
  lagos: {
    suitableCrops: ["cassava", "maize", "rice", "oilpalm", "cowpea"],
    soilTypes: "Sandy, alluvial, coastal",
    rainfallRange: "1500-2000mm",
    farmingNotes: {
      en: "Lagos has limited farmland but supports urban and peri-urban agriculture. Good for cassava and vegetables.",
      ha: "Lagos tana da ƙarancin filin noma amma tana tallafawa noman birane.",
    },
  },
  ogun: { ...derivedSavanna, suitableCrops: ["cassava", "maize", "rice", "yam", "oilpalm", "cocoa", "cowpea"], farmingNotes: { en: "Ogun in derived savanna/forest zone. Major cassava producer. Supports tree crops.", ha: "Ogun tana cikin yankin savanna/daji. Babbar mai samar da rogo." } },
  oyo: { ...derivedSavanna, suitableCrops: ["cassava", "maize", "yam", "cocoa", "rice", "cowpea"], farmingNotes: { en: "Oyo has rich agricultural heritage. Cocoa, cassava, and maize are major crops.", ha: "Oyo tana da tarihin noma mai arziki. Koko, rogo, da masara su ne manyan amfanin gona." } },
  osun: { ...derivedSavanna, suitableCrops: ["cocoa", "cassava", "yam", "maize", "oilpalm", "rice"], farmingNotes: { en: "Osun is a major cocoa-producing state. Also supports food crops.", ha: "Osun babbar jihar noman koko ce. Har ila yau tana tallafawa amfanin abinci." } },
  ondo: { ...rainforest, suitableCrops: ["cocoa", "oilpalm", "rubber", "cassava", "yam", "rice", "maize"], farmingNotes: { en: "Ondo is Nigeria's largest cocoa producer. Rich forest soils support tree crops.", ha: "Ondo ita ce mafi girma mai samar da koko a Najeriya." } },
  ekiti: { ...derivedSavanna, suitableCrops: ["cocoa", "yam", "cassava", "rice", "maize", "oilpalm"], farmingNotes: { en: "Ekiti has hilly terrain with rich soils. Good for cocoa, yam, and rice.", ha: "Ekiti tana da tsaunuka masu ƙasa mai albarka. Ya dace da koko, doya, da shinkafa." } },

  // South-East
  abia: { ...rainforest, suitableCrops: ["cassava", "yam", "rice", "oilpalm", "maize", "cowpea"], farmingNotes: { en: "Abia in the forest zone. Good for root crops and oil palm.", ha: "Abia tana cikin yankin daji. Ya dace da amfanin gona na tushe da kwakwa." } },
  anambra: { ...derivedSavanna, suitableCrops: ["cassava", "yam", "rice", "maize", "oilpalm", "cowpea"], farmingNotes: { en: "Anambra has fertile soils. Major food crop production area.", ha: "Anambra tana da ƙasa mai albarka. Babban yankin samar da amfanin abinci." } },
  ebonyi: { ...derivedSavanna, suitableCrops: ["rice", "yam", "cassava", "maize", "groundnut", "cowpea"], farmingNotes: { en: "Ebonyi is a major rice-producing state in the Southeast.", ha: "Ebonyi babbar jihar noman shinkafa ce a kudu maso gabas." } },
  enugu: { ...derivedSavanna, suitableCrops: ["cassava", "yam", "rice", "maize", "oilpalm", "cowpea"], farmingNotes: { en: "Enugu spans savanna and forest. Good for diverse food and cash crops.", ha: "Enugu tana tsakanin savanna da daji. Ya dace da amfanin gona iri-iri." } },
  imo: { ...rainforest, suitableCrops: ["cassava", "yam", "oilpalm", "rice", "maize", "cowpea"], farmingNotes: { en: "Imo in the forest zone. Oil palm and cassava are dominant crops.", ha: "Imo tana cikin yankin daji. Kwakwa da rogo su ne manyan amfanin gona." } },

  // South-South
  crossriver: { ...rainforest, suitableCrops: ["cocoa", "oilpalm", "cassava", "yam", "rice", "rubber"], farmingNotes: { en: "Cross River has rich forest resources. Major cocoa and oil palm area.", ha: "Cross River tana da arzikin daji. Babban yankin koko da kwakwa." } },
  delta: { ...rainforest, suitableCrops: ["cassava", "yam", "oilpalm", "rice", "rubber", "maize"], farmingNotes: { en: "Delta has riverine areas ideal for rice. Oil palm and cassava thrive.", ha: "Delta tana da yankunan kogi da suka dace da shinkafa. Kwakwa da rogo suna bunƙasa." } },
  edo: { ...rainforest, suitableCrops: ["oilpalm", "rubber", "cassava", "yam", "rice", "cocoa", "maize"], farmingNotes: { en: "Edo has forest and savanna areas. Strong in rubber and oil palm.", ha: "Edo tana da daji da savanna. Tana da ƙarfi a roba da kwakwa." } },
  bayelsa: { ...rainforest, suitableCrops: ["cassava", "oilpalm", "rice", "yam"], farmingNotes: { en: "Bayelsa is riverine with mangrove swamps. Limited farmland but good for fishing and cassava.", ha: "Bayelsa yankin kogi ne. Ƙarancin filin noma amma ya dace da kamun kifi da rogo." } },
  rivers: { ...rainforest, suitableCrops: ["cassava", "oilpalm", "yam", "rice", "maize"], farmingNotes: { en: "Rivers State has coastal and riverine terrain. Supports cassava, oil palm, and fishing.", ha: "Rivers tana da yankin bakin teku. Tana tallafawa rogo, kwakwa, da kamun kifi." } },
  akwaibom: { ...rainforest, suitableCrops: ["oilpalm", "cassava", "yam", "rice", "cocoa", "rubber"], farmingNotes: { en: "Akwa Ibom has rich forest soils. Oil palm is the dominant cash crop.", ha: "Akwa Ibom tana da ƙasar daji mai albarka. Kwakwa shi ne babban amfanin gona na kuɗi." } },
};

export function getCropsForState(stateId: string): CropInfo[] {
  const data = stateFarmingData[stateId];
  if (!data) {
    // Fallback: return common Nigerian crops
    return [crops.maize, crops.cassava, crops.rice, crops.yam, crops.groundnut].filter(Boolean);
  }
  return data.suitableCrops.map(id => crops[id]).filter(Boolean);
}

export function getCropDataSummary(stateId: string, language: Language): string {
  const data = stateFarmingData[stateId];
  if (!data) return "No specific farming data for this state. General crops: maize, cassava, rice, yam, groundnut.";

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
    if (humidity > 80) advice.push("High humidity — watch for fungal diseases. Avoid applying fertilizer in wet conditions.");
    if (humidity < 30) advice.push("Very dry air — mulch around plants to conserve soil moisture.");
    if (temp > 35) advice.push("Very hot — provide shade for young seedlings. Water in early morning or evening.");
    if (temp < 15) advice.push("Cool temperatures — some crops may grow slowly. Avoid planting heat-loving crops.");
    if (precipitation > 20) advice.push("Heavy rain — avoid applying fertilizer as it will wash away. Check for waterlogging.");
  } else {
    if (precipitation > 0 && rainDaysAhead >= 3) {
      advice.push("Ruwan sama mai kyau yana zuwa — lokaci mai kyau don shuka.");
    } else if (rainDaysAhead >= 1 && rainDaysAhead < 3) {
      advice.push("Ana sa ran ɗan ruwan sama — shirya gonar ku don shuka.");
    } else if (rainDaysAhead === 0 && precipitation === 0) {
      advice.push("Lokacin rani — jinkirta shuka. Yi ban ruwa idan zai yiwu.");
    }
    if (humidity > 80) advice.push("Yawan danshi — kula da cututtukan fungi. Kada ku sa taki a jiƙe.");
    if (humidity < 30) advice.push("Bushewar iska — yi amfani da ciyawa don adana danshi.");
    if (temp > 35) advice.push("Zafi sosai — ba da inuwa ga ƙananan shuki. Shayar da ruwa da safe ko maraice.");
    if (temp < 15) advice.push("Sanyi — wasu amfanin gona za su yi girma a hankali.");
    if (precipitation > 20) advice.push("Ruwan sama mai yawa — kada ku sa taki saboda ruwa zai wanke shi.");
  }

  return advice.length > 0 ? advice.join(" ") : (language === "en" ? "Weather conditions are moderate — continue normal farming activities." : "Yanayi ya yi daidai — ci gaba da ayyukan noma na yau da kullun.");
}
