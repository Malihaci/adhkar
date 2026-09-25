/**
 * Adhkār authentiques — Coucher / Sortie de la maison / Voyage.
 *
 * Chaque entrée remonte à une source primaire (Sahih al-Bukhari, Sahih
 * Muslim, Sunan Abi Dawud, Jami' at-Tirmidhi), vérifiée directement sur
 * sunnah.com avant intégration (texte arabe, référence, narrateur, degré
 * d'authenticité). Aucune formule n'est reconstruite de mémoire ni
 * mélangée entre deux narrations différentes.
 *
 * `propheticEvidenceType` précise ce que la preuve établit RÉELLEMENT —
 * ne jamais transformer B/C/D/E en "Le Prophète ﷺ disait...". Voir
 * `PropheticEvidenceType` dans ./adhkar.ts.
 *
 * `repetitions` = 1 partout SAUF lorsque la narration elle-même précise
 * un nombre (jamais un nombre rituel inventé).
 */

import type { Dhikr } from "@/data/adhkar";

export const coucherAdhkar: Dhikr[] = [
  {
    id: "coucher-1",
    category: "coucher",
    title: "Les trois sourates protectrices + le geste rapporté",
    titleAr: "المعوذات عند النوم",
    arabic:
      "قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ ... ثم قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ ... ثم قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ ...",
    phonetic:
      "Qul huwa-llâhu ahad… puis Qul a'ûdhu bi-rabbi-l-falaq… puis Qul a'ûdhu bi-rabbi-n-nâs… (les trois sourates en entier)",
    translation:
      "Réciter en entier les sourates Al-Ikhlâs, Al-Falaq et An-Nâs, souffler dans les mains jointes après chacune, puis passer les mains sur le corps (tête, visage, avant du corps), en recommençant trois fois.",
    repetitions: 3,
    explanation:
      "D'après Aisha (qu'Allah l'agrée) : chaque nuit avant de se coucher, le Prophète ﷺ joignait ses mains, soufflait dedans après avoir récité Al-Ikhlâs, Al-Falaq et An-Nâs, puis passait ses mains sur tout ce qu'il pouvait atteindre de son corps en commençant par la tête, le visage et l'avant du corps. Il faisait cela trois fois.",
    merits: "",
    reference: "Source : Sahih al-Bukhari 5017 ⓘ",
    context: "Chaque nuit, avant de dormir",
    propheticEvidenceType: "A",
    primarySource: "Sahih al-Bukhari",
    collection: "Sahih al-Bukhari",
    hadithNumber: "5017",
    narrator: "Aisha (رضي الله عنها)",
    authenticityGrade: "Sahih (recueil authentique par consensus)",
    authenticityGrader: "Al-Bukhari",
    evidenceSummaryFr:
      "Aisha rapporte directement la pratique régulière du Prophète ﷺ chaque nuit : c'est donc son geste personnel (type A), avec la répétition 3 fois explicitement mentionnée dans le texte du hadith.",
    validationStatus: "verified_source",
  },
  {
    id: "coucher-2",
    category: "coucher",
    title: "Ayat al-Kursi (2:255)",
    titleAr: "آية الكرسي",
    arabic:
      "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    phonetic: "Allâhu lâ ilâha illâ Huwa, al-Hayyu al-Qayyûm. Lâ ta'khudhuhu sinatun wa lâ nawm...",
    translation:
      "Allah, il n'y a de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même. Ni somnolence ni sommeil ne Le saisissent... Il est le Très-Haut, le Très-Grand.",
    repetitions: 1,
    explanation:
      "Le récit authentique (Abu Hurayra) rapporte qu'un être (identifié ensuite comme un démon) chargé de voler dans les provisions de la Zakât fut intercepté trois nuits de suite par Abu Hurayra, et lui enseigna : « Quand tu vas te coucher, récite Ayat al-Kursi jusqu'au bout ; un gardien d'Allah restera avec toi et aucun démon ne t'approchera jusqu'au matin. » Le lendemain, le Prophète ﷺ confirma : « Il t'a dit la vérité, alors qu'il est un grand menteur. C'était un démon. »",
    merits:
      "La preuve établit une confirmation prophétique de cet enseignement (transmis, de façon inhabituelle, par un démon) — et non une pratique que le Prophète ﷺ décrivait comme sienne chaque soir.",
    reference: "Source : Sahih al-Bukhari 2311 ⓘ",
    context: "Au coucher",
    propheticEvidenceType: "B",
    primarySource: "Sahih al-Bukhari",
    collection: "Sahih al-Bukhari",
    hadithNumber: "2311",
    narrator: "Abu Hurayra (رضي الله عنه)",
    authenticityGrade: "Sahih (recueil authentique par consensus)",
    authenticityGrader: "Al-Bukhari",
    evidenceSummaryFr:
      "Le contenu de l'enseignement provient d'un démon dans le récit, mais le Prophète ﷺ en a confirmé explicitement la véracité — d'où le type B (enseignement confirmé), jamais présenté comme « le Prophète ﷺ récitait Ayat al-Kursi chaque soir ».",
    validationStatus: "verified_source",
  },
  {
    id: "coucher-3a",
    category: "coucher",
    title: "Tasbih avant de dormir (1/3) — Subhanallah",
    titleAr: "تسبيح النوم — سبحان الله",
    arabic: "سُبْحَانَ اللَّهِ",
    phonetic: "Subhâna-llâh",
    translation: "Gloire à Allah.",
    repetitions: 33,
    explanation:
      "Fatima (qu'Allah l'agrée) demanda un serviteur au Prophète ﷺ. Il lui répondit : « Ne veux-tu pas que je t'indique mieux que cela ? À ton coucher, dis 33 fois Subhânallah, 33 fois Al-hamdulillah et 34 fois Allâhu Akbar. » Ali (qu'Allah l'agrée) rapporte ne jamais avoir délaissé cela depuis, pas même la nuit de la bataille de Siffin.",
    merits: "",
    reference: "Source : Sahih al-Bukhari 5362 ⓘ",
    context: "Au coucher — 1ʳᵉ étape de la séquence 33 → 33 → 34",
    propheticEvidenceType: "B",
    primarySource: "Sahih al-Bukhari",
    collection: "Sahih al-Bukhari",
    hadithNumber: "5362",
    narrator: "Ali ibn Abi Talib (رضي الله عنه)",
    authenticityGrade: "Sahih (recueil authentique par consensus)",
    authenticityGrader: "Al-Bukhari",
    evidenceSummaryFr:
      "Enseignement direct du Prophète ﷺ à Fatima (type B) ; le nombre 33 est explicitement établi par le texte du hadith, jamais déduit.",
    validationStatus: "verified_source",
  },
  {
    id: "coucher-3b",
    category: "coucher",
    title: "Tasbih avant de dormir (2/3) — Alhamdulillah",
    titleAr: "تسبيح النوم — الحمد لله",
    arabic: "الْحَمْدُ لِلَّهِ",
    phonetic: "Al-hamdu li-llâh",
    translation: "La louange est à Allah.",
    repetitions: 33,
    explanation:
      "Deuxième étape de la même séquence enseignée à Fatima (qu'Allah l'agrée) par le Prophète ﷺ (voir Sahih al-Bukhari 5362).",
    merits: "",
    reference: "Source : Sahih al-Bukhari 5362 ⓘ",
    context: "Au coucher — 2ᵉ étape de la séquence 33 → 33 → 34",
    propheticEvidenceType: "B",
    primarySource: "Sahih al-Bukhari",
    collection: "Sahih al-Bukhari",
    hadithNumber: "5362",
    narrator: "Ali ibn Abi Talib (رضي الله عنه)",
    authenticityGrade: "Sahih (recueil authentique par consensus)",
    authenticityGrader: "Al-Bukhari",
    evidenceSummaryFr:
      "Même hadith que l'étape précédente — séquence unique 33 → 33 → 34, jamais présentée comme trois dhikr indépendants.",
    sourceIds: ["coucher-3a"],
    validationStatus: "verified_source",
  },
  {
    id: "coucher-3c",
    category: "coucher",
    title: "Tasbih avant de dormir (3/3) — Allahu Akbar",
    titleAr: "تسبيح النوم — الله أكبر",
    arabic: "اللَّهُ أَكْبَرُ",
    phonetic: "Allâhu akbar",
    translation: "Allah est le Plus Grand.",
    repetitions: 34,
    explanation:
      "Troisième et dernière étape de la même séquence enseignée à Fatima (qu'Allah l'agrée) par le Prophète ﷺ (voir Sahih al-Bukhari 5362).",
    merits: "",
    reference: "Source : Sahih al-Bukhari 5362 ⓘ",
    context: "Au coucher — 3ᵉ étape de la séquence 33 → 33 → 34",
    propheticEvidenceType: "B",
    primarySource: "Sahih al-Bukhari",
    collection: "Sahih al-Bukhari",
    hadithNumber: "5362",
    narrator: "Ali ibn Abi Talib (رضي الله عنه)",
    authenticityGrade: "Sahih (recueil authentique par consensus)",
    authenticityGrader: "Al-Bukhari",
    evidenceSummaryFr:
      "Fin de la séquence — le nombre 34 est explicitement établi par le texte du hadith.",
    sourceIds: ["coucher-3a"],
    validationStatus: "verified_source",
  },
  {
    id: "coucher-4",
    category: "coucher",
    title: "Bismika Allahumma amutu wa ahya",
    titleAr: "باسمك اللهم أموت وأحيا",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    phonetic: "Bismika Allâhumma amûtu wa ahyâ",
    translation: "En Ton nom, ô Allah, je meurs et je vis.",
    repetitions: 1,
    explanation:
      "D'après Hudhayfa (qu'Allah l'agrée) : quand le Prophète ﷺ voulait se coucher, il disait cette invocation ; et à son réveil, il disait : « Louange à Allah qui nous a rendu la vie après nous avoir fait mourir (le sommeil), et c'est vers Lui la résurrection. »",
    merits: "",
    reference: "Source : Sahih al-Bukhari 6324 ⓘ",
    context: "Au moment de se coucher",
    propheticEvidenceType: "A",
    primarySource: "Sahih al-Bukhari",
    collection: "Sahih al-Bukhari",
    hadithNumber: "6324",
    narrator: "Hudhayfa ibn al-Yaman (رضي الله عنه)",
    authenticityGrade: "Sahih (recueil authentique par consensus)",
    authenticityGrader: "Al-Bukhari",
    evidenceSummaryFr:
      "Pratique personnelle et régulière du Prophète ﷺ rapportée directement (type A).",
    validationStatus: "verified_source",
  },
  {
    id: "coucher-5",
    category: "coucher",
    title: "Allahumma aslamtu wajhi ilayka (avec wudu)",
    titleAr: "اللهم أسلمت وجهي إليك",
    arabic:
      "اللَّهُمَّ أَسْلَمْتُ وَجْهِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ",
    phonetic:
      "Allâhumma aslamtu wajhî ilayk, wa fawwadtu amrî ilayk, wa alja'tu zahrî ilayk, raghbatan wa rahbatan ilayk, lâ malja'a wa lâ manjâ minka illâ ilayk, âmantu bi kitâbika-lladhî anzalt, wa bi nabiyyika-lladhî arsalt",
    translation:
      "Ô Allah, je remets mon visage à Toi, je confie mon affaire à Toi, j'adosse mon dos à Toi, par désir et par crainte de Toi. Il n'y a nul refuge ni nul salut de Toi si ce n'est auprès de Toi. Je crois en Ton Livre que Tu as révélé et en Ton prophète que Tu as envoyé.",
    repetitions: 1,
    explanation:
      "Le Prophète ﷺ dit à Al-Bara' ibn Azib : « Quand tu vas te coucher, fais tes ablutions comme pour la prière, puis allonge-toi sur ton côté droit et dis cette invocation. Si tu meurs [cette nuit], tu meurs sur la Fitra (la nature saine de l'Islam) ; fais-en tes dernières paroles. » Al-Bara' ayant voulu répéter « et en Ton messager que Tu as envoyé », le Prophète ﷺ le corrigea : « Non, dis : en Ton prophète que Tu as envoyé. »",
    merits: "",
    reference: "Source : Sahih al-Bukhari 6311 ⓘ",
    context: "Au coucher, après les ablutions",
    propheticEvidenceType: "B",
    primarySource: "Sahih al-Bukhari",
    collection: "Sahih al-Bukhari",
    hadithNumber: "6311",
    narrator: "Al-Bara' ibn Azib (رضي الله عنهما)",
    authenticityGrade: "Sahih (recueil authentique par consensus)",
    authenticityGrader: "Al-Bukhari",
    evidenceSummaryFr:
      "Enseignement direct et personnalisé du Prophète ﷺ à Al-Bara' ibn Azib (type B), avec la formulation arabe exacte confirmée par le Prophète lui-même face à une variante proposée par le narrateur.",
    validationStatus: "verified_source",
  },
  {
    id: "coucher-6",
    category: "coucher",
    title: "Subhanaka Allahumma Rabbi (allongement sur le côté droit)",
    titleAr: "سبحانك اللهم ربي بك وضعت جنبي",
    arabic:
      "سُبْحَانَكَ اللَّهُمَّ رَبِّي بِكَ وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَاغْفِرْ لَهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
    phonetic:
      "Subhânaka Allâhumma Rabbî, bika wada'tu janbî wa bika arfa'uh, in amsakta nafsî fa-ghfir lahâ, wa in arsaltahâ fa-hfazhâ bimâ tahfazu bihi 'ibâdaka-s-sâlihîn",
    translation:
      "Gloire à Toi, ô Allah mon Seigneur ! C'est par Toi que je pose mon flanc et par Toi que je le relève. Si Tu retiens mon âme, pardonne-lui ; et si Tu la renvoies, préserve-la comme Tu préserves Tes serviteurs vertueux.",
    repetitions: 1,
    explanation:
      "Le Prophète ﷺ enseigna que lorsqu'on va se coucher, on doit secouer sa literie avec le pan de son vêtement, invoquer le nom d'Allah, puis, en s'allongeant sur le côté droit, prononcer cette invocation.",
    merits: "",
    reference: "Source : Sahih Muslim 2714a ⓘ",
    context: "Au coucher, en s'allongeant sur le côté droit",
    propheticEvidenceType: "A",
    primarySource: "Sahih Muslim",
    collection: "Sahih Muslim",
    hadithNumber: "2714a",
    narrator: "Abu Hurayra (رضي الله عنه)",
    authenticityGrade: "Sahih (recueil authentique par consensus)",
    authenticityGrader: "Muslim",
    evidenceSummaryFr:
      "Instruction générale du Prophète ﷺ rapportée par Abu Hurayra (« إذا أوى أحدكم إلى فراشه » — quand l'un de vous va se coucher), type A.",
    validationStatus: "verified_source",
  },
  {
    id: "coucher-7",
    category: "coucher",
    title: "Allahumma khalaqta nafsi",
    titleAr: "اللهم خلقت نفسي وأنت توفاها",
    arabic:
      "اللَّهُمَّ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ",
    phonetic:
      "Allâhumma khalaqta nafsî wa anta tawaffâhâ, laka mamâtuhâ wa mahyâhâ, in ahyaytahâ fa-hfazhâ, wa in amattahâ fa-ghfir lahâ, Allâhumma innî as'aluka-l-'âfiya",
    translation:
      "Ô Allah, Tu as créé mon âme et c'est Toi qui la reprends ; à Toi sa mort et sa vie. Si Tu la fais vivre, préserve-la ; et si Tu la fais mourir, pardonne-lui. Ô Allah, je Te demande la préservation.",
    repetitions: 1,
    explanation:
      "Abdullah ibn Umar rapporte cette invocation directement du Messager d'Allah ﷺ (« d'un meilleur que Umar : le Messager d'Allah ﷺ ») pour celui qui va se coucher.",
    merits: "",
    reference: "Source : Sahih Muslim 2712 ⓘ",
    context: "Au coucher",
    propheticEvidenceType: "A",
    primarySource: "Sahih Muslim",
    collection: "Sahih Muslim",
    hadithNumber: "2712",
    narrator: "Abdullah ibn Umar (رضي الله عنهما)",
    authenticityGrade: "Sahih (recueil authentique par consensus)",
    authenticityGrader: "Muslim",
    evidenceSummaryFr:
      "Ibn Umar précise explicitement dans le hadith tenir cette parole du Messager d'Allah ﷺ lui-même, et non de son père Umar — type A.",
    validationStatus: "verified_source",
  },
  {
    id: "coucher-8",
    category: "coucher",
    title: "Les deux derniers versets d'Al-Baqara (2:285-286)",
    titleAr: "آخر آيتين من سورة البقرة",
    arabic:
      "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ ... لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ ... فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    phonetic: "Âmana-r-Rasûlu bimâ unzila ilayhi min Rabbihi wal-Mu'minûn… (2:285-286, en entier)",
    translation:
      "Le Messager a cru en ce qui a été descendu vers lui venant de son Seigneur, de même que les croyants... [jusqu'à] secours-nous contre les gens mécréants.",
    repetitions: 1,
    explanation:
      "Le Prophète ﷺ a dit : « Quiconque récite les deux versets à la fin de Sourate Al-Baqara durant une nuit, cela lui suffit. »",
    merits:
      "La preuve établit la récitation « durant une nuit » — elle n'établit pas que le Prophète ﷺ les récitait systématiquement juste avant de dormir en particulier.",
    reference: "Source : Sahih al-Bukhari 5009 ⓘ",
    context: "Durant la nuit",
    propheticEvidenceType: "A",
    primarySource: "Sahih al-Bukhari",
    collection: "Sahih al-Bukhari",
    hadithNumber: "5009",
    narrator: "Abu Mas'ud al-Ansari (رضي الله عنه)",
    authenticityGrade: "Sahih (recueil authentique par consensus)",
    authenticityGrader: "Al-Bukhari",
    evidenceSummaryFr:
      "Parole directe du Prophète ﷺ (« qâla an-nabiyyu ﷺ »), portée exacte conservée : « fî laylatin » (durant une nuit), jamais élargie à « juste avant de dormir ».",
    validationStatus: "verified_source",
  },
];

