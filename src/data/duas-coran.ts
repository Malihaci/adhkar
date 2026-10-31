/**
 * Duʿāʾ du Coran — invocations des croyants, des prophètes et des anges
 * rapportées dans le Coran. Le texte arabe est celui du Mushaf (édition
 * Uthmani de l'API alquran.cloud), découpé mot pour mot ; la traduction est
 * celle de Muhammad Hamidullah (édition française déjà utilisée par l'app),
 * découpée à l'identique sans aucune reformulation. Les phonétiques sont
 * rédigées avec la même convention que les adhkār et restent à relire.
 * `verseKeys` = āyāt entières récitées par l'audio (même moteur que les
 * adhkār coraniques) : l'audio peut réciter la phrase qui introduit
 * l'invocation. Fichier généré : ne pas éditer à la main sans relire la source.
 */
import type { Dhikr } from "@/data/adhkar";

export const DUA_THEMES: { key: string; label: string; ar: string }[] = [
  {
    "key": "guidance",
    "label": "Guidance et fermeté",
    "ar": "الهداية والثبات"
  },
  {
    "key": "pardon",
    "label": "Pardon et repentir",
    "ar": "المغفرة والتوبة"
  },
  {
    "key": "dunya",
    "label": "Ici-bas et au-delà",
    "ar": "الدنيا والآخرة"
  },
  {
    "key": "famille",
    "label": "Famille et descendance",
    "ar": "الأهل والذرية"
  },
  {
    "key": "epreuve",
    "label": "Épreuve, patience et victoire",
    "ar": "الابتلاء والنصر"
  },
  {
    "key": "science",
    "label": "Science et sagesse",
    "ar": "العلم والحكمة"
  },
  {
    "key": "refuge",
    "label": "Protection et refuge",
    "ar": "الاستعاذة والحماية"
  },
  {
    "key": "rizq",
    "label": "Subsistance et gratitude",
    "ar": "الرزق والشكر"
  },
  {
    "key": "detresse",
    "label": "Détresse et besoin",
    "ar": "الشدة والحاجة"
  },
  {
    "key": "foi",
    "label": "Foi, soumission et confiance",
    "ar": "الإيمان والتوكل"
  }
];

