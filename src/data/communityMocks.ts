export interface Thread {
  id: string;
  title: { en: string; ha: string };
  author: string;
  replies: number;
  likes: number;
  tag: string;
  lastActive: string;
  body?: { en: string; ha: string };
}

export const THREADS: Thread[] = [
  { id: "1", title: { en: "Best maize variety for late-season planting in Plateau?", ha: "Mafi kyawun nau'in masara don shukar ƙarshen lokaci a Plateau?" }, author: "Aisha M.", replies: 23, likes: 47, tag: "Maize", lastActive: "2h", body: { en: "Rains have been late this year on the Plateau. I'm considering SAMMAZ-15 vs SAMMAZ-52 for a December planting target. Anyone tried these under similar conditions? What yields did you get?", ha: "Ruwan sama ya makara a Plateau. Wanda kuka gwada tsakanin SAMMAZ-15 da SAMMAZ-52?" } },
  { id: "2", title: { en: "Fall armyworm outbreak — what's working for you?", ha: "Barkewar Fall armyworm — me ke aiki?" }, author: "Musa B.", replies: 41, likes: 89, tag: "Pests", lastActive: "5h", body: { en: "Massive armyworm pressure in my maize this week. Neem extract + early-morning scouting is helping a bit but losses are mounting. What chemicals or IPM combos are working in your area?", ha: "Akwai matsalar armyworm a gonata. Me ke aiki?" } },
  { id: "3", title: { en: "Solar pump vs petrol pump for 2 hectares?", ha: "Famfon hasken rana vs na fetur?" }, author: "Chinedu O.", replies: 18, likes: 32, tag: "Irrigation", lastActive: "1d", body: { en: "Looking at upfront ₦650k for solar vs ₦180k petrol. Diesel cost will eat me alive in 2 years. Anyone running solar at this scale?", ha: "Solar yana da tsada amma fetur na cinye kuɗi." } },
  { id: "4", title: { en: "Where to sell tomatoes during Jos glut?", ha: "Ina za a sayar da tumatir lokacin yalwa?" }, author: "Hauwa I.", replies: 12, likes: 28, tag: "Market", lastActive: "1d", body: { en: "Prices have collapsed to ₦3,500 a basket in Farin Gada. Anyone connected to processors or southern buyers paying better?", ha: "Farashi ya faɗi a Farin Gada." } },
  { id: "5", title: { en: "Cowpea storage without chemicals — Triple bag method", ha: "Ajiye wake ba tare da magunguna ba — Hanyar buhu uku" }, author: "Yusuf K.", replies: 35, likes: 102, tag: "Storage", lastActive: "2d", body: { en: "Posting a quick guide: PICS bags, properly sealed, give 6+ months weevil-free storage. No phostoxin, no chemicals. AMA in the replies.", ha: "Buhu uku na PICS yana ajiye wake watanni 6+ ba tare da magani ba." } },
];

export interface Reply {
  id: string;
  author: string;
  body: { en: string; ha: string };
  time: string;
}

export const SEED_REPLIES: Record<string, Reply[]> = {
  "1": [
    { id: "r1", author: "Bala U.", body: { en: "SAMMAZ-15 has done well for me at Bokkos — 4.2 t/ha last season with proper fertilizer.", ha: "SAMMAZ-15 ya ba ni 4.2 t/ha." }, time: "1h" },
    { id: "r2", author: "Joy P.", body: { en: "Avoid late SAMMAZ-52 unless you can guarantee water through January.", ha: "Kar ka shuka SAMMAZ-52 idan ba ka da tabbacin ruwa." }, time: "30m" },
  ],
  "2": [
    { id: "r1", author: "Salim A.", body: { en: "Coragen at label rate, then weekly scouting. Don't spray on closed whorls — waste.", ha: "Coragen yana aiki sosai." }, time: "3h" },
  ],
};
