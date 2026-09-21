export type DhikrCategory = "morning" | "evening";

export interface Dhikr {
  id: string;
  category: DhikrCategory;
  title: string;
  arabic: string;
  phonetic: string;
  translation: string;
  repetitions: number;
  explanation: string;
  merits: string;
  reference: string;
}

// Textes arabes partagés (Coran & formules identiques matin/soir)
const AYAT_KURSI =
  "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ.";

const IKHLAS =
  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ هُوَ اللَّهُ أَحَدٌ • اللَّهُ الصَّمَدُ • لَمْ يَلِدْ وَلَمْ يُولَدْ • وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ.";

const FALAQ =
  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ • مِن شَرِّ مَا خَلَقَ • وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ • وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ • وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ.";

const NAS =
  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ النَّاسِ • مَلِكِ النَّاسِ • إِلَٰهِ النَّاسِ • مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ • الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ • مِنَ الْجِنَّةِ وَالنَّاسِ.";

const AYAT_KURSI_PH =
  "Allâhu lâ ilâha illâ Huwa, al-Hayyu al-Qayyûm. Lâ ta'khudhuhu sinatun wa lâ nawm. Lahu mâ fis-samâwâti wa mâ fil-ard. Man dhal-ladhî yashfa'u 'indahu illâ bi-idhnih. Ya'lamu mâ bayna aydîhim wa mâ khalfahum, wa lâ yuhîtûna bi-shay'in min 'ilmihi illâ bimâ shâ'. Wasi'a kursiyyuhu-s-samâwâti wal-ard, wa lâ ya'ûduhu hifzuhumâ, wa Huwa-l-'Aliyyu-l-'Azîm.";

const AYAT_KURSI_FR =
  "Allah, il n'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même. Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur la terre. Qui peut intercéder auprès de Lui sans Sa permission ? Il connaît leur passé et leur futur, et ils n'embrassent de Sa science que ce qu'Il veut. Son Trône déborde les cieux et la terre, dont la garde ne Lui coûte aucune peine. Il est le Très-Haut, le Très-Grand.";

const QULS_PH =
  "Qul Huwa-llâhu Ahad… • Qul a'ûdhu bi-Rabbi-l-falaq… • Qul a'ûdhu bi-Rabbi-n-nâs… (les trois sourates en entier).";

const QULS_FR =
  "Sourates Al-Ikhlâs (l'Unicité pure), Al-Falaq (l'Aube) et An-Nâs (les Hommes) : affirmation du tawhîd et recherche de refuge contre tout mal, visible et invisible.";

const AAFINI_AR =
  "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَٰهَ إِلَّا أَنْتَ.";
const AAFINI_PH =
  "Allâhumma 'âfinî fî badanî, Allâhumma 'âfinî fî sam'î, Allâhumma 'âfinî fî basarî, lâ ilâha illâ Ant.";
const AAFINI_FR =
  "Ô Allah, préserve mon corps, préserve mon ouïe, préserve ma vue. Il n'y a de divinité que Toi.";

const KUFR_QABR_AR =
  "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَٰهَ إِلَّا أَنْتَ.";
const KUFR_QABR_PH =
  "Allâhumma innî a'ûdhu bika mina-l-kufri wal-faqr, wa a'ûdhu bika min 'adhâbi-l-qabr, lâ ilâha illâ Ant.";
const KUFR_QABR_FR =
  "Ô Allah, je cherche refuge auprès de Toi contre la mécréance et la pauvreté, et contre le châtiment de la tombe. Il n'y a de divinité que Toi.";

const AFWU_AR =
  "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي.";
const AFWU_PH =
  "Allâhumma innî as'aluka-l-'afwa wal-'âfiyata fi-d-dunyâ wal-âkhira. Allâhumma innî as'aluka-l-'afwa wal-'âfiyata fî dînî wa dunyâya wa ahlî wa mâlî. Allâhumma-stur 'awrâtî wa âmin raw'âtî. Allâhumma-hfaznî min bayni yadayya wa min khalfî wa 'an yamînî wa 'an shimâlî wa min fawqî, wa a'ûdhu bi 'azamatika an ughtâla min tahtî.";
const AFWU_FR =
  "Ô Allah, je Te demande le pardon et le bien-être dans cette vie et dans l'autre. Ô Allah, je Te demande pardon et santé dans ma religion, ma vie, ma famille et mes biens. Ô Allah, couvre mes défauts et apaise mes craintes. Ô Allah, garde-moi devant, derrière, à ma droite, à ma gauche et au-dessus de moi, et je cherche refuge dans Ta grandeur d'être englouti par en-dessous.";

const YA_HAYYU_AR =
  "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَىٰ نَفْسِي طَرْفَةَ عَيْنٍ.";
const YA_HAYYU_PH =
  "Yâ Hayyu yâ Qayyûm, bi rahmatika astaghîth, aslih lî sha'nî kullah, wa lâ takilnî ilâ nafsî tarfata 'ayn.";
const YA_HAYYU_FR =
  "Ô Vivant, ô Subsistant par Lui-même, j'implore secours par Ta miséricorde. Rectifie pour moi toute mon affaire et ne me confie pas à moi-même l'espace d'un clin d'œil.";

const ALIM_GHAYB_AR =
  "اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَىٰ نَفْسِي سُوءًا أَوْ أَجُرَّهُ إِلَىٰ مُسْلِمٍ.";
const ALIM_GHAYB_PH =
  "Allâhumma 'âlima-l-ghaybi wa-sh-shahâda, Fâtira-s-samâwâti wal-ard, Rabba kulli shay'in wa malîkah, ash-hadu an lâ ilâha illâ Ant, a'ûdhu bika min sharri nafsî wa min sharri-sh-shaytâni wa shirkih, wa an aqtarifa 'alâ nafsî sû'an aw ajurrahu ilâ Muslim.";
const ALIM_GHAYB_FR =
  "Ô Allah, Connaisseur de l'invisible et du visible, Créateur des cieux et de la terre, Seigneur et Souverain de toute chose, je témoigne qu'il n'y a de divinité que Toi. Je cherche refuge auprès de Toi contre le mal de mon âme, le mal de Satan et son associationnisme, et de commettre du mal contre moi-même ou de l'entraîner sur un musulman.";

const KALIMAT_AR = "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.";
const KALIMAT_PH = "A'ûdhu bi kalimâti-llâhi at-tâmmâti min sharri mâ khalaq.";
const KALIMAT_FR =
  "Je cherche refuge dans les paroles parfaites d'Allah contre le mal de ce qu'Il a créé.";

const SALAT_NABI_AR = "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ.";
const SALAT_NABI_PH = "Allâhumma salli wa sallim wa bârik 'alâ nabiyyinâ Muhammad.";
const SALAT_NABI_FR =
  "Ô Allah, prie sur notre Prophète Muhammad, accorde-lui la paix et bénis-le.";

const SHIRK_AR =
  "اللَّهُمَّ إِنَّا نَعُوذُ بِكَ مِنْ أَنْ نُشْرِكَ بِكَ شَيْئًا نَعْلَمُهُ، وَنَسْتَغْفِرُكَ لِمَا لَا نَعْلَمُهُ.";
const SHIRK_PH =
  "Allâhumma innâ na'ûdhu bika an nushrika bika shay'an na'lamuh, wa nastaghfiruka limâ lâ na'lamuh.";