export const sortieAdhkar: Dhikr[] = [
  {
    id: "sortie-1",
    category: "sortie",
    title: "Bismillah, tawakkaltu 'ala Allah",
    titleAr: "بسم الله توكلت على الله",
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    phonetic: "Bismillâhi tawakkaltu 'ala-llâhi, lâ hawla wa lâ quwwata illâ billâh",
    translation:
      "Au nom d'Allah, je place ma confiance en Allah. Il n'y a de force ni de puissance qu'en Allah.",
    repetitions: 1,
    explanation:
      "Le Prophète ﷺ a dit : « Quand un homme sort de sa maison et dit cette invocation, il lui est dit à cet instant : tu es guidé, épargné et protégé, et les démons s'éloignent de lui. »",
    merits: "",
    reference: "Source : Sunan Abi Dawud 5095 ⓘ",
    context: "En sortant de la maison",
    propheticEvidenceType: "A",
    primarySource: "Sunan Abi Dawud",
    collection: "Sunan Abi Dawud",
    hadithNumber: "5095",
    narrator: "Anas ibn Malik (رضي الله عنه)",
    authenticityGrade: "Sahih (jugé par Al-Albani)",
    authenticityGrader: "Al-Albani",
    evidenceSummaryFr:
      "Parole directe du Prophète ﷺ rapportée par Anas ibn Malik, formule générale (type A).",
    validationStatus: "verified_source",
  },
  {
    id: "sortie-2",
    category: "sortie",
    title: "Allahumma inni a'udhu bika an adilla",
    titleAr: "اللهم إني أعوذ بك أن أضل أو أضل",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أَضِلَّ أَوْ أُضَلَّ، أَوْ أَزِلَّ أَوْ أُزَلَّ، أَوْ أَظْلِمَ أَوْ أُظْلَمَ، أَوْ أَجْهَلَ أَوْ يُجْهَلَ عَلَيَّ",
    phonetic:
      "Allâhumma innî a'ûdhu bika an adilla aw udall, aw azilla aw uzall, aw azlima aw uzlam, aw ajhala aw yujhala 'alayy",
    translation:
      "Ô Allah, je cherche refuge auprès de Toi contre le fait de m'égarer ou d'être égaré, de faillir ou d'être mis en faute, de commettre une injustice ou d'en subir une, d'agir par ignorance ou qu'on agisse ainsi envers moi.",
    repetitions: 1,
    explanation:
      "Umm Salama, épouse du Prophète ﷺ, rapporte que chaque fois qu'il sortait de chez elle, il levait son regard vers le ciel et prononçait cette invocation.",
    merits: "",
    reference: "Source : Sunan Abi Dawud 5094 ⓘ",
    context: "En sortant de la maison",
    propheticEvidenceType: "A",
    primarySource: "Sunan Abi Dawud",
    collection: "Sunan Abi Dawud",
    hadithNumber: "5094",
    narrator: "Umm Salama (رضي الله عنها)",
    authenticityGrade: "Sahih (jugé par Al-Albani)",
    authenticityGrader: "Al-Albani",
    evidenceSummaryFr:
      "Pratique personnelle et régulière du Prophète ﷺ, décrite directement par Umm Salama qui l'observait à chaque sortie (type A). Également rapporté par At-Tirmidhi, An-Nasa'i et Ibn Majah.",
    validationStatus: "verified_source",
  },
];

