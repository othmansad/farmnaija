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
  abia: {
    name: "Abia",
    lgas: [
      { name: "Umuahia North", lat: 5.5333, lon: 7.4833 },
      { name: "Umuahia South", lat: 5.4833, lon: 7.4667 },
      { name: "Aba North", lat: 5.1167, lon: 7.3667 },
      { name: "Aba South", lat: 5.1000, lon: 7.3500 },
      { name: "Osisioma", lat: 5.1333, lon: 7.3167 },
    ],
  },
  adamawa: {
    name: "Adamawa",
    lgas: [
      { name: "Yola North", lat: 9.2333, lon: 12.4667 },
      { name: "Yola South", lat: 9.2000, lon: 12.4500 },
      { name: "Jimeta", lat: 9.2800, lon: 12.4600 },
      { name: "Mubi North", lat: 10.2667, lon: 13.2667 },
      { name: "Numan", lat: 9.4667, lon: 12.0333 },
    ],
  },
  akwaibom: {
    name: "Akwa Ibom",
    lgas: [
      { name: "Uyo", lat: 5.0500, lon: 7.9333 },
      { name: "Eket", lat: 4.6500, lon: 7.9167 },
      { name: "Ikot Ekpene", lat: 5.1833, lon: 7.7167 },
      { name: "Oron", lat: 4.8167, lon: 8.2333 },
      { name: "Abak", lat: 5.0000, lon: 7.7833 },
    ],
  },
  anambra: {
    name: "Anambra",
    lgas: [
      { name: "Awka South", lat: 6.2167, lon: 7.0667 },
      { name: "Onitsha North", lat: 6.1500, lon: 6.7833 },
      { name: "Onitsha South", lat: 6.1333, lon: 6.7667 },
      { name: "Nnewi North", lat: 6.0167, lon: 6.9167 },
      { name: "Aguata", lat: 6.0167, lon: 7.0833 },
    ],
  },
  bauchi: {
    name: "Bauchi",
    lgas: [
      { name: "Bauchi", lat: 10.3158, lon: 9.8442 },
      { name: "Alkaleri", lat: 10.2667, lon: 10.3167 },
      { name: "Dass", lat: 10.0000, lon: 9.5167 },
      { name: "Tafawa Balewa", lat: 9.7500, lon: 9.5833 },
      { name: "Toro", lat: 10.0667, lon: 9.0833 },
    ],
  },
  bayelsa: {
    name: "Bayelsa",
    lgas: [
      { name: "Yenagoa", lat: 4.9267, lon: 6.2676 },
      { name: "Brass", lat: 4.3167, lon: 6.2500 },
      { name: "Sagbama", lat: 5.1500, lon: 6.2000 },
      { name: "Ogbia", lat: 4.6833, lon: 6.3333 },
      { name: "Kolokuma/Opokuma", lat: 5.0167, lon: 6.2500 },
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
  borno: {
    name: "Borno",
    lgas: [
      { name: "Maiduguri", lat: 11.8333, lon: 13.1500 },
      { name: "Jere", lat: 11.8667, lon: 13.2167 },
      { name: "Konduga", lat: 11.6500, lon: 13.2833 },
      { name: "Biu", lat: 10.6167, lon: 12.1833 },
      { name: "Gwoza", lat: 11.0833, lon: 13.7000 },
    ],
  },
  crossriver: {
    name: "Cross River",
    lgas: [
      { name: "Calabar Municipal", lat: 4.9517, lon: 8.3220 },
      { name: "Calabar South", lat: 4.9333, lon: 8.3167 },
      { name: "Ogoja", lat: 6.6667, lon: 8.8000 },
      { name: "Ikom", lat: 5.9667, lon: 8.7167 },
      { name: "Akamkpa", lat: 5.3500, lon: 8.3167 },
    ],
  },
  delta: {
    name: "Delta",
    lgas: [
      { name: "Asaba", lat: 6.1944, lon: 6.7333 },
      { name: "Warri South", lat: 5.5167, lon: 5.7500 },
      { name: "Uvwie", lat: 5.5333, lon: 5.7833 },
      { name: "Sapele", lat: 5.8833, lon: 5.6833 },
      { name: "Ughelli North", lat: 5.5000, lon: 6.0000 },
    ],
  },
  ebonyi: {
    name: "Ebonyi",
    lgas: [
      { name: "Abakaliki", lat: 6.3249, lon: 8.1137 },
      { name: "Afikpo North", lat: 5.8833, lon: 7.9333 },
      { name: "Onueke", lat: 6.2000, lon: 8.0833 },
      { name: "Ishielu", lat: 6.4833, lon: 7.8500 },
      { name: "Ohaukwu", lat: 6.5500, lon: 7.9833 },
    ],
  },
  edo: {
    name: "Edo",
    lgas: [
      { name: "Benin City", lat: 6.3350, lon: 5.6037 },
      { name: "Egor", lat: 6.3333, lon: 5.6333 },
      { name: "Ikpoba-Okha", lat: 6.2833, lon: 5.6500 },
      { name: "Auchi", lat: 7.0667, lon: 6.2667 },
      { name: "Ekpoma", lat: 6.7500, lon: 6.1333 },
    ],
  },
  ekiti: {
    name: "Ekiti",
    lgas: [
      { name: "Ado Ekiti", lat: 7.6167, lon: 5.2167 },
      { name: "Ikere", lat: 7.5000, lon: 5.2333 },
      { name: "Ikole", lat: 7.7833, lon: 5.5167 },
      { name: "Oye", lat: 7.7833, lon: 5.3333 },
      { name: "Ijero", lat: 7.8167, lon: 5.0667 },
    ],
  },
  enugu: {
    name: "Enugu",
    lgas: [
      { name: "Enugu North", lat: 6.4667, lon: 7.5000 },
      { name: "Enugu South", lat: 6.4167, lon: 7.5000 },
      { name: "Nsukka", lat: 6.8567, lon: 7.3958 },
      { name: "Udi", lat: 6.3167, lon: 7.4167 },
      { name: "Nkanu West", lat: 6.3500, lon: 7.5833 },
    ],
  },
  gombe: {
    name: "Gombe",
    lgas: [
      { name: "Gombe", lat: 10.2833, lon: 11.1667 },
      { name: "Akko", lat: 10.2833, lon: 11.0333 },
      { name: "Dukku", lat: 10.8333, lon: 10.7667 },
      { name: "Kaltungo", lat: 9.8167, lon: 11.3167 },
      { name: "Billiri", lat: 9.8667, lon: 11.2333 },
    ],
  },
  imo: {
    name: "Imo",
    lgas: [
      { name: "Owerri Municipal", lat: 5.4833, lon: 7.0333 },
      { name: "Owerri North", lat: 5.5167, lon: 7.0667 },
      { name: "Owerri West", lat: 5.4500, lon: 6.9833 },
      { name: "Orlu", lat: 5.7833, lon: 7.0333 },
      { name: "Okigwe", lat: 5.8333, lon: 7.3500 },
    ],
  },
  jigawa: {
    name: "Jigawa",
    lgas: [
      { name: "Dutse", lat: 11.7667, lon: 9.3333 },
      { name: "Hadejia", lat: 12.4500, lon: 10.0500 },
      { name: "Gumel", lat: 12.6333, lon: 9.3833 },
      { name: "Birnin Kudu", lat: 11.4500, lon: 9.4833 },
      { name: "Kazaure", lat: 12.6500, lon: 8.4167 },
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
  katsina: {
    name: "Katsina",
    lgas: [
      { name: "Katsina", lat: 13.0059, lon: 7.5986 },
      { name: "Daura", lat: 13.0333, lon: 8.3167 },
      { name: "Funtua", lat: 11.5333, lon: 7.3167 },
      { name: "Malumfashi", lat: 11.7833, lon: 7.6167 },
      { name: "Dutsin-Ma", lat: 12.4500, lon: 7.5000 },
    ],
  },
  kebbi: {
    name: "Kebbi",
    lgas: [
      { name: "Birnin Kebbi", lat: 12.4539, lon: 4.1975 },
      { name: "Argungu", lat: 12.7500, lon: 4.5167 },
      { name: "Yauri", lat: 10.8333, lon: 4.7500 },
      { name: "Zuru", lat: 11.4333, lon: 5.2333 },
      { name: "Jega", lat: 12.2167, lon: 4.3833 },
    ],
  },
  kogi: {
    name: "Kogi",
    lgas: [
      { name: "Lokoja", lat: 7.7969, lon: 6.7408 },
      { name: "Okene", lat: 7.5500, lon: 6.2333 },
      { name: "Idah", lat: 7.1000, lon: 6.7333 },
      { name: "Kabba", lat: 7.8333, lon: 6.0667 },
      { name: "Ankpa", lat: 7.4000, lon: 7.6333 },
    ],
  },
  kwara: {
    name: "Kwara",
    lgas: [
      { name: "Ilorin West", lat: 8.5000, lon: 4.5500 },
      { name: "Ilorin East", lat: 8.4833, lon: 4.6000 },
      { name: "Ilorin South", lat: 8.4500, lon: 4.5667 },
      { name: "Offa", lat: 8.1500, lon: 4.7167 },
      { name: "Pategi", lat: 8.7333, lon: 5.7500 },
    ],
  },
  lagos: {
    name: "Lagos",
    lgas: [
      { name: "Ikeja", lat: 6.6018, lon: 3.3515 },
      { name: "Lagos Island", lat: 6.4541, lon: 3.4085 },
      { name: "Lagos Mainland", lat: 6.4969, lon: 3.3574 },
      { name: "Eti-Osa", lat: 6.4698, lon: 3.6013 },
      { name: "Alimosho", lat: 6.6167, lon: 3.2833 },
      { name: "Ikorodu", lat: 6.6194, lon: 3.5105 },
      { name: "Epe", lat: 6.5833, lon: 3.9833 },
      { name: "Badagry", lat: 6.4167, lon: 2.8833 },
    ],
  },
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
  ogun: {
    name: "Ogun",
    lgas: [
      { name: "Abeokuta South", lat: 7.1475, lon: 3.3619 },
      { name: "Abeokuta North", lat: 7.1833, lon: 3.3500 },
      { name: "Ijebu Ode", lat: 6.8167, lon: 3.9167 },
      { name: "Sagamu", lat: 6.8500, lon: 3.6500 },
      { name: "Ota", lat: 6.6833, lon: 3.2333 },
    ],
  },
  ondo: {
    name: "Ondo",
    lgas: [
      { name: "Akure South", lat: 7.2500, lon: 5.1950 },
      { name: "Akure North", lat: 7.3167, lon: 5.2000 },
      { name: "Ondo West", lat: 7.1000, lon: 4.8333 },
      { name: "Owo", lat: 7.1833, lon: 5.5833 },
      { name: "Okitipupa", lat: 6.5000, lon: 4.7833 },
    ],
  },
  osun: {
    name: "Osun",
    lgas: [
      { name: "Osogbo", lat: 7.7667, lon: 4.5667 },
      { name: "Ife Central", lat: 7.4667, lon: 4.5667 },
      { name: "Ilesa West", lat: 7.6167, lon: 4.7333 },
      { name: "Ede North", lat: 7.7333, lon: 4.4333 },
      { name: "Iwo", lat: 7.6333, lon: 4.1833 },
    ],
  },
  oyo: {
    name: "Oyo",
    lgas: [
      { name: "Ibadan North", lat: 7.4000, lon: 3.9167 },
      { name: "Ibadan South West", lat: 7.3500, lon: 3.8667 },
      { name: "Ogbomosho North", lat: 8.1333, lon: 4.2500 },
      { name: "Oyo West", lat: 7.8500, lon: 3.9333 },
      { name: "Saki West", lat: 8.6667, lon: 3.3833 },
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
  rivers: {
    name: "Rivers",
    lgas: [
      { name: "Port Harcourt", lat: 4.8156, lon: 7.0498 },
      { name: "Obio-Akpor", lat: 4.8667, lon: 7.0167 },
      { name: "Eleme", lat: 4.7833, lon: 7.1167 },
      { name: "Bonny", lat: 4.4333, lon: 7.1667 },
      { name: "Degema", lat: 4.7500, lon: 6.7667 },
    ],
  },
  sokoto: {
    name: "Sokoto",
    lgas: [
      { name: "Sokoto North", lat: 13.0667, lon: 5.2333 },
      { name: "Sokoto South", lat: 13.0500, lon: 5.2167 },
      { name: "Wamako", lat: 13.0333, lon: 5.1500 },
      { name: "Bodinga", lat: 12.8833, lon: 5.1833 },
      { name: "Tambuwal", lat: 12.4000, lon: 4.6500 },
    ],
  },
  taraba: {
    name: "Taraba",
    lgas: [
      { name: "Jalingo", lat: 8.8833, lon: 11.3667 },
      { name: "Wukari", lat: 7.8667, lon: 9.7833 },
      { name: "Bali", lat: 7.8500, lon: 10.9500 },
      { name: "Takum", lat: 7.2667, lon: 9.9833 },
      { name: "Zing", lat: 8.9833, lon: 11.7500 },
    ],
  },
  yobe: {
    name: "Yobe",
    lgas: [
      { name: "Damaturu", lat: 11.7500, lon: 11.9667 },
      { name: "Potiskum", lat: 11.7167, lon: 11.0833 },
      { name: "Gashua", lat: 12.8667, lon: 11.0500 },
      { name: "Nguru", lat: 12.8833, lon: 10.4500 },
      { name: "Geidam", lat: 12.8833, lon: 11.9333 },
    ],
  },
  zamfara: {
    name: "Zamfara",
    lgas: [
      { name: "Gusau", lat: 12.1667, lon: 6.6667 },
      { name: "Kaura Namoda", lat: 12.6000, lon: 6.5833 },
      { name: "Talata Mafara", lat: 12.5667, lon: 6.0667 },
      { name: "Anka", lat: 12.1167, lon: 5.9333 },
      { name: "Maru", lat: 12.3333, lon: 6.3667 },
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
};

export const getDefaultState = () => "nasarawa";
export const getDefaultLGA = (stateId: string) => states[stateId]?.lgas[0] || null;
