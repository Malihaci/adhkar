/**
 * Repères MESURÉS dans les enregistrements d'Al-ʿAfâsy (matin / soir) : début et
 * fin, en secondes, de chaque passage récité, et début de chaque répétition.
 * Obtenus en transcrivant l'audio mot à mot (avec l'heure de chaque mot) puis
 * en retrouvant dans la transcription le texte de chaque dhikr — jamais estimés
 * d'après la longueur du texte. Liste dans l'ORDRE RÉEL de l'enregistrement
 * (différent de la liste « Lire ») ; certains dhikr n'y sont pas récités, d'autres
 * le sont à deux endroits (ex. Āyat al-Kursī du soir et du coucher).
 * `ids` : un ou deux dhikr récités d'un seul tenant (ex. ʿAfinî + Kufr/qabr).
 */
export interface AfasyCue {
  ids: string[];
  start: number;
  end: number;
  /** Début de chaque récitation quand le dhikr est répété (compte vérifié). */
  occ?: number[];
}

export const AFASY_CUES: Record<"morning" | "evening", AfasyCue[]> = {
  morning: [
    { ids: ["m-01-ayat-kursi"], start: 7.15, end: 84.41 },
    { ids: ["m-02-ikhlas"], start: 84.41, end: 139.21, occ: [84.56,103.36,121.36] },
    { ids: ["m-03-falaq"], start: 139.21, end: 223.89, occ: [139.36,168.28,195.56] },
    { ids: ["m-04-nas"], start: 223.89, end: 348.11, occ: [224.04,261.78,298.92] },
    { ids: ["m-05-asbahna-mulk"], start: 348.11, end: 402.79 },
    { ids: ["m-12-bika-asbahna"], start: 402.79, end: 416.65 },
    { ids: ["m-06-sayyid"], start: 416.65, end: 481.77 },
    { ids: ["m-08-ushhiduka"], start: 481.77, end: 600.47, occ: [481.92,509.74,537.66,566.24] },
    { ids: ["m-09-shukr"], start: 600.47, end: 636.97 },
    { ids: ["m-15-afini","m-16-kufr-qabr"], start: 636.97, end: 733.11 },
    { ids: ["m-10-hasbi"], start: 733.11, end: 812.49 },
    { ids: ["m-17-afwu-afiya"], start: 812.49, end: 860.89 },
    { ids: ["m-20-alim-ghayb"], start: 860.89, end: 893.93 },
    { ids: ["m-11-bismillahi"], start: 893.93, end: 946.43 },
    { ids: ["m-07-radhitu"], start: 946.43, end: 996.69 },
    { ids: ["m-18-ya-hayyu"], start: 996.69, end: 1015.17 },
    { ids: ["m-19-asbahna-rabb-alamin"], start: 1015.17, end: 1042.97 },
    { ids: ["m-13-fitrah"], start: 1042.97, end: 1071.55 },
    { ids: ["m-30-subhan-100"], start: 1071.55, end: 1124.19 },
    { ids: ["m-29-lailaha-100"], start: 1124.19, end: 1138.81 },
    { ids: ["m-14-subhan-adad"], start: 1138.81, end: 1176.07, occ: [1138.96,1151.5,1164.2] },
    { ids: ["m-27-ilm-nafi"], start: 1176.07, end: 1190.03 },
    { ids: ["m-31-istighfar-100"], start: 1190.03, end: 1239.35 },
    { ids: ["m-22-salat-nabi"], start: 1239.35, end: 1408.55 },
  ],
  evening: [
    { ids: ["e-01-ayat-kursi"], start: 10.1, end: 89.15 },
    { ids: ["e-03-ikhlas"], start: 89.15, end: 144.57, occ: [89.3,108.36,126.54] },
    { ids: ["e-04-falaq"], start: 144.57, end: 230.17, occ: [144.72,173.98,201.6] },
    { ids: ["e-05-nas"], start: 230.17, end: 354.51, occ: [230.32,268.14,305.48] },
    { ids: ["e-06-amsayna-mulk"], start: 354.51, end: 405.65 },
    { ids: ["e-13-bika-amsayna"], start: 405.65, end: 419.73 },
    { ids: ["e-07-sayyid"], start: 419.73, end: 482.73 },
    { ids: ["e-09-ushhiduka"], start: 482.73, end: 591.15, occ: [482.88,510.1,537.2,564.3] },
    { ids: ["e-10-shukr"], start: 591.15, end: 620.27 },
    { ids: ["e-16-afini","e-17-kufr-qabr"], start: 620.27, end: 721.27 },
    { ids: ["e-11-hasbi"], start: 721.27, end: 817.03 },
    { ids: ["e-18-afwu-afiya"], start: 817.03, end: 853.05 },
    { ids: ["e-21-alim-ghayb"], start: 853.05, end: 889.91 },
    { ids: ["e-12-bismillahi"], start: 889.91, end: 935.41, occ: [892.24,906.56,920.9] },
    { ids: ["e-08-radhitu"], start: 935.41, end: 974.79 },
    { ids: ["e-19-ya-hayyu"], start: 974.79, end: 990.33 },
    { ids: ["e-20-amsayna-rabb-alamin"], start: 990.33, end: 1019.37 },
    { ids: ["e-14-fitrah"], start: 1019.37, end: 1054.07 },
    { ids: ["e-30-subhan-100"], start: 1054.07, end: 1101.93 },
    { ids: ["e-28-lailaha-100"], start: 1101.93, end: 1118.63 },
    { ids: ["m-31-istighfar-100"], start: 1118.63, end: 1173.81 },
    { ids: ["e-22-kalimat"], start: 1173.81, end: 1216.85, occ: [1173.96,1184.12,1194.24] },
    { ids: ["e-23-salat-nabi"], start: 1216.85, end: 1253.55 },
    { ids: ["coucher-1"], start: 1253.55, end: 1496.07, occ: [1265.02,1343.5,1421.98] },
    { ids: ["coucher-2"], start: 1496.07, end: 1559.51 },
    { ids: ["e-02-baqara-fin"], start: 1559.51, end: 1662.59 },
  ],
};