/**
 * Voyage — organisé par MOMENT (jamais une liste mélangée). L'ordre des
 * entrées EST l'organisation : départ/montée → pendant le trajet →
 * ascension/descente → halte → adieux/provision → retour.
 */
export const voyageAdhkar: Dhikr[] = [
  {
    id: "voyage-1",
    category: "voyage",
    title: "Takbir et invocation du départ (en montant sur le moyen de transport)",
    titleAr: "دعاء ركوب السفر",
    arabic:
      "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ، اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ، وَكَآبَةِ الْمَنْظَرِ، وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ",
    phonetic:
      "Allâhu akbar, Allâhu akbar, Allâhu akbar. Subhâna-lladhî sakhkhara lanâ hâdhâ wa mâ kunnâ lahu muqrinîn, wa innâ ilâ Rabbinâ la-munqalibûn. Allâhumma innâ nas'aluka fî safarinâ hâdha-l-birra wa-t-taqwâ, wa mina-l-'amali mâ tardâ. Allâhumma hawwin 'alaynâ safaranâ hâdhâ wa-twi 'annâ bu'dah. Allâhumma anta-s-sâhibu fi-s-safari wa-l-khalîfatu fi-l-ahl. Allâhumma innî a'ûdhu bika min wa'thâ'i-s-safar, wa kâ'abati-l-manzar, wa sû'i-l-munqalabi fi-l-mâli wa-l-ahl",
    translation:
      "Allah est le Plus Grand (3 fois). Gloire à Celui qui a mis ceci à notre service, alors que nous n'aurions pu le dominer par nous-mêmes ; et c'est vers notre Seigneur que nous retournerons. Ô Allah, nous Te demandons, dans ce voyage, la bonté et la piété, et l'œuvre qui Te satisfait. Ô Allah, facilite-nous ce voyage et raccourcis-en la distance. Ô Allah, Tu es le Compagnon du voyage et le Gardien de la famille [laissée derrière]. Ô Allah, je cherche refuge auprès de Toi contre les difficultés du voyage, la tristesse de ce qu'on y voit, et un mauvais retour concernant les biens et la famille.",
    repetitions: 1,
    explanation:
      "Ibn Umar (qu'Allah les agrée, lui et son père) rapporte que lorsque le Prophète ﷺ s'installait sur sa monture en sortant pour un voyage, il disait le takbir trois fois, puis cette invocation complète.",
    merits: "",
    reference: "Source : Sahih Muslim 1342 ⓘ",
    context: "Au départ, en montant sur le moyen de transport",
    propheticEvidenceType: "A",
    primarySource: "Sahih Muslim",
    collection: "Sahih Muslim",
    hadithNumber: "1342",
    narrator: "Abdullah ibn Umar (رضي الله عنهما)",
    authenticityGrade: "Sahih (recueil authentique par consensus)",
    authenticityGrader: "Muslim",
    evidenceSummaryFr:
      "Pratique régulière et complète du Prophète ﷺ rapportée par Ibn Umar (« kâna idhâ... » — il faisait ainsi chaque fois), type A. Texte intégral repris directement de la narration, sans coupure.",
    validationStatus: "verified_source",
  },
  {
    id: "voyage-2",
    category: "voyage",
    title: "Takbir en montant, tasbih en descendant",
    titleAr: "التكبير عند الصعود والتسبيح عند النزول",
    arabic: "اللَّهُ أَكْبَرُ (عند الصعود) — سُبْحَانَ اللَّهِ (عند النزول)",
    phonetic: "Allâhu akbar (en montant) — Subhâna-llâh (en descendant)",
    translation: "Allah est le Plus Grand (en montant) — Gloire à Allah (en descendant).",
    repetitions: 1,
    explanation:
      "Jabir ibn Abdullah (qu'Allah l'agrée) rapporte : « Nous disions le takbir quand nous montions [une hauteur], et nous disions le tasbih quand nous descendions. »",
    merits: "",
    reference: "Source : Sahih al-Bukhari 2993 ⓘ",
    context: "En chemin — montées et descentes du trajet",
    propheticEvidenceType: "C",
    primarySource: "Sahih al-Bukhari",
    collection: "Sahih al-Bukhari",
    hadithNumber: "2993",
    narrator: "Jabir ibn Abdullah (رضي الله عنهما)",
    authenticityGrade: "Sahih (recueil authentique par consensus)",
    authenticityGrader: "Al-Bukhari",
    evidenceSummaryFr:
      "Jabir décrit une pratique collective des Compagnons pendant les déplacements avec le Prophète ﷺ (« kunnâ... » — NOUS faisions), donc de type C (pratique des Compagnons) et non une parole du Prophète ﷺ lui-même.",
    validationStatus: "verified_source",
  },
  {
    id: "voyage-3",
    category: "voyage",
    title: "Invocation en s'arrêtant dans un lieu",
    titleAr: "دعاء النزول في منزل",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    phonetic: "A'ûdhu bi kalimâti-llâhi-t-tâmmâti min sharri mâ khalaq",
    translation:
      "Je cherche refuge dans les paroles parfaites d'Allah contre le mal de ce qu'Il a créé.",
    repetitions: 1,
    explanation:
      "Khawla bint Hakim rapporte avoir entendu le Messager d'Allah ﷺ dire : « Quiconque s'arrête en un lieu puis dit cette invocation, rien ne lui nuira jusqu'à ce qu'il reparte de ce lieu. »",
    merits: "",
    reference: "Source : Sahih Muslim 2708a ⓘ",
    context: "En s'arrêtant dans un lieu, pendant le trajet",
    propheticEvidenceType: "A",
    primarySource: "Sahih Muslim",
    collection: "Sahih Muslim",
    hadithNumber: "2708a",
    narrator: "Khawla bint Hakim (رضي الله عنها)",
    authenticityGrade: "Sahih (recueil authentique par consensus)",
    authenticityGrader: "Muslim",
    evidenceSummaryFr:
      "Parole directe du Prophète ﷺ rapportée par Khawla bint Hakim, formule générale (type A).",
    validationStatus: "verified_source",
  },
  {
    id: "voyage-4",
    category: "voyage",
    title: "Adieu à celui qui part en voyage",
    titleAr: "توديع المسافر",
    arabic: "أَسْتَوْدِعُ اللَّهَ دِينَكَ، وَأَمَانَتَكَ، وَخَوَاتِيمَ عَمَلِكَ",
    phonetic: "Astawdi'u-llâha dînaka, wa amânataka, wa khawâtîma 'amalik",
    translation:
      "Je confie à Allah ta religion, ta responsabilité (ce qui t'est confié) et la fin de tes œuvres.",
    repetitions: 1,
    explanation:
      "Salim rapporte que son père, Ibn Umar (qu'Allah les agrée), disait à un homme qui partait en voyage : « Approche, que je te fasse mes adieux comme le Messager d'Allah ﷺ nous faisait ses adieux », puis prononçait cette invocation.",
    merits: "",
    reference: "Source : Jami' at-Tirmidhi 3443 ⓘ",
    context: "Adieu à un proche qui part en voyage (dit par celui qui reste)",
    propheticEvidenceType: "A",
    primarySource: "Jami' at-Tirmidhi",
    collection: "Jami' at-Tirmidhi",
    hadithNumber: "3443",
    narrator: "Ibn Umar (رضي الله عنهما), via son fils Salim",
    authenticityGrade: "Hasan Sahih Gharib",
    authenticityGrader: "At-Tirmidhi",
    evidenceSummaryFr:
      "Ibn Umar précise explicitement reproduire la pratique du Prophète ﷺ envers ses Compagnons (« comme le Messager d'Allah ﷺ nous faisait ses adieux ») — type A rapporté via un Compagnon.",
    validationStatus: "verified_source",
  },
  {
    id: "voyage-5",
    category: "voyage",
    title: "Invocation du Prophète ﷺ pour un voyageur (provision)",
    titleAr: "زودك الله التقوى",
    arabic:
      "زَوَّدَكَ اللَّهُ التَّقْوَى، وَغَفَرَ ذَنْبَكَ، وَيَسَّرَ لَكَ الْخَيْرَ حَيْثُمَا كُنْتَ",
    phonetic: "Zawwadaka-llâhu-t-taqwâ, wa ghafara dhanbak, wa yassara laka-l-khayra haythumâ kunt",
    translation:
      "Qu'Allah te pourvoie de piété comme provision, qu'Il pardonne ton péché, et qu'Il te facilite le bien où que tu sois.",
    repetitions: 1,
    explanation:
      "Anas (qu'Allah l'agrée) rapporte qu'un homme vint trouver le Prophète ﷺ en lui disant : « Ô Messager d'Allah, je veux voyager, donne-moi des provisions. » Le Prophète ﷺ lui répondit avec cette invocation, en l'complétant à sa demande.",
    merits: "",
    reference: "Source : Jami' at-Tirmidhi 3444 ⓘ",
    context: "Invocation faite pour un voyageur, à sa demande",
    propheticEvidenceType: "B",
    primarySource: "Jami' at-Tirmidhi",
    collection: "Jami' at-Tirmidhi",
    hadithNumber: "3444",
    narrator: "Anas ibn Malik (رضي الله عنه)",
    authenticityGrade: "Hasan Gharib",
    authenticityGrader: "At-Tirmidhi",
    evidenceSummaryFr:
      "Le Prophète ﷺ répond directement à une demande précise d'un compagnon voyageur — type B (enseigné/adressé à une personne dans un contexte donné).",
    validationStatus: "verified_source",
  },
  {
    id: "voyage-6",
    category: "voyage",
    title: "Invocation du retour de voyage",
    titleAr: "دعاء الرجوع من السفر",
    arabic:
      "آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ (avec la même invocation qu'au départ)",
    phonetic: "Âyibûna tâ'ibûna 'âbidûna li-Rabbinâ hâmidûn",
    translation:
      "Nous revenons, repentants, adorateurs, à notre Seigneur reconnaissants — (récitée avec la même invocation qu'au départ).",
    repetitions: 1,
    explanation:
      "Selon le même hadith d'Ibn Umar : au retour, le Prophète ﷺ répétait l'invocation complète du départ (takbir puis « Subhana-lladhi sakhkhara lana hadha... »), en y ajoutant ces mots.",
    merits: "",
    reference: "Source : Sahih Muslim 1342 ⓘ",
    context: "Au retour de voyage",
    propheticEvidenceType: "A",
    primarySource: "Sahih Muslim",
    collection: "Sahih Muslim",
    hadithNumber: "1342",
    narrator: "Abdullah ibn Umar (رضي الله عنهما)",
    authenticityGrade: "Sahih (recueil authentique par consensus)",
    authenticityGrader: "Muslim",
    evidenceSummaryFr:
      "Même hadith que l'invocation de départ (voyage-1) : le texte précise explicitement « et quand il revenait, il les disait, en y ajoutant... » — portée conservée fidèlement, pas une invocation distincte inventée.",
    sourceIds: ["voyage-1"],
    validationStatus: "verified_source",
  },
];