const SHIRK_FR =
  "Ô Allah, nous cherchons refuge auprès de Toi de T'associer sciemment quoi que ce soit, et nous Te demandons pardon pour ce que nous ignorons.";

const HAMM_AR =
  "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ.";
const HAMM_PH =
  "Allâhumma innî a'ûdhu bika mina-l-hammi wal-hazan, wa a'ûdhu bika mina-l-'ajzi wal-kasal, wa a'ûdhu bika mina-l-jubni wal-bukhl, wa a'ûdhu bika min ghalabati-d-dayni wa qahri-r-rijâl.";
const HAMM_FR =
  "Ô Allah, je cherche refuge auprès de Toi contre le souci et la tristesse, l'incapacité et la paresse, la lâcheté et l'avarice, l'accablement des dettes et l'oppression des hommes.";

const ISTIGHFAR3_AR =
  "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ.";
const ISTIGHFAR3_PH =
  "Astaghfiru-llâha-l-'Azîma-lladhî lâ ilâha illâ Huwa-l-Hayya-l-Qayyûma wa atûbu ilayh.";
const ISTIGHFAR3_FR =
  "Je demande pardon à Allah, l'Immense, Celui en dehors de qui il n'y a pas de divinité, le Vivant, le Subsistant, et je me repens à Lui.";

const YA_RABBI_AR = "يَا رَبِّ لَكَ الْحَمْدُ كَمَا يَنْبَغِي لِجَلَالِ وَجْهِكَ وَلِعَظِيمِ سُلْطَانِكَ.";
const YA_RABBI_PH = "Yâ Rabbi, laka-l-hamdu kamâ yanbaghî li jalâli wajhika wa li 'azîmi sultânik.";
const YA_RABBI_FR =
  "Ô mon Seigneur, à Toi la louange comme il sied à la majesté de Ta Face et à l'immensité de Ton pouvoir.";

const TAWAKKAL_AR =
  "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، عَلَيْكَ تَوَكَّلْتُ وَأَنْتَ رَبُّ الْعَرْشِ الْعَظِيمِ. مَا شَاءَ اللَّهُ كَانَ، وَمَا لَمْ يَشَأْ لَمْ يَكُنْ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ. أَعْلَمُ أَنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ، وَأَنَّ اللَّهَ قَدْ أَحَاطَ بِكُلِّ شَيْءٍ عِلْمًا. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي وَمِنْ شَرِّ كُلِّ دَابَّةٍ أَنْتَ آخِذٌ بِنَاصِيَتِهَا، إِنَّ رَبِّي عَلَىٰ صِرَاطٍ مُسْتَقِيمٍ.";
const TAWAKKAL_PH =
  "Allâhumma Anta Rabbî lâ ilâha illâ Ant, 'alayka tawakkaltu wa Anta Rabbu-l-'Arshi-l-'Azîm. Mâ shâ'a-llâhu kân, wa mâ lam yasha' lam yakun. Wa lâ hawla wa lâ quwwata illâ billâhi-l-'Aliyyi-l-'Azîm. A'lamu anna-llâha 'alâ kulli shay'in Qadîr, wa anna-llâha qad ahâta bi kulli shay'in 'ilmâ. Allâhumma innî a'ûdhu bika min sharri nafsî wa min sharri kulli dâbbatin Anta âkhidhun bi nâsiyatihâ, inna Rabbî 'alâ sirâtin mustaqîm.";
const TAWAKKAL_FR =
  "Ô Allah, Tu es mon Seigneur, il n'y a de divinité que Toi. C'est à Toi que je m'en remets et Tu es le Seigneur du Trône immense. Ce qu'Allah veut est, et ce qu'Il ne veut pas n'est point. Il n'y a de force ni de puissance qu'en Allah, le Très-Haut, le Très-Grand. Je sais qu'Allah est capable de toute chose et qu'Il a englobé toute chose de Sa science. Ô Allah, je cherche refuge en Toi contre le mal de mon âme et contre le mal de toute créature dont Tu tiens le toupet ; certes mon Seigneur est sur une voie droite.";

const LAILAHA_UNIT_AR =
  "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ.";
const LAILAHA_UNIT_PH =
  "Lâ ilâha illa-llâh wahdahu lâ sharîka lah, lahu-l-mulku wa lahu-l-hamdu wa Huwa 'alâ kulli shay'in Qadîr.";
const LAILAHA_UNIT_FR =
  "Nulle divinité sauf Allah, seul et sans associé. À Lui la royauté, à Lui la louange, et Il est capable de toute chose.";

const SUBHAN_HAMD_AR = "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.";
const SUBHAN_HAMD_PH = "Subhâna-llâhi wa bi hamdih.";
const SUBHAN_HAMD_FR = "Gloire à Allah et par Sa louange.";

const SUBHAN_ADAD_AR =
  "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ.";
const SUBHAN_ADAD_PH =
  "Subhâna-llâhi wa bi hamdih, 'adada khalqih, wa ridâ nafsih, wa zinata 'arshih, wa midâda kalimâtih.";
const SUBHAN_ADAD_FR =
  "Gloire et louange à Allah, autant que le nombre de Sa création, autant que Sa satisfaction, autant que le poids de Son Trône et autant que l'encre de Ses paroles.";

const SAYYID_AR =
  "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.";
const SAYYID_PH =
  "Allâhumma Anta Rabbî lâ ilâha illâ Ant, khalaqtanî wa ana 'abduka, wa ana 'alâ 'ahdika wa wa'dika ma-stata't, a'ûdhu bika min sharri mâ sana't, abû'u laka bi ni'matika 'alayya wa abû'u bi dhanbî fa-ghfir lî, fa innahu lâ yaghfiru-dh-dhunûba illâ Ant.";
const SAYYID_FR =
  "Ô Allah, Tu es mon Seigneur, il n'y a de divinité que Toi. Tu m'as créé et je suis Ton serviteur. Je m'attache à Ton pacte et à Ta promesse autant que je le peux. Je cherche refuge en Toi contre le mal que j'ai commis. Je reconnais Ton bienfait envers moi et je reconnais mon péché : pardonne-moi, car nul ne pardonne les péchés à part Toi.";

const RADHITU_AR = "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.";
const RADHITU_PH = "Radîtu billâhi Rabban, wa bi-l-Islâmi dînan, wa bi Muhammadin ﷺ nabiyyan.";
const RADHITU_FR =
  "Je suis satisfait qu'Allah soit mon Seigneur, l'Islam ma religion et Muhammad ﷺ mon Prophète.";

const HASBI_AR =
  "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.";
const HASBI_PH =
  "Hasbiya-llâhu lâ ilâha illâ Huwa, 'alayhi tawakkaltu wa Huwa Rabbu-l-'Arshi-l-'Azîm.";
const HASBI_FR =
  "Allah me suffit, il n'y a de divinité que Lui. C'est à Lui que je m'en remets, et Il est le Seigneur du Trône immense.";

const BISMILLAHI_AR =
  "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.";
const BISMILLAHI_PH =
  "Bismi-llâhi-lladhî lâ yadurru ma'a-smihi shay'un fi-l-ardi wa lâ fi-s-samâ', wa Huwa-s-Samî'u-l-'Alîm.";
