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
};

export const getDefaultState = () => "nasarawa";
export const getDefaultLGA = (stateId: string) => states[stateId]?.lgas[0] || null;
