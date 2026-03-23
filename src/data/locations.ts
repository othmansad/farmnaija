export interface LGA {
  name: string;
  lat: number;
  lon: number;
}

export interface StateData {
  name: string;
  lgas: LGA[];
}

export const states: Record<string, StateData> = {
  nasarawa: {
    name: "Nasarawa",
    lgas: [
      { name: "Akwanga", lat: 8.9069, lon: 8.3925 },
      { name: "Awe", lat: 8.1047, lon: 9.2567 },
      { name: "Doma", lat: 8.3903, lon: 8.3517 },
      { name: "Karu", lat: 8.9956, lon: 7.8422 },
      { name: "Keana", lat: 8.1167, lon: 8.7833 },
      { name: "Keffi", lat: 8.8489, lon: 7.8739 },
      { name: "Kokona", lat: 8.7167, lon: 7.9333 },
      { name: "Lafia", lat: 8.4904, lon: 8.5157 },
      { name: "Nasarawa", lat: 8.5389, lon: 7.7083 },
      { name: "Nasarawa Eggon", lat: 8.7167, lon: 8.7167 },
      { name: "Obi", lat: 8.0833, lon: 8.9500 },
      { name: "Toto", lat: 8.3833, lon: 7.0833 },
      { name: "Wamba", lat: 8.9333, lon: 8.6833 },
    ],
  },
  benue: {
    name: "Benue",
    lgas: [
      { name: "Makurdi", lat: 7.7337, lon: 8.5214 },
      { name: "Gboko", lat: 7.3167, lon: 9.0000 },
      { name: "Otukpo", lat: 7.1904, lon: 8.1300 },
      { name: "Katsina-Ala", lat: 7.1667, lon: 9.2833 },
      { name: "Vandeikya", lat: 7.0833, lon: 9.0667 },
      { name: "Konshisha", lat: 7.0000, lon: 9.1500 },
      { name: "Gwer West", lat: 7.5000, lon: 8.2000 },
      { name: "Gwer East", lat: 7.5333, lon: 8.4333 },
      { name: "Ushongo", lat: 7.1333, lon: 9.0333 },
      { name: "Logo", lat: 7.5000, lon: 9.5000 },
      { name: "Tarka", lat: 7.4500, lon: 8.8667 },
      { name: "Buruku", lat: 7.3667, lon: 9.2000 },
      { name: "Ado", lat: 7.6333, lon: 7.6333 },
    ],
  },
  kaduna: {
    name: "Kaduna",
    lgas: [
      { name: "Kaduna North", lat: 10.5264, lon: 7.4383 },
      { name: "Kaduna South", lat: 10.4500, lon: 7.4333 },
      { name: "Zaria", lat: 11.0667, lon: 7.7000 },
      { name: "Chikun", lat: 10.3833, lon: 7.3167 },
      { name: "Igabi", lat: 10.7167, lon: 7.3333 },
      { name: "Giwa", lat: 11.0833, lon: 7.2333 },
      { name: "Kajuru", lat: 10.3167, lon: 7.6833 },
      { name: "Kachia", lat: 9.8833, lon: 7.9500 },
      { name: "Sanga", lat: 9.5500, lon: 8.3500 },
      { name: "Kaura", lat: 9.6667, lon: 8.5000 },
      { name: "Jaba", lat: 9.7833, lon: 8.2500 },
      { name: "Jema'a", lat: 9.3667, lon: 8.1667 },
    ],
  },
  plateau: {
    name: "Plateau",
    lgas: [
      { name: "Jos North", lat: 9.9167, lon: 8.9000 },
      { name: "Jos South", lat: 9.8000, lon: 8.8667 },
      { name: "Jos East", lat: 9.8833, lon: 9.0333 },
      { name: "Barkin Ladi", lat: 9.5333, lon: 8.9000 },
      { name: "Riyom", lat: 9.6000, lon: 8.7500 },
      { name: "Bassa", lat: 9.9333, lon: 8.7333 },
      { name: "Bokkos", lat: 9.3000, lon: 8.9833 },
      { name: "Mangu", lat: 9.5167, lon: 9.0833 },
      { name: "Pankshin", lat: 9.3333, lon: 9.4333 },
      { name: "Shendam", lat: 8.8833, lon: 9.5333 },
      { name: "Langtang North", lat: 9.1500, lon: 9.7833 },
      { name: "Langtang South", lat: 9.0000, lon: 9.7500 },
      { name: "Wase", lat: 9.1000, lon: 9.9500 },
      { name: "Kanam", lat: 9.6000, lon: 9.5667 },
      { name: "Quan'an Pan", lat: 8.9167, lon: 9.2000 },
    ],
  },
  kano: {
    name: "Kano",
    lgas: [
      { name: "Kano Municipal", lat: 12.0000, lon: 8.5167 },
      { name: "Fagge", lat: 12.0167, lon: 8.5333 },
      { name: "Dala", lat: 12.0333, lon: 8.5167 },
      { name: "Nassarawa", lat: 11.9833, lon: 8.5333 },
      { name: "Ungogo", lat: 12.0667, lon: 8.4833 },
      { name: "Dawakin Tofa", lat: 12.1000, lon: 8.3500 },
      { name: "Gezawa", lat: 12.1333, lon: 8.6833 },
      { name: "Gabasawa", lat: 12.2000, lon: 8.8167 },
      { name: "Bichi", lat: 12.2333, lon: 8.2333 },
      { name: "Kura", lat: 11.7667, lon: 8.4167 },
      { name: "Wudil", lat: 11.8167, lon: 8.8500 },
      { name: "Gwarzo", lat: 12.0667, lon: 7.9333 },
      { name: "Rano", lat: 11.5500, lon: 8.5833 },
    ],
  },
  abuja: {
    name: "FCT Abuja",
    lgas: [
      { name: "Municipal (City Centre)", lat: 9.0579, lon: 7.4951 },
      { name: "Bwari", lat: 9.2833, lon: 7.3833 },
      { name: "Gwagwalada", lat: 8.9433, lon: 7.0817 },
      { name: "Kuje", lat: 8.8797, lon: 7.2278 },
      { name: "Abaji", lat: 8.4756, lon: 6.9439 },
      { name: "Kwali", lat: 8.7333, lon: 7.0167 },
    ],
  },
  niger: {
    name: "Niger",
    lgas: [
      { name: "Minna", lat: 9.6139, lon: 6.5569 },
      { name: "Suleja", lat: 9.1833, lon: 7.1833 },
      { name: "Bida", lat: 9.0833, lon: 6.0167 },
      { name: "Kontagora", lat: 10.4000, lon: 5.4667 },
      { name: "Bosso", lat: 9.6500, lon: 6.4833 },
      { name: "Chanchaga", lat: 9.5833, lon: 6.5500 },
      { name: "Shiroro", lat: 9.9667, lon: 6.8500 },
      { name: "Rafi", lat: 10.2000, lon: 6.7333 },
      { name: "Mokwa", lat: 9.2833, lon: 5.0500 },
      { name: "Lapai", lat: 9.0500, lon: 6.5667 },
      { name: "Agaie", lat: 9.0000, lon: 6.2833 },
      { name: "Gurara", lat: 9.3333, lon: 7.0833 },
    ],
  },
};

export const getDefaultState = () => "nasarawa";
export const getDefaultLGA = (stateId: string) => states[stateId]?.lgas[0] || null;