const BISMILLAHI_FR =
  "Au nom d'Allah avec le nom duquel rien ne peut nuire, ni sur la terre ni dans le ciel, et Il est l'Audient, l'Omniscient.";

const morning: Dhikr[] = [
  {
    id: "m-01-ayat-kursi",
    category: "morning",
    title: "1. Âyat al-Kursî",
    arabic: AYAT_KURSI,
    phonetic: AYAT_KURSI_PH,
    translation: AYAT_KURSI_FR,
    repetitions: 1,
    explanation:
      "Le plus grand verset du Coran (Al-Baqara, 255). Affirmation absolue de l'Unicité, de la vie et de la souveraineté d'Allah.",
    merits:
      "Celui qui le récite le matin est protégé des djinns jusqu'au soir, et celui qui le récite le soir en est protégé jusqu'au matin.",
    reference: "An-Nasâ'î (Amal al-Yawm wa-l-Layla), Al-Hâkim — authentifié par Al-Albânî.",
  },
  {
    id: "m-02-ikhlas",
    category: "morning",
    title: "2. Sourate Al-Ikhlâs",
    arabic: IKHLAS,
    phonetic: "Qul Huwa-llâhu Ahad, Allâhu-s-Samad, lam yalid wa lam yûlad, wa lam yakun lahu kufuwan Ahad.",
    translation:
      "« Dis : Lui, Allah est Un. Allah, le Soutien universel. Il n'a pas engendré et n'a pas été engendré, et nul n'est égal à Lui. »",
    repetitions: 3,
    explanation:
      "L'affirmation pure de l'Unicité. Récitée avec les deux mu'awwidhât (Al-Falaq, An-Nâs), elle constitue un refuge complet.",
    merits: "« Elles te suffiront contre toute chose » — le Prophète ﷺ à ‘Abdullâh ibn Khubayb.",
    reference: "Abû Dâwud 5082, At-Tirmidhî 3575 — authentique.",
  },
  {
    id: "m-03-falaq",
    category: "morning",
    title: "3. Sourate Al-Falaq",
    arabic: FALAQ,
    phonetic:
      "Qul a'ûdhu bi Rabbi-l-falaq, min sharri mâ khalaq, wa min sharri ghâsiqin idhâ waqab, wa min sharri-n-naffâthâti fi-l-'uqad, wa min sharri hâsidin idhâ hasad.",
    translation:
      "« Dis : Je cherche refuge auprès du Seigneur de l'aube contre le mal de ce qu'Il a créé, contre le mal de l'obscurité quand elle s'étend, contre le mal des souffleuses sur les nœuds et contre le mal de l'envieux quand il envie. »",
    repetitions: 3,
    explanation: "Refuge contre les maux visibles et invisibles, la sorcellerie et l'envie.",
    merits: "Les mu'awwidhât suffisent contre tout mal matin et soir.",
    reference: "Abû Dâwud 5082, At-Tirmidhî 3575 — authentique.",
  },
  {
    id: "m-04-nas",
    category: "morning",
    title: "4. Sourate An-Nâs",
    arabic: NAS,
    phonetic:
      "Qul a'ûdhu bi Rabbi-n-nâs, Maliki-n-nâs, Ilâhi-n-nâs, min sharri-l-waswâsi-l-khannâs, alladhî yuwaswisu fî sudûri-n-nâs, mina-l-jinnati wa-n-nâs.",
    translation:
      "« Dis : Je cherche refuge auprès du Seigneur des hommes, Souverain des hommes, Dieu des hommes, contre le mal du chuchoteur furtif qui souffle le mal dans les poitrines des hommes, qu'il soit des djinns ou des hommes. »",
    repetitions: 3,
    explanation: "Refuge spécifique contre le waswâs (chuchotement) de Shaytân dans les cœurs.",
    merits: "Aucun refuge n'égale celui offert par ces trois sourates.",
    reference: "Abû Dâwud 5082, At-Tirmidhî 3575 — authentique.",
  },
  {
    id: "m-05-asbahna-mulk",
    category: "morning",
    title: "5. Asbahnâ wa asbaha-l-mulku lillâh",
    arabic:
      "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَٰذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَٰذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ. رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.",
    phonetic:
      "Asbahnâ wa asbaha-l-mulku lillâh, wal-hamdu lillâh, lâ ilâha illa-llâh wahdahu lâ sharîka lah, lahu-l-mulku wa lahu-l-hamdu wa Huwa 'alâ kulli shay'in Qadîr. Rabbi as'aluka khayra mâ fî hâdha-l-yawm wa khayra mâ ba'dah, wa a'ûdhu bika min sharri mâ fî hâdha-l-yawm wa sharri mâ ba'dah. Rabbi a'ûdhu bika mina-l-kasali wa sû'i-l-kibar, Rabbi a'ûdhu bika min 'adhâbin fi-n-nâri wa 'adhâbin fi-l-qabr.",
    translation:
      "Nous voici au matin et la royauté appartient à Allah. Louange à Allah. Nulle divinité sauf Allah, seul sans associé ; à Lui la royauté et à Lui la louange, et Il est capable de toute chose. Seigneur, je Te demande le bien de ce jour et de ce qui le suit, et je cherche refuge contre son mal et le mal de ce qui le suit. Seigneur, je cherche refuge auprès de Toi contre la paresse et l'affliction de la vieillesse, contre le châtiment du Feu et le châtiment de la tombe.",
    repetitions: 1,
    explanation: "Ouverture du jour dans le tawhîd, en confiant à Allah le bien et la protection.",
    merits: "Formule prophétique récitée quotidiennement par le Messager ﷺ.",
    reference: "Sahîh Muslim 2723.",
  },
  {
    id: "m-06-sayyid",
    category: "morning",
    title: "6. Sayyid al-istighfâr",
    arabic: SAYYID_AR,
    phonetic: SAYYID_PH,
    translation: SAYYID_FR,
    repetitions: 1,
    explanation: "« Le maître des demandes de pardon » — la formulation la plus complète du repentir.",
    merits:
      "Qui le dit avec certitude le matin et meurt avant le soir entre au Paradis ; de même pour le soir.",
    reference: "Sahîh al-Bukhârî 6306.",
  },
  {
    id: "m-07-radhitu",
    category: "morning",
    title: "7. Radîtu billâhi Rabban",
    arabic: RADHITU_AR,
    phonetic: RADHITU_PH,
    translation: RADHITU_FR,
    repetitions: 3,
    explanation: "Renouveler chaque matin son agrément envers Allah, l'Islam et son Prophète ﷺ.",
    merits: "Il incombe à Allah de satisfaire, au Jour du Jugement, quiconque le dit trois fois matin et soir.",
    reference: "Abû Dâwud 5072, At-Tirmidhî 3389 — authentique.",
  },
  {
    id: "m-08-ushhiduka",
    category: "morning",
    title: "8. Allâhumma innî asbahtu ush-hiduka",
    arabic:
      "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَٰهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ.",
    phonetic:
      "Allâhumma innî asbahtu ush-hiduka, wa ush-hidu hamalata 'arshika, wa malâ'ikataka, wa jamî'a khalqika, annaka Anta-llâhu lâ ilâha illâ Anta wahdaka lâ sharîka lak, wa anna Muhammadan 'abduka wa rasûluk.",
    translation:
      "Ô Allah, je Te prends à témoin en ce matin, ainsi que les porteurs de Ton Trône, Tes anges et toutes Tes créatures, que Tu es Allah, il n'y a de divinité que Toi, seul sans associé, et que Muhammad est Ton serviteur et Ton Messager.",
    repetitions: 4,
    explanation: "Renouvellement de la shahâda devant les anges et toute la création.",
    merits: "Qui le dit quatre fois, Allah l'affranchit du Feu.",
    reference: "Abû Dâwud 5069, An-Nasâ'î — hasan.",
  },
  {
    id: "m-09-shukr",
    category: "morning",
    title: "9. Reconnaissance des bienfaits",
    arabic:
      "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ، فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ.",
    phonetic:
      "Allâhumma mâ asbaha bî min ni'matin aw bi ahadin min khalqik, fa minka wahdaka lâ sharîka lak, fa laka-l-hamdu wa laka-sh-shukr.",
    translation:
      "Ô Allah, tout bienfait qui m'a été accordé ce matin, ou à l'une de Tes créatures, vient de Toi seul, sans associé. À Toi la louange et à Toi la gratitude.",
    repetitions: 1,
    explanation: "Attribuer tout bienfait à Allah seul.",
    merits: "Qui le dit le matin s'acquitte de la reconnaissance de sa journée.",
    reference: "Abû Dâwud 5073, An-Nasâ'î — hasan.",
  },
  {
    id: "m-10-hasbi",
    category: "morning",
    title: "10. Hasbiya-llâh",
    arabic: HASBI_AR,
    phonetic: HASBI_PH,
    translation: HASBI_FR,
    repetitions: 7,
    explanation: "Confiance totale : Allah suffit contre toute inquiétude de la vie et de l'au-delà.",
    merits: "Qui le dit sept fois matin et soir, Allah lui suffit contre tout ce qui l'afflige.",
    reference: "Abû Dâwud 5081 — hasan selon Ibn Bâz.",
  },
  {
    id: "m-11-bismillahi",
    category: "morning",
    title: "11. Bismi-llâhi-lladhî lâ yadurru",
    arabic: BISMILLAHI_AR,
    phonetic: BISMILLAHI_PH,
    translation: BISMILLAHI_FR,
    repetitions: 3,
    explanation: "Se placer sous la protection du Nom d'Allah dès le matin.",
    merits: "Rien ne pourra nuire à celui qui le dit trois fois matin et soir.",
    reference: "Abû Dâwud 5088, At-Tirmidhî 3388 — authentique.",
  },
  {
    id: "m-12-bika-asbahna",
    category: "morning",
    title: "12. Allâhumma bika asbahnâ",
    arabic:
      "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.",
    phonetic:
      "Allâhumma bika asbahnâ, wa bika amsaynâ, wa bika nahyâ, wa bika namût, wa ilayka-n-nushûr.",
    translation:
      "Ô Allah, par Toi nous atteignons le matin, par Toi le soir, par Toi nous vivons, par Toi nous mourons, et vers Toi est la résurrection.",
    repetitions: 1,
    explanation: "Reconnaître qu'Allah est à l'origine de chaque instant de notre vie.",
    merits: "Sunna quotidienne du Prophète ﷺ.",
    reference: "At-Tirmidhî 3391, Abû Dâwud 5068 — authentique.",
  },
  {
    id: "m-13-fitrah",
    category: "morning",
    title: "13. Asbahnâ 'alâ fitrati-l-Islâm",
    arabic:
      "أَصْبَحْنَا عَلَىٰ فِطْرَةِ الْإِسْلَامِ، وَعَلَىٰ كَلِمَةِ الْإِخْلَاصِ، وَعَلَىٰ دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَعَلَىٰ مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ.",
    phonetic:
      "Asbahnâ 'alâ fitrati-l-Islâm, wa 'alâ kalimati-l-ikhlâs, wa 'alâ dîni nabiyyinâ Muhammadin ﷺ, wa 'alâ millati abînâ Ibrâhîma hanîfan musliman wa mâ kâna mina-l-mushrikîn.",
    translation:
      "Nous voici au matin dans la fitrah de l'Islam, sur la parole de sincérité, sur la religion de notre Prophète Muhammad ﷺ, et sur la voie de notre père Ibrâhîm, monothéiste pur soumis, qui n'était pas des associateurs.",
    repetitions: 1,
    explanation: "Renouveler son attachement à la voie pure d'Ibrâhîm ﷺ et de Muhammad ﷺ.",
    merits: "Ancrage dans la fitrah dès l'aube.",
    reference: "Ahmad 15367 — authentifié par Al-Albânî.",
  },
  {
    id: "m-14-subhan-adad",
    category: "morning",
    title: "14. Subhâna-llâhi wa bi hamdih (adada khalqih)",
    arabic: SUBHAN_ADAD_AR,
    phonetic: SUBHAN_ADAD_PH,
    translation: SUBHAN_ADAD_FR,
    repetitions: 3,
    explanation: "Formule brève et immense en récompense, comparée par le Prophète ﷺ à des heures de dhikr.",
    merits: "Trois fois le matin égalent des milliers de tasbîh en récompense.",
    reference: "Sahîh Muslim 2726.",
  },
  {
    id: "m-15-afini",
    category: "morning",
    title: "15. Allâhumma 'âfinî fî badanî",
    arabic: AAFINI_AR,
    phonetic: AAFINI_PH,
    translation: AAFINI_FR,
    repetitions: 3,
    explanation: "Demande complète de préservation du corps et des sens.",
    merits: "Le Prophète ﷺ ne délaissait pas ces paroles matin et soir.",
    reference: "Abû Dâwud 5090 — authentifié par Al-Albânî.",
  },
  {
    id: "m-16-kufr-qabr",
    category: "morning",
    title: "16. Refuge contre la mécréance, la pauvreté et le tourment de la tombe",
    arabic: KUFR_QABR_AR,
    phonetic: KUFR_QABR_PH,
    translation: KUFR_QABR_FR,
    repetitions: 3,
    explanation: "Trois maux dont le musulman doit sans cesse chercher refuge.",
    merits: "Complément indissociable du dhikr précédent selon la sunna.",
    reference: "Abû Dâwud 5090 — authentifié par Al-Albânî.",
  },
  {
    id: "m-17-afwu-afiya",
    category: "morning",
    title: "17. Demande de pardon et de préservation totale",
    arabic: AFWU_AR,
    phonetic: AFWU_PH,
    translation: AFWU_FR,
    repetitions: 1,
    explanation: "Invocation complète protégeant la personne, la religion et la famille.",
    merits: "Le Prophète ﷺ ne délaissait jamais ces paroles matin et soir.",
    reference: "Abû Dâwud 5074, Ibn Mâjah 3871 — authentique.",
  },
  {
    id: "m-18-ya-hayyu",
    category: "morning",
    title: "18. Yâ Hayyu yâ Qayyûm",
    arabic: YA_HAYYU_AR,
    phonetic: YA_HAYYU_PH,
    translation: YA_HAYYU_FR,
    repetitions: 3,
    explanation: "Appel aux deux plus grands Noms — al-Hayy al-Qayyûm — pour la rectification totale.",
    merits: "Invocation puissante recommandée par le Prophète ﷺ à Fâtima.",
    reference: "An-Nasâ'î dans As-Sunan al-Kubrâ, Al-Hâkim — authentifié par Al-Albânî.",
  },
  {
    id: "m-19-asbahna-rabb-alamin",
    category: "morning",
    title: "19. Le bien, la victoire et la lumière du jour",
    arabic:
      "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَٰذَا الْيَوْمِ، فَتْحَهُ وَنَصْرَهُ وَنُورَهُ وَبَرَكَتَهُ وَهُدَاهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ.",
    phonetic:
      "Asbahnâ wa asbaha-l-mulku lillâhi Rabbi-l-'âlamîn, Allâhumma innî as'aluka khayra hâdha-l-yawm, fat-hahu wa nasrahu wa nûrahu wa barakatahu wa hudâh, wa a'ûdhu bika min sharri mâ fîhi wa sharri mâ ba'dah.",
    translation:
      "Nous voici au matin et la royauté appartient à Allah, Seigneur des mondes. Ô Allah, je Te demande le bien de ce jour : sa conquête, sa victoire, sa lumière, sa bénédiction et sa guidée, et je cherche refuge auprès de Toi contre son mal et celui qui le suit.",
    repetitions: 1,
    explanation: "Demande englobant tous les biens de la journée à venir.",
    merits: "Sunna prophétique rapportée pour l'ouverture du jour.",
    reference: "Abû Dâwud 5084 — hasan.",
  },
  {
    id: "m-20-alim-ghayb",
    category: "morning",
    title: "20. Allâhumma 'âlima-l-ghaybi wa-sh-shahâda",
    arabic: ALIM_GHAYB_AR,
    phonetic: ALIM_GHAYB_PH,
    translation: ALIM_GHAYB_FR,
    repetitions: 1,
    explanation: "Reconnaissance de la seigneurie totale d'Allah et refuge contre les péchés du cœur.",
    merits: "Enseigné par le Prophète ﷺ à Abû Bakr pour matin, soir et coucher.",
    reference: "Abû Dâwud 5067, At-Tirmidhî 3392 — authentique.",
  },
  {
    id: "m-21-kalimat",
    category: "morning",
    title: "21. A'ûdhu bi kalimâti-llâhi at-tâmmât",
    arabic: KALIMAT_AR,
    phonetic: KALIMAT_PH,
    translation: KALIMAT_FR,
    repetitions: 3,
    explanation: "Refuge dans les paroles parfaites d'Allah contre tout mal créé.",
    merits: "Qui le dit trois fois, rien ne pourra lui nuire (piqûres venimeuses incluses).",
    reference: "At-Tirmidhî 3437, Ahmad — authentique.",
  },
  {
    id: "m-22-salat-nabi",
    category: "morning",
    title: "22. Prière sur le Prophète ﷺ",
    arabic: SALAT_NABI_AR,
    phonetic: SALAT_NABI_PH,
    translation: SALAT_NABI_FR,
    repetitions: 10,
    explanation: "Multiplier la salât 'ala-n-Nabî ﷺ matin et soir.",
    merits: "Qui prie sur lui dix fois matin et soir bénéficiera de son intercession au Jour de la Résurrection.",
    reference: "At-Tabarânî — hasan selon Al-Albânî.",
  },
  {
    id: "m-23-shirk",
    category: "morning",
    title: "23. Refuge contre le shirk",
    arabic: SHIRK_AR,
    phonetic: SHIRK_PH,
    translation: SHIRK_FR,
    repetitions: 3,
    explanation: "Prévention contre le shirk apparent et caché.",
    merits: "Immunise contre le shirk caché comme le riyâ' (ostentation).",
    reference: "Ahmad, At-Tabarânî — hasan.",
  },
  {
    id: "m-24-hamm",
    category: "morning",
    title: "24. Refuge contre le souci et la faiblesse",
    arabic: HAMM_AR,
    phonetic: HAMM_PH,
    translation: HAMM_FR,
    repetitions: 3,
    explanation: "Huit refuges regroupés dans une invocation prophétique célèbre.",
    merits: "Anas ibn Mâlik le récitait fréquemment ; Allah éloigne soucis et dettes.",
    reference: "Sahîh al-Bukhârî 6369.",
  },
  {
    id: "m-25-istighfar-3",
    category: "morning",
    title: "25. Istighfâr al-Hayy al-Qayyûm",
    arabic: ISTIGHFAR3_AR,
    phonetic: ISTIGHFAR3_PH,
    translation: ISTIGHFAR3_FR,
    repetitions: 3,
    explanation: "Repentance liée aux Noms al-Hayy al-Qayyûm — cause du pardon.",
    merits: "Qui le dit voit ses péchés pardonnés, même s'il aurait fui le combat.",
    reference: "Abû Dâwud 1517, At-Tirmidhî 3577 — authentique.",
  },
  {
    id: "m-26-ya-rabbi",
    category: "morning",
    title: "26. Yâ Rabbi laka-l-hamd",
    arabic: YA_RABBI_AR,
    phonetic: YA_RABBI_PH,
    translation: YA_RABBI_FR,
    repetitions: 3,
    explanation: "Louange proportionnée à la majesté et au pouvoir d'Allah.",
    merits: "Formule englobant l'ensemble des louanges possibles.",
    reference: "Ibn Mâjah 3801, Ibn as-Sunnî — hasan.",
  },
  {
    id: "m-27-ilm-nafi",
    category: "morning",
    title: "27. Demande de science, subsistance et œuvre",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا.",
    phonetic: "Allâhumma innî as'aluka 'ilman nâfi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan.",
    translation:
      "Ô Allah, je Te demande une science utile, une subsistance licite et bonne, et une œuvre agréée.",
    repetitions: 1,
    explanation: "Trois demandes qui résument le succès dans les deux demeures.",
    merits: "Invocation matinale enseignée par le Prophète ﷺ à Umm Salama.",
    reference: "Ibn Mâjah 925, An-Nasâ'î — authentique.",
  },
  {
    id: "m-28-tawakkal",
    category: "morning",
    title: "28. Anta Rabbî, 'alayka tawakkaltu",
    arabic: TAWAKKAL_AR,
    phonetic: TAWAKKAL_PH,
    translation: TAWAKKAL_FR,
    repetitions: 1,
    explanation: "Un dhikr complet mêlant tawhîd, tawakkul et refuge contre toute nuisance.",
    merits: "« Dhikr excellent » — le Prophète ﷺ.",
    reference: "Rapporté par Ibn as-Sunnî et cité dans les recueils d'adhkâr.",
  },
  {
    id: "m-29-lailaha-100",
    category: "morning",
    title: "29. Lâ ilâha illa-llâh (×100)",
    arabic: LAILAHA_UNIT_AR,
    phonetic: LAILAHA_UNIT_PH,
    translation: LAILAHA_UNIT_FR,
    repetitions: 100,
    explanation: "L'affirmation du tawhîd la plus complète, à répéter cent fois dans la journée.",
    merits:
      "Récompense de dix esclaves affranchis, cent bonnes actions, cent péchés effacés, protection contre Shaytân toute la journée.",
    reference: "Sahîh al-Bukhârî 3293, Sahîh Muslim 2691.",
  },
  {
    id: "m-30-subhan-100",
    category: "morning",
    title: "30. Subhâna-llâhi wa bi hamdih (×100)",
    arabic: SUBHAN_HAMD_AR,
    phonetic: SUBHAN_HAMD_PH,
    translation: SUBHAN_HAMD_FR,
    repetitions: 100,
    explanation: "Formule brève, immense en récompense, à répéter cent fois le matin.",
    merits: "Ses péchés sont effacés seraient-ils comme l'écume de la mer.",
    reference: "Sahîh al-Bukhârî 6405, Sahîh Muslim 2691.",
  },
  {
    id: "m-31-istighfar-100",
    category: "morning",
    title: "31. Astaghfiru-llâha wa atûbu ilayh (×100)",
    arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ.",
    phonetic: "Astaghfiru-llâha wa atûbu ilayh.",
    translation: "Je demande pardon à Allah et me repens à Lui.",
    repetitions: 100,
    explanation: "L'istighfâr quotidien du Prophète ﷺ, plus de cent fois par jour.",
    merits: "Cent bonnes actions écrites, cent mauvaises effacées, protection contre Shaytân jusqu'au soir.",
    reference: "Sahîh al-Bukhârî 6307, Sahîh Muslim 2702.",
  },
];

