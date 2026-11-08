/**
 * Repères MESURÉS des enregistrements ajoutés (voix 2 du matin, voix 2 et 3 du
 * soir) — même méthode que afasy-cues.ts : transcription mot à mot, puis
 * recherche dans la transcription du texte de chaque dhikr. Ordre réel de
 * chaque enregistrement ; les dhikr non récités n'y figurent pas.
 */
import type { AfasyCue } from "./afasy-cues";

export const MATIN_2_CUES: AfasyCue[] = [
  {"ids":["m-01-ayat-kursi"],"start":3.15,"end":85.83},
  {"ids":["m-02-ikhlas"],"start":85.83,"end":105.07},
  {"ids":["m-03-falaq"],"start":105.07,"end":136.69},
  {"ids":["m-04-nas"],"start":136.69,"end":379.27},
  {"ids":["m-05-asbahna-mulk"],"start":379.27,"end":436},
  {"ids":["m-12-bika-asbahna"],"start":436,"end":452.07},
  {"ids":["m-06-sayyid"],"start":452.07,"end":493.67},
  {"ids":["m-08-ushhiduka"],"start":493.67,"end":528.79},
  {"ids":["m-09-shukr"],"start":528.79,"end":544.13},
  {"ids":["m-15-afini","m-16-kufr-qabr"],"start":544.13,"end":592.79,"occ":[544.28,549.18,555.6]},
  {"ids":["m-10-hasbi"],"start":592.79,"end":634.17},
  {"ids":["m-17-afwu-afiya"],"start":634.17,"end":681.97},
  {"ids":["m-20-alim-ghayb"],"start":681.97,"end":723.33},
  {"ids":["m-11-bismillahi"],"start":723.33,"end":744.63},
  {"ids":["m-07-radhitu"],"start":744.63,"end":764.21},
  {"ids":["m-18-ya-hayyu"],"start":764.21,"end":783.67},
  {"ids":["m-19-asbahna-rabb-alamin"],"start":783.67,"end":831.69},
  {"ids":["m-13-fitrah"],"start":831.69,"end":866.31},
  {"ids":["m-29-lailaha-100"],"start":866.31,"end":887.97},
  {"ids":["m-14-subhan-adad"],"start":887.97,"end":938},
];

export const SOIR_2_CUES: AfasyCue[] = [
  {"ids":["e-01-ayat-kursi"],"start":0.75,"end":75.85},
  {"ids":["e-03-ikhlas"],"start":75.85,"end":94.41},
  {"ids":["e-04-falaq"],"start":94.41,"end":127.03},
  {"ids":["e-05-nas"],"start":127.03,"end":346.63},
  {"ids":["e-28-lailaha-100"],"start":346.63,"end":515.81},
  {"ids":["e-11-hasbi"],"start":515.81,"end":602.49},
  {"ids":["e-12-bismillahi"],"start":602.49,"end":644.95,"occ":[602.64,613.54,627.28]},
  {"ids":["e-22-kalimat"],"start":644.95,"end":675.71},
  {"ids":["e-08-radhitu"],"start":675.71,"end":715.79},
  {"ids":["e-09-ushhiduka"],"start":715.79,"end":844.17,"occ":[715.94,740.54,768.88,793.4]},
  {"ids":["e-14-fitrah"],"start":844.17,"end":866.69},
  {"ids":["e-06-amsayna-mulk"],"start":866.69,"end":913.15},
  {"ids":["e-20-amsayna-rabb-alamin"],"start":913.15,"end":942.11},
  {"ids":["e-13-bika-amsayna"],"start":942.11,"end":951.59},
  {"ids":["e-10-shukr"],"start":951.59,"end":960.87},
  {"ids":["e-19-ya-hayyu"],"start":960.87,"end":976.69},
  {"ids":["e-16-afini","e-17-kufr-qabr"],"start":976.69,"end":1064.45},
  {"ids":["e-18-afwu-afiya"],"start":1064.45,"end":1091.37},
  {"ids":["e-21-alim-ghayb"],"start":1091.37,"end":1121.05},
  {"ids":["e-07-sayyid"],"start":1121.05,"end":1163.7},
];

export const SOIR_3_CUES: AfasyCue[] = [
  {"ids":["e-01-ayat-kursi"],"start":8.23,"end":78.89},
  {"ids":["e-03-ikhlas"],"start":78.89,"end":99.19},
  {"ids":["e-04-falaq"],"start":99.19,"end":130.53},
  {"ids":["e-05-nas"],"start":130.53,"end":364.41},
  {"ids":["e-06-amsayna-mulk"],"start":364.41,"end":424.41},
  {"ids":["e-13-bika-amsayna"],"start":424.41,"end":439.57},
  {"ids":["e-07-sayyid"],"start":439.57,"end":483.25},
  {"ids":["e-09-ushhiduka"],"start":483.25,"end":600.47,"occ":[483.4,512.66,541.92,571.14]},
  {"ids":["e-10-shukr"],"start":600.47,"end":617.49},
  {"ids":["e-16-afini","e-17-kufr-qabr"],"start":617.49,"end":654.87,"occ":[617.64,622.38,627.32]},
  {"ids":["e-11-hasbi"],"start":654.87,"end":755.55,"occ":[655.02,669.6,684.44,698.12,712.72,727.54,741.22]},
  {"ids":["e-22-kalimat"],"start":755.55,"end":795.69,"occ":[755.72,765.68,776.06]},
  {"ids":["e-18-afwu-afiya"],"start":795.69,"end":838.51},
  {"ids":["e-21-alim-ghayb"],"start":838.51,"end":879.27},
  {"ids":["e-12-bismillahi"],"start":879.27,"end":929.23,"occ":[879.42,895.2,911]},
  {"ids":["e-08-radhitu"],"start":929.23,"end":1003.21},
  {"ids":["e-19-ya-hayyu"],"start":1003.21,"end":1023.45},
  {"ids":["e-28-lailaha-100"],"start":1023.45,"end":1147.99},
  {"ids":["e-20-amsayna-rabb-alamin"],"start":1147.99,"end":1180.03},
  {"ids":["e-14-fitrah"],"start":1180.03,"end":1214.65},
  {"ids":["e-23-salat-nabi"],"start":1214.65,"end":1289.47},
  {"ids":["m-31-istighfar-100"],"start":1289.47,"end":1322.7},
];