export const duasCoran: Dhikr[] = [
  {
    "id": "dua-fatiha-hidaya",
    "category": "dua_coran",
    "theme": "guidance",
    "title": "Guide-nous dans le droit chemin",
    "arabic": "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ • صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
    "phonetic": "Ihdina-s-sirâta-l-mustaqîm, sirâta-lladhîna an'amta 'alayhim, ghayri-l-maghdûbi 'alayhim wa lâ-d-dâllîn.",
    "translation": "Guide-nous dans le droit chemin, le chemin de ceux que Tu as comblés de faveurs, non pas de ceux qui ont encouru Ta colère, ni des égarés.",
    "repetitions": 1,
    "explanation": "On demande à Allah la guidance sur le chemin droit, celui des croyants comblés de faveurs.",
    "merits": "",
    "reference": "Coran 1:6-7 · traduction de Muhammad Hamidullah",
    "context": "Sourate Al-Fâtiha, récitée dans chaque unité de prière.",
    "verseKeys": [
      "1:6",
      "1:7"
    ]
  },
  {
    "id": "dua-ibrahim-baladan-aminan",
    "category": "dua_coran",
    "theme": "rizq",
    "title": "Sécurité pour La Mecque",
    "arabic": "رَبِّ ٱجْعَلْ هَٰذَا بَلَدًا ءَامِنًۭا وَٱرْزُقْ أَهْلَهُۥ مِنَ ٱلثَّمَرَٰتِ مَنْ ءَامَنَ مِنْهُم بِٱللَّهِ وَٱلْيَوْمِ ٱلْءَاخِرِ",
    "phonetic": "Rabbi-j'al hâdhâ baladan âminan wa-rzuq ahlahu mina-th-thamarâti man âmana minhum bi-llâhi wa-l-yawmi-l-âkhir.",
    "translation": "O mon Seigneur, fais de cette cité un lieu de sécurité, et fais attribution des fruits à ceux qui parmi ses habitants auront cru en Allah et au Jour dernier.",
    "repetitions": 1,
    "explanation": "Il demande la sécurité pour la cité et des fruits pour ses habitants croyants.",
    "merits": "",
    "reference": "Coran 2:126 · traduction de Muhammad Hamidullah",
    "context": "Invocation d'Ibrâhîm ﷺ pour la ville de La Mecque.",
    "verseKeys": [
      "2:126"
    ]
  },
  {
    "id": "dua-ibrahim-ismail-taqabbal",
    "category": "dua_coran",
    "theme": "foi",
    "title": "Accepte de nous",
    "arabic": "رَبَّنَا تَقَبَّلْ مِنَّآ إِنَّكَ أَنتَ ٱلسَّمِيعُ ٱلْعَلِيمُ • رَبَّنَا وَٱجْعَلْنَا مُسْلِمَيْنِ لَكَ وَمِن ذُرِّيَّتِنَآ أُمَّةًۭ مُّسْلِمَةًۭ لَّكَ وَأَرِنَا مَنَاسِكَنَا وَتُبْ عَلَيْنَآ إِنَّكَ أَنتَ ٱلتَّوَّابُ ٱلرَّحِيمُ",
    "phonetic": "Rabbanâ taqabbal minnâ, innaka Anta-s-Samî'u-l-'Alîm. Rabbanâ wa-j'alnâ muslimayni laka wa min dhurriyyatinâ ummatan muslimatan laka, wa arinâ manâsikanâ wa tub 'alaynâ, innaka Anta-t-Tawwâbu-r-Rahîm.",
    "translation": "O notre Seigneur, accepte ceci de notre part! Car c'est Toi l'Audient, l'Omniscient. Notre Seigneur! Fais de nous Tes Soumis, et de notre descendance une communauté soumise à Toi. Et montre nous nos rites et accepte de nous le repentir. Car c'est Toi certes l'Accueillant au repentir, le Miséricordieux.",
    "repetitions": 1,
    "explanation": "Ils demandent qu'Allah accepte leur œuvre, qu'ils Lui soient soumis ainsi que leur descendance, et qu'Il accueille leur repentir.",
    "merits": "",
    "reference": "Coran 2:127-128 · traduction de Muhammad Hamidullah",
    "context": "Invocation d'Ibrâhîm et d'Ismâ'îl ﷺ en élevant les assises de la Maison (la Ka'ba).",
    "verseKeys": [
      "2:127",
      "2:128"
    ]
  },
  {
    "id": "dua-ibrahim-ba-ath-rasul",
    "category": "dua_coran",
    "theme": "science",
    "title": "Envoie un messager parmi eux",
    "arabic": "رَبَّنَا وَٱبْعَثْ فِيهِمْ رَسُولًۭا مِّنْهُمْ يَتْلُوا۟ عَلَيْهِمْ ءَايَٰتِكَ وَيُعَلِّمُهُمُ ٱلْكِتَٰبَ وَٱلْحِكْمَةَ وَيُزَكِّيهِمْ إِنَّكَ أَنتَ ٱلْعَزِيزُ ٱلْحَكِيمُ",
    "phonetic": "Rabbanâ wab'ath fîhim rasûlan minhum yatlû 'alayhim âyâtika wa yu'allimuhumu-l-kitâba wa-l-hikmata wa yuzakkîhim, innaka Anta-l-'Azîzu-l-Hakîm.",
    "translation": "Notre Seigneur! Envoie l'un des leurs comme messager parmi eux, pour leur réciter Tes versets, leur enseigner le Livre et la Sagesse, et les purifier. Car c'est Toi certes le Puissant, le Sage!",
    "repetitions": 1,
    "explanation": "Ils demandent l'envoi d'un messager parmi eux, qui récite les versets, enseigne le Livre et la Sagesse et purifie.",
    "merits": "",
    "reference": "Coran 2:129 · traduction de Muhammad Hamidullah",
    "context": "Suite de l'invocation d'Ibrâhîm et d'Ismâ'îl ﷺ.",
    "verseKeys": [
      "2:129"
    ]
  },
  {
    "id": "dua-baqara-hasana",
    "category": "dua_coran",
    "theme": "dunya",
    "title": "Belle part ici-bas et dans l'au-delà",
    "arabic": "رَبَّنَآ ءَاتِنَا فِى ٱلدُّنْيَا حَسَنَةًۭ وَفِى ٱلْءَاخِرَةِ حَسَنَةًۭ وَقِنَا عَذَابَ ٱلنَّارِ",
    "phonetic": "Rabbanâ âtinâ fi-d-dunyâ hasanatan wa fi-l-âkhirati hasanatan wa qinâ 'adhâba-n-nâr.",
    "translation": "Seigneur! Accorde nous belle part ici-bas, et belle part aussi dans l'au-delà; et protège-nous du châtiment du Feu!",
    "repetitions": 1,
    "explanation": "Une invocation complète : le bien de cette vie, le bien de l'au-delà et la protection du Feu.",
    "merits": "",
    "reference": "Coran 2:201 · traduction de Muhammad Hamidullah",
    "context": "Parole de ceux qui demandent à Allah le bien des deux mondes.",
    "verseKeys": [
      "2:201"
    ]
  },
  {
    "id": "dua-talut-sabr",
    "category": "dua_coran",
    "theme": "epreuve",
    "title": "Endurance et fermeté",
    "arabic": "رَبَّنَآ أَفْرِغْ عَلَيْنَا صَبْرًۭا وَثَبِّتْ أَقْدَامَنَا وَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَٰفِرِينَ",
    "phonetic": "Rabbanâ afrigh 'alaynâ sabran wa thabbit aqdâmanâ wa-nsurnâ 'ala-l-qawmi-l-kâfirîn.",
    "translation": "Seigneur! Déverse sur nous l'endurance, affermis nos pas et donne-nous la victoire sur ce peuple infidèle.",
    "repetitions": 1,
    "explanation": "Ils demandent l'endurance, la fermeté des pas et le secours contre leurs ennemis.",
    "merits": "",
    "reference": "Coran 2:250 · traduction de Muhammad Hamidullah",
    "context": "Invocation des soldats de Tâlût (Saül) face à Jâlût (Goliath).",
    "verseKeys": [
      "2:250"
    ]
  },
  {
    "id": "dua-baqara-sami-na",
    "category": "dua_coran",
    "theme": "foi",
    "title": "Nous avons entendu et obéi",
    "arabic": "سَمِعْنَا وَأَطَعْنَا غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ ٱلْمَصِيرُ",
    "phonetic": "Sami'nâ wa ata'nâ, ghufrânaka Rabbanâ wa ilayka-l-masîr.",
    "translation": "Nous avons entendu et obéi. Seigneur, nous implorons Ton pardon. C'est à Toi que sera le retour.",
    "repetitions": 1,
    "explanation": "Expression de la soumission des croyants et demande de pardon, avec le rappel que tout retour est vers Allah.",
    "merits": "",
    "reference": "Coran 2:285 · traduction de Muhammad Hamidullah",
    "context": "Parole des croyants, dans l'avant-dernière āyah d'Al-Baqara.",
    "verseKeys": [
      "2:285"
    ]
  },
  {
    "id": "dua-baqara-la-tu-akhidhna",
    "category": "dua_coran",
    "theme": "pardon",
    "title": "Ne nous charge pas au-delà de nos forces",
    "arabic": "رَبَّنَا لَا تُؤَاخِذْنَآ إِن نَّسِينَآ أَوْ أَخْطَأْنَا رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَآ إِصْرًۭا كَمَا حَمَلْتَهُۥ عَلَى ٱلَّذِينَ مِن قَبْلِنَا رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِۦ وَٱعْفُ عَنَّا وَٱغْفِرْ لَنَا وَٱرْحَمْنَآ أَنتَ مَوْلَىٰنَا فَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَٰفِرِينَ",
    "phonetic": "Rabbanâ lâ tu'âkhidhnâ in nasînâ aw akhta'nâ. Rabbanâ wa lâ tahmil 'alaynâ isran kamâ hamaltahu 'alâ-lladhîna min qablinâ. Rabbanâ wa lâ tuhammilnâ mâ lâ tâqata lanâ bih, wa'fu 'annâ wa-ghfir lanâ wa-rhamnâ, Anta mawlânâ fa-nsurnâ 'ala-l-qawmi-l-kâfirîn.",
    "translation": "Seigneur, ne nous châtie pas s'il nous arrive d'oublier ou de commettre une erreur. Seigneur! Ne nous charge pas d'un fardeau lourd comme Tu as chargé ceux qui vécurent avant nous. Seigneur! Ne nous impose pas ce que nous ne pouvons supporter, efface nos fautes, pardonne-nous et fais nous miséricorde. Tu es Notre Maître, accorde-nous donc la victoire sur les peuples infidèles.",
    "repetitions": 1,
    "explanation": "Demande d'indulgence pour les oublis et les erreurs, d'allègement des charges, de pardon, de miséricorde et de secours.",
    "merits": "",
    "reference": "Coran 2:286 · traduction de Muhammad Hamidullah",
    "context": "Dernière āyah d'Al-Baqara.",
    "verseKeys": [
      "2:286"
    ]
  },
  {
    "id": "dua-imran-la-tuzigh",
    "category": "dua_coran",
    "theme": "guidance",
    "title": "Ne laisse pas dévier nos cœurs",
    "arabic": "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ ٱلْوَهَّابُ • رَبَّنَآ إِنَّكَ جَامِعُ ٱلنَّاسِ لِيَوْمٍۢ لَّا رَيْبَ فِيهِ إِنَّ ٱللَّهَ لَا يُخْلِفُ ٱلْمِيعَادَ",
    "phonetic": "Rabbanâ lâ tuzigh qulûbanâ ba'da idh hadaytanâ wa hab lanâ min ladunka rahmah, innaka Anta-l-Wahhâb. Rabbanâ innaka jâmi'u-n-nâsi li-yawmin lâ rayba fîh, inna-llâha lâ yukhlifu-l-mî'âd.",
    "translation": "Seigneur! Ne laisse pas dévier nos cœurs après que Tu nous aies guidés; et accorde-nous Ta miséricorde. C'est Toi, certes, le Grand Donateur! Seigneur! C'est Toi qui rassembleras les gens, un jour - en quoi il n'y a point de doute - Allah, vraiment, ne manque jamais à Sa promesse.",
    "repetitions": 1,
    "explanation": "Demande de rester sur la guidance, avec le rappel que le Jour du rassemblement est certain.",
    "merits": "",
    "reference": "Coran 3:8-9 · traduction de Muhammad Hamidullah",
    "context": "Parole de ceux qui sont ancrés dans la science (Âl 'Imrân).",
    "verseKeys": [
      "3:8",
      "3:9"
    ]
  },
  {
    "id": "dua-imran-innana-amanna",
    "category": "dua_coran",
    "theme": "pardon",
    "title": "Pardonne-nous nos péchés",
    "arabic": "رَبَّنَآ إِنَّنَآ ءَامَنَّا فَٱغْفِرْ لَنَا ذُنُوبَنَا وَقِنَا عَذَابَ ٱلنَّارِ",
    "phonetic": "Rabbanâ innanâ âmannâ fa-ghfir lanâ dhunûbanâ wa qinâ 'adhâba-n-nâr.",
    "translation": "O notre Seigneur, nous avons la foi; pardonne-nous donc nos péchés, et protège-nous du châtiment du Feu.",
    "repetitions": 1,
    "explanation": "Foi affirmée, demande de pardon et de protection du châtiment du Feu.",
    "merits": "",
    "reference": "Coran 3:16 · traduction de Muhammad Hamidullah",
    "context": "Parole des pieux (Âl 'Imrân).",
    "verseKeys": [
      "3:16"
    ]
  },
  {
    "id": "dua-imran-malik-al-mulk",
    "category": "dua_coran",
    "theme": "foi",
    "title": "Ô Allah, Maître de l'autorité absolue",
    "arabic": "ٱللَّهُمَّ مَٰلِكَ ٱلْمُلْكِ تُؤْتِى ٱلْمُلْكَ مَن تَشَآءُ وَتَنزِعُ ٱلْمُلْكَ مِمَّن تَشَآءُ وَتُعِزُّ مَن تَشَآءُ وَتُذِلُّ مَن تَشَآءُ بِيَدِكَ ٱلْخَيْرُ إِنَّكَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌۭ • تُولِجُ ٱلَّيْلَ فِى ٱلنَّهَارِ وَتُولِجُ ٱلنَّهَارَ فِى ٱلَّيْلِ وَتُخْرِجُ ٱلْحَىَّ مِنَ ٱلْمَيِّتِ وَتُخْرِجُ ٱلْمَيِّتَ مِنَ ٱلْحَىِّ وَتَرْزُقُ مَن تَشَآءُ بِغَيْرِ حِسَابٍۢ",
    "phonetic": "Allâhumma Mâlika-l-mulk, tu'tî-l-mulka man tashâ'u wa tanzi'u-l-mulka mimman tashâ', wa tu'izzu man tashâ'u wa tudhillu man tashâ', bi-yadika-l-khayr, innaka 'alâ kulli shay'in qadîr. Tûliju-l-layla fi-n-nahâri wa tûliju-n-nahâra fi-l-layl, wa tukhriju-l-hayya mina-l-mayyiti wa tukhriju-l-mayyita mina-l-hayy, wa tarzuqu man tashâ'u bi-ghayri hisâb.",
    "translation": "O Allah, Maître de l'autorité absolue. Tu donnes l'autorité à qui Tu veux, et Tu arraches l'autorité à qui Tu veux; et Tu donnes la puissance à qui Tu veux, et Tu humilies qui Tu veux. Le bien est en Ta main et Tu es Omnipotent. Tu fais pénétrer la nuit dans le jour, et Tu fais pénétrer le jour dans la nuit, et Tu fais sortir le vivant du mort, et Tu fais sortir le mort du vivant. Et Tu accordes attribution à qui Tu veux, sans compter.",
    "repetitions": 1,
    "explanation": "Reconnaissance de la souveraineté d'Allah sur tout : l'autorité, la puissance, la nuit et le jour, la vie et la mort, la subsistance.",
    "merits": "",
    "reference": "Coran 3:26-27 · traduction de Muhammad Hamidullah",
    "context": "Ordre donné au Prophète ﷺ : « Dis : ô Allah… ».",
    "verseKeys": [
      "3:26",
      "3:27"
    ]
  },
  {
    "id": "dua-imran-nadhartu",
    "category": "dua_coran",
    "theme": "famille",
    "title": "Accepte ce vœu",
    "arabic": "رَبِّ إِنِّى نَذَرْتُ لَكَ مَا فِى بَطْنِى مُحَرَّرًۭا فَتَقَبَّلْ مِنِّىٓ إِنَّكَ أَنتَ ٱلسَّمِيعُ ٱلْعَلِيمُ",
    "phonetic": "Rabbi innî nadhartu laka mâ fî batnî muharraran fa-taqabbal minnî, innaka Anta-s-Samî'u-l-'Alîm.",
    "translation": "Seigneur, je T'ai voué en toute exclusivité ce qui est dans mon ventre. Accepte-le donc, de moi. C'est Toi certes l' Audient et l'Omniscient.",
    "repetitions": 1,
    "explanation": "Elle voue à Allah ce qu'elle porte et Lui demande de l'accepter.",
    "merits": "",
    "reference": "Coran 3:35 · traduction de Muhammad Hamidullah",
    "context": "Invocation de la femme de 'Imrân (mère de Maryam), enceinte.",
    "verseKeys": [
      "3:35"
    ]
  },
  {
    "id": "dua-zakariyya-dhurriyya",
    "category": "dua_coran",
    "theme": "famille",
    "title": "Une excellente descendance",
    "arabic": "رَبِّ هَبْ لِى مِن لَّدُنكَ ذُرِّيَّةًۭ طَيِّبَةً إِنَّكَ سَمِيعُ ٱلدُّعَآءِ",
    "phonetic": "Rabbi hab lî min ladunka dhurriyyatan tayyibah, innaka Samî'u-d-du'â'.",
    "translation": "O mon Seigneur, donne-moi, venant de Toi, une excellente descendance. Car Tu es Celui qui entend bien la prière.",
    "repetitions": 1,
    "explanation": "Il demande à Allah une descendance pure.",
    "merits": "",
    "reference": "Coran 3:38 · traduction de Muhammad Hamidullah",
    "context": "Invocation de Zakariyyâ ﷺ dans le sanctuaire, auprès de Maryam.",
    "verseKeys": [
      "3:38"
    ]
  },
  {
    "id": "dua-hawariyyun-shahidin",
    "category": "dua_coran",
    "theme": "foi",
    "title": "Inscris-nous parmi ceux qui témoignent",
    "arabic": "رَبَّنَآ ءَامَنَّا بِمَآ أَنزَلْتَ وَٱتَّبَعْنَا ٱلرَّسُولَ فَٱكْتُبْنَا مَعَ ٱلشَّٰهِدِينَ",
    "phonetic": "Rabbanâ âmannâ bimâ anzalta wa-ttaba'nâ-r-rasûla fa-uktubnâ ma'a-sh-shâhidîn.",
    "translation": "Seigneur! Nous avons cru à ce que Tu as fait descendre et suivi le messager. Inscris-nous donc parmi ceux qui témoignent.",
    "repetitions": 1,
    "explanation": "Déclaration de foi et demande d'être comptés parmi les témoins.",
    "merits": "",
    "reference": "Coran 3:53 · traduction de Muhammad Hamidullah",
    "context": "Parole des disciples de 'Îsâ ﷺ.",
    "verseKeys": [
      "3:53"
    ]
  },
  {
    "id": "dua-imran-israfana",
    "category": "dua_coran",
    "theme": "epreuve",
    "title": "Pardonne nos excès, affermis nos pas",
    "arabic": "رَبَّنَا ٱغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِىٓ أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَٰفِرِينَ",
    "phonetic": "Rabbana-ghfir lanâ dhunûbanâ wa isrâfanâ fî amrinâ wa thabbit aqdâmanâ wa-nsurnâ 'ala-l-qawmi-l-kâfirîn.",
    "translation": "Seigneur, pardonne-nous nos péchés ainsi que nos excès dans nos comportements, affermis nos pas et donne-nous la victoire sur les gens mécréants.",
    "repetitions": 1,
    "explanation": "Ils ne disent que cela : demande de pardon, de fermeté et de victoire.",
    "merits": "",
    "reference": "Coran 3:147 · traduction de Muhammad Hamidullah",
    "context": "Parole des fidèles qui combattaient aux côtés des prophètes (Âl 'Imrân).",
    "verseKeys": [
      "3:147"
    ]
  },
  {
    "id": "dua-ulu-al-albab-1",
    "category": "dua_coran",
    "theme": "refuge",
    "title": "Tu n'as pas créé cela en vain",
    "arabic": "رَبَّنَا مَا خَلَقْتَ هَٰذَا بَٰطِلًۭا سُبْحَٰنَكَ فَقِنَا عَذَابَ ٱلنَّارِ • رَبَّنَآ إِنَّكَ مَن تُدْخِلِ ٱلنَّارَ فَقَدْ أَخْزَيْتَهُۥ وَمَا لِلظَّٰلِمِينَ مِنْ أَنصَارٍۢ",
    "phonetic": "Rabbanâ mâ khalaqta hâdhâ bâtilan, subhânaka fa-qinâ 'adhâba-n-nâr. Rabbanâ innaka man tudkhili-n-nâra fa-qad akhzaytah, wa mâ li-z-zâlimîna min ansâr.",
    "translation": "Notre Seigneur! Tu n'as pas créé cela en vain. Gloire à Toi! Garde-nous du châtiment du Feu. Seigneur! Quiconque Tu fais entrer dans le Feu, Tu le couvres vraiment d'ignominie. Et pour les injustes, il n'y a pas de secoureurs!",
    "repetitions": 1,
    "explanation": "Glorification, méditation puis demande de protection du Feu.",
    "merits": "",
    "reference": "Coran 3:191-192 · traduction de Muhammad Hamidullah",
    "context": "Parole des gens doués d'intelligence qui méditent la création des cieux et de la terre.",
    "verseKeys": [
      "3:191",
      "3:192"
    ]
  },
  {
    "id": "dua-ulu-al-albab-2",
    "category": "dua_coran",
    "theme": "pardon",
    "title": "Nous avons entendu l'appel à la foi",
    "arabic": "رَّبَّنَآ إِنَّنَا سَمِعْنَا مُنَادِيًۭا يُنَادِى لِلْإِيمَٰنِ أَنْ ءَامِنُوا۟ بِرَبِّكُمْ فَـَٔامَنَّا رَبَّنَا فَٱغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّـَٔاتِنَا وَتَوَفَّنَا مَعَ ٱلْأَبْرَارِ • رَبَّنَا وَءَاتِنَا مَا وَعَدتَّنَا عَلَىٰ رُسُلِكَ وَلَا تُخْزِنَا يَوْمَ ٱلْقِيَٰمَةِ إِنَّكَ لَا تُخْلِفُ ٱلْمِيعَادَ",
    "phonetic": "Rabbanâ innanâ sami'nâ munâdiyan yunâdî lil-îmâni an âminû bi-Rabbikum fa-âmannâ. Rabbanâ fa-ghfir lanâ dhunûbanâ wa kaffir 'annâ sayyi'âtinâ wa tawaffanâ ma'a-l-abrâr. Rabbanâ wa âtinâ mâ wa'adtanâ 'alâ rusulika wa lâ tukhzinâ yawma-l-qiyâmah, innaka lâ tukhlifu-l-mî'âd.",
    "translation": "Seigneur! Nous avons entendu l'appel de celui qui a appelé ainsi à la foi: «Croyez en votre Seigneur» et dès lors nous avons cru. Seigneur, pardonne-nous nos péchés, efface de nous nos méfaits, et place nous, à notre mort, avec les gens de bien. Seigneur! Donne-nous ce que Tu nous as promis par Tes messagers. Et ne nous couvre pas d'ignominie au Jour de la Résurrection. Car Toi, Tu ne manques pas à Ta promesse.",
    "repetitions": 1,
    "explanation": "Ils demandent le pardon, l'effacement des méfaits, une fin parmi les gens de bien et l'accomplissement de la promesse d'Allah.",
    "merits": "",
    "reference": "Coran 3:193-194 · traduction de Muhammad Hamidullah",
    "context": "Suite de la parole des gens doués d'intelligence.",
    "verseKeys": [
      "3:193",
      "3:194"
    ]
  },
  {
    "id": "dua-nisa-akhrijna",
    "category": "dua_coran",
    "theme": "epreuve",
    "title": "Sauve-nous d'une cité injuste",
    "arabic": "رَبَّنَآ أَخْرِجْنَا مِنْ هَٰذِهِ ٱلْقَرْيَةِ ٱلظَّالِمِ أَهْلُهَا وَٱجْعَل لَّنَا مِن لَّدُنكَ وَلِيًّۭا وَٱجْعَل لَّنَا مِن لَّدُنكَ نَصِيرًا",
    "phonetic": "Rabbanâ akhrijnâ min hâdhihi-l-qaryati-z-zâlimi ahluhâ, wa-j'al lanâ min ladunka waliyyan wa-j'al lanâ min ladunka nasîrâ.",
    "translation": "Seigneur! Fais-nous sortir de cette cité dont les gens sont injustes, et assigne-nous de Ta part un allié, et assigne-nous de Ta part un secoureur.",
    "repetitions": 1,
    "explanation": "Demande de sortie de l'oppression, d'un allié et d'un secoureur de la part d'Allah.",
    "merits": "",
    "reference": "Coran 4:75 · traduction de Muhammad Hamidullah",
    "context": "Parole des faibles opprimés : hommes, femmes et enfants.",
    "verseKeys": [
      "4:75"
    ]
  },
  {
    "id": "dua-maida-shahidin",
    "category": "dua_coran",
    "theme": "foi",
    "title": "Inscris-nous parmi les témoins",
    "arabic": "رَبَّنَآ ءَامَنَّا فَٱكْتُبْنَا مَعَ ٱلشَّٰهِدِينَ",
    "phonetic": "Rabbanâ âmannâ fa-uktubnâ ma'a-sh-shâhidîn.",
    "translation": "O notre Seigneur! Nous croyons: inscris-nous donc parmi ceux qui témoignent (de la véracité du Coran).",
    "repetitions": 1,
    "explanation": "Leurs yeux débordent de larmes ; ils croient et demandent d'être comptés parmi ceux qui témoignent.",
    "merits": "",
    "reference": "Coran 5:83 · traduction de Muhammad Hamidullah",
    "context": "Parole de ceux qui reconnaissent la vérité en entendant le Coran.",
    "verseKeys": [
      "5:83"
    ]
  },
  {
    "id": "dua-isa-ma-ida",
    "category": "dua_coran",
    "theme": "rizq",
    "title": "Fais descendre une table servie",
    "arabic": "ٱللَّهُمَّ رَبَّنَآ أَنزِلْ عَلَيْنَا مَآئِدَةًۭ مِّنَ ٱلسَّمَآءِ تَكُونُ لَنَا عِيدًۭا لِّأَوَّلِنَا وَءَاخِرِنَا وَءَايَةًۭ مِّنكَ وَٱرْزُقْنَا وَأَنتَ خَيْرُ ٱلرَّٰزِقِينَ",
    "phonetic": "Allâhumma Rabbanâ anzil 'alaynâ mâ'idatan mina-s-samâ'i takûnu lanâ 'îdan li-awwalinâ wa âkhirinâ wa âyatan minka, wa-rzuqnâ wa Anta khayru-r-râziqîn.",
    "translation": "O Allah, notre Seigneur, dit Jésus, fils de Marie, fais descendre du ciel sur nous une table servie qui soit une fête pour nous, pour le premier d'entre nous, comme pour le dernier, ainsi qu'un signe de Ta part. Nourris-nous: Tu es le meilleur des nourrisseurs.",
    "repetitions": 1,
    "explanation": "Il demande à Allah de faire descendre du ciel une table servie, signe et fête pour les siens.",
    "merits": "",
    "reference": "Coran 5:114 · traduction de Muhammad Hamidullah",
    "context": "Invocation de 'Îsâ fils de Maryam ﷺ.",
    "verseKeys": [
      "5:114"
    ]
  },
  {
    "id": "dua-adam-zalamna",
    "category": "dua_coran",
    "theme": "pardon",
    "title": "Nous avons fait du tort à nous-mêmes",
    "arabic": "رَبَّنَا ظَلَمْنَآ أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ ٱلْخَٰسِرِينَ",
    "phonetic": "Rabbanâ zalamnâ anfusanâ wa in lam taghfir lanâ wa tarhamnâ lanakûnanna mina-l-khâsirîn.",
    "translation": "O notre Seigneur, nous avons fait du tort à nous-mêmes. Et si Tu ne nous pardonnes pas et ne nous fais pas miséricorde, nous serons très certainement du nombre des perdants.",
    "repetitions": 1,
    "explanation": "Aveu de la faute et demande de pardon et de miséricorde.",
    "merits": "",
    "reference": "Coran 7:23 · traduction de Muhammad Hamidullah",
    "context": "Invocation d'Âdam et de Hawwâ' (Ève) après leur faute.",
    "verseKeys": [
      "7:23"
    ]
  },
  {
    "id": "dua-araf-la-taj-alna",
    "category": "dua_coran",
    "theme": "refuge",
    "title": "Ne nous mets pas avec le peuple injuste",
    "arabic": "رَبَّنَا لَا تَجْعَلْنَا مَعَ ٱلْقَوْمِ ٱلظَّٰلِمِينَ",
    "phonetic": "Rabbanâ lâ taj'alnâ ma'a-l-qawmi-z-zâlimîn.",
    "translation": "O notre Seigneur! Ne nous mets pas avec le peuple injuste.",
    "repetitions": 1,
    "explanation": "Demande de ne pas être comptés parmi les injustes.",
    "merits": "",
    "reference": "Coran 7:47 · traduction de Muhammad Hamidullah",
    "context": "Parole des gens des hauteurs (Al-A'râf), quand leurs regards se tournent vers les gens du Feu.",
    "verseKeys": [
      "7:47"
    ]
  },
  {
    "id": "dua-shuayb-iftah",
    "category": "dua_coran",
    "theme": "epreuve",
    "title": "Tranche entre nous par la vérité",
    "arabic": "رَبَّنَا ٱفْتَحْ بَيْنَنَا وَبَيْنَ قَوْمِنَا بِٱلْحَقِّ وَأَنتَ خَيْرُ ٱلْفَٰتِحِينَ",
    "phonetic": "Rabbana-ftah baynanâ wa bayna qawminâ bi-l-haqqi wa Anta khayru-l-fâtihîn.",
    "translation": "O notre Seigneur, tranche par la vérité, entre nous et notre peuple car Tu es le meilleur des juges.",
    "repetitions": 1,
    "explanation": "Ils s'en remettent à Allah pour qu'Il juge avec vérité entre eux et leur peuple.",
    "merits": "",
    "reference": "Coran 7:89 · traduction de Muhammad Hamidullah",
    "context": "Invocation de Shu'ayb ﷺ et de ses compagnons face à leur peuple.",
    "verseKeys": [
      "7:89"
    ]
  },
  {
    "id": "dua-sahara-sabr",
    "category": "dua_coran",
    "theme": "epreuve",
    "title": "Déverse sur nous l'endurance",
    "arabic": "رَبَّنَآ أَفْرِغْ عَلَيْنَا صَبْرًۭا وَتَوَفَّنَا مُسْلِمِينَ",
    "phonetic": "Rabbanâ afrigh 'alaynâ sabran wa tawaffanâ muslimîn.",
    "translation": "O notre Seigneur! Déverse sur nous l'endurance et fais nous mourir entièrement soumis.",
    "repetitions": 1,
    "explanation": "Demande d'endurance et de mourir en parfaite soumission.",
    "merits": "",
    "reference": "Coran 7:126 · traduction de Muhammad Hamidullah",
    "context": "Invocation des magiciens de Pharaon devenus croyants, face à ses menaces.",
    "verseKeys": [
      "7:126"
    ]
  },
  {
    "id": "dua-musa-subhanaka",
    "category": "dua_coran",
    "theme": "pardon",
    "title": "Gloire à Toi, je me repens",
    "arabic": "سُبْحَٰنَكَ تُبْتُ إِلَيْكَ وَأَنَا۠ أَوَّلُ ٱلْمُؤْمِنِينَ",
    "phonetic": "Subhânaka tubtu ilayka wa anâ awwalu-l-mu'minîn.",
    "translation": "Gloire à Toi! A Toi je me repens; et je suis le premier des croyants.",
    "repetitions": 1,
    "explanation": "Glorification d'Allah et repentir.",
    "merits": "",
    "reference": "Coran 7:143 · traduction de Muhammad Hamidullah",
    "context": "Parole de Mûsâ ﷺ après s'être remis sur le Mont.",
    "verseKeys": [
      "7:143"
    ]
  },
  {
    "id": "dua-musa-ighfir-li",
    "category": "dua_coran",
    "theme": "pardon",
    "title": "Pardonne-moi et à mon frère",
    "arabic": "رَبِّ ٱغْفِرْ لِى وَلِأَخِى وَأَدْخِلْنَا فِى رَحْمَتِكَ وَأَنتَ أَرْحَمُ ٱلرَّٰحِمِينَ",
    "phonetic": "Rabbi-ghfir lî wa li-akhî wa adkhilnâ fî rahmatik, wa Anta arhamu-r-râhimîn.",
    "translation": "O mon Seigneur, pardonne à moi et à mon frère et fais-nous entrer en Ta miséricorde, car Tu es Le plus Miséricordieux des miséricordieux.",
    "repetitions": 1,
    "explanation": "Demande de pardon et d'entrer dans la miséricorde d'Allah.",
    "merits": "",
    "reference": "Coran 7:151 · traduction de Muhammad Hamidullah",
    "context": "Invocation de Mûsâ ﷺ pour lui-même et son frère Hârûn.",
    "verseKeys": [
      "7:151"
    ]
  },
  {
    "id": "dua-yunus-fitna",
    "category": "dua_coran",
    "theme": "epreuve",
    "title": "Ne fais pas de nous une cible pour les injustes",
    "arabic": "رَبَّنَا لَا تَجْعَلْنَا فِتْنَةًۭ لِّلْقَوْمِ ٱلظَّٰلِمِينَ • وَنَجِّنَا بِرَحْمَتِكَ مِنَ ٱلْقَوْمِ ٱلْكَٰفِرِينَ",
    "phonetic": "Rabbanâ lâ taj'alnâ fitnatan lil-qawmi-z-zâlimîn. Wa najjinâ bi-rahmatika mina-l-qawmi-l-kâfirîn.",
    "translation": "O notre Seigneur, ne fais pas de nous une cible pour les persécutions des injustes. Et délivre-nous, par Ta miséricorde, des gens mécréants.",
    "repetitions": 1,
    "explanation": "Après avoir placé leur confiance en Allah, ils demandent d'être protégés de la persécution et délivrés.",
    "merits": "",
    "reference": "Coran 10:85-86 · traduction de Muhammad Hamidullah",
    "context": "Invocation des croyants du peuple de Mûsâ ﷺ.",
    "verseKeys": [
      "10:85",
      "10:86"
    ]
  },
  {
    "id": "dua-nuh-a-udhu-bika",
    "category": "dua_coran",
    "theme": "refuge",
    "title": "Je cherche Ta protection",
    "arabic": "رَبِّ إِنِّىٓ أَعُوذُ بِكَ أَنْ أَسْـَٔلَكَ مَا لَيْسَ لِى بِهِۦ عِلْمٌۭ وَإِلَّا تَغْفِرْ لِى وَتَرْحَمْنِىٓ أَكُن مِّنَ ٱلْخَٰسِرِينَ",
    "phonetic": "Rabbi innî a'ûdhu bika an as'alaka mâ laysa lî bihî 'ilm, wa illâ taghfir lî wa tarhamnî akun mina-l-khâsirîn.",
    "translation": "Seigneur, je cherche Ta protection contre toute demande de ce dont je n'ai aucune connaissance. Et si Tu ne me pardonnes pas et ne me fais pas miséricorde, je serai au nombre des perdants.",
    "repetitions": 1,
    "explanation": "Il cherche refuge contre toute demande faite sans science, et demande pardon et miséricorde.",
    "merits": "",
    "reference": "Coran 11:47 · traduction de Muhammad Hamidullah",
    "context": "Invocation de Nûh (Noé) ﷺ.",
    "verseKeys": [
      "11:47"
    ]
  },
  {
    "id": "dua-yusuf-sijn",
    "category": "dua_coran",
    "theme": "refuge",
    "title": "Écarte de moi leur ruse",
    "arabic": "رَبِّ ٱلسِّجْنُ أَحَبُّ إِلَىَّ مِمَّا يَدْعُونَنِىٓ إِلَيْهِ وَإِلَّا تَصْرِفْ عَنِّى كَيْدَهُنَّ أَصْبُ إِلَيْهِنَّ وَأَكُن مِّنَ ٱلْجَٰهِلِينَ",
    "phonetic": "Rabbi-s-sijnu ahabbu ilayya mimmâ yad'ûnanî ilayh, wa illâ tasrif 'annî kaydahunna asbu ilayhinna wa akun mina-l-jâhilîn.",
    "translation": "O mon Seigneur, la prison m'est préférable à ce à quoi elles m'invitent. Et si Tu n'écartes pas de moi leur ruse, je pencherai vers elles et serai du nombre des ignorants.",
    "repetitions": 1,
    "explanation": "Il préfère la prison au péché et demande à Allah d'écarter la ruse.",
    "merits": "",
    "reference": "Coran 12:33 · traduction de Muhammad Hamidullah",
    "context": "Invocation de Yûsuf ﷺ face à la tentation.",
    "verseKeys": [
      "12:33"
    ]
  },
  {
    "id": "dua-yusuf-tawaffani-musliman",
    "category": "dua_coran",
    "theme": "foi",
    "title": "Fais-moi mourir en parfaite soumission",
    "arabic": "رَبِّ قَدْ ءَاتَيْتَنِى مِنَ ٱلْمُلْكِ وَعَلَّمْتَنِى مِن تَأْوِيلِ ٱلْأَحَادِيثِ فَاطِرَ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ أَنتَ وَلِىِّۦ فِى ٱلدُّنْيَا وَٱلْءَاخِرَةِ تَوَفَّنِى مُسْلِمًۭا وَأَلْحِقْنِى بِٱلصَّٰلِحِينَ",
    "phonetic": "Rabbi qad âtaytanî mina-l-mulki wa 'allamtanî min ta'wîli-l-ahâdîth, fâtira-s-samâwâti wa-l-ard, Anta waliyyî fi-d-dunyâ wa-l-âkhirah, tawaffanî musliman wa alhiqnî bi-s-sâlihîn.",
    "translation": "O mon Seigneur, Tu m'as donné du pouvoir et m'as enseigné l'interprétation des rêves. [C'est Toi Le] Créateur des cieux et de la terre, Tu es mon patron, ici-bas et dans l'au-delà. Fais-moi mourir en parfaite soumission et fais moi rejoindre les vertueux.",
    "repetitions": 1,
    "explanation": "Il reconnaît les bienfaits d'Allah, Le prend pour Maître et demande une fin en soumission, parmi les vertueux.",
    "merits": "",
    "reference": "Coran 12:101 · traduction de Muhammad Hamidullah",
    "context": "Invocation de Yûsuf ﷺ, à la fin de son histoire.",
    "verseKeys": [
      "12:101"
    ]
  },
  {
    "id": "dua-ibrahim-baladan-2",
    "category": "dua_coran",
    "theme": "famille",
    "title": "Fais de cette cité un lieu sûr",
    "arabic": "رَبِّ ٱجْعَلْ هَٰذَا ٱلْبَلَدَ ءَامِنًۭا وَٱجْنُبْنِى وَبَنِىَّ أَن نَّعْبُدَ ٱلْأَصْنَامَ",
    "phonetic": "Rabbi-j'al hâdha-l-balada âminan wa-jnubnî wa baniyya an na'buda-l-asnâm.",
    "translation": "O mon Seigneur, fais de cette cité un lieu sûr, et préserve-moi ainsi que mes enfants de l'adoration des idoles.",
    "repetitions": 1,
    "explanation": "Il demande la sécurité et la préservation de l'adoration des idoles pour lui et ses enfants.",
    "merits": "",
    "reference": "Coran 14:35 · traduction de Muhammad Hamidullah",
    "context": "Invocation d'Ibrâhîm ﷺ pour La Mecque.",
    "verseKeys": [
      "14:35"
    ]
  },
  {
    "id": "dua-ibrahim-askantu",
    "category": "dua_coran",
    "theme": "famille",
    "title": "J'ai établi une partie de ma descendance",
    "arabic": "رَّبَّنَآ إِنِّىٓ أَسْكَنتُ مِن ذُرِّيَّتِى بِوَادٍ غَيْرِ ذِى زَرْعٍ عِندَ بَيْتِكَ ٱلْمُحَرَّمِ رَبَّنَا لِيُقِيمُوا۟ ٱلصَّلَوٰةَ فَٱجْعَلْ أَفْـِٔدَةًۭ مِّنَ ٱلنَّاسِ تَهْوِىٓ إِلَيْهِمْ وَٱرْزُقْهُم مِّنَ ٱلثَّمَرَٰتِ لَعَلَّهُمْ يَشْكُرُونَ",
    "phonetic": "Rabbanâ innî askantu min dhurriyyatî bi-wâdin ghayri dhî zar'in 'inda baytika-l-muharram, Rabbanâ li-yuqîmû-s-salâh, fa-j'al af'idatan mina-n-nâsi tahwî ilayhim wa-rzuqhum mina-th-thamarâti la'allahum yashkurûn.",
    "translation": "O notre Seigneur, j'ai établi une partie de ma descendance dans une vallée sans agriculture, près de Ta Maison sacrée [la Ka'ba], - ô notre Seigneur - afin qu'ils accomplissent la Salât. Fais donc que se penchent vers eux les cœurs d'une partie des gens. Et nourris-les de fruits. Peut-être seront-ils reconnaissants?",
    "repetitions": 1,
    "explanation": "Il demande qu'ils accomplissent la prière, que les cœurs se penchent vers eux et qu'ils soient nourris de fruits.",
    "merits": "",
    "reference": "Coran 14:37 · traduction de Muhammad Hamidullah",
    "context": "Invocation d'Ibrâhîm ﷺ après avoir installé sa famille près de la Maison sacrée.",
    "verseKeys": [
      "14:37"
    ]
  },
  {
    "id": "dua-ibrahim-ta-lamu",
    "category": "dua_coran",
    "theme": "foi",
    "title": "Tu sais ce que nous cachons",
    "arabic": "رَبَّنَآ إِنَّكَ تَعْلَمُ مَا نُخْفِى وَمَا نُعْلِنُ",
    "phonetic": "Rabbanâ innaka ta'lamu mâ nukhfî wa mâ nu'lin.",
    "translation": "O notre Seigneur, Tu sais, vraiment, ce que nous cachons et ce que nous divulguons.",
    "repetitions": 1,
    "explanation": "Reconnaissance qu'Allah connaît tout, le caché comme le divulgué.",
    "merits": "",
    "reference": "Coran 14:38 · traduction de Muhammad Hamidullah",
    "context": "Invocation d'Ibrâhîm ﷺ.",
    "verseKeys": [
      "14:38"
    ]
  },
  {
    "id": "dua-ibrahim-muqim-salat",
    "category": "dua_coran",
    "theme": "famille",
    "title": "Fais que j'accomplisse la prière",
    "arabic": "رَبِّ ٱجْعَلْنِى مُقِيمَ ٱلصَّلَوٰةِ وَمِن ذُرِّيَّتِى رَبَّنَا وَتَقَبَّلْ دُعَآءِ • رَبَّنَا ٱغْفِرْ لِى وَلِوَٰلِدَىَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ ٱلْحِسَابُ",
    "phonetic": "Rabbi-j'alnî muqîma-s-salâti wa min dhurriyyatî, Rabbanâ wa taqabbal du'â'. Rabbana-ghfir lî wa li-wâlidayya wa li-l-mu'minîna yawma yaqûmu-l-hisâb.",
    "translation": "O mon Seigneur! Fais que j'accomplisse assidûment la Salât ainsi qu'une partie de ma descendance; exauce ma prière, ô notre Seigneur! O notre Seigneur! pardonne-moi, ainsi qu'à mes père et mère et aux croyants, le jour de la reddition des comptes.",
    "repetitions": 1,
    "explanation": "Il demande la constance dans la prière pour lui et sa descendance, puis le pardon pour lui, ses parents et les croyants.",
    "merits": "",
    "reference": "Coran 14:40-41 · traduction de Muhammad Hamidullah",
    "context": "Invocation d'Ibrâhîm ﷺ.",
    "verseKeys": [
      "14:40",
      "14:41"
    ]
  },
  {
    "id": "dua-isra-irhamhuma",
    "category": "dua_coran",
    "theme": "famille",
    "title": "Fais-leur miséricorde comme ils m'ont élevé",
    "arabic": "رَّبِّ ٱرْحَمْهُمَا كَمَا رَبَّيَانِى صَغِيرًۭا",
    "phonetic": "Rabbi-rhamhumâ kamâ rabbayânî saghîrâ.",
    "translation": "O mon Seigneur, fais-leur, à tous deux, miséricorde comme ils m'ont élevé tout petit.",
    "repetitions": 1,
    "explanation": "Une invocation pour père et mère, en rappel de la manière dont ils ont élevé leur enfant.",
    "merits": "",
    "reference": "Coran 17:24 · traduction de Muhammad Hamidullah",
    "context": "Invocation pour les parents, enseignée dans le Coran (sourate Al-Isrâ').",
    "verseKeys": [
      "17:24"
    ]
  },
  {
    "id": "dua-isra-mudkhal-sidq",
    "category": "dua_coran",
    "theme": "guidance",
    "title": "Une entrée de vérité, une sortie de vérité",
    "arabic": "رَّبِّ أَدْخِلْنِى مُدْخَلَ صِدْقٍۢ وَأَخْرِجْنِى مُخْرَجَ صِدْقٍۢ وَٱجْعَل لِّى مِن لَّدُنكَ سُلْطَٰنًۭا نَّصِيرًۭا",
    "phonetic": "Rabbi adkhilnî mudkhala sidqin wa akhrijnî mukhraja sidqin wa-j'al lî min ladunka sultânan nasîrâ.",
    "translation": "O mon Seigneur, fais que j'entre par une entrée de vérité et que je sorte par une sortie de vérité; et accorde-moi de Ta part, un pouvoir bénéficiant de Ton secours.",
    "repetitions": 1,
    "explanation": "Demande d'entrer et de sortir dans la vérité, et d'un pouvoir soutenu par Allah.",
    "merits": "",
    "reference": "Coran 17:80 · traduction de Muhammad Hamidullah",
    "context": "Ordre donné au Prophète ﷺ : « Et dis : … ».",
    "verseKeys": [
      "17:80"
    ]
  },
  {
    "id": "dua-kahf-rahma",
    "category": "dua_coran",
    "theme": "guidance",
    "title": "Accorde-nous Ta miséricorde",
    "arabic": "رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةًۭ وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًۭا",
    "phonetic": "Rabbanâ âtinâ min ladunka rahmatan wa hayyi' lanâ min amrinâ rashadâ.",
    "translation": "O notre Seigneur, donne-nous de Ta part une miséricorde; et assure nous la droiture dans tout ce qui nous concerne.",
    "repetitions": 1,
    "explanation": "Ils demandent la miséricorde d'Allah et la droiture dans toute leur affaire.",
    "merits": "",
    "reference": "Coran 18:10 · traduction de Muhammad Hamidullah",
    "context": "Invocation des jeunes gens réfugiés dans la caverne (Al-Kahf).",
    "verseKeys": [
      "18:10"
    ]
  },
  {
    "id": "dua-zakariyya-wahana",
    "category": "dua_coran",
    "theme": "famille",
    "title": "Accorde-moi un descendant",
    "arabic": "رَبِّ إِنِّى وَهَنَ ٱلْعَظْمُ مِنِّى وَٱشْتَعَلَ ٱلرَّأْسُ شَيْبًۭا وَلَمْ أَكُنۢ بِدُعَآئِكَ رَبِّ شَقِيًّۭا • وَإِنِّى خِفْتُ ٱلْمَوَٰلِىَ مِن وَرَآءِى وَكَانَتِ ٱمْرَأَتِى عَاقِرًۭا فَهَبْ لِى مِن لَّدُنكَ وَلِيًّۭا • يَرِثُنِى وَيَرِثُ مِنْ ءَالِ يَعْقُوبَ وَٱجْعَلْهُ رَبِّ رَضِيًّۭا",
    "phonetic": "Rabbi innî wahana-l-'azmu minnî wa-shta'ala-r-ra'su shaybâ, wa lam akun bi-du'â'ika Rabbi shaqiyyâ. Wa innî khiftu-l-mawâliya min warâ'î wa kânati-mra'atî 'âqiran fa-hab lî min ladunka waliyyâ, yarithunî wa yarithu min âli Ya'qûb, wa-j'alhu Rabbi radiyyâ.",
    "translation": "O mon Seigneur, mes os sont affaiblis et ma tête s'est enflammée de cheveux blancs. [Cependant], je n'ai jamais été malheureux [déçu] en te priant, ô mon Seigneur. Je crains [le comportement] de mes héritiers, après moi. Et ma propre femme est stérile. Accorde-moi, de Ta part, un descendant, qui hérite de moi et hérite de la famille de Jacob. Et fais qu'il te soit agréable, ô mon Seigneur.",
    "repetitions": 1,
    "explanation": "Il expose sa faiblesse, son besoin et sa confiance en Allah, qui ne l'a jamais déçu dans ses invocations.",
    "merits": "",
    "reference": "Coran 19:4-6 · traduction de Muhammad Hamidullah",
    "context": "Invocation de Zakariyyâ ﷺ, âgé, demandant un héritier.",
    "verseKeys": [
      "19:4",
      "19:5",
      "19:6"
    ]
  },
  {
    "id": "dua-musa-ishrah-li",
    "category": "dua_coran",
    "theme": "science",
    "title": "Ouvre-moi ma poitrine",
    "arabic": "رَبِّ ٱشْرَحْ لِى صَدْرِى • وَيَسِّرْ لِىٓ أَمْرِى • وَٱحْلُلْ عُقْدَةًۭ مِّن لِّسَانِى • يَفْقَهُوا۟ قَوْلِى",
    "phonetic": "Rabbi-shrah lî sadrî, wa yassir lî amrî, wa-hlul 'uqdatan min lisânî, yafqahû qawlî.",
    "translation": "Seigneur, ouvre-moi ma poitrine, et facilite ma mission, et dénoue un nœud en ma langue, afin qu'ils comprennent mes paroles.",
    "repetitions": 1,
    "explanation": "Il demande l'ouverture de la poitrine, la facilité de sa mission et une parole comprise.",
    "merits": "",
    "reference": "Coran 20:25-28 · traduction de Muhammad Hamidullah",
    "context": "Invocation de Mûsâ ﷺ avant de se rendre auprès de Pharaon.",
    "verseKeys": [
      "20:25",
      "20:26",
      "20:27",
      "20:28"
    ]
  },
  {
    "id": "dua-taha-zidni-ilma",
    "category": "dua_coran",
    "theme": "science",
    "title": "Accroît mes connaissances",
    "arabic": "رَّبِّ زِدْنِى عِلْمًۭا",
    "phonetic": "Rabbi zidnî 'ilmâ.",
    "translation": "O mon Seigneur, accroît mes connaissances!",
    "repetitions": 1,
    "explanation": "Demande d'augmenter la science.",
    "merits": "",
    "reference": "Coran 20:114 · traduction de Muhammad Hamidullah",
    "context": "Ordre donné au Prophète ﷺ : « Et dis : … » (Tâ-Hâ).",
    "verseKeys": [
      "20:114"
    ]
  },
  {
    "id": "dua-ayyub-massaniya",
    "category": "dua_coran",
    "theme": "detresse",
    "title": "Le mal m'a touché",
    "arabic": "أَنِّى مَسَّنِىَ ٱلضُّرُّ وَأَنتَ أَرْحَمُ ٱلرَّٰحِمِينَ",
    "phonetic": "Annî massaniya-d-durru wa Anta arhamu-r-râhimîn.",
    "translation": "Le mal m'a touché. Mais Toi, tu es le plus miséricordieux des miséricordieux!",
    "repetitions": 1,
    "explanation": "Il expose son épreuve à Allah et se réfère à Sa miséricorde.",
    "merits": "",
    "reference": "Coran 21:83 · traduction de Muhammad Hamidullah",
    "context": "Invocation d'Ayyûb (Job) ﷺ dans l'épreuve.",
    "verseKeys": [
      "21:83"
    ]
  },
  {
    "id": "dua-yunus-la-ilaha-illa-anta",
    "category": "dua_coran",
    "theme": "detresse",
    "title": "Pas de divinité à part Toi",
    "arabic": "لَّآ إِلَٰهَ إِلَّآ أَنتَ سُبْحَٰنَكَ إِنِّى كُنتُ مِنَ ٱلظَّٰلِمِينَ",
    "phonetic": "Lâ ilâha illâ Anta, subhânaka innî kuntu mina-z-zâlimîn.",
    "translation": "Pas de divinité à part Toi! Pureté à Toi! J'ai été vraiment du nombre des injustes.",
    "repetitions": 1,
    "explanation": "Affirmation de l'unicité d'Allah, glorification et aveu de ses torts.",
    "merits": "",
    "reference": "Coran 21:87 · traduction de Muhammad Hamidullah",
    "context": "Invocation de Yûnus (Jonas) ﷺ, appelant Allah dans les ténèbres.",
    "verseKeys": [
      "21:87"
    ]
  },
  {
    "id": "dua-zakariyya-fardan",
    "category": "dua_coran",
    "theme": "famille",
    "title": "Ne me laisse pas seul",
    "arabic": "رَبِّ لَا تَذَرْنِى فَرْدًۭا وَأَنتَ خَيْرُ ٱلْوَٰرِثِينَ",
    "phonetic": "Rabbi lâ tadharnî fardan wa Anta khayru-l-wârithîn.",
    "translation": "Ne me laisse pas seul, Seigneur, alors que Tu es le meilleur des héritiers.",
    "repetitions": 1,
    "explanation": "Demande d'un héritier, en rappelant qu'Allah est le meilleur des héritiers.",
    "merits": "",
    "reference": "Coran 21:89 · traduction de Muhammad Hamidullah",
    "context": "Invocation de Zakariyyâ ﷺ.",
    "verseKeys": [
      "21:89"
    ]
  },
  {
    "id": "dua-anbiya-ihkum-bil-haqq",
    "category": "dua_coran",
    "theme": "epreuve",
    "title": "Juge en toute justice",
    "arabic": "رَبِّ ٱحْكُم بِٱلْحَقِّ وَرَبُّنَا ٱلرَّحْمَٰنُ ٱلْمُسْتَعَانُ عَلَىٰ مَا تَصِفُونَ",
    "phonetic": "Rabbi-hkum bi-l-haqq, wa Rabbunâ-r-Rahmânu-l-musta'ânu 'alâ mâ tasifûn.",
    "translation": "Seigneur, juge en toute justice! Et Notre Seigneur le Tout Miséricordieux, c'est Lui dont le secours est imploré contre vos assertions.",
    "repetitions": 1,
    "explanation": "Demande qu'Allah juge avec justice, et appel à Son secours.",
    "merits": "",
    "reference": "Coran 21:112 · traduction de Muhammad Hamidullah",
    "context": "Dernière āyah d'Al-Anbiyâ'.",
    "verseKeys": [
      "21:112"
    ]
  },
  {
    "id": "dua-nuh-munzalan-mubarakan",
    "category": "dua_coran",
    "theme": "rizq",
    "title": "Un débarquement béni",
    "arabic": "رَّبِّ أَنزِلْنِى مُنزَلًۭا مُّبَارَكًۭا وَأَنتَ خَيْرُ ٱلْمُنزِلِينَ",
    "phonetic": "Rabbi anzilnî munzalan mubârakan wa Anta khayru-l-munzilîn.",
    "translation": "Seigneur, fais-moi débarquer d'un débarquement béni. Tu es Celui qui procure le meilleur débarquement.",
    "repetitions": 1,
    "explanation": "Demande d'un lieu d'arrivée béni.",
    "merits": "",
    "reference": "Coran 23:29 · traduction de Muhammad Hamidullah",
    "context": "Invocation enseignée à Nûh ﷺ une fois installé sur l'arche.",
    "verseKeys": [
      "23:29"
    ]
  },
  {
    "id": "dua-muminun-la-taj-alni",
    "category": "dua_coran",
    "theme": "refuge",
    "title": "Ne me place pas parmi les injustes",
    "arabic": "رَّبِّ إِمَّا تُرِيَنِّى مَا يُوعَدُونَ • رَبِّ فَلَا تَجْعَلْنِى فِى ٱلْقَوْمِ ٱلظَّٰلِمِينَ",
    "phonetic": "Rabbi immâ turiyannî mâ yû'adûn. Rabbi fa-lâ taj'alnî fi-l-qawmi-z-zâlimîn.",
    "translation": "Seigneur, si jamais Tu me montres ce qui leur est promis, alors, Seigneur, ne me place pas parmi les gens injustes.",
    "repetitions": 1,
    "explanation": "Demande de ne pas être parmi les injustes lorsque s'accomplit ce qui leur est promis.",
    "merits": "",
    "reference": "Coran 23:93-94 · traduction de Muhammad Hamidullah",
    "context": "Ordre donné au Prophète ﷺ : « Dis : … » (Al-Mu'minûn).",
    "verseKeys": [
      "23:93",
      "23:94"
    ]
  },
  {
    "id": "dua-muminun-hamazat",
    "category": "dua_coran",
    "theme": "refuge",
    "title": "Protection contre les incitations des diables",
    "arabic": "رَّبِّ أَعُوذُ بِكَ مِنْ هَمَزَٰتِ ٱلشَّيَٰطِينِ • وَأَعُوذُ بِكَ رَبِّ أَن يَحْضُرُونِ",
    "phonetic": "Rabbi a'ûdhu bika min hamazâti-sh-shayâtîn. Wa a'ûdhu bika Rabbi an yahdurûn.",
    "translation": "Seigneur, je cherche Ta protection, contre les incitations des diables, et je cherche Ta protection, Seigneur, contre leur présence auprès de moi.",
    "repetitions": 1,
    "explanation": "Demande de protection contre les incitations des diables et leur présence auprès de soi.",
    "merits": "",
    "reference": "Coran 23:97-98 · traduction de Muhammad Hamidullah",
    "context": "Ordre donné au Prophète ﷺ : « Et dis : … » (Al-Mu'minûn).",
    "verseKeys": [
      "23:97",
      "23:98"
    ]
  },
  {
    "id": "dua-muminun-amanna-faghfir",
    "category": "dua_coran",
    "theme": "pardon",
    "title": "Nous croyons, pardonne-nous",
    "arabic": "رَبَّنَآ ءَامَنَّا فَٱغْفِرْ لَنَا وَٱرْحَمْنَا وَأَنتَ خَيْرُ ٱلرَّٰحِمِينَ",
    "phonetic": "Rabbanâ âmannâ fa-ghfir lanâ wa-rhamnâ wa Anta khayru-r-râhimîn.",
    "translation": "Seigneur, nous croyons; pardonne-nous donc et fais-nous miséricorde, car Tu es le meilleur des Miséricordieux.",
    "repetitions": 1,
    "explanation": "Foi affirmée, demande de pardon et de miséricorde.",
    "merits": "",
    "reference": "Coran 23:109 · traduction de Muhammad Hamidullah",
    "context": "Parole d'un groupe de serviteurs d'Allah croyants (Al-Mu'minûn).",
    "verseKeys": [
      "23:109"
    ]
  },
  {
    "id": "dua-muminun-ighfir-warham",
    "category": "dua_coran",
    "theme": "pardon",
    "title": "Pardonne et fais miséricorde",
    "arabic": "رَّبِّ ٱغْفِرْ وَٱرْحَمْ وَأَنتَ خَيْرُ ٱلرَّٰحِمِينَ",
    "phonetic": "Rabbi-ghfir wa-rham wa Anta khayru-r-râhimîn.",
    "translation": "Seigneur, pardonne et fais miséricorde. C'est Toi le Meilleur des miséricordieux.",
    "repetitions": 1,
    "explanation": "Une invocation brève et complète de pardon et de miséricorde.",
    "merits": "",
    "reference": "Coran 23:118 · traduction de Muhammad Hamidullah",
    "context": "Dernière āyah d'Al-Mu'minûn : ordre donné au Prophète ﷺ.",
    "verseKeys": [
      "23:118"
    ]
  },
  {
    "id": "dua-furqan-isrif-jahannam",
    "category": "dua_coran",
    "theme": "refuge",
    "title": "Écarte de nous le châtiment de l'Enfer",
    "arabic": "رَبَّنَا ٱصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ",
    "phonetic": "Rabbana-srif 'annâ 'adhâba jahannam.",
    "translation": "Seigneur, écarte de nous le châtiment de l'Enfer.",
    "repetitions": 1,
    "explanation": "Demande de protection du châtiment de l'Enfer.",
    "merits": "",
    "reference": "Coran 25:65 · traduction de Muhammad Hamidullah",
    "context": "Parole des serviteurs du Tout Miséricordieux (Al-Furqân).",
    "verseKeys": [
      "25:65"
    ]
  },
  {
    "id": "dua-furqan-qurrata-a-yun",
    "category": "dua_coran",
    "theme": "famille",
    "title": "La joie des yeux en nos épouses et descendants",
    "arabic": "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَٰجِنَا وَذُرِّيَّٰتِنَا قُرَّةَ أَعْيُنٍۢ وَٱجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    "phonetic": "Rabbanâ hab lanâ min azwâjinâ wa dhurriyyâtinâ qurrata a'yunin wa-j'alnâ lil-muttaqîna imâmâ.",
    "translation": "Seigneur, donne-nous, en nos épouses et nos descendants, la joie des yeux, et fais de nous un guide pour les pieux.",
    "repetitions": 1,
    "explanation": "Demande d'une famille qui réjouit, et de devenir un guide pour les pieux.",
    "merits": "",
    "reference": "Coran 25:74 · traduction de Muhammad Hamidullah",
    "context": "Parole des serviteurs du Tout Miséricordieux (Al-Furqân).",
    "verseKeys": [
      "25:74"
    ]
  },
  {
    "id": "dua-ibrahim-hab-li-hukman",
    "category": "dua_coran",
    "theme": "dunya",
    "title": "Fais-moi rejoindre les gens de bien",
    "arabic": "رَبِّ هَبْ لِى حُكْمًۭا وَأَلْحِقْنِى بِٱلصَّٰلِحِينَ • وَٱجْعَل لِّى لِسَانَ صِدْقٍۢ فِى ٱلْءَاخِرِينَ • وَٱجْعَلْنِى مِن وَرَثَةِ جَنَّةِ ٱلنَّعِيمِ • وَٱغْفِرْ لِأَبِىٓ إِنَّهُۥ كَانَ مِنَ ٱلضَّآلِّينَ • وَلَا تُخْزِنِى يَوْمَ يُبْعَثُونَ",
    "phonetic": "Rabbi hab lî hukman wa alhiqnî bi-s-sâlihîn. Wa-j'al lî lisâna sidqin fi-l-âkhirîn. Wa-j'alnî min warathati jannati-n-na'îm. Wa-ghfir li-abî innahu kâna mina-d-dâllîn. Wa lâ tukhzinî yawma yub'athûn.",
    "translation": "Seigneur, accorde-moi sagesse (et savoir) et fais-moi rejoindre les gens de bien, fais que j'aie une mention honorable sur les langues de la postérité, et fais de moi l'un des héritiers du Jardin des délices, et pardonne à mon père: car il a été du nombre des égarés, et ne me couvre pas d'ignominie, le jour où l'on sera ressuscité.",
    "repetitions": 1,
    "explanation": "Il demande la sagesse, une belle mention, le Jardin des délices et de ne pas être couvert d'ignominie à la résurrection. Pour son père, voir aussi 9:114.",
    "merits": "",
    "reference": "Coran 26:83-87 · traduction de Muhammad Hamidullah",
    "context": "Invocation d'Ibrâhîm ﷺ (Ash-Shu'arâ').",
    "verseKeys": [
      "26:83",
      "26:84",
      "26:85",
      "26:86",
      "26:87"
    ]
  },
  {
    "id": "dua-sulayman-awzi-ni",
    "category": "dua_coran",
    "theme": "rizq",
    "title": "Permets-moi de rendre grâce",
    "arabic": "رَبِّ أَوْزِعْنِىٓ أَنْ أَشْكُرَ نِعْمَتَكَ ٱلَّتِىٓ أَنْعَمْتَ عَلَىَّ وَعَلَىٰ وَٰلِدَىَّ وَأَنْ أَعْمَلَ صَٰلِحًۭا تَرْضَىٰهُ وَأَدْخِلْنِى بِرَحْمَتِكَ فِى عِبَادِكَ ٱلصَّٰلِحِينَ",
    "phonetic": "Rabbi awzi'nî an ashkura ni'mataka-llatî an'amta 'alayya wa 'alâ wâlidayya wa an a'mala sâlihan tardâhu wa adkhilnî bi-rahmatika fî 'ibâdika-s-sâlihîn.",
    "translation": "Permets-moi Seigneur, de rendre grâce pour le bienfait dont Tu m'as comblé ainsi que mes père et mère, et que je fasse une bonne œuvre que tu agrées et fais-moi entrer, par Ta miséricorde, parmi Tes serviteurs vertueux.",
    "repetitions": 1,
    "explanation": "Il demande d'être inspiré pour remercier, de faire une bonne œuvre agréée et d'entrer parmi les vertueux.",
    "merits": "",
    "reference": "Coran 27:19 · traduction de Muhammad Hamidullah",
    "context": "Invocation de Sulaymân (Salomon) ﷺ.",
    "verseKeys": [
      "27:19"
    ]
  },
  {
    "id": "dua-saba-aslamtu",
    "category": "dua_coran",
    "theme": "foi",
    "title": "Je me soumets avec Sulaymân",
    "arabic": "رَبِّ إِنِّى ظَلَمْتُ نَفْسِى وَأَسْلَمْتُ مَعَ سُلَيْمَٰنَ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
    "phonetic": "Rabbi innî zalamtu nafsî wa aslamtu ma'a Sulaymâna li-llâhi Rabbi-l-'âlamîn.",
    "translation": "Seigneur, je me suis fait du tort à moi-même: Je me soumets avec Salomon à Allah, Seigneur de l'univers.",
    "repetitions": 1,
    "explanation": "Aveu de son tort et soumission à Allah, Seigneur de l'univers.",
    "merits": "",
    "reference": "Coran 27:44 · traduction de Muhammad Hamidullah",
    "context": "Parole de la reine de Saba' en se soumettant à Allah.",
    "verseKeys": [
      "27:44"
    ]
  },
  {
    "id": "dua-musa-zalamtu-nafsi",
    "category": "dua_coran",
    "theme": "pardon",
    "title": "Je me suis fait du tort, pardonne-moi",
    "arabic": "رَبِّ إِنِّى ظَلَمْتُ نَفْسِى فَٱغْفِرْ لِى",
    "phonetic": "Rabbi innî zalamtu nafsî fa-ghfir lî.",
    "translation": "Seigneur, je me suis fait du tort à moi-même; pardonne-moi.",
    "repetitions": 1,
    "explanation": "Aveu de son tort et demande de pardon ; Allah lui pardonna.",
    "merits": "",
    "reference": "Coran 28:16 · traduction de Muhammad Hamidullah",
    "context": "Invocation de Mûsâ ﷺ (Al-Qasas).",
    "verseKeys": [
      "28:16"
    ]
  },
  {
    "id": "dua-musa-najjini",
    "category": "dua_coran",
    "theme": "detresse",
    "title": "Sauve-moi du peuple injuste",
    "arabic": "رَبِّ نَجِّنِى مِنَ ٱلْقَوْمِ ٱلظَّٰلِمِينَ",
    "phonetic": "Rabbi najjinî mina-l-qawmi-z-zâlimîn.",
    "translation": "Seigneur, sauve-moi de [ce] peuple injuste!",
    "repetitions": 1,
    "explanation": "Demande de délivrance du peuple injuste.",
    "merits": "",
    "reference": "Coran 28:21 · traduction de Muhammad Hamidullah",
    "context": "Invocation de Mûsâ ﷺ quittant l'Égypte, craintif.",
    "verseKeys": [
      "28:21"
    ]
  },
  {
    "id": "dua-musa-faqir",
    "category": "dua_coran",
    "theme": "detresse",
    "title": "J'ai grand besoin du bien que Tu feras descendre",
    "arabic": "رَبِّ إِنِّى لِمَآ أَنزَلْتَ إِلَىَّ مِنْ خَيْرٍۢ فَقِيرٌۭ",
    "phonetic": "Rabbi innî limâ anzalta ilayya min khayrin faqîr.",
    "translation": "Seigneur, j'ai grand besoin du bien que tu feras descendre vers moi.",
    "repetitions": 1,
    "explanation": "Il exprime son besoin à Allah.",
    "merits": "",
    "reference": "Coran 28:24 · traduction de Muhammad Hamidullah",
    "context": "Invocation de Mûsâ ﷺ à Madyan, après avoir abreuvé les bêtes.",
    "verseKeys": [
      "28:24"
    ]
  },
  {
    "id": "dua-ibrahim-salihin",
    "category": "dua_coran",
    "theme": "famille",
    "title": "Fais-moi don d'une descendance vertueuse",
    "arabic": "رَبِّ هَبْ لِى مِنَ ٱلصَّٰلِحِينَ",
    "phonetic": "Rabbi hab lî mina-s-sâlihîn.",
    "translation": "Seigneur, fais-moi don d'une [progéniture] d'entre les vertueux.",
    "repetitions": 1,
    "explanation": "Demande d'un enfant parmi les vertueux.",
    "merits": "",
    "reference": "Coran 37:100 · traduction de Muhammad Hamidullah",
    "context": "Invocation d'Ibrâhîm ﷺ (As-Sâffât).",
    "verseKeys": [
      "37:100"
    ]
  },
  {
    "id": "dua-sulayman-mulkan",
    "category": "dua_coran",
    "theme": "dunya",
    "title": "Pardonne-moi et fais-moi don d'un royaume",
    "arabic": "رَبِّ ٱغْفِرْ لِى وَهَبْ لِى مُلْكًۭا لَّا يَنۢبَغِى لِأَحَدٍۢ مِّنۢ بَعْدِىٓ إِنَّكَ أَنتَ ٱلْوَهَّابُ",
    "phonetic": "Rabbi-ghfir lî wa hab lî mulkan lâ yanbaghî li-ahadin min ba'dî, innaka Anta-l-Wahhâb.",
    "translation": "Seigneur, pardonne-moi et fais-moi don d'un royaume tel que nul après moi n'aura de pareil. C'est Toi le grand Dispensateur.",
    "repetitions": 1,
    "explanation": "Demande de pardon et d'un royaume sans pareil.",
    "merits": "",
    "reference": "Coran 38:35 · traduction de Muhammad Hamidullah",
    "context": "Invocation de Sulaymân ﷺ (Sâd).",
    "verseKeys": [
      "38:35"
    ]
  },
  {
    "id": "dua-zumar-fatir",
    "category": "dua_coran",
    "theme": "foi",
    "title": "Créateur des cieux et de la terre",
    "arabic": "ٱللَّهُمَّ فَاطِرَ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ عَٰلِمَ ٱلْغَيْبِ وَٱلشَّهَٰدَةِ أَنتَ تَحْكُمُ بَيْنَ عِبَادِكَ فِى مَا كَانُوا۟ فِيهِ يَخْتَلِفُونَ",
    "phonetic": "Allâhumma Fâtira-s-samâwâti wa-l-ard, 'Âlima-l-ghaybi wa-sh-shahâdah, Anta tahkumu bayna 'ibâdika fî mâ kânû fîhi yakhtalifûn.",
    "translation": "O Allah, Créateur des cieux et de la terre, Connaisseur de tout ce que le monde ignore comme de ce qu'il perçoit, c'est Toi qui jugeras entre Tes serviteurs ce sur quoi ils divergeaient.",
    "repetitions": 1,
    "explanation": "Il remet à Allah le jugement entre Ses serviteurs.",
    "merits": "",
    "reference": "Coran 39:46 · traduction de Muhammad Hamidullah",
    "context": "Ordre donné au Prophète ﷺ : « Dis : ô Allah… » (Az-Zumar).",
    "verseKeys": [
      "39:46"
    ]
  },
  {
    "id": "dua-malaika-wasi-ta",
    "category": "dua_coran",
    "theme": "pardon",
    "title": "Tu étends sur toute chose Ta miséricorde",
    "arabic": "رَبَّنَا وَسِعْتَ كُلَّ شَىْءٍۢ رَّحْمَةًۭ وَعِلْمًۭا فَٱغْفِرْ لِلَّذِينَ تَابُوا۟ وَٱتَّبَعُوا۟ سَبِيلَكَ وَقِهِمْ عَذَابَ ٱلْجَحِيمِ • رَبَّنَا وَأَدْخِلْهُمْ جَنَّٰتِ عَدْنٍ ٱلَّتِى وَعَدتَّهُمْ وَمَن صَلَحَ مِنْ ءَابَآئِهِمْ وَأَزْوَٰجِهِمْ وَذُرِّيَّٰتِهِمْ إِنَّكَ أَنتَ ٱلْعَزِيزُ ٱلْحَكِيمُ • وَقِهِمُ ٱلسَّيِّـَٔاتِ وَمَن تَقِ ٱلسَّيِّـَٔاتِ يَوْمَئِذٍۢ فَقَدْ رَحِمْتَهُۥ",
    "phonetic": "Rabbanâ wasi'ta kulla shay'in rahmatan wa 'ilman fa-ghfir li-lladhîna tâbû wa-ttaba'û sabîlaka wa qihim 'adhâba-l-jahîm. Rabbanâ wa adkhilhum jannâti 'adnini-llatî wa'adtahum wa man salaha min âbâ'ihim wa azwâjihim wa dhurriyyâtihim, innaka Anta-l-'Azîzu-l-Hakîm. Wa qihimu-s-sayyi'âti wa man taqi-s-sayyi'âti yawma'idhin fa-qad rahimtah.",
    "translation": "Seigneur! Tu étends sur toute chose Ta miséricorde et Ta science. Pardonne donc à ceux qui se repentent et suivent Ton chemin et protège-les du châtiment de l'Enfer. Seigneur! Fais-les entrer aux jardins d'Eden que Tu leur as promis, ainsi qu'aux vertueux parmi leurs ancêtres, leurs épouses et leurs descendants, car c'est Toi le Puissant, le Sage. Et préserve-les [du châtiment] des mauvaises actions. Quiconque Tu préserves [du châtiment] des mauvaises actions ce jour-là, Tu lui feras miséricorde.",
    "repetitions": 1,
    "explanation": "Ils demandent le pardon pour les repentants, la protection du châtiment et l'entrée aux Jardins d'Eden.",
    "merits": "",
    "reference": "Coran 40:7-9 · traduction de Muhammad Hamidullah",
    "context": "Invocation des anges qui portent le Trône, pour les croyants.",
    "verseKeys": [
      "40:7",
      "40:8",
      "40:9"
    ]
  },
  {
    "id": "dua-ahqaf-awzi-ni",
    "category": "dua_coran",
    "theme": "famille",
    "title": "Inspire-moi pour que je rende grâce",
    "arabic": "رَبِّ أَوْزِعْنِىٓ أَنْ أَشْكُرَ نِعْمَتَكَ ٱلَّتِىٓ أَنْعَمْتَ عَلَىَّ وَعَلَىٰ وَٰلِدَىَّ وَأَنْ أَعْمَلَ صَٰلِحًۭا تَرْضَىٰهُ وَأَصْلِحْ لِى فِى ذُرِّيَّتِىٓ إِنِّى تُبْتُ إِلَيْكَ وَإِنِّى مِنَ ٱلْمُسْلِمِينَ",
    "phonetic": "Rabbi awzi'nî an ashkura ni'mataka-llatî an'amta 'alayya wa 'alâ wâlidayya wa an a'mala sâlihan tardâhu wa aslih lî fî dhurriyyatî, innî tubtu ilayka wa innî mina-l-muslimîn.",
    "translation": "O Seigneur! Inspire-moi pour que je rende grâce au bienfait dont Tu m'as comblé ainsi qu'à mes père et mère, et pour que je fasse une bonne œuvre que Tu agrées. Et fais que ma postérité soit de moralité saine. Je me repens à Toi et je suis du nombre des Soumis.",
    "repetitions": 1,
    "explanation": "Gratitude, demande d'une bonne œuvre agréée et d'une descendance saine, et repentir.",
    "merits": "",
    "reference": "Coran 46:15 · traduction de Muhammad Hamidullah",
    "context": "Invocation de l'homme qui atteint quarante ans (Al-Ahqâf).",
    "verseKeys": [
      "46:15"
    ]
  },
  {
    "id": "dua-nuh-maghlub",
    "category": "dua_coran",
    "theme": "detresse",
    "title": "Je suis vaincu, fais triompher Ta cause",
    "arabic": "أَنِّى مَغْلُوبٌۭ فَٱنتَصِرْ",
    "phonetic": "Annî maghlûbun fa-ntasir.",
    "translation": "Moi, je suis vaincu. Fais triompher (Ta cause).",
    "repetitions": 1,
    "explanation": "Il exprime sa faiblesse et demande le secours d'Allah.",
    "merits": "",
    "reference": "Coran 54:10 · traduction de Muhammad Hamidullah",
    "context": "Invocation de Nûh ﷺ face à son peuple (Al-Qamar).",
    "verseKeys": [
      "54:10"
    ]
  },
  {
    "id": "dua-hashr-ghill",
    "category": "dua_coran",
    "theme": "pardon",
    "title": "Pas de rancœur dans nos cœurs",
    "arabic": "رَبَّنَا ٱغْفِرْ لَنَا وَلِإِخْوَٰنِنَا ٱلَّذِينَ سَبَقُونَا بِٱلْإِيمَٰنِ وَلَا تَجْعَلْ فِى قُلُوبِنَا غِلًّۭا لِّلَّذِينَ ءَامَنُوا۟ رَبَّنَآ إِنَّكَ رَءُوفٌۭ رَّحِيمٌ",
    "phonetic": "Rabbana-ghfir lanâ wa li-ikhwâninâ-lladhîna sabaqûnâ bi-l-îmân, wa lâ taj'al fî qulûbinâ ghillan lil-ladhîna âmanû, Rabbanâ innaka Ra'ûfun Rahîm.",
    "translation": "Seigneur, pardonne-nous, ainsi qu'à nos frères qui nous ont précédés dans la foi; et ne mets dans nos cœurs aucune rancœur pour ceux qui ont cru. Seigneur, Tu es Compatissant et Très Miséricordieux.",
    "repetitions": 1,
    "explanation": "Demande de pardon pour eux et pour leurs frères dans la foi, et d'un cœur sans rancœur.",
    "merits": "",
    "reference": "Coran 59:10 · traduction de Muhammad Hamidullah",
    "context": "Parole de ceux qui sont venus après les premiers croyants (Al-Hashr).",
    "verseKeys": [
      "59:10"
    ]
  },
  {
    "id": "dua-mumtahana-tawakkalna",
    "category": "dua_coran",
    "theme": "foi",
    "title": "C'est en Toi que nous mettons notre confiance",
    "arabic": "رَّبَّنَا عَلَيْكَ تَوَكَّلْنَا وَإِلَيْكَ أَنَبْنَا وَإِلَيْكَ ٱلْمَصِيرُ • رَبَّنَا لَا تَجْعَلْنَا فِتْنَةًۭ لِّلَّذِينَ كَفَرُوا۟ وَٱغْفِرْ لَنَا رَبَّنَآ إِنَّكَ أَنتَ ٱلْعَزِيزُ ٱلْحَكِيمُ",
    "phonetic": "Rabbanâ 'alayka tawakkalnâ wa ilayka anabnâ wa ilayka-l-masîr. Rabbanâ lâ taj'alnâ fitnatan lil-ladhîna kafarû wa-ghfir lanâ Rabbanâ, innaka Anta-l-'Azîzu-l-Hakîm.",
    "translation": "Seigneur, c'est en Toi que nous mettons notre confiance et à Toi nous revenons [repentants]. Et vers Toi est le Devenir. Seigneur, ne fais pas de nous [un sujet] de tentation pour ceux qui ont mécru; et pardonne-nous, Seigneur, car c'est Toi le Puissant, le Sage.",
    "repetitions": 1,
    "explanation": "Confiance en Allah, repentir, et demande de ne pas être une tentation pour les mécréants.",
    "merits": "",
    "reference": "Coran 60:4-5 · traduction de Muhammad Hamidullah",
    "context": "Parole d'Ibrâhîm ﷺ et de ceux qui étaient avec lui (Al-Mumtahana).",
    "verseKeys": [
      "60:4",
      "60:5"
    ]
  },
  {
    "id": "dua-tahrim-atmim-nurana",
    "category": "dua_coran",
    "theme": "pardon",
    "title": "Parfais-nous notre lumière",
    "arabic": "رَبَّنَآ أَتْمِمْ لَنَا نُورَنَا وَٱغْفِرْ لَنَآ إِنَّكَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌۭ",
    "phonetic": "Rabbanâ atmim lanâ nûranâ wa-ghfir lanâ, innaka 'alâ kulli shay'in qadîr.",
    "translation": "Seigneur, parfais-nous notre lumière et pardonne-nous. Car Tu es Omnipotent.",
    "repetitions": 1,
    "explanation": "Ils demandent que leur lumière soit parfaite, et le pardon.",
    "merits": "",
    "reference": "Coran 66:8 · traduction de Muhammad Hamidullah",
    "context": "Parole des croyants au Jour de la résurrection (At-Tahrîm).",
    "verseKeys": [
      "66:8"
    ]
  },
  {
    "id": "dua-imraat-firawn",
    "category": "dua_coran",
    "theme": "refuge",
    "title": "Une maison auprès de Toi dans le Paradis",
    "arabic": "رَبِّ ٱبْنِ لِى عِندَكَ بَيْتًۭا فِى ٱلْجَنَّةِ وَنَجِّنِى مِن فِرْعَوْنَ وَعَمَلِهِۦ وَنَجِّنِى مِنَ ٱلْقَوْمِ ٱلظَّٰلِمِينَ",
    "phonetic": "Rabbi-bni lî 'indaka baytan fi-l-jannati wa najjinî min Fir'awna wa 'amalih, wa najjinî mina-l-qawmi-z-zâlimîn.",
    "translation": "Seigneur, construis-moi auprès de Toi une maison dans le Paradis, et sauve-moi de Pharaon et de son œuvre; et sauve-moi des gens injustes.",
    "repetitions": 1,
    "explanation": "Elle demande une demeure auprès d'Allah dans le Paradis et la délivrance de Pharaon et de son œuvre.",
    "merits": "",
    "reference": "Coran 66:11 · traduction de Muhammad Hamidullah",
    "context": "Invocation de la femme de Pharaon (At-Tahrîm).",
    "verseKeys": [
      "66:11"
    ]
  },
  {
    "id": "dua-nuh-ighfir-li",
    "category": "dua_coran",
    "theme": "pardon",
    "title": "Pardonne-moi, à mes parents et aux croyants",
    "arabic": "رَّبِّ ٱغْفِرْ لِى وَلِوَٰلِدَىَّ وَلِمَن دَخَلَ بَيْتِىَ مُؤْمِنًۭا وَلِلْمُؤْمِنِينَ وَٱلْمُؤْمِنَٰتِ",
    "phonetic": "Rabbi-ghfir lî wa li-wâlidayya wa li-man dakhala baytiya mu'minan wa li-l-mu'minîna wa-l-mu'minât.",
    "translation": "Seigneur! Pardonne-moi, et à mes père et mère et à celui qui entre dans ma demeure croyant, ainsi qu'aux croyants et croyantes.",
    "repetitions": 1,
    "explanation": "Demande de pardon pour lui, ses parents, celui qui entre chez lui croyant, et les croyants et croyantes.",
    "merits": "",
    "reference": "Coran 71:28 · traduction de Muhammad Hamidullah",
    "context": "Invocation de Nûh ﷺ (sourate Nûh).",
    "verseKeys": [
      "71:28"
    ]
  }
];