const evening: Dhikr[] = [
  {
    id: "e-01-ayat-kursi",
    category: "evening",
    title: "1. Âyat al-Kursî",
    arabic: AYAT_KURSI,
    phonetic: AYAT_KURSI_PH,
    translation: AYAT_KURSI_FR,
    repetitions: 1,
    explanation: "Le plus grand verset du Coran, à réciter aussi le soir pour être protégé jusqu'au matin.",
    merits: "Un ange est chargé de garder celui qui le récite avant de dormir jusqu'à son réveil.",
    reference: "Sahîh al-Bukhârî 2311.",
  },
  {
    id: "e-02-baqara-fin",
    category: "evening",
    title: "2. Les deux derniers versets d'Al-Baqara",
    arabic:
      "آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ. لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ.",
    phonetic:
      "Âmana-r-Rasûlu bimâ unzila ilayhi min Rabbihi wal-mu'minûn… (Al-Baqara 285-286).",
    translation:
      "« Le Messager a cru en ce que l'on a fait descendre vers lui de la part de son Seigneur, et aussi les croyants… Notre Seigneur, ne nous châtie pas si nous oublions ou tombons dans l'erreur… Efface nos péchés, pardonne-nous et fais-nous miséricorde. »",
    repetitions: 1,
    explanation: "Deux versets d'immense protection à réciter chaque soir.",
    merits: "« Qui récite ces deux versets la nuit, ils lui suffiront. »",
    reference: "Sahîh al-Bukhârî 5040, Sahîh Muslim 807.",
  },
  {
    id: "e-03-ikhlas",
    category: "evening",
    title: "3. Sourate Al-Ikhlâs",
    arabic: IKHLAS,
    phonetic: "Qul Huwa-llâhu Ahad, Allâhu-s-Samad, lam yalid wa lam yûlad, wa lam yakun lahu kufuwan Ahad.",
    translation: "Sourate de la Pure Unicité — voir matin n°2.",
    repetitions: 3,
    explanation: "Le Prophète ﷺ soufflait dans ses mains après les avoir récitées, avant de dormir.",
    merits: "Refuge complet jusqu'au matin.",
    reference: "Sahîh al-Bukhârî 5017, Abû Dâwud 5082.",
  },
  {
    id: "e-04-falaq",
    category: "evening",
    title: "4. Sourate Al-Falaq",
    arabic: FALAQ,
    phonetic: "Qul a'ûdhu bi Rabbi-l-falaq…",
    translation: "Refuge contre tous les maux — voir matin n°3.",
    repetitions: 3,
    explanation: "Récitée trois fois le soir avec les deux autres mu'awwidhât.",
    merits: "Protection totale pour la nuit.",
    reference: "Abû Dâwud 5082, At-Tirmidhî 3575 — authentique.",
  },
  {
    id: "e-05-nas",
    category: "evening",
    title: "5. Sourate An-Nâs",
    arabic: NAS,
    phonetic: "Qul a'ûdhu bi Rabbi-n-nâs…",
    translation: "Refuge contre le waswâs — voir matin n°4.",
    repetitions: 3,
    explanation: "Complète le trio protecteur du soir.",
    merits: "Refuge complet contre tout mal jusqu'au matin.",
    reference: "Abû Dâwud 5082, At-Tirmidhî 3575 — authentique.",
  },
  {
    id: "e-06-amsayna-mulk",
    category: "evening",
    title: "6. Amsaynâ wa amsâ-l-mulku lillâh",
    arabic:
      "أَمْسَيْنَا وَأَمْسَىٰ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَٰذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَٰذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا. رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.",
    phonetic:
      "Amsaynâ wa amsâ-l-mulku lillâh, wal-hamdu lillâh, lâ ilâha illa-llâh wahdahu lâ sharîka lah, lahu-l-mulku wa lahu-l-hamdu wa Huwa 'alâ kulli shay'in Qadîr. Rabbi as'aluka khayra mâ fî hâdhihi-l-layla wa khayra mâ ba'dahâ, wa a'ûdhu bika min sharri mâ fî hâdhihi-l-layla wa sharri mâ ba'dahâ. Rabbi a'ûdhu bika mina-l-kasali wa sû'i-l-kibar, Rabbi a'ûdhu bika min 'adhâbin fi-n-nâri wa 'adhâbin fi-l-qabr.",
    translation:
      "Nous voici au soir et la royauté appartient à Allah… Seigneur, je Te demande le bien de cette nuit et de ce qui la suit, et je cherche refuge contre son mal et le mal de ce qui la suit. Seigneur, je cherche refuge contre la paresse et l'affliction de la vieillesse, contre le châtiment du Feu et de la tombe.",
    repetitions: 1,
    explanation: "Version du soir : reconnaître la souveraineté d'Allah au coucher du soleil.",
    merits: "Ouvre la nuit sous la protection du Seigneur.",
    reference: "Sahîh Muslim 2723.",
  },
  {
    id: "e-07-sayyid",
    category: "evening",
    title: "7. Sayyid al-istighfâr",
    arabic: SAYYID_AR,
    phonetic: SAYYID_PH,
    translation: SAYYID_FR,
    repetitions: 1,
    explanation: "La meilleure formulation de repentir, à dire aussi le soir avec certitude.",
    merits: "Qui le dit le soir avec certitude et meurt cette nuit entre au Paradis.",
    reference: "Sahîh al-Bukhârî 6306.",
  },
  {
    id: "e-08-radhitu",
    category: "evening",
    title: "8. Radîtu billâhi Rabban",
    arabic: RADHITU_AR,
    phonetic: RADHITU_PH,
    translation: RADHITU_FR,
    repetitions: 3,
    explanation: "Ridâ envers Allah, l'Islam et le Prophète ﷺ, à renouveler soir et matin.",
    merits: "Il incombe à Allah de le satisfaire au Jour du Jugement.",
    reference: "Abû Dâwud 5072, At-Tirmidhî 3389 — authentique.",
  },
  {
    id: "e-09-ushhiduka",
    category: "evening",
    title: "9. Allâhumma innî amsaytu ush-hiduka",
    arabic:
      "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَٰهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ.",
    phonetic:
      "Allâhumma innî amsaytu ush-hiduka, wa ush-hidu hamalata 'arshika, wa malâ'ikataka, wa jamî'a khalqika, annaka Anta-llâhu lâ ilâha illâ Anta wahdaka lâ sharîka lak, wa anna Muhammadan 'abduka wa rasûluk.",
    translation:
      "Ô Allah, je Te prends à témoin en ce soir, ainsi que les porteurs de Ton Trône, Tes anges et toutes Tes créatures, que Tu es Allah, il n'y a de divinité que Toi, seul sans associé, et que Muhammad est Ton serviteur et Ton Messager.",
    repetitions: 4,
    explanation: "Réitérer la shahâda le soir en prenant les anges à témoin.",
    merits: "Allah affranchit du Feu celui qui le dit quatre fois.",
    reference: "Abû Dâwud 5069 — hasan.",
  },
  {
    id: "e-10-shukr",
    category: "evening",
    title: "10. Reconnaissance des bienfaits",
    arabic:
      "اللَّهُمَّ مَا أَمْسَىٰ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ، فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ.",
    phonetic:
      "Allâhumma mâ amsâ bî min ni'matin aw bi ahadin min khalqik, fa minka wahdaka lâ sharîka lak, fa laka-l-hamdu wa laka-sh-shukr.",
    translation:
      "Ô Allah, tout bienfait qui m'a été accordé ce soir, ou à l'une de Tes créatures, vient de Toi seul. À Toi la louange et à Toi la gratitude.",
    repetitions: 1,
    explanation: "Attribuer tout bienfait à Allah seul avant la nuit.",
    merits: "Qui le dit s'acquitte de la reconnaissance de sa journée.",
    reference: "Abû Dâwud 5073, An-Nasâ'î — hasan.",
  },
  {
    id: "e-11-hasbi",
    category: "evening",
    title: "11. Hasbiya-llâh",
    arabic: HASBI_AR,
    phonetic: HASBI_PH,
    translation: HASBI_FR,
    repetitions: 7,
    explanation: "Se remettre entièrement à Allah pour la nuit.",
    merits: "Allah lui suffit contre tout ce qui l'afflige.",
    reference: "Abû Dâwud 5081 — hasan.",
  },
  {
    id: "e-12-bismillahi",
    category: "evening",
    title: "12. Bismi-llâhi-lladhî lâ yadurru",
    arabic: BISMILLAHI_AR,
    phonetic: BISMILLAHI_PH,
    translation: BISMILLAHI_FR,
    repetitions: 3,
    explanation: "Refuge dans le Nom d'Allah pour la nuit qui vient.",
    merits: "Rien ne pourra lui nuire jusqu'au matin.",
    reference: "Abû Dâwud 5088, At-Tirmidhî 3388 — authentique.",
  },
  {
    id: "e-13-bika-amsayna",
    category: "evening",
    title: "13. Allâhumma bika amsaynâ",
    arabic:
      "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.",
    phonetic:
      "Allâhumma bika amsaynâ, wa bika asbahnâ, wa bika nahyâ wa bika namût, wa ilayka-l-masîr.",
    translation:
      "Ô Allah, par Toi nous atteignons le soir, par Toi le matin, par Toi nous vivons, par Toi nous mourons, et vers Toi est le retour.",
    repetitions: 1,
    explanation: "Sunna quotidienne du Prophète ﷺ, version du soir.",
    merits: "Rappel du retour final à Allah.",
    reference: "At-Tirmidhî 3391, Abû Dâwud 5068 — authentique.",
  },
  {
    id: "e-14-fitrah",
    category: "evening",
    title: "14. Amsaynâ 'alâ fitrati-l-Islâm",
    arabic:
      "أَمْسَيْنَا عَلَىٰ فِطْرَةِ الْإِسْلَامِ، وَعَلَىٰ كَلِمَةِ الْإِخْلَاصِ، وَعَلَىٰ دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَعَلَىٰ مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ.",
    phonetic:
      "Amsaynâ 'alâ fitrati-l-Islâm, wa 'alâ kalimati-l-ikhlâs, wa 'alâ dîni nabiyyinâ Muhammadin ﷺ, wa 'alâ millati abînâ Ibrâhîma hanîfan musliman wa mâ kâna mina-l-mushrikîn.",
    translation:
      "Nous voici au soir dans la fitrah de l'Islam, sur la parole de sincérité, sur la religion de notre Prophète ﷺ, et sur la voie d'Ibrâhîm ﷺ, monothéiste pur soumis.",
    repetitions: 1,
    explanation: "Reconfirmer la fitrah avant la nuit qui peut ressembler à la mort.",
    merits: "Attachement à la religion pure d'Ibrâhîm ﷺ.",
    reference: "Ahmad 15367 — authentifié par Al-Albânî.",
  },
  {
    id: "e-15-subhan-adad",
    category: "evening",
    title: "15. Subhâna-llâhi wa bi hamdih (adada khalqih)",
    arabic: SUBHAN_ADAD_AR,
    phonetic: SUBHAN_ADAD_PH,
    translation: SUBHAN_ADAD_FR,
    repetitions: 3,
    explanation: "Tasbîh immense en récompense, trois fois le soir.",
    merits: "Équivaut à des heures entières de dhikr.",
    reference: "Sahîh Muslim 2726.",
  },
  {
    id: "e-16-afini",
    category: "evening",
    title: "16. Allâhumma 'âfinî fî badanî",
    arabic: AAFINI_AR,
    phonetic: AAFINI_PH,
    translation: AAFINI_FR,
    repetitions: 3,
    explanation: "Préservation du corps, de l'ouïe et de la vue pendant la nuit.",
    merits: "Le Prophète ﷺ ne la délaissait pas soir et matin.",
    reference: "Abû Dâwud 5090 — authentique.",
  },
  {
    id: "e-17-kufr-qabr",
    category: "evening",
    title: "17. Refuge contre la mécréance et le tourment de la tombe",
    arabic: KUFR_QABR_AR,
    phonetic: KUFR_QABR_PH,
    translation: KUFR_QABR_FR,
    repetitions: 3,
    explanation: "Se prémunir contre trois grands maux avant le sommeil.",
    merits: "Complément indissociable du dhikr précédent.",
    reference: "Abû Dâwud 5090 — authentique.",
  },
  {
    id: "e-18-afwu-afiya",
    category: "evening",
    title: "18. Demande de pardon et de préservation totale",
    arabic: AFWU_AR,
    phonetic: AFWU_PH,
    translation: AFWU_FR,
    repetitions: 1,
    explanation: "Protection de la personne, de la religion, de la famille et des biens pour la nuit.",
    merits: "Le Prophète ﷺ ne la délaissait jamais soir et matin.",
    reference: "Abû Dâwud 5074, Ibn Mâjah 3871 — authentique.",
  },
  {
    id: "e-19-ya-hayyu",
    category: "evening",
    title: "19. Yâ Hayyu yâ Qayyûm",
    arabic: YA_HAYYU_AR,
    phonetic: YA_HAYYU_PH,
    translation: YA_HAYYU_FR,
    repetitions: 3,
    explanation: "Recours aux Noms al-Hayy al-Qayyûm pour la rectification de la nuit.",
    merits: "Invocation puissante enseignée par le Prophète ﷺ à Fâtima.",
    reference: "An-Nasâ'î, Al-Hâkim — authentifié par Al-Albânî.",
  },
  {
    id: "e-20-amsayna-rabb-alamin",
    category: "evening",
    title: "20. Le bien, la victoire et la lumière de la nuit",
    arabic:
      "أَمْسَيْنَا وَأَمْسَىٰ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَٰذِهِ اللَّيْلَةِ، فَتْحَهَا وَنَصْرَهَا وَنُورَهَا وَبَرَكَتَهَا وَهُدَاهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهَا وَشَرِّ مَا بَعْدَهَا.",
    phonetic:
      "Amsaynâ wa amsâ-l-mulku lillâhi Rabbi-l-'âlamîn, Allâhumma innî as'aluka khayra hâdhihi-l-layla, fat-hahâ wa nasrahâ wa nûrahâ wa barakatahâ wa hudâhâ, wa a'ûdhu bika min sharri mâ fîhâ wa sharri mâ ba'dahâ.",
    translation:
      "Nous voici au soir et la royauté appartient à Allah, Seigneur des mondes. Ô Allah, je Te demande le bien de cette nuit : sa conquête, sa victoire, sa lumière, sa bénédiction et sa guidée, et je cherche refuge contre son mal et celui qui la suit.",
    repetitions: 1,
    explanation: "Demande englobant tous les biens de la nuit à venir.",
    merits: "Sunna prophétique du soir.",
    reference: "Abû Dâwud 5084 — hasan.",
  },
  {
    id: "e-21-alim-ghayb",
    category: "evening",
    title: "21. Allâhumma 'âlima-l-ghaybi wa-sh-shahâda",
    arabic: ALIM_GHAYB_AR,
    phonetic: ALIM_GHAYB_PH,
    translation: ALIM_GHAYB_FR,
    repetitions: 1,
    explanation: "Reconnaissance de la seigneurie d'Allah et refuge contre les péchés du cœur.",
    merits: "Enseigné par le Prophète ﷺ à Abû Bakr pour matin, soir et coucher.",
    reference: "Abû Dâwud 5067, At-Tirmidhî 3392 — authentique.",
  },
  {
    id: "e-22-kalimat",
    category: "evening",
    title: "22. A'ûdhu bi kalimâti-llâhi at-tâmmât",
    arabic: KALIMAT_AR,
    phonetic: KALIMAT_PH,
    translation: KALIMAT_FR,
    repetitions: 3,
    explanation: "Refuge spécifique contre les nuisibles de la nuit.",
    merits: "Rien ne pourra lui nuire cette nuit-là, pas même une piqûre venimeuse.",
    reference: "Sahîh Muslim 2708, At-Tirmidhî 3437.",
  },
  {
    id: "e-23-salat-nabi",
    category: "evening",
    title: "23. Prière sur le Prophète ﷺ",
    arabic: SALAT_NABI_AR,
    phonetic: SALAT_NABI_PH,
    translation: SALAT_NABI_FR,
    repetitions: 10,
    explanation: "Salât 'ala-n-Nabî ﷺ dix fois le soir.",
    merits: "L'intercession du Prophète ﷺ au Jour de la Résurrection.",
    reference: "At-Tabarânî — hasan selon Al-Albânî.",
  },
  {
    id: "e-24-shirk",
    category: "evening",
    title: "24. Refuge contre le shirk",
    arabic: SHIRK_AR,
    phonetic: SHIRK_PH,
    translation: SHIRK_FR,
    repetitions: 3,
    explanation: "Prévention contre le shirk visible et caché.",
    merits: "Immunise contre le shirk caché.",
    reference: "Ahmad, At-Tabarânî — hasan.",
  },
  {
    id: "e-25-hamm",
    category: "evening",
    title: "25. Refuge contre le souci et la faiblesse",
    arabic: HAMM_AR,
    phonetic: HAMM_PH,
    translation: HAMM_FR,
    repetitions: 3,
    explanation: "Huit refuges pour finir la journée l'âme allégée.",
    merits: "Allah éloigne les soucis, les dettes et l'oppression.",
    reference: "Sahîh al-Bukhârî 6369.",
  },
  {
    id: "e-26-istighfar-3",
    category: "evening",
    title: "26. Istighfâr al-Hayy al-Qayyûm",
    arabic: ISTIGHFAR3_AR,
    phonetic: ISTIGHFAR3_PH,
    translation: ISTIGHFAR3_FR,
    repetitions: 3,
    explanation: "Repentance avant la nuit, liée aux Noms al-Hayy al-Qayyûm.",
    merits: "Cause du pardon même des péchés majeurs.",
    reference: "Abû Dâwud 1517, At-Tirmidhî 3577 — authentique.",
  },
  {
    id: "e-27-ya-rabbi",
    category: "evening",
    title: "27. Yâ Rabbi laka-l-hamd",
    arabic: YA_RABBI_AR,
    phonetic: YA_RABBI_PH,
    translation: YA_RABBI_FR,
    repetitions: 3,
    explanation: "Louange proportionnée à la Majesté d'Allah.",
    merits: "Formule englobant toutes les louanges possibles.",
    reference: "Ibn Mâjah 3801, Ibn as-Sunnî — hasan.",
  },
  {
    id: "e-28-lailaha-100",
    category: "evening",
    title: "28. Lâ ilâha illa-llâh (×100)",
    arabic: LAILAHA_UNIT_AR,
    phonetic: LAILAHA_UNIT_PH,
    translation: LAILAHA_UNIT_FR,
    repetitions: 100,
    explanation: "L'affirmation du tawhîd, à répéter cent fois — équivalente à l'affranchissement d'esclaves.",
    merits:
      "Dix esclaves affranchis, cent bonnes actions, cent péchés effacés, protection contre Shaytân toute la nuit.",
    reference: "Sahîh al-Bukhârî 3293, Sahîh Muslim 2691.",
  },
  {
    id: "e-29-tawakkal",
    category: "evening",
    title: "29. Anta Rabbî, 'alayka tawakkaltu",
    arabic: TAWAKKAL_AR,
    phonetic: TAWAKKAL_PH,
    translation: TAWAKKAL_FR,
    repetitions: 1,
    explanation: "Un dhikr complet mêlant tawhîd, tawakkul et refuge contre toute nuisance.",
    merits: "« Dhikr excellent » — le Prophète ﷺ.",
    reference: "Rapporté par Ibn as-Sunnî et cité dans les recueils d'adhkâr.",
  },
  {
    id: "e-30-subhan-100",
    category: "evening",
    title: "30. Subhâna-llâhi wa bi hamdih (×100)",
    arabic: SUBHAN_HAMD_AR,
    phonetic: SUBHAN_HAMD_PH,
    translation: SUBHAN_HAMD_FR,
    repetitions: 100,
    explanation: "Formule brève, immense en récompense, à clore la journée.",
    merits: "Les péchés effacés seraient-ils comme l'écume de la mer.",
    reference: "Sahîh al-Bukhârî 6405, Sahîh Muslim 2691.",
  },
];

export const adhkar: Dhikr[] = [...morning, ...evening];
export const morningAdhkar = morning;
export const eveningAdhkar = evening;
