export interface AyahWord {
  word: string;
  count: number;
  refs: string[];
}

export interface AyahTadabbur {
  n: number;
  arabic: string;
  french: string;
  tadabburAr: string;
  tadabburFr: string;
  amalAr: string;
  amalFr: string;
  tawjihAr: string;
  tawjihFr: string;
  words: AyahWord[];
}

export const baqaraJuz1: AyahTadabbur[] = [
  {
    "n": 1,
    "arabic": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ الٓمٓ",
    "french": "Alif, Lâm, Mim.",
    "tadabburAr": "الحُرُوفُ المُقَطَّعَةُ فِي بِدَايَةِ السُّورَةِ تَدُلُّ عَلَى إِعْجَازِ القُرْآنِ العَظِيمِ وَعَجْزِ الخَلْقِ عَنْ إِتْيَانِ بِمِثْلِهِ.",
    "tadabburFr": "Ces lettres disjointes soulignent l'inimitabilité du Coran, composé de lettres connues des Arabes mais qu'aucun être ne peut égaler.",
    "amalAr": "اسْتَمِعْ إِلَى القُرْآنِ الكَرِيمِ بِتَعْظِيمٍ وَتَدَبَّرْ آيَاتِهِ.",
    "amalFr": "Écoute le Coran avec vénération et médite sur sa grandeur aujourd'hui.",
    "tawjihAr": "القُرْآنُ الكَرِيمُ كَلَامُ اللَّهِ المُعْجِزُ الَّذِي يَجِبُ الخُضُوعُ لَهُ.",
    "tawjihFr": "Le Noble Coran est la parole miraculeuse de Dieu à laquelle l'esprit doit se soumettre.",
    "words": [
      {
        "word": "الرحيم",
        "count": 146,
        "refs": [
          "1:1",
          "1:3",
          "2:1",
          "2:37"
        ]
      },
      {
        "word": "الرحمن",
        "count": 157,
        "refs": [
          "1:1",
          "1:3",
          "2:1",
          "2:163"
        ]
      }
    ]
  },
  {
    "n": 2,
    "arabic": "ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًۭى لِّلْمُتَّقِينَ",
    "french": "C'est le Livre au sujet duquel il n'y a aucun doute, c'est un guide pour les pieux,",
    "tadabburAr": "القُرْآنُ كِتَابٌ عَظِيمٌ لاَ شَكَّ فِي صِدْقِهِ، وَهُوَ هِدَايَةٌ تَامَّةٌ لِلْمُتَّقِينَ الَّذِينَ يَخَافُونَ اللَّهَ.",
    "tadabburFr": "Le Coran est un Livre parfait, exempt de tout doute, une source de guidée pour ceux qui cherchent la piété.",
    "amalAr": "اتَّخِذِ القُرْآنَ دَلِيلًا لَكَ فِي جَمِيعِ قَرَارَاتِكَ اليَوْمَ.",
    "amalFr": "Consulte le Coran pour guider tes choix et tes décisions aujourd'hui.",
    "tawjihAr": "التَّقْوَى هِيَ الشَّرْطُ الأَسَاسِيُّ لِلٱنْتِفَاعِ بِهِدَايَةِ القُرْآنِ.",
    "tawjihFr": "La piété (Taqwa) est la condition indispensable pour bénéficier de la guidée coranique.",
    "words": [
      {
        "word": "للمتقين",
        "count": 18,
        "refs": [
          "2:2",
          "2:66",
          "3:133",
          "3:138"
        ]
      }
    ]
  },
  {
    "n": 3,
    "arabic": "ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَٰهُمْ يُنفِقُونَ",
    "french": "qui croient à l'invisible et accomplissent la Salât et dépensent (dans l'obéissance à Allah), de ce que Nous leur avons attribué,",
    "tadabburAr": "أَعْظَمُ صِفَاتِ المُؤْمِنِينَ الإِيمَانُ بِالغَيْبِ، وَإِقَامَةُ الصَّلاَةِ بِأَرْكَانِهَا، وَالإِنْفَاقُ مِمَّا رَزَقَهُمُ اللَّهُ.",
    "tadabburFr": "Les croyants se distinguent par leur foi en l'Inconnaissable, la pratique assidue de la prière et la générosité.",
    "amalAr": "حَافِظْ عَلَى الصَّلَوَاتِ فِي أَوْقَاتِهَا وَتَصَدَّقْ بِشَيْءٍ مِنْ مَالِكَ.",
    "amalFr": "Accomplis tes prières à l'heure avec concentration et donne une aumône.",
    "tawjihAr": "الإِيمَانُ الصَّادِقُ يَجْمَعُ بَيْنَ العَقِيدَةِ الصَّحِيحَةِ وَالعِبَادَةِ وَالإِحْسَانِ.",
    "tawjihFr": "La foi véritable réunit la croyance du cœur, l'adoration physique et la générosité envers autrui.",
    "words": [
      {
        "word": "ويقيمون",
        "count": 2,
        "refs": [
          "2:3",
          "9:71"
        ]
      },
      {
        "word": "ومما",
        "count": 11,
        "refs": [
          "2:3",
          "2:267",
          "8:3",
          "13:17"
        ]
      },
      {
        "word": "بالغيب",
        "count": 12,
        "refs": [
          "2:3",
          "5:94",
          "12:52",
          "18:22"
        ]
      }
    ]
  },
  {
    "n": 4,
    "arabic": "وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن قَبْلِكَ وَبِٱلْءَاخِرَةِ هُمْ يُوقِنُونَ",
    "french": "Ceux qui croient à ce qui t'a été descendu (révélé) et à ce qui a été descendu avant toi et qui croient fermement à la vie future.",
    "tadabburAr": "المُؤْمِنُونَ الصَّادِقُونَ يُؤْمِنُونَ بِجَمِيعِ الرُّسُلِ وَالْكُتُبِ وَيُوقِنُونَ بِاليَوْمِ الآخِرِ إِيمَانًا لاَ يَتَطَرَّقُ إِلَيْهِ شَكٌّ.",
    "tadabburFr": "La foi complète englobe la croyance en toutes les Révélations divines et la certitude absolue en la vie future.",
    "amalAr": "جَدِّدْ يَقِينَكَ بِاليَوْمِ الآخِرِ وَاعْمَلْ عَمَلًا صَالِحًا يَنْفَعُكَ فِيهِ.",
    "amalFr": "Rappelle-toi la réalité du Jour Dernier et accomplis une bonne œuvre pour cet au-delà.",
    "tawjihAr": "اليَقِينُ بِالآخِرَةِ هُوَ المُمَرِّكُ الأَسَاسِيُّ لِلإِكْثَارِ مِنَ الصَّالِحَاتِ.",
    "tawjihFr": "La certitude concernant l'au-delà est le moteur principal des bonnes actions.",
    "words": [
      {
        "word": "يوقنون",
        "count": 11,
        "refs": [
          "2:4",
          "2:118",
          "5:50",
          "27:3"
        ]
      },
      {
        "word": "قبلك",
        "count": 33,
        "refs": [
          "2:4",
          "3:184",
          "4:60",
          "4:162"
        ]
      },
      {
        "word": "اليك",
        "count": 77,
        "refs": [
          "2:4",
          "2:99",
          "2:260",
          "3:44"
        ]
      }
    ]
  },
  {
    "n": 5,
    "arabic": "أُو۟لَٰٓئِكَ عَلَىٰ هُدًۭى مِّن رَّبِّهِمْ ۖ وَأُو۟لَٰٓئِكَ هُمُ ٱلْمُفْلِحُونَ",
    "french": "Ceux-là sont sur le bon chemin de leur Seigneur, et ce sont eux qui réussissent (dans cette vie et dans la vie future).",
    "tadabburAr": "مَنْ اتَّصَفَ بِصِفَاتِ الإِيمَانِ المَذْكُورَةِ فَهُوَ عَلَى نُورٍ وَهُدًى مِنَ اللَّهِ، وَهُوَ الفَائِزُ بِالسَّعَادَةِ فِي الدَّارَيْنِ.",
    "tadabburFr": "Ceux qui possèdent ces qualités bénéficient d'une lumière divine et sont promus au succès éternel.",
    "amalAr": "ادْعُ اللَّهَ أَنْ يَجْعَلَكَ مِنَ المَفْلُوحِينَ المَهْدِيِّينَ.",
    "amalFr": "Invoque Allah d'un cœur sincère pour qu'Il t'accorde la réussite absolue.",
    "tawjihAr": "الفَلاَحُ الحَقِيقِيُّ لاَ يُنَالُ إِلاَّ بِٱتِّبَاعِ هُدَى اللَّهِ وَالتَّمَسُّكِ بِشَرِيعَتِهِ.",
    "tawjihFr": "Le succès véritable ne s'obtient qu'en suivant la voie tracée par Dieu.",
    "words": [
      {
        "word": "المفلحون",
        "count": 12,
        "refs": [
          "2:5",
          "3:104",
          "7:8",
          "7:157"
        ]
      },
      {
        "word": "واولئك",
        "count": 25,
        "refs": [
          "2:5",
          "2:157",
          "2:177",
          "2:217"
        ]
      },
      {
        "word": "ربهم",
        "count": 111,
        "refs": [
          "2:5",
          "2:26",
          "2:46",
          "2:62"
        ]
      }
    ]
  },
  {
    "n": 6,
    "arabic": "إِنَّ ٱلَّذِينَ كَفَرُوا۟ سَوَآءٌ عَلَيْهِمْ ءَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ",
    "french": "[Mais] certes les infidèles que tu les avertisses ou que tu ne les avertisses pas, ils ne croient pas.",
    "tadabburAr": "المُصِرُّونَ عَلَى الكُفْرِ مَهْمَا جَاءَهُمْ مِنَ النَّذِيرِ لاَ يَنْتَفِعُونَ بِهِ لِقَسَاوَةِ قُلُوبِهِمْ وَٱتِّبَاعِهِمُ الهَوَى.",
    "tadabburFr": "L'obstination dans la négation et l'orgueil rendent l'homme hermétique à tous les avertissements.",
    "amalAr": "احْذَرْ مِنَ الكِبْرِ وَاحْرِصْ عَلَى قَبُولِ الحَقِّ مِمَّنْ جَاءَ بِهِ.",
    "amalFr": "Éloigne de ton cœur tout orgueil et accepte la vérité d'où qu'elle vienne.",
    "tawjihAr": "الإِصْرَارُ عَلَى البَاطِلِ يَحْرِمُ العَبْدَ مِنْ التَّوْفِيقِ وَالقَبُولِ.",
    "tawjihFr": "S'obstiner dans le faux prive le serviteur de l'assistance et de la guidée divines.",
    "words": [
      {
        "word": "تنذرهم",
        "count": 2,
        "refs": [
          "2:6",
          "36:10"
        ]
      },
      {
        "word": "سواء",
        "count": 26,
        "refs": [
          "2:6",
          "2:108",
          "3:64",
          "3:113"
        ]
      },
      {
        "word": "يؤمنون",
        "count": 86,
        "refs": [
          "2:3",
          "2:4",
          "2:6",
          "2:88"
        ]
      }
    ]
  },
  {
    "n": 7,
    "arabic": "خَتَمَ ٱللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ وَعَلَىٰٓ أَبْصَٰرِهِمْ غِشَٰوَةٌۭ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌۭ",
    "french": "Allah a scellé leurs cœurs et leurs oreilles; et un voile épais leur couvre la vue; et pour eux il y aura un grand châtiment.",
    "tadabburAr": "الخَتْمُ عَلَى القُلُوبِ وَالأَسْمَاعِ عُقُوبَةٌ عَالِادِلَةٌ مِنَ اللَّهِ لِمَنْ رَفَضَ الحَقَّ وَٱسْتَكْبَرَ عَنْهُ.",
    "tadabburFr": "Le scellement des cœurs et de l'ouïe est une juste punition divine pour ceux qui rejettent délibérément la vérité.",
    "amalAr": "كَرِرْ دُعَاءَ: «يَا مُقَلِّبَ القُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ».",
    "amalFr": "Répète aujourd'hui l'invocation : « Ô Toi qui retournes les cœurs, affermis mon cœur sur Ta religion ».",
    "tawjihAr": "الذُّنُوبُ وَالمَعَاصِي المُتَكَرِّرَةُ تُؤَدِّي إِلَى قَسَاوَةِ القَلْبِ وَحِجَابِهِ عَنِ النُّورِ.",
    "tawjihFr": "Les péchés accumulés finissent par durcir le cœur et le voiler face à la lumière divine.",
    "words": [
      {
        "word": "سمعهم",
        "count": 3,
        "refs": [
          "2:7",
          "41:20",
          "46:26"
        ]
      },
      {
        "word": "وعلي",
        "count": 39,
        "refs": [
          "2:7",
          "2:7",
          "2:184",
          "2:233"
        ]
      },
      {
        "word": "ولهم",
        "count": 43,
        "refs": [
          "2:7",
          "2:10",
          "2:25",
          "2:114"
        ]
      }
    ]
  },
  {
    "n": 8,
    "arabic": "وَمِنَ ٱلنَّاسِ مَن يَقُولُ ءَامَنَّا بِٱللَّهِ وَبِٱلْيَوْمِ ٱلْءَاخِرِ وَمَا هُم بِمُؤْمِنِينَ",
    "french": "Parmi les gens, il y a ceux qui disent: «Nous croyons en Allah et au Jour dernier!» tandis qu'en fait, ils n'y croient pas.",
    "tadabburAr": "الإِيمَانُ لَيْسَ مُجَرَّدَ قَوْلٍ بِاللِّسَانِ، بَلْ هُوَ مَا وَقَرَ فِي الْقَلْبِ وَصَدَّقَهُ الْعَمَلُ.",
    "tadabburFr": "La foi n'est pas une simple affirmation verbale, mais ce qui est ancré dans le cœur et confirmé par les actes.",
    "amalAr": "طَهِّرْ قَلْبَكَ وَفَتِّشْ عَنْ صِدْقِ إِيمَانِكَ فِي خَلَوَاتِكَ.",
    "amalFr": "Purifie ton cœur et examine la sincérité de ta foi lorsque tu es seul.",
    "tawjihAr": "الْحَذَرُ مِنَ النِّفَاقِ وَمُخَالَفَةِ الظَّاهِرِ لِلْبَاطِنِ.",
    "tawjihFr": "Prendre garde à l'hypocrisie et à la contradiction entre le paraître et l'être.",
    "words": [
      {
        "word": "بمؤمنين",
        "count": 6,
        "refs": [
          "2:8",
          "7:132",
          "10:78",
          "11:53"
        ]
      },
      {
        "word": "يقول",
        "count": 39,
        "refs": [
          "2:8",
          "2:68",
          "2:69",
          "2:71"
        ]
      },
      {
        "word": "بالله",
        "count": 139,
        "refs": [
          "2:8",
          "2:28",
          "2:62",
          "2:67"
        ]
      }
    ]
  },
  {
    "n": 9,
    "arabic": "يُخَٰدِعُونَ ٱللَّهَ وَٱلَّذِينَ ءَامَنُوا۟ وَمَا يَخْدَعُونَ إِلَّآ أَنفُسَهُمْ وَمَا يَشْعُرُونَ",
    "french": "Ils cherchent à tromper Allah et les croyants; mais ils ne trompent qu'eux-mêmes, et ils ne s'en rendent pas compte.",
    "tadabburAr": "الْمُنَافِقُ يَظُنُّ أَنَّهُ يَخْدَعُ اللهَ وَالْمُؤْمِنِينَ، وَإِنَّمَا يَخْدَعُ نَفْسَهُ وَيُوبِقُهَا دُونَ أَنْ يَشْعُرَ.",
    "tadabburFr": "L'hypocrite pense tromper Allah et les croyants, mais il ne fait que se tromper lui-même et se causer sa propre perte sans s'en rendre compte.",
    "amalAr": "كُنْ صَادِقًا ظَاهِرًا وَبَاطِنًا وَتَجَنَّبِ الْمَكْرَ وَالْخِدَاعَ.",
    "amalFr": "Sois véridique intérieurement et extérieurement, et évite la ruse et la tromperie.",
    "tawjihAr": "الْخِدَاعُ وَالْمَكْرُ يَعُودُ ضَرَرُهُمَا عَلَى صَاحِبِهِمَا فِي الدُّنْيَا وَالْآخِرَةِ.",
    "tawjihFr": "La tromperie et la ruse ne retombent en mal que sur leur auteur ici-bas et dans l'au-delà.",
    "words": [
      {
        "word": "يشعرون",
        "count": 21,
        "refs": [
          "2:9",
          "2:12",
          "3:69",
          "6:26"
        ]
      },
      {
        "word": "انفسهم",
        "count": 72,
        "refs": [
          "2:9",
          "2:57",
          "2:90",
          "2:102"
        ]
      },
      {
        "word": "والذين",
        "count": 164,
        "refs": [
          "2:4",
          "2:9",
          "2:21",
          "2:39"
        ]
      }
    ]
  },
  {
    "n": 10,
    "arabic": "فِى قُلُوبِهِم مَّرَضٌۭ فَزَادَهُمُ ٱللَّهُ مَرَضًۭا ۖ وَلَهُمْ عَذَابٌ أَلِيمٌۢ بِمَا كَانُوا۟ يَكْذِبُونَ",
    "french": "Il y a dans leurs cœurs une maladie (de doute et d'hypocrisie), et Allah laisse croître leur maladie. Ils auront un châtiment douloureux, pour avoir menti.",
    "tadabburAr": "الْمَعَاصِي وَالنِّفَاقُ أَمْرَاضٌ قَلْبِيَّةٌ، إِذَا لَمْ يُبَادِرِ الْعَبْدُ بِالتَّوْبَةِ زَادَهُ اللهُ مَرَضًا.",
    "tadabburFr": "Les péchés et l'hypocrisie sont des maladies du cœur ; si le serviteur ne s'empresse pas de se repentir, Allah aggrave son état.",
    "amalAr": "اسْأَلِ اللهَ الْعَافِيَةَ لِقَلْبِكَ وَجَدِّدِ التَّوْبَةَ مَعَ كُلِّ ذَنْبٍ.",
    "amalFr": "Demande à Allah la préservation de ton cœur et renouvelle ton repentir après chaque péché.",
    "tawjihAr": "الْكَذِبُ وَالشَّكُّ سَبَبٌ لِزِيَادَةِ مَرَضِ الْقُلُوبِ وَالْعَذَابِ الْأَلِيمِ.",
    "tawjihFr": "Le mensonge et le doute aggravent les maladies du cœur et exposent à un châtiment douloureux.",
    "words": [
      {
        "word": "فزادهم",
        "count": 2,
        "refs": [
          "2:10",
          "3:173"
        ]
      },
      {
        "word": "يكذبون",
        "count": 6,
        "refs": [
          "2:10",
          "9:77",
          "26:12",
          "28:34"
        ]
      },
      {
        "word": "ولهم",
        "count": 43,
        "refs": [
          "2:7",
          "2:10",
          "2:25",
          "2:114"
        ]
      }
    ]
  },
  {
    "n": 11,
    "arabic": "وَإِذَا قِيلَ لَهُمْ لَا تُفْسِدُوا۟ فِى ٱلْأَرْضِ قَالُوٓا۟ إِنَّمَا نَحْنُ مُصْلِحُونَ",
    "french": "Et quand on leur dit: «Ne semez pas la corruption sur la terre», ils disent: «Au contraire nous ne sommes que des réformateurs!»",
    "tadabburAr": "مِنْ أَعْظَمِ الِابْتِلَاءِ أَنْ يَعْمَلَ الْإِنْسَانُ الْفَسَادَ وَهُوَ يَظُنُّ أَنَّهُ يُصْلِحُ.",
    "tadabburFr": "C'est l'une des plus grandes épreuves que d'accomplir des actes de corruption tout en étant persuadé de faire le bien.",
    "amalAr": "زِنْ أَعْمَالَكَ بِمِيزَانِ الشَّرْعِ كَيْ لَا تَقَعَ فِي الْفَسَادِ وَأَنْتَ لَا تَدْرِي.",
    "amalFr": "Pèse tes actions à la lumière de la Révélation pour ne pas commettre le mal en pensant bien faire.",
    "tawjihAr": "الْإِصْلَاحُ الْحَقِيقِيُّ لَا يَكُونُ إِلَّا بِإِطَاعَةِ اللهِ وَاتِّبَاعِ شَرْعِهِ.",
    "tawjihFr": "La véritable réforme ne se réalise que par l'obéissance à Allah et le suivi de Sa loi.",
    "words": [
      {
        "word": "مصلحون",
        "count": 2,
        "refs": [
          "2:11",
          "11:117"
        ]
      },
      {
        "word": "تفسدوا",
        "count": 4,
        "refs": [
          "2:11",
          "7:56",
          "7:85",
          "47:22"
        ]
      },
      {
        "word": "انما",
        "count": 132,
        "refs": [
          "2:11",
          "2:14",
          "2:102",
          "2:169"
        ]
      }
    ]
  },
  {
    "n": 12,
    "arabic": "أَلَآ إِنَّهُمْ هُمُ ٱلْمُفْسِدُونَ وَلَٰكِن لَّا يَشْعُرُونَ",
    "french": "Certes, ce sont eux les véritables corrupteurs, mais ils ne s'en rendent pas compte.",
    "tadabburAr": "الْجَهْلُ بِالْحَالِ وَانْغِمَاسُ الْقَلْبِ فِي الْبَاطِلِ يَجْعَلُ الْمُنَافِقَ لَا يَشْعُرُ بِفَسَادِهِ.",
    "tadabburFr": "L'aveuglement spirituel et l'immersion du cœur dans le faux empêchent l'hypocrite de réaliser sa propre corruption.",
    "amalAr": "حَاسِبْ نَفْسَكَ بِاسْتِمْرَارٍ قَبْلَ أَنْ تَعْمَى بَصِيرَتُكَ.",
    "amalFr": "Demande des comptes à ton âme continuellement avant que ta clairvoyance ne s'éteigne.",
    "tawjihAr": "الْحَذَرُ مِنَ اغْتِرَارِ الْمَرْءِ بِنَفْسِهِ وَالتَّزْكِيَةِ الْكَاذِبَةِ.",
    "tawjihFr": "Se méfier de l'autosatisfaction et des fausses auto-justifications.",
    "words": [
      {
        "word": "يشعرون",
        "count": 21,
        "refs": [
          "2:9",
          "2:12",
          "3:69",
          "6:26"
        ]
      },
      {
        "word": "انهم",
        "count": 104,
        "refs": [
          "2:12",
          "2:13",
          "2:46",
          "2:103"
        ]
      },
      {
        "word": "ولكن",
        "count": 112,
        "refs": [
          "2:12",
          "2:13",
          "2:57",
          "2:102"
        ]
      }
    ]
  },
  {
    "n": 13,
    "arabic": "وَإِذَا قِيلَ لَهُمْ ءَامِنُوا۟ كَمَآ ءَامَنَ ٱلنَّاسُ قَالُوٓا۟ أَنُؤْمِنُ كَمَآ ءَامَنَ ٱلسُّفَهَآءُ ۗ أَلَآ إِنَّهُمْ هُمُ ٱلسُّفَهَآءُ وَلَٰكِن لَّا يَعْلَمُونَ",
    "french": "Et quand on leur dit: «Croyez comme les gens ont cru», ils disent: «Croirons-nous comme ont cru les faibles d'esprit?» Certes, ce sont eux les véritables faibles d'esprit, mais ils ne le savent pas.",
    "tadabburAr": "الْمُنَافِقُونَ يَسْتَهِينُونَ بِأَهْلِ الْإِيمَانِ، وَاللهُ هُوَ الَّذِي يَحْكُمُ بِالسَّفَهِ الْحَقِيقِيِّ.",
    "tadabburFr": "Les hypocrites méprisent les croyants sincères en les traitant d'insensés, mais c'est Allah qui définit la vraie sottise.",
    "amalAr": "احْتَرِمِ الصَّالِحِينَ وَاقْتَدِ بِإِيمَانِ الصَّحَابَةِ رَضِيَ اللهُ عَنْهُمْ.",
    "amalFr": "Respecte les pieux et prends exemple sur la foi sincère des Compagnons.",
    "tawjihAr": "السَّفَهُ الْحَقِيقِيُّ هُوَ تَرْكُ الطَّاعَةِ وَاتِّبَاعُ الْهَوَى، وَلَيْسَ التَّمَسُّكُ بِالدِّينِ.",
    "tawjihFr": "La vraie sottise consiste à délaisser l'obéissance et à suivre ses passions, non à s'accrocher à la religion.",
    "words": [
      {
        "word": "انؤمن",
        "count": 3,
        "refs": [
          "2:13",
          "23:47",
          "26:111"
        ]
      },
      {
        "word": "السفهاء",
        "count": 5,
        "refs": [
          "2:13",
          "2:13",
          "2:142",
          "4:5"
        ]
      },
      {
        "word": "يعلمون",
        "count": 82,
        "refs": [
          "2:13",
          "2:75",
          "2:77",
          "2:78"
        ]
      }
    ]
  },
  {
    "n": 14,
    "arabic": "وَإِذَا لَقُوا۟ ٱلَّذِينَ ءَامَنُوا۟ قَالُوٓا۟ ءَامَنَّا وَإِذَا خَلَوْا۟ إِلَىٰ شَيَٰطِينِهِمْ قَالُوٓا۟ إِنَّا مَعَكُمْ إِنَّمَا نَحْنُ مُسْتَهْزِءُونَ",
    "french": "Quand ils rencontrent ceux qui ont cru, ils disent: «Nous croyons» mais quand ils se trouvent seuls avec leurs diables, ils disent: «Nous sommes avec vous; en effet nous ne faisions que nous moquer (d'eux)».",
    "tadabburAr": "التَّقَلُّبُ بَيْنَ الْوُجُوهِ وَالاسْتِهْزَاءُ بِالْمُؤْمِنِينَ مِنْ أَبْرَزِ صِفَاتِ الْمُنَافِقِينَ.",
    "tadabburFr": "Avoir un double visage et se moquer des croyants en secret font partie des traits les plus marquants des hypocrites.",
    "amalAr": "الْتَزِمْ مَوْقِفًا وَاحِدًا مَعَ الْحَقِّ وَلَا تَكُنْ ذَا وَجْهَيْنِ.",
    "amalFr": "Adopte une position ferme avec la vérité et ne sois pas une personne à double visage.",
    "tawjihAr": "وَلَاءُ الْمُؤْمِنِ لِلَّهِ وَلِلْمُؤْمِنِينَ، وَالْمُصَانَعَةُ مَعَ أَهْلِ الضَّلَالِ نِفَاقٌ.",
    "tawjihFr": "La loyauté du croyant est envers Allah et les croyants ; flatter les gens de l'égarement est une forme d'hypocrisie.",
    "words": [
      {
        "word": "لقوا",
        "count": 2,
        "refs": [
          "2:14",
          "2:76"
        ]
      },
      {
        "word": "خلوا",
        "count": 7,
        "refs": [
          "2:14",
          "2:214",
          "3:119",
          "10:102"
        ]
      },
      {
        "word": "معكم",
        "count": 26,
        "refs": [
          "2:14",
          "2:41",
          "3:81",
          "3:81"
        ]
      }
    ]
  },
  {
    "n": 15,
    "arabic": "ٱللَّهُ يَسْتَهْزِئُ بِهِمْ وَيَمُدُّهُمْ فِى طُغْيَٰنِهِمْ يَعْمَهُونَ",
    "french": "C'est Allah qui Se moque d'eux et les endurcira dans leur révolte et prolongera sans fin leur égarement.",
    "tadabburAr": "مِنْ عُقُوبَةِ السُّخْرِيَةِ بِالْحَقِّ أَنْ يَمُدَّ اللَّهُ الْمُنَافِقِينَ فِي طُغْيَانِهِمْ يَعْمَهُونَ.",
    "tadabburFr": "L'une des punitions pour s'être moqué de la vérité est qu'Allah laisse les hypocrites s'égarer aveuglément dans leur transgression.",
    "amalAr": "احْذَرْ مِنَ النِّفَاقِ وَاسْأَلِ اللَّهَ الثَّبَاتَ عَلَى الْحَقِّ.",
    "amalFr": "Méfie-toi de l'hypocrisie et demande à Allah la fermeté sur la vérité.",
    "tawjihAr": "الإِمْهَالُ مَعَ الإِصْرَارِ عَلَى الذَّنْبِ اسْتِدْرَاجٌ وَعُقُوبَةٌ.",
    "tawjihFr": "Le fait qu'Allah accorde du répit au pécheur obstiné est un piège et une punition.",
    "words": [
      {
        "word": "يعمهون",
        "count": 7,
        "refs": [
          "2:15",
          "6:110",
          "7:186",
          "10:11"
        ]
      }
    ]
  },
  {
    "n": 16,
    "arabic": "أُو۟لَٰٓئِكَ ٱلَّذِينَ ٱشْتَرَوُا۟ ٱلضَّلَٰلَةَ بِٱلْهُدَىٰ فَمَا رَبِحَت تِّجَٰرَتُهُمْ وَمَا كَانُوا۟ مُهْتَدِينَ",
    "french": "Ce sont eux qui ont troqué le droit chemin contre l'égarement. Eh bien, leur négoce n'a point profité. Et ils ne sont pas sur la bonne voie.",
    "tadabburAr": "مَنِ اسْتَبْدَلَ الضَّلَالَةَ بِالْهُدَى فَقَدْ خَسِرَ أَعْظَمَ خِسَارَةٍ فِي التِّجَارَةِ الأُخْرَوِيَّةِ.",
    "tadabburFr": "Celui qui troque la guidée contre l'égarement subit la plus grande perte dans le commerce de l'au-delà.",
    "amalAr": "قَدِّمِ الدِّينَ وَالْهُدَى عَلَى أَيِّ مَصْلَحَةٍ دُنْيَوِيَّةٍ الْيَوْمَ.",
    "amalFr": "Fais passer la religion et la guidée avant tout intérêt matériel aujourd'hui.",
    "tawjihAr": "الرِّبْحُ الْحَقِيقِيُّ هُوَ الْفَوْزُ بِالْهُدَى وَالرِّضَوَانِ.",
    "tawjihFr": "Le vrai profit réside dans l'obtention de la guidée et de la satisfaction divine.",
    "words": [
      {
        "word": "مهتدين",
        "count": 3,
        "refs": [
          "2:16",
          "6:140",
          "10:45"
        ]
      },
      {
        "word": "اشتروا",
        "count": 6,
        "refs": [
          "2:16",
          "2:86",
          "2:90",
          "2:175"
        ]
      },
      {
        "word": "بالهدي",
        "count": 7,
        "refs": [
          "2:16",
          "2:175",
          "9:33",
          "28:37"
        ]
      }
    ]
  },
  {
    "n": 17,
    "arabic": "مَثَلُهُمْ كَمَثَلِ ٱلَّذِى ٱسْتَوْقَدَ نَارًۭا فَلَمَّآ أَضَآءَتْ مَا حَوْلَهُۥ ذَهَبَ ٱللَّهُ بِنُورِهِمْ وَتَرَكَهُمْ فِى ظُلُمَٰتٍۢ لَّا يُبْصِرُونَ",
    "french": "Ils ressemblent à quelqu'un qui a allumé un feu; puis quand le feu a illuminé tout à l'entour, Allah a fait disparaître leur lumière et les a abandonnés dans les ténèbres où ils ne voient plus rien.",
    "tadabburAr": "النِّفَاقُ يُعْطِي نُورًا ظَاهِرِيًّا زَائِلاً، ثُمَّ يُعْقِبُهُ ظُلْمَةٌ وَحَسْرَةٌ.",
    "tadabburFr": "L'hypocrisie procure une lumière apparente et éphémère, suivie de ténèbres et de regrets.",
    "amalAr": "أَخْلِصْ نِيَّتَكَ لِلَّهِ لِيَدُومَ لَكَ نُورُ الإِيمَانِ.",
    "amalFr": "Purifie ton intention pour Allah afin que la lumière de ta foi dure.",
    "tawjihAr": "الإِيمَانُ الظَّاهِرُ بِلا يَقِينٍ قَلْبِيٍّ لا يَنْفَعُ صَاحِبَهُ.",
    "tawjihFr": "La foi purement extérieure sans conviction du cœur ne profite pas à son auteur.",
    "words": [
      {
        "word": "ظلمت",
        "count": 3,
        "refs": [
          "10:54",
          "27:44",
          "28:16"
        ]
      },
      {
        "word": "مثلهم",
        "count": 5,
        "refs": [
          "2:17",
          "4:140",
          "17:99",
          "36:81"
        ]
      },
      {
        "word": "حوله",
        "count": 5,
        "refs": [
          "2:17",
          "17:1",
          "26:25",
          "26:34"
        ]
      }
    ]
  },
  {
    "n": 18,
    "arabic": "صُمٌّۢ بُكْمٌ عُمْىٌۭ فَهُمْ لَا يَرْجِعُونَ",
    "french": "Sourds, muets, aveugles, ils ne peuvent donc pas revenir (de leur égarement).",
    "tadabburAr": "إِعْرَاضُ الإِنْسَانِ عَنِ الْحَقِّ يُؤَدِّي إِلَى انْطِمَاسِ بَصِيرَتِهِ وَعَدَمِ الاهْتِدَاءِ.",
    "tadabburFr": "Le détournement volontaire de la vérité entraîne l'aveuglement du cœur et l'incapacité de se guider.",
    "amalAr": "اسْتَمِعْ لِلْحَقِّ وَتَكَلَّمْ بِهِ وَانْظُرْ فِيمَا يُرْضِي اللَّهَ.",
    "amalFr": "Écoute la vérité, dis la vérité et ne regarde que ce qui plaît à Allah.",
    "tawjihAr": "مَنْ تَرَكَ الْعَمَلَ بِالْحَقِّ حُرِمَ الانْتِفَاعَ بِجَوَارِحِهِ.",
    "tawjihFr": "Quiconque renonce à agir selon la vérité se voit privé du bénéfice de ses sens.",
    "words": [
      {
        "word": "يرجعون",
        "count": 22,
        "refs": [
          "2:18",
          "3:72",
          "3:83",
          "6:36"
        ]
      }
    ]
  },
  {
    "n": 19,
    "arabic": "أَوْ كَصَيِّبٍۢ مِّنَ ٱلسَّمَآءِ فِيهِ ظُلُمَٰتٌۭ وَرَعْدٌۭ وَبَرْقٌۭ يَجْعَلُونَ أَصَٰبِعَهُمْ فِىٓ ءَاذَانِهِم مِّنَ ٱلصَّوَٰعِقِ حَذَرَ ٱلْمَوْتِ ۚ وَٱللَّهُ مُحِيطٌۢ بِٱلْكَٰفِرِينَ",
    "french": "(On peut encore les comparer à ces gens qui,) au moment où les nuées éclatent en pluies, chargées de ténèbres, de tonnerre et éclairs, se mettent les doigts dans les oreilles, terrorisés par le fracas de la foudre et craignant la mort; et Allah encercle de tous côtés les infidèles.",
    "tadabburAr": "الْمُنَافِقُ يَخَافُ مِنْ مَوَاعِظِ الْقُرْآنِ وَتَكَالِيفِهِ كَمَا يَخَافُ مِنْ الصَّوَاعِقِ.",
    "tadabburFr": "L'hypocrite redoute les exhortations et obligations du Coran comme il redoute la foudre.",
    "amalAr": "اسْتَقْبِلْ أَوَامِرَ اللَّهِ بِالقَبُولِ وَلا تَهْرُبْ مِنْ النَّصِيحَةِ.",
    "amalFr": "Accueille les ordres d'Allah avec acceptation et ne fuis pas le conseil.",
    "tawjihAr": "لا مَفَرَّ مِنْ قُدْرَةِ اللَّهِ وَإِحَاطَتِهِ بِالْخَلْقِ.",
    "tawjihFr": "Nul ne peut échapper au pouvoir d'Allah ni à Sa science infinie.",
    "words": [
      {
        "word": "يجعلون",
        "count": 2,
        "refs": [
          "2:19",
          "15:96"
        ]
      },
      {
        "word": "ظلمت",
        "count": 3,
        "refs": [
          "10:54",
          "27:44",
          "28:16"
        ]
      },
      {
        "word": "محيط",
        "count": 7,
        "refs": [
          "2:19",
          "3:120",
          "8:47",
          "11:84"
        ]
      }
    ]
  },
  {
    "n": 20,
    "arabic": "يَكَادُ ٱلْبَرْقُ يَخْطَفُ أَبْصَٰرَهُمْ ۖ كُلَّمَآ أَضَآءَ لَهُم مَّشَوْا۟ فِيهِ وَإِذَآ أَظْلَمَ عَلَيْهِمْ قَامُوا۟ ۚ وَلَوْ شَآءَ ٱللَّهُ لَذَهَبَ بِسَمْعِهِمْ وَأَبْصَٰرِهِمْ ۚ إِنَّ ٱللَّهَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌۭ",
    "french": "L'éclair presque leur emporte la vue: chaque fois qu'il leur donne de la lumière, ils avancent; mais dès qu'il fait obscur, ils s'arrêtent. Si Allah le voulait Il leur enlèverait certes l'ouïe et la vue, car Allah a pouvoir sur toute chose.",
    "tadabburAr": "الْمُنَافِقُ يَعْبُدُ اللَّهَ عَلَى حَرْفٍ، يَمْشِي مَعَ العَافِيَةِ وَيَتَوَقَّفُ عِنْدَ البَلاَءِ.",
    "tadabburFr": "L'hypocrite adore Allah de manière vacillante : il avance dans la facilité et s'arrête face à l'épreuve.",
    "amalAr": "اثْبُتْ عَلَى طَاعَةِ اللَّهِ فِي السَّرَّاءِ وَالضَّرَّاءِ.",
    "amalFr": "Sois constant dans l'obéissance à Allah, aussi bien dans l'aisance que dans l'épreuve.",
    "tawjihAr": "الثَّبَاتُ فِي الشَّدَائِدِ مِعْيَارُ الإِيمَانِ الصَّادِقِ.",
    "tawjihFr": "La fermeté durant les épreuves est le vrai critère de la foi sincère.",
    "words": [
      {
        "word": "لذهب",
        "count": 2,
        "refs": [
          "2:20",
          "23:91"
        ]
      },
      {
        "word": "البرق",
        "count": 3,
        "refs": [
          "2:20",
          "13:12",
          "30:24"
        ]
      },
      {
        "word": "قاموا",
        "count": 4,
        "refs": [
          "2:20",
          "4:142",
          "4:142",
          "18:14"
        ]
      }
    ]
  },
  {
    "n": 21,
    "arabic": "يَٰٓأَيُّهَا ٱلنَّاسُ ٱعْبُدُوا۟ رَبَّكُمُ ٱلَّذِى خَلَقَكُمْ وَٱلَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
    "french": "O hommes! Adorez votre Seigneur, qui vous a créés vous et ceux qui vous ont précédés. Ainsi atteindriez-vous à la piété.",
    "tadabburAr": "هَذَا أَوَّلُ أَمْرٍ فِي القُرْآنِ: الأَمْرُ بِالتَّوْحِيدِ وَالعِبَادَةِ لِخَالِقِ الكَوْنِ.",
    "tadabburFr": "C'est le premier ordre dans le Coran : l'ordre d'unifier et d'adorer le Créateur de l'univers.",
    "amalAr": "أَفْرِدِ اللَّهَ بِالعِبَادَةِ اليَوْمَ وَاجْعَلْ أَعْمَالَكَ كُلَّهَا لَهُ.",
    "amalFr": "Voue ton adoration exclusivement à Allah aujourd'hui et consacre-Lui toutes tes actions.",
    "tawjihAr": "الْخَلْقُ وَالإِيجَادُ دَلِيلٌ عَلَى وُجُوبِ العِبَادَةِ وَالتَّقْوَى.",
    "tawjihFr": "La création est la preuve suprême de l'obligation d'adorer Allah et de Le craindre.",
    "words": [
      {
        "word": "اعبدوا",
        "count": 17,
        "refs": [
          "2:21",
          "5:72",
          "5:117",
          "7:59"
        ]
      },
      {
        "word": "خلقكم",
        "count": 18,
        "refs": [
          "2:21",
          "4:1",
          "6:2",
          "7:189"
        ]
      },
      {
        "word": "قبلكم",
        "count": 18,
        "refs": [
          "2:21",
          "2:183",
          "2:214",
          "3:137"
        ]
      }
    ]
  },
  {
    "n": 22,
    "arabic": "ٱلَّذِى جَعَلَ لَكُمُ ٱلْأَرْضَ فِرَٰشًۭا وَٱلسَّمَآءَ بِنَآءًۭ وَأَنزَلَ مِنَ ٱلسَّمَآءِ مَآءًۭ فَأَخْرَجَ بِهِۦ مِنَ ٱلثَّمَرَٰتِ رِزْقًۭا لَّكُمْ ۖ فَلَا تَجْعَلُوا۟ لِلَّهِ أَندَادًۭا وَأَنتُمْ تَعْلَمُونَ",
    "french": "C'est Lui qui vous a fait la terre pour lit, et le ciel pour toit; qui précipite la pluie du ciel et par elle fait surgir toutes sortes de fruits pour vous nourrir, ne Lui cherchez donc pas des égaux, alors que vous savez (tout cela).",
    "tadabburAr": "خَلَقَ اللهُ الأَرْضَ وَالسَّمَاءَ وَأَنْزَلَ المَاءَ لِرِزْقِنَا، فَمِنَ الجَهْلِ أَنْ نَجْعَلَ لَهُ شَرِيكًا وَنَحْنُ نَعْلَمُ أَنَّهُ الخَالِقُ الوَاحِدُ.",
    "tadabburFr": "Allah a disposé la terre et le ciel et a fait descendre l'eau pour notre subsistance; il est absurde de Lui donner des égaux alors que nous savons qu'Il est le seul Créateur.",
    "amalAr": "تَأَمَّلْ اليَوْمَ فِي نِعَمِ اللهِ عَلَيْكَ وَأَخْلِصْ عِبَادَتَكَ لَهُ وَحْدَهُ.",
    "amalFr": "Médite aujourd'hui sur les bienfaits d'Allah et purifie ton adoration pour Lui seul.",
    "tawjihAr": "إِفْرَادُ اللهِ بِالعِبَادَةِ وَاجِبٌ عَلَى كُلِّ مَنْ عَرَفَ أَنَّهُ المُنْعِمُ الخَالِقُ.",
    "tawjihFr": "L'exclusivité de l'adoration revient de droit à Allah, Seul Auteur de tous les bienfaits.",
    "words": [
      {
        "word": "بناء",
        "count": 3,
        "refs": [
          "2:22",
          "38:37",
          "40:64"
        ]
      },
      {
        "word": "تجعلوا",
        "count": 5,
        "refs": [
          "2:22",
          "2:224",
          "4:144",
          "24:63"
        ]
      },
      {
        "word": "اندادا",
        "count": 6,
        "refs": [
          "2:22",
          "2:165",
          "14:30",
          "34:33"
        ]
      }
    ]
  },
  {
    "n": 23,
    "arabic": "وَإِن كُنتُمْ فِى رَيْبٍۢ مِّمَّا نَزَّلْنَا عَلَىٰ عَبْدِنَا فَأْتُوا۟ بِسُورَةٍۢ مِّن مِّثْلِهِۦ وَٱدْعُوا۟ شُهَدَآءَكُم مِّن دُونِ ٱللَّهِ إِن كُنتُمْ صَٰدِقِينَ",
    "french": "Si vous avez un doute sur ce que Nous avons révélé à Notre Serviteur, tâchez donc de produire une sourate semblable et appelez vos témoins, (les idoles) que vous adorez en dehors d'Allah, si vous êtes véridiques.",
    "tadabburAr": "التَّحَدِّي بِإِيتَاءِ سُورَةٍ مِثْلِ القُرْآنِ دَلِيلٌ قَاطِعٌ عَلَى أَنَّهُ كَلَامُ اللهِ وَلَيْسَ مِنْ صُنْعِ بَشَرٍ.",
    "tadabburFr": "Le défi d'apporter une seule sourate semblable au Coran prouve de manière irréfutable qu'il est la parole d'Allah et non une création humaine.",
    "amalAr": "إِقْرَأْ سُورَةً مِنَ القُرْآنِ اليَوْمَ بِتَدَبُّرٍ وَيَقِينٍ فِي إِعْجَازِهِ.",
    "amalFr": "Lis une sourate du Coran aujourd'hui avec méditation et certitude quant à son inimitabilité.",
    "tawjihAr": "اليَقِينُ بِصِدْقِ القُرْآنِ وَنُبُوَّةِ مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ أَصْلٌ فِي الإِيمَانِ.",
    "tawjihFr": "La certitude quant à la véracité du Coran et de la prophétie est un pilier fondamental de la foi.",
    "words": [
      {
        "word": "بسوره",
        "count": 2,
        "refs": [
          "2:23",
          "10:38"
        ]
      },
      {
        "word": "شهداءكم",
        "count": 2,
        "refs": [
          "2:23",
          "6:150"
        ]
      },
      {
        "word": "وادعوا",
        "count": 4,
        "refs": [
          "2:23",
          "10:38",
          "11:13",
          "25:14"
        ]
      }
    ]
  },
  {
    "n": 24,
    "arabic": "فَإِن لَّمْ تَفْعَلُوا۟ وَلَن تَفْعَلُوا۟ فَٱتَّقُوا۟ ٱلنَّارَ ٱلَّتِى وَقُودُهَا ٱلنَّاسُ وَٱلْحِجَارَةُ ۖ أُعِدَّتْ لِلْكَٰفِرِينَ",
    "french": "Si vous n'y parvenez pas et, à coup sûr, vous n'y parviendrez jamais, parez-vous donc contre le feu qu'alimenteront les hommes et les pierres, lequel est réservé aux infidèles.",
    "tadabburAr": "عَجْزُ الخَلْقِ عَنْ مُعَارَضَةِ القُرْآنِ حَقِيقَةٌ أَبَدِيَّةٌ، وَالْإِصْرَارُ عَلَى الكُفْرِ يُؤَدِّي إِلَى النَّارِ.",
    "tadabburFr": "L'incapacité de l'humanité à imiter le Coran est absolue; s'obstiner dans la mécréance mène au Feu préparé pour les dénégateurs.",
    "amalAr": "اِسْتَعِذْ بِاللهِ اليَوْمَ مِنَ النَّارِ وَاسْأَلْهُ السَّلَامَةَ مِنْ عَذَابِهَا.",
    "amalFr": "Demande aujourd'hui protection à Allah contre le Feu de l'Enfer.",
    "tawjihAr": "الخَوْفُ مِنَ النَّارِ يَحُثُّ العَبْدَ عَلَى التَّوْبَةِ وَاتِّبَاعِ الحَقِّ.",
    "tawjihFr": "La crainte du Châtiment doit inciter le serviteur à se repentir et à suivre la vérité.",
    "words": [
      {
        "word": "وقودها",
        "count": 2,
        "refs": [
          "2:24",
          "66:6"
        ]
      },
      {
        "word": "والحجاره",
        "count": 2,
        "refs": [
          "2:24",
          "66:6"
        ]
      },
      {
        "word": "اعدت",
        "count": 4,
        "refs": [
          "2:24",
          "3:131",
          "3:133",
          "57:21"
        ]
      }
    ]
  },
  {
    "n": 25,
    "arabic": "وَبَشِّرِ ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّٰلِحَٰتِ أَنَّ لَهُمْ جَنَّٰتٍۢ تَجْرِى مِن تَحْتِهَا ٱلْأَنْهَٰرُ ۖ كُلَّمَا رُزِقُوا۟ مِنْهَا مِن ثَمَرَةٍۢ رِّزْقًۭا ۙ قَالُوا۟ هَٰذَا ٱلَّذِى رُزِقْنَا مِن قَبْلُ ۖ وَأُتُوا۟ بِهِۦ مُتَشَٰبِهًۭا ۖ وَلَهُمْ فِيهَآ أَزْوَٰجٌۭ مُّطَهَّرَةٌۭ ۖ وَهُمْ فِيهَا خَٰلِدُونَ",
    "french": "Annonce à ceux qui croient et pratiquent de bonnes œuvres qu'ils auront pour demeures des jardins sous lesquels coulent les ruisseaux; chaque fois qu'ils seront gratifiés d'un fruit des jardins ils diront: «C'est bien là ce qui nous avait été servi auparavant». Or c'est quelque chose de semblable (seulement dans la forme); ils auront là des épouses pures, et là ils demeureront éternellement.",
    "tadabburAr": "الإِيمَانُ المَقْرُونُ بِالعَمَلِ الصَّالِحِ هُوَ سَبِيلُ الفَوْزِ بِالجَنَّاتِ وَالنَّعِيمِ الخَالِدِ.",
    "tadabburFr": "La foi liée aux bonnes œuvres est la clé pour gagner les jardins du Paradis et leurs délices éternels.",
    "amalAr": "قُمْ بِعَمَلٍ صَالِحٍ إِضَافِيٍّ اليَوْمَ ابْتِغَاءَ مَرْضَاتِ اللهِ وَجَنَّتِهِ.",
    "amalFr": "Accomplis une bonne action supplémentaire aujourd'hui en recherchant l'agrément d'Allah et Son Paradis.",
    "tawjihAr": "التَّبْشِيرُ بِالْخَيْرِ يَشْحَذُ الهِمَمَ لِطَاعَةِ اللهِ وَمُلاَزَمَةِ الصَّالِحَاتِ.",
    "tawjihFr": "L'annonce des bonnes nouvelles stimule la motivation à obéir à Allah et à multiplier les bonnes œuvres.",
    "words": [
      {
        "word": "ثمره",
        "count": 4,
        "refs": [
          "2:25",
          "6:99",
          "6:141",
          "36:35"
        ]
      },
      {
        "word": "مطهره",
        "count": 5,
        "refs": [
          "2:25",
          "3:15",
          "4:57",
          "80:14"
        ]
      },
      {
        "word": "وبشر",
        "count": 11,
        "refs": [
          "2:25",
          "2:155",
          "2:223",
          "9:3"
        ]
      }
    ]
  },
  {
    "n": 26,
    "arabic": "۞ إِنَّ ٱللَّهَ لَا يَسْتَحْىِۦٓ أَن يَضْرِبَ مَثَلًۭا مَّا بَعُوضَةًۭ فَمَا فَوْقَهَا ۚ فَأَمَّا ٱلَّذِينَ ءَامَنُوا۟ فَيَعْلَمُونَ أَنَّهُ ٱلْحَقُّ مِن رَّبِّهِمْ ۖ وَأَمَّا ٱلَّذِينَ كَفَرُوا۟ فَيَقُولُونَ مَاذَآ أَرَادَ ٱللَّهُ بِهَٰذَا مَثَلًۭا ۘ يُضِلُّ بِهِۦ كَثِيرًۭا وَيَهْدِى بِهِۦ كَثِيرًۭا ۚ وَمَا يُضِلُّ بِهِۦٓ إِلَّا ٱلْفَٰسِقِينَ",
    "french": "Certes, Allah ne se gêne point de citer en exemple n'importe quoi: un moustique ou quoi que ce soit au-dessus; quant aux croyants, ils savent bien qu'il s'agit de la vérité venant de la part de leur Seigneur; quant aux infidèles, ils se demandent «Qu'a voulu dire Allah par un tel exemple?» Par cela, nombreux sont ceux qu'Il égare et nombreux sont ceux qu'Il guide; mais Il n'égare par cela que les pervers,",
    "tadabburAr": "يَضْرِبُ اللهُ الأَمْثَالَ لِتَبْيِينِ الحَقِّ، فَالْمُؤْمِنُ يَزْدَادُ إِيمَانًا وَالفَاسِقُ يَضِلُّ بِعِنَادِهِ.",
    "tadabburFr": "Allah emploie des paraboles pour clarifier la Vérité; le croyant y augmente sa foi tandis que le pervers s'égare par son obstination.",
    "amalAr": "تَدَبَّرْ أَمْثَالَ القُرْآنِ بِقَلْبٍ مُؤْمِنٍ يَبْحَثُ عَنِ العِبْرَةِ وَالحِكْمَةِ.",
    "amalFr": "Médite sur les paraboles du Coran avec un cœur croyant en quête de leçons et de sagesse.",
    "tawjihAr": "العِبْرَةُ فِي الأَمْثَالِ بِالحِكْمَةِ المَنصُوصَةِ لَا بِحَجْمِ المَخْلُوقِ المَضْرُوبِ بِهِ المَثَلُ.",
    "tawjihFr": "L'importance d'une parabole réside dans la sagesse qu'elle contient et non dans la taille de la créature mentionnée.",
    "words": [
      {
        "word": "فوقها",
        "count": 3,
        "refs": [
          "2:26",
          "39:20",
          "41:10"
        ]
      },
      {
        "word": "يضرب",
        "count": 4,
        "refs": [
          "2:26",
          "13:17",
          "13:17",
          "47:3"
        ]
      },
      {
        "word": "ويهدي",
        "count": 9,
        "refs": [
          "2:26",
          "10:25",
          "13:27",
          "14:4"
        ]
      }
    ]
  },
  {
    "n": 27,
    "arabic": "ٱلَّذِينَ يَنقُضُونَ عَهْدَ ٱللَّهِ مِنۢ بَعْدِ مِيثَٰقِهِۦ وَيَقْطَعُونَ مَآ أَمَرَ ٱللَّهُ بِهِۦٓ أَن يُوصَلَ وَيُفْسِدُونَ فِى ٱلْأَرْضِ ۚ أُو۟لَٰٓئِكَ هُمُ ٱلْخَٰسِرُونَ",
    "french": "qui rompent le pacte qu'ils avaient fermement conclu avec Allah, coupent ce qu'Allah a ordonné d'unir, et sèment la corruption sur la terre. Ceux-là sont les vrais perdants.",
    "tadabburAr": "نَقْضُ العُهُودِ وَقَطِيعَةُ الرَّحِمِ وَالإِفْسَادُ فِي الأَرْضِ مِنْ صِفَاتِ الخَاسِرِينَ.",
    "tadabburFr": "Rompre les engagements, couper les liens de parenté et semer la corruption sont les caractéristiques des vrais perdants.",
    "amalAr": "صِلْ رَحِمَكَ اليَوْمَ بِاتِّصَالٍ أَوْ زِيَارَةٍ كَسْرًا لِلْقَطِيعَةِ.",
    "amalFr": "Maintiens tes liens de parenté aujourd'hui en appelant ou en rendant visite à un proche.",
    "tawjihAr": "الوَفَاءُ بِالعُهُودِ وَصِلَةُ الأَرْحَامِ مِنْ أَعْظَمِ الوَاجِبَاتِ الشَّرْعِيَّةِ.",
    "tawjihFr": "Le respect des engagements et le maintien des liens familiaux font partie des plus grands devoirs religieux.",
    "words": [
      {
        "word": "ويقطعون",
        "count": 2,
        "refs": [
          "2:27",
          "13:25"
        ]
      },
      {
        "word": "ويفسدون",
        "count": 2,
        "refs": [
          "2:27",
          "13:25"
        ]
      },
      {
        "word": "يوصل",
        "count": 3,
        "refs": [
          "2:27",
          "13:21",
          "13:25"
        ]
      }
    ]
  },
  {
    "n": 28,
    "arabic": "كَيْفَ تَكْفُرُونَ بِٱللَّهِ وَكُنتُمْ أَمْوَٰتًۭا فَأَحْيَٰكُمْ ۖ ثُمَّ يُمِيتُكُمْ ثُمَّ يُحْيِيكُمْ ثُمَّ إِلَيْهِ تُرْجَعُونَ",
    "french": "Comment pouvez-vous renier Allah alors qu'Il vous a donné la vie, quand vous en étiez privés? Puis Il vous fera mourir; puis Il vous fera revivre et enfin c'est à Lui que vous retournerez.",
    "tadabburAr": "الكُفْرُ بِاللهِ غَايَةُ العَجَبِ، وَهُوَ الَّذِي أَوْجَدَنَا مِنَ العَدَمِ وَإِلَيْهِ مَرْجِعُنَا لِلْحِسَابِ.",
    "tadabburFr": "La mécréance est stupéfiante alors qu'Allah nous a donné la vie à partir du néant, nous fera mourir, nous ressuscitera et nous ramènera à Lui.",
    "amalAr": "اِذْكُرِ المَوْتَ اليَوْمَ وَاسْتَعِدَّ لِلِقَاءِ اللهِ بِالتَّوْبَةِ الصَّادِقَةِ.",
    "amalFr": "Rappelle-toi la mort aujourd'hui et prépare ta rencontre avec Allah par un repentir sincère.",
    "tawjihAr": "تَذَكُّرُ البِدَايَةِ وَالنِّهَايَةِ يَقْطَعُ الكِبْرَ وَيَدْعُوَ إِلَى الإِنَابَةِ.",
    "tawjihFr": "Se rappeler notre origine et notre retour final à Allah détruit l'orgueil et invite au repentir.",
    "words": [
      {
        "word": "يميتكم",
        "count": 4,
        "refs": [
          "2:28",
          "22:66",
          "30:40",
          "45:26"
        ]
      },
      {
        "word": "يحييكم",
        "count": 5,
        "refs": [
          "2:28",
          "8:24",
          "22:66",
          "30:40"
        ]
      },
      {
        "word": "وكنتم",
        "count": 8,
        "refs": [
          "2:28",
          "3:103",
          "6:93",
          "23:35"
        ]
      }
    ]
  },
  {
    "n": 29,
    "arabic": "هُوَ ٱلَّذِى خَلَقَ لَكُم مَّا فِى ٱلْأَرْضِ جَمِيعًۭا ثُمَّ ٱسْتَوَىٰٓ إِلَى ٱلسَّمَآءِ فَسَوَّىٰهُنَّ سَبْعَ سَمَٰوَٰتٍۢ ۚ وَهُوَ بِكُلِّ شَىْءٍ عَلِيمٌۭ",
    "french": "C'est Lui qui a créé pour vous tout ce qui est sur la terre, puis Il a orienté Sa volonté vers le ciel et en fit sept cieux. Et Il est Omniscient.",
    "tadabburAr": "خَلَقَ اللهُ كُلَّ مَا فِي الْأَرْضِ لِنَفْعِ الإِنْسَانِ وَخِدْمَتِهِ، مِمَّا يَدُلُّ عَلَى عِظَمِ نِعَمِهِ وَإِحَاطَةِ عِلْمِهِ.",
    "tadabburFr": "Allah a créé tout ce qui est sur terre pour le bénéfice de l'homme, ce qui prouve l'immensité de Ses bienfaits et l'omniscience de Son savoir.",
    "amalAr": "اشْكُرِ اللهَ الْيَوْمَ عَلَى نِعَمِهِ الظَّاهِرَةِ وَالْبَاطِنَةِ فِي هَذَا الْكَوْنِ.",
    "amalFr": "Remercie Allah aujourd'hui pour Ses multiples bienfaits dans cet univers.",
    "tawjihAr": "الأَصْلُ فِي الأَشْيَاءِ المَنَافِعِ فِي الأَرْضِ الإِبَاحَةُ حَتَّى يَدُلَّ الدَّلِيلُ عَلَى التَّحْرِيمِ.",
    "tawjihFr": "La règle de base concernant les choses utiles sur terre est la permission, sauf preuve de leur interdiction.",
    "words": [
      {
        "word": "استوي",
        "count": 9,
        "refs": [
          "2:29",
          "7:54",
          "10:3",
          "13:2"
        ]
      },
      {
        "word": "جميعا",
        "count": 49,
        "refs": [
          "2:29",
          "2:38",
          "2:148",
          "2:165"
        ]
      },
      {
        "word": "عليم",
        "count": 106,
        "refs": [
          "2:29",
          "2:95",
          "2:115",
          "2:158"
        ]
      }
    ]
  },
  {
    "n": 30,
    "arabic": "وَإِذْ قَالَ رَبُّكَ لِلْمَلَٰٓئِكَةِ إِنِّى جَاعِلٌۭ فِى ٱلْأَرْضِ خَلِيفَةًۭ ۖ قَالُوٓا۟ أَتَجْعَلُ فِيهَا مَن يُفْسِدُ فِيهَا وَيَسْفِكُ ٱلدِّمَآءَ وَنَحْنُ نُسَبِّحُ بِحَمْدِكَ وَنُقَدِّسُ لَكَ ۖ قَالَ إِنِّىٓ أَعْلَمُ مَا لَا تَعْلَمُونَ",
    "french": "Lorsque Ton Seigneur confia aux Anges: «Je vais établir sur la terre un vicaire «Khalifa». Ils dirent: «Vas-Tu y désigner un qui y mettra le désordre et répandra le sang, quand nous sommes là à Te sanctifier et à Te glorifier?» - Il dit: «En vérité, Je sais ce que vous ne savez pas!».",
    "tadabburAr": "خَلَقَ اللهُ الآدَمِيَّ لِيَكُونَ خَلِيفَةً يَعْمُرُ الأَرْضَ بِالْحَقِّ، وَحِكْمَةُ اللهِ أَعْظَمُ مِنْ إِدْرَاكِ المَخْلُوقِينَ.",
    "tadabburFr": "Allah a créé l'homme pour aménager la terre selon la vérité, et la sagesse divine dépasse la compréhension des créatures.",
    "amalAr": "اسْعَ الْيَوْمَ فِي إِصْلَاحِ أَمْرِكَ وَمُحِيطِكَ، وَاحْذَرِ الإِفْسَادَ بِالأَقْوَالِ أَوِ الأَفْعَالِ.",
    "amalFr": "Œuvre aujourd'hui pour apporter le bien autour de toi, sans jamais semer le désordre.",
    "tawjihAr": "المَشُورَةُ وَالسُّؤَالُ لِاسْتِكْشَافِ الحِكْمَةِ جَائِزَانِ إِذَا كَانَا قَائِمَيْنِ عَلَى الأَدَبِ.",
    "tawjihFr": "Demander des éclaircissements pour comprendre une sagesse est permis si cela est fait avec respect.",
    "words": [
      {
        "word": "جاعل",
        "count": 2,
        "refs": [
          "2:30",
          "35:1"
        ]
      },
      {
        "word": "خليفه",
        "count": 2,
        "refs": [
          "2:30",
          "38:26"
        ]
      },
      {
        "word": "ونحن",
        "count": 15,
        "refs": [
          "2:30",
          "2:133",
          "2:136",
          "2:138"
        ]
      }
    ]
  },
  {
    "n": 31,
    "arabic": "وَعَلَّمَ ءَادَمَ ٱلْأَسْمَآءَ كُلَّهَا ثُمَّ عَرَضَهُمْ عَلَى ٱلْمَلَٰٓئِكَةِ فَقَالَ أَنۢبِـُٔونِى بِأَسْمَآءِ هَٰٓؤُلَآءِ إِن كُنتُمْ صَٰدِقِينَ",
    "french": "Et Il apprit à Adam tous les noms (de toutes choses), puis Il les présenta aux Anges et dit: «Informez-Moi des noms de ceux-là, si vous êtes véridiques!» (dans votre prétention que vous êtes plus méritants qu'Adam).",
    "tadabburAr": "العِلْمُ هوَ المِعْيَارُ الأَسَاسِيُّ لِلشَّرَفِ وَالتَّفَضُّلِ، وَبِهِ أَبْرَزَ اللهُ فَضْلَ آدَمَ عَلَى المَلائِكَةِ.",
    "tadabburFr": "La connaissance est le véritable critère d'honneur, c'est par elle qu'Allah a manifesté le mérite d'Adam face aux anges.",
    "amalAr": "تَعَلَّمِ الْيَوْمَ مَعْلُومَةً جَدِيدَةً نَافِعَةً تُقَرِّبُكَ إِلَى اللهِ أَوْ تَنْفَعُ بِهَا النَّاسَ.",
    "amalFr": "Apprends aujourd'hui un savoir utile qui te rapproche d'Allah ou profite aux autres.",
    "tawjihAr": "العِلْمُ مَوْهِبَةٌ إِلهِيَّةٌ يُؤْتِيهَا اللهُ مَنْ يَشَاءُ لِتَحْقِيقِ العِمَارَةِ وَالعِبَادَةِ.",
    "tawjihFr": "Le savoir est un don divin accordé pour accomplir le rôle d'adoration et d'édification sur terre.",
    "words": [
      {
        "word": "وعلم",
        "count": 2,
        "refs": [
          "2:31",
          "8:66"
        ]
      },
      {
        "word": "الاسماء",
        "count": 5,
        "refs": [
          "2:31",
          "7:180",
          "17:110",
          "20:8"
        ]
      },
      {
        "word": "كلها",
        "count": 5,
        "refs": [
          "2:31",
          "20:56",
          "36:36",
          "43:12"
        ]
      }
    ]
  },
  {
    "n": 32,
    "arabic": "قَالُوا۟ سُبْحَٰنَكَ لَا عِلْمَ لَنَآ إِلَّا مَا عَلَّمْتَنَآ ۖ إِنَّكَ أَنتَ ٱلْعَلِيمُ ٱلْحَكِيمُ",
    "french": "- Ils dirent: «Gloire à Toi! Nous n'avons de savoir que ce que Tu nous a appris. Certes c'est Toi l'Omniscient, le Sage».",
    "tadabburAr": "التَّوَاضُعُ لِلَّهِ وَالاِعْتِرَافُ بِالْعَجْزِ وَالنَّقْصِ مِنْ شِيَمِ المَلَائِكَةِ وَالْعُلَمَاءِ.",
    "tadabburFr": "L'humilité envers Allah et la reconnaissance de ses propres limites sont des qualités caractéristiques des anges et des savants.",
    "amalAr": "قُلْ \"لَا أَعْلَمُ\" فِيمَا لاَ تَتَيَقَّنُ مِنْهُ الْيَوْمَ تَأَدُّبًا مَعَ العِلْمِ.",
    "amalFr": "N'hésite pas à dire « je ne sais pas » aujourd'hui concernant ce que tu ne maîtrises pas.",
    "tawjihAr": "مِنْ أَدَبِ العَالِمِ وَالْمُتَعَلِّمِ نَسْبَةُ العِلْمِ إِلَى اللهِ وَالاعْتِرَافُ بِالْجَهْلِ عِنْدَ عَدَمِ المَعْرِفَةِ.",
    "tawjihFr": "Fait partie de la bienséance d'attribuer toute science à Allah et d'avouer son ignorance quand on ne sait pas.",
    "words": [
      {
        "word": "العليم",
        "count": 32,
        "refs": [
          "2:32",
          "2:127",
          "2:137",
          "3:35"
        ]
      },
      {
        "word": "الحكيم",
        "count": 42,
        "refs": [
          "2:32",
          "2:129",
          "3:6",
          "3:18"
        ]
      },
      {
        "word": "قالوا",
        "count": 250,
        "refs": [
          "2:11",
          "2:13",
          "2:14",
          "2:14"
        ]
      }
    ]
  },
  {
    "n": 33,
    "arabic": "قَالَ يَٰٓـَٔادَمُ أَنۢبِئْهُم بِأَسْمَآئِهِمْ ۖ فَلَمَّآ أَنۢبَأَهُم بِأَسْمَآئِهِمْ قَالَ أَلَمْ أَقُل لَّكُمْ إِنِّىٓ أَعْلَمُ غَيْبَ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ وَأَعْلَمُ مَا تُبْدُونَ وَمَا كُنتُمْ تَكْتُمُونَ",
    "french": "Il dit: «O Adam, informe-les de ces noms ;» Puis quand celui-ci les eut informés de ces noms, Allah dit: «Ne vous ai-Je pas dit que Je connais les mystères des cieux et de la terre, et que Je sais ce que vous divulguez et ce que vous cachez?»",
    "tadabburAr": "اللهُ يَعْلَمُ السَّرَائِرَ وَالظَّوَاهِرَ، وَقُدْرَتُهُ وَحِكْمَتُهُ تَظْهَرُ فِي إِبْرَازِ الفَضْلِ فِي وَقْتِهِ.",
    "tadabburFr": "Allah connaît les secrets comme le visible, et Sa sagesse éclate en manifestant le mérite de Ses serviteurs au moment opportun.",
    "amalAr": "طَهِّرْ سَرِيرَتَكَ وَاسْتَحْضِرْ مُرَاقَبَةَ اللهِ لَكَ فِي سِرِّكَ وَعَلَانِيَتِكَ.",
    "amalFr": "Purifie ton cœur et garde à l'esprit qu'Allah observe tout ce que tu caches comme ce que tu divulgues.",
    "tawjihAr": "عِلْمُ اللهِ مُحِيطٌ بِكُلِّ المَغِيبَاتِ وَالظَّوَاهِرِ لاَ يَخْفَى عَلَيْهِ شَيْءٌ.",
    "tawjihFr": "La science d'Allah embrasse l'invisible et l'apparent, absolument rien ne Lui échappe.",
    "words": [
      {
        "word": "باسمائهم",
        "count": 2,
        "refs": [
          "2:33",
          "2:33"
        ]
      },
      {
        "word": "تبدون",
        "count": 3,
        "refs": [
          "2:33",
          "5:99",
          "24:29"
        ]
      },
      {
        "word": "واعلم",
        "count": 4,
        "refs": [
          "2:33",
          "2:260",
          "7:62",
          "12:86"
        ]
      }
    ]
  },
  {
    "n": 34,
    "arabic": "وَإِذْ قُلْنَا لِلْمَلَٰٓئِكَةِ ٱسْجُدُوا۟ لِءَادَمَ فَسَجَدُوٓا۟ إِلَّآ إِبْلِيسَ أَبَىٰ وَٱسْتَكْبَرَ وَكَانَ مِنَ ٱلْكَٰفِرِينَ",
    "french": "Et lorsque Nous demandâmes aux Anges de se prosterner devant Adam, ils se prosternèrent à l'exception d'Iblis qui refusa, s'enfla d'orgueil et fut parmi les infidèles.",
    "tadabburAr": "الكِبْرُ وَالحَسَدُ أَهْلَكَا إِبْلِيسَ وَأَخْرَجَاهُ مِنَ الرَّحْمَةِ، فَالْكِبْرُ رَأْسُ كُلِّ مَعْصِيَةٍ.",
    "tadabburFr": "L'orgueil et l'envie ont causé la perte d'Iblis et l'ont exclu de la miséricorde divine; l'orgueil est la racine de toute désobéissance.",
    "amalAr": "حَاسِبْ نَفْسَكَ الْيَوْمَ وَاحْذَرِ التَّكَبُّرَ عَلَى أَحَدٍ مِنْ خَلْقِ اللهِ.",
    "amalFr": "Examine ton cœur aujourd'hui et garde-toi de tout sentiment de supériorité envers quiconque.",
    "tawjihAr": "الِاسْتِكْبَارُ عَنْ طَاعَةِ اللهِ وَأَوَامِرِهِ يَقُودُ إِلَى الخُسْرَانِ وَالْكُفْرِ.",
    "tawjihFr": "S'enfler d'orgueil face aux ordres d'Allah mène inévitablement à la ruine et au déni.",
    "words": [
      {
        "word": "واستكبر",
        "count": 3,
        "refs": [
          "2:34",
          "28:39",
          "74:23"
        ]
      },
      {
        "word": "فسجدوا",
        "count": 5,
        "refs": [
          "2:34",
          "7:11",
          "17:61",
          "18:50"
        ]
      },
      {
        "word": "اسجدوا",
        "count": 6,
        "refs": [
          "2:34",
          "7:11",
          "17:61",
          "18:50"
        ]
      }
    ]
  },
  {
    "n": 35,
    "arabic": "وَقُلْنَا يَٰٓـَٔادَمُ ٱسْكُنْ أَنتَ وَزَوْجُكَ ٱلْجَنَّةَ وَكُلَا مِنْهَا رَغَدًا حَيْثُ شِئْتُمَا وَلَا تَقْرَبَا هَٰذِهِ ٱلشَّجَرَةَ فَتَكُونَا مِنَ ٱلظَّٰلِمِينَ",
    "french": "Et Nous dîmes: «O Adam, habite le Paradis toi et ton épouse, et nourrissez-vous-en de partout à votre guise; mais n'approchez pas de l'arbre que voici: sinon vous seriez du nombre des injustes».",
    "tadabburAr": "أَبَاحَ اللهُ لِلإِنْسَانِ الطَّيِّبَاتِ الكَثِيرَةَ وَحَرَّمَ عَلَيْهِ القَلِيلَ لِابْتِلَاءِ طَاعَتِهِ.",
    "tadabburFr": "Allah a rendu l'immense majorité des bonnes choses licites à l'homme et n'en a interdit qu'une minorité pour éprouver son obéissance.",
    "amalAr": "الْتَزِمْ بِحُدُودِ اللهِ الْيَوْمَ وَابْتَعِدْ عَنِ المُحَرَّمَاتِ مَهْمَا بَدَتْ مُغْرِيَةً.",
    "amalFr": "Respecte les limites fixées par Allah aujourd'hui en t'éloignant des interdictions, si tentantes soient-elles.",
    "tawjihAr": "تَجَاوُزُ حُدُودِ اللهِ وَارْتِكاَبُ المَحْظُورَاتِ ظُلْمٌ لِلنَّفْسِ وَسَبَبٌ لِلْحِرْمَانِ.",
    "tawjihFr": "Transgresser les limites d'Allah et commettre des interdits constitue une injustice envers soi-même.",
    "words": [
      {
        "word": "اسكن",
        "count": 2,
        "refs": [
          "2:35",
          "7:19"
        ]
      },
      {
        "word": "وزوجك",
        "count": 2,
        "refs": [
          "2:35",
          "7:19"
        ]
      },
      {
        "word": "شئتما",
        "count": 2,
        "refs": [
          "2:35",
          "7:19"
        ]
      }
    ]
  },
  {
    "n": 36,
    "arabic": "فَأَزَلَّهُمَا ٱلشَّيْطَٰنُ عَنْهَا فَأَخْرَجَهُمَا مِمَّا كَانَا فِيهِ ۖ وَقُلْنَا ٱهْبِطُوا۟ بَعْضُكُمْ لِبَعْضٍ عَدُوٌّۭ ۖ وَلَكُمْ فِى ٱلْأَرْضِ مُسْتَقَرٌّۭ وَمَتَٰعٌ إِلَىٰ حِينٍۢ",
    "french": "Peu de temps après, Satan les fit glisser de là et les fit sortir du lieu où ils étaient. Et Nous dîmes: «Descendez (du Paradis); ennemis les uns des autres. Et pour vous il y aura une demeure sur la terre, et un usufruit pour un temps.",
    "tadabburAr": "الشَّيْطَانُ حَرِيصٌ عَلَى إِخْرَاجِ العَبْدِ مِنْ نَعِيمِ الطَّاعَةِ إِلَى شَقَاءِ المَعْصِيَةِ، وَالدُّنْيَا دَارُ ابْتِلَاءٍ وَمَتَاعٍ مُؤَقَّتٍ.",
    "tadabburFr": "Le Diable cherche sans cesse à arracher l'homme aux délices de l'obéissance pour le plonger dans le malheur du péché; la terre n'est qu'un séjour d'épreuve éphémère.",
    "amalAr": "اسْتَعِذْ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ عِنْدَ وُرُودِ الخَوَاطِرِ السَّيِّئَةِ.",
    "amalFr": "Cherche refuge auprès d'Allah contre le Diable dès qu'une mauvaise pensée t'effleure.",
    "tawjihAr": "الحَذَرُ الدَّائِمُ مِنْ خُطُوَاتِ الشَّيْطَانِ كَيْ لَا تُزِيلَ العَبْدَ عَنْ طَرِيقِ الجَنَّةِ.",
    "tawjihFr": "Maintiens une vigilance constante face aux pièges du Diable pour ne pas dévier du chemin du Paradis.",
    "words": [
      {
        "word": "كانا",
        "count": 2,
        "refs": [
          "2:36",
          "5:75"
        ]
      },
      {
        "word": "اهبطوا",
        "count": 4,
        "refs": [
          "2:36",
          "2:38",
          "2:61",
          "7:24"
        ]
      },
      {
        "word": "مستقر",
        "count": 5,
        "refs": [
          "2:36",
          "6:67",
          "7:24",
          "54:3"
        ]
      }
    ]
  },
  {
    "n": 37,
    "arabic": "فَتَلَقَّىٰٓ ءَادَمُ مِن رَّبِّهِۦ كَلِمَٰتٍۢ فَتَابَ عَلَيْهِ ۚ إِنَّهُۥ هُوَ ٱلتَّوَّابُ ٱلرَّحِيمُ",
    "french": "Puis Adam reçut de son Seigneur des paroles, et Allah agréa son repentir car c'est Lui certes, le Repentant, le Miséricordieux.",
    "tadabburAr": "مِنْ رَحْمَةِ اللَّهِ بِالعَبْدِ أَنْ يُوَفِّقَهُ لِلتَّوْبَةِ وَيُعَلِّمَهُ كَيْفَ يَعْتَذِرُ، فَاللَّهُ هُوَ التَّوَّابُ الرَّحِيمُ.",
    "tadabburFr": "C'est une clémence d'Allah d'accorder au serviteur la capacité de se repentir et de lui enseigner comment implorer Son pardon, car Il est le Grand Accueillant au repentir.",
    "amalAr": "جَدِّدْ تَوْبَتَكَ اليَوْمَ بِاسْتِغْفَارٍ صَادِقٍ مَعَ حُضُورِ القَلْبِ.",
    "amalFr": "Renouvelle ton repentir aujourd'hui par une demande de pardon sincère et consciente.",
    "tawjihAr": "التَّوْبَةُ هِيَ مَفْتَاحُ العَوْدَةِ إِلَى اللَّهِ بَعْدَ كُلِّ زَلَّةٍ.",
    "tawjihFr": "Le repentir est la clé pour revenir vers Allah après chaque faux pas.",
    "words": [
      {
        "word": "فتلقي",
        "count": 2,
        "refs": [
          "2:37",
          "17:39"
        ]
      },
      {
        "word": "كلمت",
        "count": 5,
        "refs": [
          "6:115",
          "7:137",
          "10:33",
          "10:96"
        ]
      },
      {
        "word": "فتاب",
        "count": 5,
        "refs": [
          "2:37",
          "2:54",
          "2:187",
          "20:122"
        ]
      }
    ]
  },
  {
    "n": 38,
    "arabic": "قُلْنَا ٱهْبِطُوا۟ مِنْهَا جَمِيعًۭا ۖ فَإِمَّا يَأْتِيَنَّكُم مِّنِّى هُدًۭى فَمَن تَبِعَ هُدَاىَ فَلَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ",
    "french": "- Nous dîmes: «Descendez d'ici, vous tous! Toutes les fois que Je vous enverrai un guide, ceux qui [le] suivront n'auront rien à craindre et ne seront point affligés».",
    "tadabburAr": "الأَمْنُ التَّامُّ وَالسَّعَادَةُ الحَقِيقِيَّةُ المُنَزَّهَةُ عَنِ الخَوْفِ وَالحُزْنِ لَا تُنَالُ إِلَّا بِاتِّبَاعِ هُدَى اللَّهِ.",
    "tadabburFr": "La vraie sécurité et la sérénité absolue, exemptes de peur et d'affliction, ne s'obtiennent qu'en suivant la guidée divine.",
    "amalAr": "اتَّبِعْ سُنَّةً نَبَوِيَّةً اليَوْمَ حِرْصًا عَلَى لُزُومِ هُدَى اللَّهِ.",
    "amalFr": "Applique une Sunnah du Prophète aujourd'hui afin de t'accrocher à la guidée d'Allah.",
    "tawjihAr": "اتِّبَاعُ الوَحْيِ هُوَ الأَمَانُ الوَحِيدُ مِنْ مَخَاوِفِ الدُّنْيَا وَالأَخِرَةِ.",
    "tawjihFr": "Suivre la Révélation est le seul rempart contre les frayeurs de ce monde et de l'au-delà.",
    "words": [
      {
        "word": "هداي",
        "count": 2,
        "refs": [
          "2:38",
          "20:123"
        ]
      },
      {
        "word": "ياتينكم",
        "count": 3,
        "refs": [
          "2:38",
          "7:35",
          "20:123"
        ]
      },
      {
        "word": "اهبطوا",
        "count": 4,
        "refs": [
          "2:36",
          "2:38",
          "2:61",
          "7:24"
        ]
      }
    ]
  },
  {
    "n": 39,
    "arabic": "وَٱلَّذِينَ كَفَرُوا۟ وَكَذَّبُوا۟ بِـَٔايَٰتِنَآ أُو۟لَٰٓئِكَ أَصْحَٰبُ ٱلنَّارِ ۖ هُمْ فِيهَا خَٰلِدُونَ",
    "french": "Et ceux qui ne croient pas (à nos messagers) et traitent de mensonge Nos révélations, ceux-là sont les gens du Feu où ils demeureront éternellement.",
    "tadabburAr": "التَّكْذِيبُ بِآيَاتِ اللَّهِ وَالعِنَادُ سَبَبُ الخُلُودِ فِي العَذَابِ، فَالوَاجِبُ التَّسْلِيمُ لِلْحَقِّ.",
    "tadabburFr": "Le reniement des signes d'Allah et l'obstination conduisent au châtiment éternel; la soumission à la Vérité est donc une obligation.",
    "amalAr": "اقْرَأْ آيَاتٍ مِنَ القُرْآنِ بِتَدَبُّرٍ وَتَسْلِيمٍ لِمَا فِيهَا.",
    "amalFr": "Lis quelques versets du Coran avec méditation et une totale soumission à leur message.",
    "tawjihAr": "الخَوْفُ مِنْ سُوءِ العَاقِبَةِ يَحْثُّ العَبْدَ عَلَى الثَّبَاتِ عَلَى الإِيمَانِ.",
    "tawjihFr": "La crainte d'une fin tragique doit inciter le serviteur à fermement s'accrocher à la foi.",
    "words": [
      {
        "word": "وكذبوا",
        "count": 10,
        "refs": [
          "2:39",
          "5:10",
          "5:86",
          "22:57"
        ]
      },
      {
        "word": "النار",
        "count": 102,
        "refs": [
          "2:24",
          "2:39",
          "2:80",
          "2:81"
        ]
      },
      {
        "word": "اولئك",
        "count": 133,
        "refs": [
          "2:5",
          "2:16",
          "2:27",
          "2:39"
        ]
      }
    ]
  },
  {
    "n": 40,
    "arabic": "يَٰبَنِىٓ إِسْرَٰٓءِيلَ ٱذْكُرُوا۟ نِعْمَتِىَ ٱلَّتِىٓ أَنْعَمْتُ عَلَيْكُمْ وَأَوْفُوا۟ بِعَهْدِىٓ أُوفِ بِعَهْدِكُمْ وَإِيَّٰىَ فَٱرْهَبُونِ",
    "french": "O enfants d'Israël, rappelez-vous Mon bienfait dont Je vous ai comblés. Si vous tenez vos engagements vis-à-vis de Moi, Je tiendrai les miens. Et c'est Moi que vous devez redouter.",
    "tadabburAr": "شُكْرُ النِّعَمِ وَالوَفَاءُ بِالعُهُودِ مَعَ اللَّهِ هُمَا أَسَاسُ الفَلَاحِ وَنَيْلِ المَغْفِرَةِ.",
    "tadabburFr": "La reconnaissance envers les bienfaits et le respect des engagements envers Allah forment le socle du succès et du pardon.",
    "amalAr": "اذْكُرْ ثَلَاثَ نِعَمٍ أَنْعَمَ اللَّهُ بِهَا عَلَيْكَ اليَوْمَ وَاشْكُرْهُ عَلَيْهَا.",
    "amalFr": "Énumère trois bienfaits qu'Allah t'a accordés aujourd'hui et remercie-Le sincèrement.",
    "tawjihAr": "الوَفَاءُ بِعَهْدِ اللَّهِ يُوجِبُ الوَفَاءَ مِنْهُ سُبْحَانَهُ بِالوَعْدِ.",
    "tawjihFr": "Respecter le pacte envers Allah garantit l'accomplissement de Sa promesse.",
    "words": [
      {
        "word": "فارهبون",
        "count": 2,
        "refs": [
          "2:40",
          "16:51"
        ]
      },
      {
        "word": "واوفوا",
        "count": 5,
        "refs": [
          "2:40",
          "6:152",
          "16:91",
          "17:34"
        ]
      },
      {
        "word": "نعمتي",
        "count": 6,
        "refs": [
          "2:40",
          "2:47",
          "2:122",
          "2:150"
        ]
      }
    ]
  },
  {
    "n": 41,
    "arabic": "وَءَامِنُوا۟ بِمَآ أَنزَلْتُ مُصَدِّقًۭا لِّمَا مَعَكُمْ وَلَا تَكُونُوٓا۟ أَوَّلَ كَافِرٍۭ بِهِۦ ۖ وَلَا تَشْتَرُوا۟ بِـَٔايَٰتِى ثَمَنًۭا قَلِيلًۭا وَإِيَّٰىَ فَٱتَّقُونِ",
    "french": "Et croyez à ce que J'ai fait descendre, en confirmation de ce qui était déjà avec vous; et ne soyez pas les premiers à le rejeter. Et n'échangez pas Mes révélations contre un vil prix. Et c'est Moi que vous devez craindre.",
    "tadabburAr": "إِيثَارُ الدُّنْيَا عَلَى الآخِرَةِ يَحْمِلُ الإِنْسَانَ عَلَى رَفْضِ الحَقِّ وَبَيْعِ الآيَاتِ بِثَمَنٍ بَخْسٍ.",
    "tadabburFr": "Préférer ce monde à l'au-delà pousse l'homme à rejeter la vérité et à troquer les versets divins contre un vil profit.",
    "amalAr": "قَدِّمْ طَاعَةً للهِ عَلَى مَصْلَحَةٍ دُنْيَوِيَّةٍ عَاجِلَةٍ تَعْرِضُ لَكَ.",
    "amalFr": "Préfère un acte d'obéissance envers Allah à un intérêt matériel éphémère qui se présente à toi.",
    "tawjihAr": "الحَذَرُ مِنْ بَيْعِ الدِّينِ أَوْ مُدَاهَنَةِ البَاطِلِ لأَجْلِ مَكْتَسَبَاتٍ دُنْيَوِيَّةٍ.",
    "tawjihFr": "Prends garde à ne pas compromettre ta religion ni à transiger avec le faux pour des gains terrestres.",
    "words": [
      {
        "word": "كافر",
        "count": 3,
        "refs": [
          "2:41",
          "2:217",
          "64:2"
        ]
      },
      {
        "word": "تشتروا",
        "count": 3,
        "refs": [
          "2:41",
          "5:44",
          "16:95"
        ]
      },
      {
        "word": "فاتقون",
        "count": 4,
        "refs": [
          "2:41",
          "16:2",
          "23:52",
          "39:16"
        ]
      }
    ]
  },
  {
    "n": 42,
    "arabic": "وَلَا تَلْبِسُوا۟ ٱلْحَقَّ بِٱلْبَٰطِلِ وَتَكْتُمُوا۟ ٱلْحَقَّ وَأَنتُمْ تَعْلَمُونَ",
    "french": "Et ne mêlez pas le faux à la vérité. Ne cachez pas sciemment la vérité.",
    "tadabburAr": "خَلْطُ الحَقِّ بِالبَاطِلِ وَكِتْمَانُ العِلْمِ جَرِيمَةٌ يُضَلَّلُ بِهَا النَّاسُ وَتُخْفَى بِهَا الهِدَايَةُ.",
    "tadabburFr": "Mélanger le faux à la vérité et dissimuler le savoir est un crime qui égare les gens et occulte la guidée.",
    "amalAr": "قُلِ الحَقَّ فِي مَوْقِفٍ تُسْأَلُ فِيهِ وَلاَ تَكْتُمْ الشَّهَادَةَ.",
    "amalFr": "Dis la vérité lorsqu'on t'interroge et ne dissimule pas ton témoignage.",
    "tawjihAr": "الوُضُوحُ وَالبَيَانُ وَنَشْرُ الحَقِّ مِنْ أَعْظَمِ أَمَانَاتِ أَهْلِ العِلْمِ وَالإِيمَانِ.",
    "tawjihFr": "La clarté et la diffusion de la vérité comptent parmi les plus grands dépôts confiés aux croyants.",
    "words": [
      {
        "word": "وانتم",
        "count": 45,
        "refs": [
          "2:22",
          "2:42",
          "2:44",
          "2:50"
        ]
      },
      {
        "word": "تعلمون",
        "count": 56,
        "refs": [
          "2:22",
          "2:30",
          "2:42",
          "2:80"
        ]
      },
      {
        "word": "الحق",
        "count": 109,
        "refs": [
          "2:26",
          "2:42",
          "2:42",
          "2:61"
        ]
      }
    ]
  },
  {
    "n": 43,
    "arabic": "وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ وَٱرْكَعُوا۟ مَعَ ٱلرَّٰكِعِينَ",
    "french": "Et accomplissez la Salât, et acquittez la Zakât, et inclinez-vous avec ceux qui s'inclinent.",
    "tadabburAr": "إِقَامَةُ الصَّلَاةِ وَإِيتَاءُ الزَّكَاةِ حَصَانَةٌ لِلْمُجْتَمَعِ، وَصَلَاةُ الْجَمَاعَةِ تَقْوِيَةٌ لِلرَّوَابِطِ الإِيمَانِيَّةِ.",
    "tadabburFr": "L'accomplissement de la prière et l'acquittement de la Zakat préservent la foi, et la prière en groupe renforce les liens de la communauté.",
    "amalAr": "حَافِظْ عَلَى صَلَاةِ الْجَمَاعَةِ فِي الْمَسْجِدِ الْيَوْمَ.",
    "amalFr": "Accomplissez la prière obligatoire en congrégation à la mosquée aujourd'hui.",
    "tawjihAr": "العِبَادَةُ المَشْرُوعَةُ فِي جَمَاعَةٍ تُعَزِّزُ التَّآخِيَ وَتَصُونُ المَرْءَ مِنَ الِانْحِرَافِ.",
    "tawjihFr": "L'adoration collective renforce la fraternité et préserve l'individu de l'égarement.",
    "words": [
      {
        "word": "واقيموا",
        "count": 11,
        "refs": [
          "2:43",
          "2:83",
          "2:110",
          "4:77"
        ]
      }
    ]
  },
  {
    "n": 44,
    "arabic": "۞ أَتَأْمُرُونَ ٱلنَّاسَ بِٱلْبِرِّ وَتَنسَوْنَ أَنفُسَكُمْ وَأَنتُمْ تَتْلُونَ ٱلْكِتَٰبَ ۚ أَفَلَا تَعْقِلُونَ",
    "french": "Commanderez-vous aux gens de faire le bien, et vous oubliez vous-mêmes de le faire, alors que vous récitez le Livre? Etes-vous donc dépourvus de raison?",
    "tadabburAr": "ذَمَّ اللَّهُ مَنْ يَأْمُرُ بِالْخَيْرِ وَيَنْسَى نَفْسَهُ، فَالْعَالِمُ يُتَبَّعُ بِعَمَلِهِ قَبْلَ قَوْلِهِ.",
    "tadabburFr": "Allah blâme celui qui ordonne le bien tout en s'oubliant lui-même; la science doit se traduire d'abord par les actes.",
    "amalAr": "ابْدَأْ بِنَفْسِكَ فِعْلِيًّا فِي حَسَنَةٍ تَأْمُرُ بِهَا غَيْرَكَ.",
    "amalFr": "Mettez concrètement en pratique un conseil de bien que vous donnez souvent aux autres.",
    "tawjihAr": "التَّوَافُقُ بَيْنَ الْقَوْلِ وَالْعَمَلِ أَمَارَةُ العَقْلِ وَصِدْقِ الإِيمَانِ.",
    "tawjihFr": "La cohérence entre les paroles et les actes est la marque de la raison et de la sincérité.",
    "words": [
      {
        "word": "بالبر",
        "count": 2,
        "refs": [
          "2:44",
          "58:9"
        ]
      },
      {
        "word": "وتنسون",
        "count": 2,
        "refs": [
          "2:44",
          "6:41"
        ]
      },
      {
        "word": "تعقلون",
        "count": 24,
        "refs": [
          "2:44",
          "2:73",
          "2:76",
          "2:242"
        ]
      }
    ]
  },
  {
    "n": 45,
    "arabic": "وَٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى ٱلْخَٰشِعِينَ",
    "french": "Et cherchez secours dans l'endurance et la salât: certes, la Salât est une lourde obligation, sauf pour les humbles,",
    "tadabburAr": "الصَّبْرُ وَالصَّلَاةُ زَادُ الْمُؤْمِنِ فِي المَشَاقِّ، وَتَخِفُّ أَعْبَاؤُهُمَا عَلَى الخَاشِعِينَ المَخْبِتِينَ.",
    "tadabburFr": "La patience et la prière sont les meilleurs soutiens face aux épreuves, et elles ne sont légères que pour les cœurs humbles.",
    "amalAr": "إِذَا أَهَمَّكَ أَمْرٌ الْيَوْمَ، فَافْزَعْ إِلَى الصَّلَاةِ وَاسْتَعِنْ بِالصَّبْرِ.",
    "amalFr": "Face à une difficulté aujourd'hui, réfugiez-vous dans la prière avec patience.",
    "tawjihAr": "الْخُشُوعُ لِلَّهِ يُحَوِّلُ الْعِبَادَةَ مِنْ مَشَقَّةٍ إِلَى رَاحَةٍ وَسَكِينَةٍ.",
    "tawjihFr": "L'humilité envers Allah transforme l'adoration en une source de paix et de réconfort.",
    "words": [
      {
        "word": "وانها",
        "count": 2,
        "refs": [
          "2:45",
          "15:76"
        ]
      },
      {
        "word": "لكبيره",
        "count": 2,
        "refs": [
          "2:45",
          "2:143"
        ]
      },
      {
        "word": "بالصبر",
        "count": 4,
        "refs": [
          "2:45",
          "2:153",
          "90:17",
          "103:3"
        ]
      }
    ]
  },
  {
    "n": 46,
    "arabic": "ٱلَّذِينَ يَظُنُّونَ أَنَّهُم مُّلَٰقُوا۟ رَبِّهِمْ وَأَنَّهُمْ إِلَيْهِ رَٰجِعُونَ",
    "french": "qui ont la certitude de rencontrer leur Seigneur (après leur résurrection) et retourner à Lui seul.",
    "tadabburAr": "اليَقِينُ بِلِقَاءِ اللَّهِ وَالرُّجُوعِ إِلَيْهِ هُوَ مَثَارُ الخُشُوعِ وَسِرُّ الاِسْتِقَامَةِ.",
    "tadabburFr": "La certitude de rencontrer Allah et de retourner à Lui est la source de l'humilité et le secret de la droiture.",
    "amalAr": "اسْتَحْضِرْ وُقُوفَكَ بَيْنَ يَدَيِ اللَّهِ أَبَّانَ صَلَاتِكَ الْقَادِمَةِ.",
    "amalFr": "Représentez-vous votre station devant Allah lors de votre prochaine prière.",
    "tawjihAr": "التَّفَكُّرُ فِي المَعَادِ يُصْلِحُ الْقَلْبَ وَيَزْهَدُ فِي الفَانِيَاتِ.",
    "tawjihFr": "La méditation sur l'Au-delà réforme le cœur et détache des vanités d'ici-bas.",
    "words": [
      {
        "word": "يظنون",
        "count": 5,
        "refs": [
          "2:46",
          "2:78",
          "2:249",
          "3:154"
        ]
      },
      {
        "word": "وانهم",
        "count": 16,
        "refs": [
          "2:46",
          "5:82",
          "6:28",
          "11:76"
        ]
      },
      {
        "word": "اليه",
        "count": 76,
        "refs": [
          "2:28",
          "2:46",
          "2:156",
          "2:178"
        ]
      }
    ]
  },
  {
    "n": 47,
    "arabic": "يَٰبَنِىٓ إِسْرَٰٓءِيلَ ٱذْكُرُوا۟ نِعْمَتِىَ ٱلَّتِىٓ أَنْعَمْتُ عَلَيْكُمْ وَأَنِّى فَضَّلْتُكُمْ عَلَى ٱلْعَٰلَمِينَ",
    "french": "O Enfants d'Israël, rappelez-vous Mon bienfait dont Je vous ai comblés, (Rappelez-vous) que Je vous ai préférés à tous les peuples (de l'époque).",
    "tadabburAr": "التَّذْكِيرُ بِنِعَمِ اللَّهِ يَسْتَوْجِبُ الشُّكْرَ، وَالتَّفْضِيلُ مَرْهُونٌ بِالطَّاعَةِ وَالاِتِّبَاعِ.",
    "tadabburFr": "Le rappel des bienfaits d'Allah exige de la gratitude, et la précellence dépend de l'obéissance.",
    "amalAr": "اشْكُرِ اللَّهَ الْيَوْمَ عَلَى نِعْمَةِ الإِسْلَامِ وَالْهِدَايَةِ.",
    "amalFr": "Remerciez Allah aujourd'hui pour le bienfait de l'Islam et de la guidée.",
    "tawjihAr": "النِّعَمُ مَوَاهِبُ مِنَ اللَّهِ تَوْجِبُ الشُّكْرَ وَتَمْنَعُ الْكِبْرَ.",
    "tawjihFr": "Les faveurs divines imposent la reconnaissance et excluent l'orgueil.",
    "words": [
      {
        "word": "فضلتكم",
        "count": 2,
        "refs": [
          "2:47",
          "2:122"
        ]
      },
      {
        "word": "نعمتي",
        "count": 6,
        "refs": [
          "2:40",
          "2:47",
          "2:122",
          "2:150"
        ]
      },
      {
        "word": "انعمت",
        "count": 7,
        "refs": [
          "1:7",
          "2:40",
          "2:47",
          "2:122"
        ]
      }
    ]
  },
  {
    "n": 48,
    "arabic": "وَٱتَّقُوا۟ يَوْمًۭا لَّا تَجْزِى نَفْسٌ عَن نَّفْسٍۢ شَيْـًۭٔا وَلَا يُقْبَلُ مِنْهَا شَفَٰعَةٌۭ وَلَا يُؤْخَذُ مِنْهَا عَدْلٌۭ وَلَا هُمْ يُنصَرُونَ",
    "french": "Et redoutez le jour où nulle âme ne suffira en quoi que ce soit à une autre; où l'on n'acceptera d'elle aucune intercession; et où on ne recevra d'elle aucune compensation. Et ils ne seront point secourus.",
    "tadabburAr": "يَوْمُ الْقِيَامَةِ يَوْمُ العَدْلِ المُلْقَى؛ فَلَا شَفَاعَةَ وَلَا فِدْيَةَ يَوْمَئِذٍ لِلْكَافِرِينَ.",
    "tadabburFr": "Le Jour de la Résurrection est le jour de la justice absolue; aucune intercession ni rançon ne profitera aux dénégateurs.",
    "amalAr": "حَاسِبْ نَفْسَكَ عَلَى تَقْصِيرِكَ قَبْلَ أَنْ تُحَاسَبَ يَوْمَ القِيَامَةِ.",
    "amalFr": "Demandez-vous des comptes sur vos manquements aujourd'hui avant d'être jugé le Jour Dernier.",
    "tawjihAr": "النَّجَاةُ فِي الآخِرَةِ مَرْهُونَةٌ بِالإِيمَانِ وَالْعَمَلِ الصَّالِحِ الفَرْدِيِّ.",
    "tawjihFr": "Le salut dans l'Au-delà dépend de la foi et des actes pieux personnels.",
    "words": [
      {
        "word": "تجزي",
        "count": 4,
        "refs": [
          "2:48",
          "2:123",
          "40:17",
          "92:19"
        ]
      },
      {
        "word": "يؤخذ",
        "count": 4,
        "refs": [
          "2:48",
          "6:70",
          "7:169",
          "57:15"
        ]
      },
      {
        "word": "يقبل",
        "count": 6,
        "refs": [
          "2:48",
          "2:123",
          "3:85",
          "3:91"
        ]
      }
    ]
  },
  {
    "n": 49,
    "arabic": "وَإِذْ نَجَّيْنَٰكُم مِّنْ ءَالِ فِرْعَوْنَ يَسُومُونَكُمْ سُوٓءَ ٱلْعَذَابِ يُذَبِّحُونَ أَبْنَآءَكُمْ وَيَسْتَحْيُونَ نِسَآءَكُمْ ۚ وَفِى ذَٰلِكُم بَلَآءٌۭ مِّن رَّبِّكُمْ عَظِيمٌۭ",
    "french": "Et [rappelez-vous] lorsque Nous vous avons délivrés des gens de Pharaon; qui vous infligeaient le pire châtiment: en égorgeant vos fils et épargnant vos femmes. C'était là une grande épreuve de la part de votre Seigneur.",
    "tadabburAr": "التَّنْجِيَةُ مِنَ الظُّلْمِ وَالْبَلَاءِ نِعْمَةٌ جَسِيمَةٌ تَسْتَدْعِي العِبْرَةَ وَدَوَامَ الشُّكْرِ.",
    "tadabburFr": "La délivrance de l'oppression et des épreuves est un immense bienfait qui appelle la méditation et la gratitude constante.",
    "amalAr": "ادْعُ اللَّهَ الْيَوْمَ أَنْ يَرْفَعَ الْبَلَاءَ عَنِ الْمُسْتَضْعَفِينَ فِي كُلِّ مَكَانٍ.",
    "amalFr": "Invoquez Allah aujourd'hui pour qu'Il soulage les opprimés à travers le monde.",
    "tawjihAr": "الشَّدَائِدُ مَهْمَا عَظُمَتْ فَالْفَرَجُ بِيَدِ اللَّهِ وَحْدَهُ.",
    "tawjihFr": "Quelle que soit l'ampleur de l'épreuve, la délivrance appartient à Allah seul.",
    "words": [
      {
        "word": "يسومونكم",
        "count": 3,
        "refs": [
          "2:49",
          "7:141",
          "14:6"
        ]
      },
      {
        "word": "ويستحيون",
        "count": 3,
        "refs": [
          "2:49",
          "7:141",
          "14:6"
        ]
      },
      {
        "word": "نساءكم",
        "count": 3,
        "refs": [
          "2:49",
          "7:141",
          "14:6"
        ]
      }
    ]
  },
  {
    "n": 50,
    "arabic": "وَإِذْ فَرَقْنَا بِكُمُ ٱلْبَحْرَ فَأَنجَيْنَٰكُمْ وَأَغْرَقْنَآ ءَالَ فِرْعَوْنَ وَأَنتُمْ تَنظُرُونَ",
    "french": "Et [rappelez-vous] lorsque Nous avons fendu la mer pour vous donner passage!... Nous vous avons donc délivrés, et noyé les gens de Pharaon, tandis que vous regardiez.",
    "tadabburAr": "إِنَّ اللَّهَ قَادِرٌ عَلَى نَصْرِ أَوْلِيَائِهِ وَإِهْلَاكِ الظَّالِمِينَ فِي لَحْظَةٍ وَاحِدَةٍ.",
    "tadabburFr": "Allah est capable de secourir Ses alliés et d'anéantir les tyrans en un instant.",
    "amalAr": "احْمَدِ اللَّهَ الْيَوْمَ عَلَى أَنْ نَجَّاكَ مِنْ كُرَبٍ سَابِقَةٍ.",
    "amalFr": "Loue Allah aujourd'hui pour t'avoir sauvé d'épreuves passées.",
    "tawjihAr": "النَّصْرُ مَقْرُونٌ بِالصَّبْرِ وَالتَّوَكُّلِ عَلَى اللَّهِ.",
    "tawjihFr": "La victoire est liée à la patience et à la confiance en Allah.",
    "words": [
      {
        "word": "واغرقنا",
        "count": 4,
        "refs": [
          "2:50",
          "7:64",
          "8:54",
          "10:73"
        ]
      },
      {
        "word": "تنظرون",
        "count": 7,
        "refs": [
          "2:50",
          "2:55",
          "3:143",
          "7:195"
        ]
      },
      {
        "word": "البحر",
        "count": 23,
        "refs": [
          "2:50",
          "2:164",
          "5:96",
          "7:138"
        ]
      }
    ]
  },
  {
    "n": 51,
    "arabic": "وَإِذْ وَٰعَدْنَا مُوسَىٰٓ أَرْبَعِينَ لَيْلَةًۭ ثُمَّ ٱتَّخَذْتُمُ ٱلْعِجْلَ مِنۢ بَعْدِهِۦ وَأَنتُمْ ظَٰلِمُونَ",
    "french": "Et [rappelez-vous] lorsque Nous donnâmes rendez-vous à Moïse pendant quarante nuits!... Puis en son absence vous avez pris le Veau pour idole alors que vous étiez injustes (à l'égard de vous-mêmes en adorant autre qu'Allah).",
    "tadabburAr": "خَطَرُ الْانْتِكَاسَةِ فِي العِبَادَةِ يَزْدَادُ عِنْدَ غِيَابِ الْمُوَجِّهِ.",
    "tadabburFr": "Le risque de récidiver dans le péché augmente en l'absence de rappel.",
    "amalAr": "حَافِظْ عَلَى إِيمَانِكَ وَعِبَادَتِكَ حَتَّى فِي أَوْقَاتِ عُزْلَتِكَ.",
    "amalFr": "Préserve ta foi et tes adorations même lorsque tu es isolé.",
    "tawjihAr": "إِشْرَاكُ غَيْرِ اللَّهِ مَعَهُ هُوَ أَعْظَمُ أَنَّوَاعِ الظُّلْمِ.",
    "tawjihFr": "Associer quoi que ce soit à Allah constitue la plus grande des injustices.",
    "words": [
      {
        "word": "اربعين",
        "count": 4,
        "refs": [
          "2:51",
          "5:26",
          "7:142",
          "46:15"
        ]
      },
      {
        "word": "وعدنا",
        "count": 5,
        "refs": [
          "7:44",
          "23:83",
          "27:68",
          "33:12"
        ]
      },
      {
        "word": "اتخذتم",
        "count": 5,
        "refs": [
          "2:51",
          "2:80",
          "2:92",
          "29:25"
        ]
      }
    ]
  },
  {
    "n": 52,
    "arabic": "ثُمَّ عَفَوْنَا عَنكُم مِّنۢ بَعْدِ ذَٰلِكَ لَعَلَّكُمْ تَشْكُرُونَ",
    "french": "Mais en dépit de cela Nous vous pardonnâmes, afin que vous reconnaissiez (Nos bienfaits à votre égard).",
    "tadabburAr": "سَعَةُ عَفْوِ اللَّهِ تَقْتَضِي مِنْ العَبْدِ دَوَامَ الشُّكْرِ وَالاسْتِغْفَارِ.",
    "tadabburFr": "L'immensité du pardon d'Allah exige du serviteur une gratitude constante.",
    "amalAr": "اسْتَغْفِرِ اللَّهَ وَاشْكُرْهُ عَلَى سِتْرِهِ وَعَفْوِهِ عَنْ زَلَّاتِكَ.",
    "amalFr": "Demande pardon à Allah et remercie-Le d'avoir couvert tes fautes.",
    "tawjihAr": "العَفْوُ الإِلَهِيُّ بَابٌ لِتَجْدِيدِ العَهْدِ مَعَ اللَّهِ.",
    "tawjihFr": "Le pardon divin est une opportunité pour renouveler son engagement envers Allah.",
    "words": [
      {
        "word": "تشكرون",
        "count": 19,
        "refs": [
          "2:52",
          "2:56",
          "2:185",
          "3:123"
        ]
      },
      {
        "word": "عنكم",
        "count": 24,
        "refs": [
          "2:52",
          "2:187",
          "2:271",
          "3:152"
        ]
      },
      {
        "word": "لعلكم",
        "count": 59,
        "refs": [
          "2:21",
          "2:52",
          "2:53",
          "2:56"
        ]
      }
    ]
  },
  {
    "n": 53,
    "arabic": "وَإِذْ ءَاتَيْنَا مُوسَى ٱلْكِتَٰبَ وَٱلْفُرْقَانَ لَعَلَّكُمْ تَهْتَدُونَ",
    "french": "Et [rappelez-vous] lorsque Nous avons donné à Moïse le Livre et le Discernement afin que vous soyez guidés.",
    "tadabburAr": "الْكِتَابُ المُنَزَّلُ هُوَ المِعْيَارُ الحَقِيقِيُّ لِلتَّمْيِيزِ بَيْنَ الْحَقِّ وَالْبَاطِلِ.",
    "tadabburFr": "Le Livre révélé est le véritable critère pour discerner le vrai du faux.",
    "amalAr": "اقْرَأْ آيَاتٍ مِنَ القُرْآنِ بِتَدَبُّرٍ لِتَهْتَدِيَ بِهِ فِي حَيَاتِكَ.",
    "amalFr": "Lis des versets du Coran avec méditation pour t'en guider dans ta vie.",
    "tawjihAr": "الهِدَايَةُ لاَ تُنَالُ إِلاَّ بِالاتِّبَاعِ الصَّادِقِ لِوَحْيِ اللَّهِ.",
    "tawjihFr": "La guidée ne s'obtient que par le suivi sincère de la révélation d'Allah.",
    "words": [
      {
        "word": "والفرقان",
        "count": 2,
        "refs": [
          "2:53",
          "2:185"
        ]
      },
      {
        "word": "تهتدون",
        "count": 6,
        "refs": [
          "2:53",
          "2:150",
          "3:103",
          "7:158"
        ]
      },
      {
        "word": "لعلكم",
        "count": 59,
        "refs": [
          "2:21",
          "2:52",
          "2:53",
          "2:56"
        ]
      }
    ]
  },
  {
    "n": 54,
    "arabic": "وَإِذْ قَالَ مُوسَىٰ لِقَوْمِهِۦ يَٰقَوْمِ إِنَّكُمْ ظَلَمْتُمْ أَنفُسَكُم بِٱتِّخَاذِكُمُ ٱلْعِجْلَ فَتُوبُوٓا۟ إِلَىٰ بَارِئِكُمْ فَٱقْتُلُوٓا۟ أَنفُسَكُمْ ذَٰلِكُمْ خَيْرٌۭ لَّكُمْ عِندَ بَارِئِكُمْ فَتَابَ عَلَيْكُمْ ۚ إِنَّهُۥ هُوَ ٱلتَّوَّابُ ٱلرَّحِيمُ",
    "french": "Et [rappelez-vous] lorsque Moïse dit à son peuple: «O mon peuple, certes vous vous êtes fait du tort à vous-mêmes en prenant le Veau pour idole. Revenez donc à votre Créateur; puis, tuez donc les coupables vous-mêmes: ce serait mieux pour vous, auprès de votre Créateur!»... C'est ainsi qu'Il agréa votre repentir; car c'est Lui, certes, le Repentant et le Miséricordieux!",
    "tadabburAr": "التَّوْبَةُ الصَّادِقَةُ تَتَطَلَّبُ الانْكِسَارَ وَالرُّجُوعَ التَّامَّ إِلَى الخَالِقِ.",
    "tadabburFr": "Le repentir sincère exige l'humilité et un retour total vers le Créateur.",
    "amalAr": "بَادِرْ بِالتَّوْبَةِ النَّصُوحِ اليَوْمَ مِنْ ذَنْبٍ تُكَرِّرُهُ.",
    "amalFr": "Empresse-toi de faire un repentir sincère aujourd'hui pour un péché répété.",
    "tawjihAr": "الرُّجُوعُ إِلَى اللَّهِ هُوَ السَّبِيلُ الوَحِيدُ لِنَجَاةِ النَّفْسِ.",
    "tawjihFr": "Le retour vers Allah est le seul moyen de sauver son âme.",
    "words": [
      {
        "word": "ظلمتم",
        "count": 2,
        "refs": [
          "2:54",
          "43:39"
        ]
      },
      {
        "word": "بارئكم",
        "count": 2,
        "refs": [
          "2:54",
          "2:54"
        ]
      },
      {
        "word": "فاقتلوا",
        "count": 2,
        "refs": [
          "2:54",
          "9:5"
        ]
      }
    ]
  },
  {
    "n": 55,
    "arabic": "وَإِذْ قُلْتُمْ يَٰمُوسَىٰ لَن نُّؤْمِنَ لَكَ حَتَّىٰ نَرَى ٱللَّهَ جَهْرَةًۭ فَأَخَذَتْكُمُ ٱلصَّٰعِقَةُ وَأَنتُمْ تَنظُرُونَ",
    "french": "Et [rappelez-vous] lorsque vous dites: «O Moïse, nous ne te croirons qu'après avoir vu Allah clairement»!... Alors la foudre vous saisit tandis que vous regardiez.",
    "tadabburAr": "العَنَادُ وَطَلَبُ المَادِّيَّاتِ فِي غَيْرِ مَوْضِعِهَا يُؤَدِّي إِلَى العُقُوبَةِ.",
    "tadabburFr": "L'entêtement et l'exigence de preuves matérielles abusives mènent au châtiment.",
    "amalAr": "سَلِّمْ لِأَمْرِ اللَّهِ وَلاَ تَشْتَرِطْ لِلإِيمَانِ شُرُوطًا عَنِيدَةً.",
    "amalFr": "Soumets-toi à l'ordre d'Allah sans poser de conditions obstinées à ta foi.",
    "tawjihAr": "الإِيمَانُ بِالغَيْبِ أُصُولُ العِبَادَةِ وَالتَّسْلِيمِ لِلَّهِ.",
    "tawjihFr": "La foi en l'invisible est le fondement de l'adoration et de la soumission.",
    "words": [
      {
        "word": "جهره",
        "count": 3,
        "refs": [
          "2:55",
          "4:153",
          "6:47"
        ]
      },
      {
        "word": "تنظرون",
        "count": 7,
        "refs": [
          "2:50",
          "2:55",
          "3:143",
          "7:195"
        ]
      },
      {
        "word": "قلتم",
        "count": 9,
        "refs": [
          "2:55",
          "2:61",
          "3:165",
          "3:183"
        ]
      }
    ]
  },
  {
    "n": 56,
    "arabic": "ثُمَّ بَعَثْنَٰكُم مِّنۢ بَعْدِ مَوْتِكُمْ لَعَلَّكُمْ تَشْكُرُونَ",
    "french": "Puis Nous vous ressuscitâmes après votre mort afin que vous soyez reconnaissants.",
    "tadabburAr": "إِعَادَةُ الحَيَاةِ بَعْدَ المَوْتِ دَلِيلٌ عَلَى القُدْرَةِ وَفُرْصَةٌ لِلشُّكْرِ.",
    "tadabburFr": "Rendre la vie après la mort est une preuve de puissance et une seconde chance de gratitude.",
    "amalAr": "اسْتَغِلَّ يَوْمَكَ الجَدِيدَ كَفُرْصَةٍ ثَانِيَةٍ لِصَالِحِ الأَعْمَالِ.",
    "amalFr": "Profite de cette nouvelle journée comme d'une seconde chance pour œuvrer en bien.",
    "tawjihAr": "تَجْدِيدُ النِّعَمِ يَتَطَلَّبُ تَجْدِيدَ الشُّكْرِ وَالطَّاعَةِ.",
    "tawjihFr": "Le renouvellement des bienfaits exige un renouvellement de la gratitude et de l'obéissance.",
    "words": [
      {
        "word": "تشكرون",
        "count": 19,
        "refs": [
          "2:52",
          "2:56",
          "2:185",
          "3:123"
        ]
      },
      {
        "word": "لعلكم",
        "count": 59,
        "refs": [
          "2:21",
          "2:52",
          "2:53",
          "2:56"
        ]
      }
    ]
  },
  {
    "n": 57,
    "arabic": "وَظَلَّلْنَا عَلَيْكُمُ ٱلْغَمَامَ وَأَنزَلْنَا عَلَيْكُمُ ٱلْمَنَّ وَٱلسَّلْوَىٰ ۖ كُلُوا۟ مِن طَيِّبَٰتِ مَا رَزَقْنَٰكُمْ ۖ وَمَا ظَلَمُونَا وَلَٰكِن كَانُوٓا۟ أَنفُسَهُمْ يَظْلِمُونَ",
    "french": "Et Nous vous couvrîmes de l'ombre d'un nuage; et fîmes descendre sur vous la manne et les cailles: - «Mangez des délices que Nous vous avons attribués!» - Ce n'est pas à Nous qu'ils firent du tort, mais ils se firent tort à eux-mêmes.",
    "tadabburAr": "نِعَمُ اللَّهِ عَلَى عِبَادِهِ جَلِيلَةٌ وَمُتَنَوِّعَةٌ، وَالكُفْرُ بِالنِّعَمِ لَا يَضُرُّ اللَّهَ شَيْئًا بَلْ يَعُودُ وَبَالُهُ عَلَى العَبْدِ نَفْسِهِ.",
    "tadabburFr": "Les bienfaits d'Allah envers Ses serviteurs sont immenses ; y répondre par l'ingratitude ne nuit point à Allah, mais nuit uniquement à l'âme de l'homme.",
    "amalAr": "اشْكُرِ اللَّهَ اليَوْمَ عَلَى نِعْمَةِ الطَّعَامِ وَالشَّرَابِ وَالأَمْنِ.",
    "amalFr": "Remercie Allah aujourd'hui pour Ses bienfaits de subsistance et de sécurité.",
    "tawjihAr": "المَعَاصِي وَكُفْرَانُ النِّعَمِ ظُلْمٌ لِلنَّفْسِ وَسَبَبٌ لِحِرْمَانِ البَرَكَةِ.",
    "tawjihFr": "La désobéissance et l'ingratitude constituent une injustice envers soi-même et privent des bénédictions divine.",
    "words": [
      {
        "word": "وظللنا",
        "count": 2,
        "refs": [
          "2:57",
          "7:160"
        ]
      },
      {
        "word": "ظلمونا",
        "count": 2,
        "refs": [
          "2:57",
          "7:160"
        ]
      },
      {
        "word": "الغمام",
        "count": 3,
        "refs": [
          "2:57",
          "2:210",
          "7:160"
        ]
      }
    ]
  },
  {
    "n": 58,
    "arabic": "وَإِذْ قُلْنَا ٱدْخُلُوا۟ هَٰذِهِ ٱلْقَرْيَةَ فَكُلُوا۟ مِنْهَا حَيْثُ شِئْتُمْ رَغَدًۭا وَٱدْخُلُوا۟ ٱلْبَابَ سُجَّدًۭا وَقُولُوا۟ حِطَّةٌۭ نَّغْفِرْ لَكُمْ خَطَٰيَٰكُمْ ۚ وَسَنَزِيدُ ٱلْمُحْسِنِينَ",
    "french": "Et [rappelez-vous] lorsque Nous dîmes: «Entrez dans cette ville, et mangez-y à l'envie où il vous plaira; mais entrez par la porte en vous prosternant et demandez la «rémission» (de vos péchés); Nous vous pardonnerons vos fautes si vous faites cela et donnerons davantage de récompense pour les bienfaisants.",
    "tadabburAr": "التَّوَاضُعُ لِلَّهِ عِنْدَ النَّصْرِ وَالدُّخُولِ إِلَى المَغَانِمِ مِنْ أَسْبَابِ المَغْفِرَةِ وَزِيَادَةِ الفَضْلِ.",
    "tadabburFr": "L'humilité envers Allah et la demande de pardon lors de la réussite attirent la miséricorde et la multiplication des récompenses.",
    "amalAr": "اسْتَغْفِرِ اللَّهَ اليَوْمَ بِإِخْلَاصٍ وَتَوَاضَعْ لِرَبِّكَ فِي سَكَنَاتِكَ وَحَرَكَاتِكَ.",
    "amalFr": "Demande sincèrement pardon à Allah aujourd'hui et fais preuve d'humilité dans tes actes.",
    "tawjihAr": "العِبَادَةُ المَقْرُونَةُ بِالتَّوَاضُعِ وَالاسْتِغْفَارِ تُكَفِّرُ الذُّنُوبَ وَتَرْفَعُ الدَّرَجَاتِ.",
    "tawjihFr": "L'adoration empreinte d'humilité et de repentir efface les péchés et élève en degrés.",
    "words": [
      {
        "word": "نغفر",
        "count": 2,
        "refs": [
          "2:58",
          "7:161"
        ]
      },
      {
        "word": "رغدا",
        "count": 3,
        "refs": [
          "2:35",
          "2:58",
          "16:112"
        ]
      },
      {
        "word": "وادخلوا",
        "count": 3,
        "refs": [
          "2:58",
          "7:161",
          "12:67"
        ]
      }
    ]
  },
  {
    "n": 59,
    "arabic": "فَبَدَّلَ ٱلَّذِينَ ظَلَمُوا۟ قَوْلًا غَيْرَ ٱلَّذِى قِيلَ لَهُمْ فَأَنزَلْنَا عَلَى ٱلَّذِينَ ظَلَمُوا۟ رِجْزًۭا مِّنَ ٱلسَّمَآءِ بِمَا كَانُوا۟ يَفْسُقُونَ",
    "french": "Mais, à ces paroles, les pervers en substituèrent d'autres, et pour les punir de leur fourberie Nous leur envoyâmes du ciel un châtiment avilissant.",
    "tadabburAr": "تَبْدِيلُ أَوَامِرِ اللَّهِ وَالتَّلَاعُبُ بِالشَّرِيعَةِ يُوجِبُ العَذَابَ وَالغَضَبَ الإِلَهِيَّ.",
    "tadabburFr": "Altérer les ordres d'Allah et se jouer de la Législation divine exposent au châtiment et au courroux d'Allah.",
    "amalAr": "التَزِمْ بِأَلْفَاظِ الشَّرْعِ وَأَحْكَامِهِ دُونَ تَحْرِيفٍ أَوْ تَبْدِيلٍ.",
    "amalFr": "Conformes-toi fidèlement aux enseignements religieux sans les altérer ni les modifier.",
    "tawjihAr": "الوَفَاءُ بِالتَّكْلِيفِ كَمَا أَمَرَ اللَّهُ شَرْطٌ لِلنَّجَاةِ مِنَ العِقَابِ.",
    "tawjihFr": "Le respect strict des ordres divins tel qu'ordonné est une condition indispensable pour le salut.",
    "words": [
      {
        "word": "فبدل",
        "count": 2,
        "refs": [
          "2:59",
          "7:162"
        ]
      },
      {
        "word": "فانزلنا",
        "count": 3,
        "refs": [
          "2:59",
          "7:57",
          "15:22"
        ]
      },
      {
        "word": "رجزا",
        "count": 3,
        "refs": [
          "2:59",
          "7:162",
          "29:34"
        ]
      }
    ]
  },
  {
    "n": 60,
    "arabic": "۞ وَإِذِ ٱسْتَسْقَىٰ مُوسَىٰ لِقَوْمِهِۦ فَقُلْنَا ٱضْرِب بِّعَصَاكَ ٱلْحَجَرَ ۖ فَٱنفَجَرَتْ مِنْهُ ٱثْنَتَا عَشْرَةَ عَيْنًۭا ۖ قَدْ عَلِمَ كُلُّ أُنَاسٍۢ مَّشْرَبَهُمْ ۖ كُلُوا۟ وَٱشْرَبُوا۟ مِن رِّزْقِ ٱللَّهِ وَلَا تَعْثَوْا۟ فِى ٱلْأَرْضِ مُفْسِدِينَ",
    "french": "Et [rappelez-vous] quand Moïse demanda de l'eau pour désaltérer son peuple, c'est alors que Nous dîmes: «Frappe le rocher avec ton bâton». Et tout d'un coup, douze sources en jaillirent, et certes, chaque tribu sut où s'abreuver! - «Mangez et buvez de ce qu'Allah vous accorde; et ne semez pas de troubles sur la terre comme des fauteurs de désordre».",
    "tadabburAr": "الرِّزْقُ بِيَدِ اللَّهِ وَحْدَهُ يُخْرِجُهُ كَيْفَ يَشَاءُ، وَالشُّكْرُ بَعْدَ النِّعْمَةِ يَكُونُ بَالابْتِعَادِ عَنِ الفَسَادِ.",
    "tadabburFr": "La subsistance appartient à Allah Seul, et la vraie gratitude après avoir reçu Ses bienfaits consiste à s'abstenir de semer le désordre.",
    "amalAr": "اصْلِحْ فِي أَرْضِ اللَّهِ وَلاَ تُفْسِدْ فِيهَا بِقَوْلٍ أَوْ فِعْلٍ.",
    "amalFr": "Œuvre positivement autour de toi et abstiens-toi de toute forme de corruption par tes actes ou tes paroles.",
    "tawjihAr": "التَّمَتُّعُ بِرِزْقِ اللَّهِ مَشْرُوطٌ بِعَدَمِ الإِفْسَادِ فِي الأَرْضِ.",
    "tawjihFr": "L'usage des bienfaits d'Allah exige de préserver la société de la corruption et de l'injustice.",
    "words": [
      {
        "word": "اثنتا",
        "count": 2,
        "refs": [
          "2:60",
          "7:160"
        ]
      },
      {
        "word": "مشربهم",
        "count": 2,
        "refs": [
          "2:60",
          "7:160"
        ]
      },
      {
        "word": "اضرب",
        "count": 3,
        "refs": [
          "2:60",
          "7:160",
          "26:63"
        ]
      }
    ]
  },
  {
    "n": 61,
    "arabic": "وَإِذْ قُلْتُمْ يَٰمُوسَىٰ لَن نَّصْبِرَ عَلَىٰ طَعَامٍۢ وَٰحِدٍۢ فَٱدْعُ لَنَا رَبَّكَ يُخْرِجْ لَنَا مِمَّا تُنۢبِتُ ٱلْأَرْضُ مِنۢ بَقْلِهَا وَقِثَّآئِهَا وَفُومِهَا وَعَدَسِهَا وَبَصَلِهَا ۖ قَالَ أَتَسْتَبْدِلُونَ ٱلَّذِى هُوَ أَدْنَىٰ بِٱلَّذِى هُوَ خَيْرٌ ۚ ٱهْبِطُوا۟ مِصْرًۭا فَإِنَّ لَكُم مَّا سَأَلْتُمْ ۗ وَضُرِبَتْ عَلَيْهِمُ ٱلذِّلَّةُ وَٱلْمَسْكَنَةُ وَبَآءُو بِغَضَبٍۢ مِّنَ ٱللَّهِ ۗ ذَٰلِكَ بِأَنَّهُمْ كَانُوا۟ يَكْفُرُونَ بِـَٔايَٰتِ ٱللَّهِ وَيَقْتُلُونَ ٱلنَّبِيِّۦنَ بِغَيْرِ ٱلْحَقِّ ۗ ذَٰلِكَ بِمَا عَصَوا۟ وَّكَانُوا۟ يَعْتَدُونَ",
    "french": "Et [rappelez-vous] quand vous dîtes: «O Moïse, nous ne pouvons plus tolérer une seule nourriture. Prie donc ton Seigneur pour qu'Il nous fasse sortir de la terre ce qu'elle fait pousser, de ses légumes, ses concombres, son ail (ou blé), ses lentilles et ses oignons!» - Il vous répondit: «Voulez-vous échanger le meilleur pour le moins bon? Descendez donc à n'importe quelle ville; vous y trouverez certainement ce que vous demandez!». L'avilissement et la misère s'abattirent sur eux; ils encoururent la colère d'Allah. Cela est parce qu'ils reniaient les révélations d'Allah, et qu'ils tuaient sans droit les prophètes. Cela parce qu'ils désobéissaient et transgressaient.",
    "tadabburAr": "المَلَلُ مِنَ النِّعَمِ وَتَفْضِيلُ الأَدْنَى عَلَى الأَعْلَى يَقُودُ إِلَى الهَوَانِ وَالذِّلَّةِ.",
    "tadabburFr": "Se lasser des bienfaits divins et préférer ce qui est vil à ce qui est noble mène à l'avilissement et à la déchéance.",
    "amalAr": "ارْضَ بِمَا قَسَمَهُ اللَّهُ لَكَ وَلاَ تَزْدَرِ نِعْمَةً صَغِيرَةً كَانَتْ أَوْ كَبِيرَةً.",
    "amalFr": "Contente-toi de ce qu'Allah t'a accordé et ne méprise aucun bienfait, si modeste soit-il.",
    "tawjihAr": "عِصْيَانُ الأَنْبِيَاءِ وَالتَّجَرُّؤُ عَلَى حُرُمَاتِ اللَّهِ يُعَقِّبُ الذُّلَّ وَالمَسْكَنَةَ.",
    "tawjihFr": "La désobéissance aux prophètes et le mépris des lois divines engendrent l'humiliation et la ruine spirituelle.",
    "words": [
      {
        "word": "فادع",
        "count": 2,
        "refs": [
          "2:61",
          "42:15"
        ]
      },
      {
        "word": "وضربت",
        "count": 2,
        "refs": [
          "2:61",
          "3:112"
        ]
      },
      {
        "word": "الذله",
        "count": 2,
        "refs": [
          "2:61",
          "3:112"
        ]
      }
    ]
  },
  {
    "n": 62,
    "arabic": "إِنَّ ٱلَّذِينَ ءَامَنُوا۟ وَٱلَّذِينَ هَادُوا۟ وَٱلنَّصَٰرَىٰ وَٱلصَّٰبِـِٔينَ مَنْ ءَامَنَ بِٱللَّهِ وَٱلْيَوْمِ ٱلْءَاخِرِ وَعَمِلَ صَٰلِحًۭا فَلَهُمْ أَجْرُهُمْ عِندَ رَبِّهِمْ وَلَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ",
    "french": "Certes, ceux qui ont cru, ceux qui se sont judaïsés, les Nazaréens, et les sabéens, quiconque d'entre eux a cru en Allah au Jour dernier et accompli de bonnes œuvres, sera récompensé par son Seigneur; il n'éprouvera aucune crainte et il ne sera jamais affligé.",
    "tadabburAr": "النَّجَاةُ عِنْدَ اللَّهِ تَعَالَى مَرْهُونَةٌ بِالإِيمَانِ الصَّادِقِ وَالعَمَلِ الصَّالِحِ فِي كُلِّ زَمَانٍ.",
    "tadabburFr": "Le salut auprès d'Allah repose sur une foi authentique et des œuvres pieuses, affranchis de tout esprit de clan.",
    "amalAr": "جَدِّدْ إِيمَانَكَ بِاللَّهِ وَاليَوْمِ الآخِرِ وَاجْتَهِدْ فِي عَمَلٍ صَالِحٍ مَقْبُولٍ.",
    "amalFr": "Renouvelle ta foi en Allah et au Jour Dernier, et efforce-toi d'accomplir une œuvre pieuse aujourd'hui.",
    "tawjihAr": "العِبْرَةُ عِنْدَ اللَّهِ بِحَقِيقَةِ الإِيمَانِ وَاتِّبَاعِ الحَقِّ لاَ بِالأَسْمَاءِ وَالأَلْقَابِ.",
    "tawjihFr": "Ce qui compte auprès d'Allah est la sincérité de la foi et le suivi de la vérité, non les simples appartenances.",
    "words": [
      {
        "word": "فلهم",
        "count": 6,
        "refs": [
          "2:62",
          "2:274",
          "32:19",
          "58:16"
        ]
      },
      {
        "word": "هادوا",
        "count": 10,
        "refs": [
          "2:62",
          "4:46",
          "4:160",
          "5:41"
        ]
      },
      {
        "word": "وعمل",
        "count": 11,
        "refs": [
          "2:62",
          "5:69",
          "18:88",
          "19:60"
        ]
      }
    ]
  },
  {
    "n": 63,
    "arabic": "وَإِذْ أَخَذْنَا مِيثَٰقَكُمْ وَرَفَعْنَا فَوْقَكُمُ ٱلطُّورَ خُذُوا۟ مَآ ءَاتَيْنَٰكُم بِقُوَّةٍۢ وَٱذْكُرُوا۟ مَا فِيهِ لَعَلَّكُمْ تَتَّقُونَ",
    "french": "(Et rappelez-vous) quand Nous avons contracté un engagement avec vous et brandi sur vous le Mont -: «Tenez ferme ce que Nous vous avons donné et souvenez-vous de ce qui s'y trouve afin que vous soyez pieux!»",
    "tadabburAr": "المِيثَاقُ مَعَ اللَّهِ يَتَطَلَّبُ العَزْمَ وَالقُوَّةَ فِي أَخْذِ الكِتَابِ وَالعَمَلِ بِمَا فِيهِ.",
    "tadabburFr": "L'engagement envers Allah exige détermination et rigueur dans l'apprentissage et la mise en pratique du Livre.",
    "amalAr": "اقْرَأْ آيَاتٍ مِنَ القُرْآنِ الكَرِيمِ بِتَدَبُّرٍ وَعَزْمٍ عَلَى التَّطْبِيقِ.",
    "amalFr": "Lis des versets du Coran avec méditation et avec la ferme résolution de les appliquer.",
    "tawjihAr": "التَّقْوَى تُنَالُ بِالأَخْذِ بِالجِدِّ لِأَحْكَامِ الدِّينِ وَمُدَامَةِ الذِّكْرِ.",
    "tawjihFr": "La piété s'acquiert en abordant les préceptes de la religion avec sérieux et en se rappelant constamment Ses enseignements.",
    "words": [
      {
        "word": "ورفعنا",
        "count": 5,
        "refs": [
          "2:63",
          "2:93",
          "4:154",
          "43:32"
        ]
      },
      {
        "word": "خذوا",
        "count": 5,
        "refs": [
          "2:63",
          "2:93",
          "4:71",
          "7:31"
        ]
      },
      {
        "word": "فوقكم",
        "count": 6,
        "refs": [
          "2:63",
          "2:93",
          "6:65",
          "23:17"
        ]
      }
    ]
  },
  {
    "n": 64,
    "arabic": "ثُمَّ تَوَلَّيْتُم مِّنۢ بَعْدِ ذَٰلِكَ ۖ فَلَوْلَا فَضْلُ ٱللَّهِ عَلَيْكُمْ وَرَحْمَتُهُۥ لَكُنتُم مِّنَ ٱلْخَٰسِرِينَ",
    "french": "Puis vous vous en détournâtes après vos engagements, n'eût été donc la grâce d'Allah et Sa miséricorde, vous seriez certes parmi les perdants.",
    "tadabburAr": "عِصْيَانُ العَبْدِ وَتَوَلِّيهِ يَقْتَضِي العُقُوبَةَ، وَلَكِنَّ فَضْلَ اللَّهِ وَرَحْمَتَهُ هُمَا الحِصْنُ المَنِيعُ مِنَ الخُسْرَانِ.",
    "tadabburFr": "La désobéissance de l'homme mérite le châtiment, mais la grâce et la miséricorde d'Allah sont les seuls remparts contre la perdition totale.",
    "amalAr": "اجْدَدْ اليَوْمَ فِي اسْتِغْفَارِ اللَّهِ وَاشْكُرْهُ عَلَى عَفْوِهِ وَسَتْرِهِ عَنْ ذُنُوبِكَ.",
    "amalFr": "Révère Allah aujourd'hui en Demandant Son pardon et en Le remerciant pour Sa clémence envers tes fautes.",
    "tawjihAr": "النَّجَاةُ فِي الدُّنْيَا وَالآخِرَةِ مَرْهُونَةٌ بِفَضْلِ اللَّهِ وَرَحْمَتِهِ لاَ بِأَعْمَالِنَا وَحْدَهَا.",
    "tawjihFr": "Le salut ici-bas et dans l'au-delà dépend de la grâce d'Allah et non de nos seuls mérites.",
    "words": [
      {
        "word": "ورحمته",
        "count": 7,
        "refs": [
          "2:64",
          "4:83",
          "4:113",
          "24:10"
        ]
      },
      {
        "word": "توليتم",
        "count": 8,
        "refs": [
          "2:64",
          "2:83",
          "5:92",
          "9:3"
        ]
      },
      {
        "word": "فلولا",
        "count": 13,
        "refs": [
          "2:64",
          "6:43",
          "9:122",
          "10:98"
        ]
      }
    ]
  },
  {
    "n": 65,
    "arabic": "وَلَقَدْ عَلِمْتُمُ ٱلَّذِينَ ٱعْتَدَوْا۟ مِنكُمْ فِى ٱلسَّبْتِ فَقُلْنَا لَهُمْ كُونُوا۟ قِرَدَةً خَٰسِـِٔينَ",
    "french": "Vous avez certainement connu ceux des vôtres qui transgressèrent le Sabbat. Et bien Nous leur dîmes: «Soyez des singes abjects!»",
    "tadabburAr": "الاحْتِيَالُ عَلَى مَحَارِمِ اللَّهِ يَمْسَخُ القُلُوبَ وَالأَخْلاَقَ قَبْلَ أَنْ يَمْسَخَ الصُّوَرَ.",
    "tadabburFr": "Ruser pour transgresser les interdits d'Allah altère l'âme et la morale avant même d'attirer le châtiment.",
    "amalAr": "احْذَرْ مِنَ التَّحَايُلِ عَلَى شَرْعِ اللَّهِ لِتَبْرِيرِ المَعَاصِي وَاحْرِصْ عَلَى الصِّدْقِ.",
    "amalFr": "Évite toute ruse ou prétexte juridique pour justifier un péché et recherche la sincérité.",
    "tawjihAr": "المَكْرُ وَالتَّلاَعُبُ بِأَحْكَامِ اللَّهِ يُؤَدِّي إِلَى الخِزْيِ وَالسُّقُوطِ.",
    "tawjihFr": "La ruse et la manipulation des prescriptions divines mènent à l'avilissement.",
    "words": [
      {
        "word": "قرده",
        "count": 2,
        "refs": [
          "2:65",
          "7:166"
        ]
      },
      {
        "word": "السبت",
        "count": 5,
        "refs": [
          "2:65",
          "4:47",
          "4:154",
          "7:163"
        ]
      },
      {
        "word": "علمتم",
        "count": 6,
        "refs": [
          "2:65",
          "5:4",
          "12:73",
          "12:89"
        ]
      }
    ]
  },
  {
    "n": 66,
    "arabic": "فَجَعَلْنَٰهَا نَكَٰلًۭا لِّمَا بَيْنَ يَدَيْهَا وَمَا خَلْفَهَا وَمَوْعِظَةًۭ لِّلْمُتَّقِينَ",
    "french": "Nous fîmes donc de cela un exemple pour les villes qui l'entouraient alors et une exhortation pour les pieux.",
    "tadabburAr": "عُقُوبَاتُ اللَّهِ لِلْمُعْتَدِينَ عِبْرَةٌ لِلْمُتَّقِينَ لِيَحْذَرُوا مِثْلَ صَنِيعِهِمْ.",
    "tadabburFr": "Les châtiments infligés aux transgresseurs servent d'avertissement aux pieux pour qu'ils évitent leurs erreurs.",
    "amalAr": "تَأَمَّلْ فِي عَوَاقِبِ العَاصِينَ كَيْ يَزْدَادَ تَقْوَاكَ وَخَوْفُكَ مِنَ اللَّهِ.",
    "amalFr": "Médite sur la fin des désobéissants afin de renforcer ta pieuse crainte d'Allah.",
    "tawjihAr": "السَّعِيدُ مَنْ وَعَظَهُ اللَّهُ بِغَيْرِهِ وَالْمُتَّقُونَ هُمْ أَهْلُ الاِنْتِفَاعِ بِالآيَاتِ.",
    "tawjihFr": "Le bienheureux est celui qui tire leçon des épreuves d'autrui, et seuls les pieux en profitent.",
    "words": [
      {
        "word": "وموعظه",
        "count": 5,
        "refs": [
          "2:66",
          "3:138",
          "5:46",
          "11:120"
        ]
      },
      {
        "word": "للمتقين",
        "count": 18,
        "refs": [
          "2:2",
          "2:66",
          "3:133",
          "3:138"
        ]
      }
    ]
  },
  {
    "n": 67,
    "arabic": "وَإِذْ قَالَ مُوسَىٰ لِقَوْمِهِۦٓ إِنَّ ٱللَّهَ يَأْمُرُكُمْ أَن تَذْبَحُوا۟ بَقَرَةًۭ ۖ قَالُوٓا۟ أَتَتَّخِذُنَا هُزُوًۭا ۖ قَالَ أَعُوذُ بِٱللَّهِ أَنْ أَكُونَ مِنَ ٱلْجَٰهِلِينَ",
    "french": "(Et rappelez-vous) lorsque Moïse dit à son peuple: «Certes Allah vous ordonne d'immoler une vache». Ils dirent: «Nous prends-tu en moquerie?» «Qu'Allah me garde d'être du nombre des ignorants» dit-il.",
    "tadabburAr": "الاسْتِهْزَاءُ عِنْدَ أَمْرِ اللَّهِ مِنْ صِفَاتِ الجَاهِلِينَ، وَالأَنْبِيَاءُ يَبْرَءُونَ مِنْ ذَلِكَ.",
    "tadabburFr": "Se moquer face aux ordres divins est le propre des ignorants, attitude dont les prophètes se désavouent.",
    "amalAr": "اسْتَعِذْ بِاللَّهِ مِنَ الجَهْلِ إِذَا عَرَضَ لَكَ مَا يَدْعُو لِلاِسْتِهْزَاءِ بِالحَقِّ.",
    "amalFr": "Cherche refuge auprès d'Allah contre l'ignorance lorsque tu es tenté de t'amuser de la vérité.",
    "tawjihAr": "تَلَقِّي أَوَامِرِ اللَّهِ يَكُونُ بِالتَّسْلِيمِ وَالتَّعْظِيمِ لاَ بِالرَّيْبِ وَالسُّخْرِيَّةِ.",
    "tawjihFr": "Les ordres divins doivent être accueillis avec soumission et respect, sans doute ni moquerie.",
    "words": [
      {
        "word": "بقره",
        "count": 4,
        "refs": [
          "2:67",
          "2:68",
          "2:69",
          "2:71"
        ]
      },
      {
        "word": "يامركم",
        "count": 5,
        "refs": [
          "2:67",
          "2:93",
          "2:169",
          "3:80"
        ]
      },
      {
        "word": "اعوذ",
        "count": 6,
        "refs": [
          "2:67",
          "11:47",
          "19:18",
          "23:97"
        ]
      }
    ]
  },
  {
    "n": 68,
    "arabic": "قَالُوا۟ ٱدْعُ لَنَا رَبَّكَ يُبَيِّن لَّنَا مَا هِىَ ۚ قَالَ إِنَّهُۥ يَقُولُ إِنَّهَا بَقَرَةٌۭ لَّا فَارِضٌۭ وَلَا بِكْرٌ عَوَانٌۢ بَيْنَ ذَٰلِكَ ۖ فَٱفْعَلُوا۟ مَا تُؤْمَرُونَ",
    "french": "- Ils dirent: «Demande pour nous à ton Seigneur qu'Il nous précise ce qu'elle doit être». - Il dit: «Certes Allah dit que c'est bien une vache, ni vieille ni vierge, d'un âge moyen, entre les deux. Faites donc ce qu'on vous commande».",
    "tadabburAr": "التَّشْدِيدُ وَالكَثْرَةُ فِي الأَسْئِلَةِ المَذْمُومَةِ يُشَقِّقَانِ التَّكَالِيفَ وَيَضُرَّانِ العَبْدَ.",
    "tadabburFr": "L'obstination et l'excès de questions inutiles rendent les obligations difficiles et nuisent au serviteur.",
    "amalAr": "سَارِعْ إِلَى طَاعَةِ اللَّهِ فَوْرًا دُونَ التَّكَلُّفِ فِي البَحْثِ عَنْ دَقَائِقَ لاَ تَلْزَمُكَ.",
    "amalFr": "Empresse-toi d'obéir à Allah sans chercher inutilement des détails compliqués.",
    "tawjihAr": "الأَصْلُ فِي الشَّرِيعَةِ اليُسْرُ، وَالتَّنَقُّرُ يَبْعَثُ عَلَى المَشَقَّةِ.",
    "tawjihFr": "La religion est basée sur la facilité ; la complaisance dans le détail apporte la contrainte.",
    "words": [
      {
        "word": "تؤمرون",
        "count": 2,
        "refs": [
          "2:68",
          "15:65"
        ]
      },
      {
        "word": "بقره",
        "count": 4,
        "refs": [
          "2:67",
          "2:68",
          "2:69",
          "2:71"
        ]
      },
      {
        "word": "يبين",
        "count": 17,
        "refs": [
          "2:68",
          "2:69",
          "2:70",
          "2:187"
        ]
      }
    ]
  },
  {
    "n": 69,
    "arabic": "قَالُوا۟ ٱدْعُ لَنَا رَبَّكَ يُبَيِّن لَّنَا مَا لَوْنُهَا ۚ قَالَ إِنَّهُۥ يَقُولُ إِنَّهَا بَقَرَةٌۭ صَفْرَآءُ فَاقِعٌۭ لَّوْنُهَا تَسُرُّ ٱلنَّٰظِرِينَ",
    "french": "- Ils dirent: «Demande donc pour nous à ton Seigneur qu'Il nous précise sa couleur». - Il dit: «Allah dit que c'est une vache jaune, de couleur vive et plaisante à voir».",
    "tadabburAr": "كُلَّمَا شَدَّدَ العَبْدُ عَلَى نَفْسِهِ شَدَّدَ اللَّهُ عَلَيْهِ، وَاللَّهُ جَعَلَ فِي خَلْقِهِ جَمَالاً يَسُرُّ القُلُوبَ.",
    "tadabburFr": "Plus le serviteur se montre exigeant sans besoin, plus Allah durcit la règle pour lui, bien qu'Il ait créé la beauté pour réjouir les cœurs.",
    "amalAr": "الْتَزِمْ بِالأَوَامِرِ الأَسَاسِيَّةِ وَلاَ تُضَيِّقْ عَلَى نَفْسِكَ مَا وَسَّعَهُ اللَّهُ.",
    "amalFr": "Conforme-toi aux ordres fondamentaux sans te restreindre là où Allah a accordé de la marge.",
    "tawjihAr": "التَّشَدُّدُ فِي الدِّينِ يُعَسِّرُ المَطْلُوبَ وَيَحْرِمُ مِنَ الرُّخَصِ.",
    "tawjihFr": "Rendre la religion rigide complique ce qui est demandé et prive des facilités accordées.",
    "words": [
      {
        "word": "لونها",
        "count": 2,
        "refs": [
          "2:69",
          "2:69"
        ]
      },
      {
        "word": "بقره",
        "count": 4,
        "refs": [
          "2:67",
          "2:68",
          "2:69",
          "2:71"
        ]
      },
      {
        "word": "يبين",
        "count": 17,
        "refs": [
          "2:68",
          "2:69",
          "2:70",
          "2:187"
        ]
      }
    ]
  },
  {
    "n": 70,
    "arabic": "قَالُوا۟ ٱدْعُ لَنَا رَبَّكَ يُبَيِّن لَّنَا مَا هِىَ إِنَّ ٱلْبَقَرَ تَشَٰبَهَ عَلَيْنَا وَإِنَّآ إِن شَآءَ ٱللَّهُ لَمُهْتَدُونَ",
    "french": "- Ils dirent: «Demande pour nous à ton Seigneur qu'Il nous précise ce qu'elle est car pour nous, les vaches se confondent. Mais, nous y serions certainement bien guidés, si Allah le veut».",
    "tadabburAr": "التَّرَدُّدُ فِي الِامْتِثَالِ يُوجِبُ الالْتِبَاسَ، وَتَعْلِيقُ الأَمْرِ بِمَشِيئَةِ اللَّهِ سَبَبُ الهِدَايَةِ.",
    "tadabburFr": "Hésiter à obéir crée la confusion, tandis que lier ses actes à la volonté d'Allah est la clé de la guidée.",
    "amalAr": "لاَ تَنْسَ قَوْلَ «إِنْ شَاءَ اللَّهُ» عِنْدَ العَزْمِ عَلَى فِعْلِ أيِّ عَمَلٍ فِي المُسْتَقْبَلِ.",
    "amalFr": "N'oublie pas de dire «Incha'Allah» lorsque tu te décides à accomplir une action future.",
    "tawjihAr": "التَّوْفِيقُ فِي العَمَلِ وَالهِدَايَةُ إِلَيْهِ مَرْهُونَانِ بِمَشِيئَةِ اللَّهِ وَحْدَهُ.",
    "tawjihFr": "Le succès dans l'action et la guidée ne s'obtiennent que par la seule volonté d'Allah.",
    "words": [
      {
        "word": "لمهتدون",
        "count": 2,
        "refs": [
          "2:70",
          "43:49"
        ]
      },
      {
        "word": "البقر",
        "count": 3,
        "refs": [
          "2:70",
          "6:144",
          "6:146"
        ]
      },
      {
        "word": "يبين",
        "count": 17,
        "refs": [
          "2:68",
          "2:69",
          "2:70",
          "2:187"
        ]
      }
    ]
  },
  {
    "n": 71,
    "arabic": "قَالَ إِنَّهُۥ يَقُولُ إِنَّهَا بَقَرَةٌۭ لَّا ذَلُولٌۭ تُثِيرُ ٱلْأَرْضَ وَلَا تَسْقِى ٱلْحَرْثَ مُسَلَّمَةٌۭ لَّا شِيَةَ فِيهَا ۚ قَالُوا۟ ٱلْـَٰٔنَ جِئْتَ بِٱلْحَقِّ ۚ فَذَبَحُوهَا وَمَا كَادُوا۟ يَفْعَلُونَ",
    "french": "- Il dit: «Allah dit que c'est bien une vache qui n'a pas été asservie à labourer la terre ni à arroser le champ, indemne d'infirmité et dont la couleur est unie». - Ils dirent: «Te voilà enfin, tu nous as apporté la vérité!» Ils l'immolèrent alors mais il s'en fallut qu'ils ne l'eussent pas fait.",
    "tadabburAr": "التَّكَلُّفُ وَالتَّعَنُّتُ فِي السُّؤَالِ يُشَقِّقُ عَلَى الْعَبْدِ وَيُوقِعُهُ فِي الْحَرَجِ.",
    "tadabburFr": "L'obstination et l'excès de questions compliquent la tâche du serviteur et le mènent à la difficulté.",
    "amalAr": "سَارِعْ إِلَى تَطْبِيقِ أَوَامِرِ اللَّهِ دُونَ تَرَدُّدٍ أَوْ تَنْقِيرٍ.",
    "amalFr": "Empresse-toi d'accomplir les ordres d'Allah sans hésitation ni ratiocination.",
    "tawjihAr": "الِاسْتِسْلَامُ لِأَمْرِ اللَّهِ مِنْ غَيْرِ تَعَنُّتٍ هُوَ طَرِيقُ النَّجَاةِ.",
    "tawjihFr": "La soumission aux ordres d'Allah sans obstination est la voie du salut.",
    "words": [
      {
        "word": "تسقي",
        "count": 2,
        "refs": [
          "2:71",
          "88:5"
        ]
      },
      {
        "word": "بقره",
        "count": 4,
        "refs": [
          "2:67",
          "2:68",
          "2:69",
          "2:71"
        ]
      },
      {
        "word": "الحرث",
        "count": 4,
        "refs": [
          "2:71",
          "2:205",
          "6:136",
          "21:78"
        ]
      }
    ]
  },
  {
    "n": 72,
    "arabic": "وَإِذْ قَتَلْتُمْ نَفْسًۭا فَٱدَّٰرَْٰٔتُمْ فِيهَا ۖ وَٱللَّهُ مُخْرِجٌۭ مَّا كُنتُمْ تَكْتُمُونَ",
    "french": "Et quand vous aviez tué un homme et que chacun de vous cherchait à se disculper!... Mais Allah démasque ce que vous dissimuliez.",
    "tadabburAr": "مَهْمَا كَتَمَ الْإِنْسَانُ مِنَ الذَّنْبِ، فَإِنَّ اللَّهَ مُظْهِرُهُ وَفَاضِحُ السِّرِّ لَا مَحَالَةَ.",
    "tadabburFr": "Peu importe combien l'homme cache un péché, Allah finira invariablement par mettre le secret au jour.",
    "amalAr": "طَهِّرْ سَرِيرَتَكَ وَتُبْ إِلَى اللَّهِ مِمَّا تُخْفِيهِ عَنِ النَّاسِ.",
    "amalFr": "Purifie ton intérieur et repens-toi à Allah de ce que tu caches aux gens.",
    "tawjihAr": "الْحَقُّ لَا يَخْفَى عَلَى اللَّهِ، وَالتَّنَاصُلُ مِنَ الْمَسْؤُولِيَّةِ لَا يُنْجِي.",
    "tawjihFr": "La vérité n'échappe pas à Allah, et se décharger de sa responsabilité ne sauve pas.",
    "words": [
      {
        "word": "قتلتم",
        "count": 3,
        "refs": [
          "2:72",
          "3:157",
          "3:158"
        ]
      },
      {
        "word": "مخرج",
        "count": 3,
        "refs": [
          "2:72",
          "9:64",
          "17:80"
        ]
      },
      {
        "word": "تكتمون",
        "count": 5,
        "refs": [
          "2:33",
          "2:72",
          "5:99",
          "21:110"
        ]
      }
    ]
  },
  {
    "n": 73,
    "arabic": "فَقُلْنَا ٱضْرِبُوهُ بِبَعْضِهَا ۚ كَذَٰلِكَ يُحْىِ ٱللَّهُ ٱلْمَوْتَىٰ وَيُرِيكُمْ ءَايَٰتِهِۦ لَعَلَّكُمْ تَعْقِلُونَ",
    "french": "Nous dîmes donc: «Frappez le tué avec une partie de la vache». - Ainsi Allah ressuscite les morts et vous montre les signes (de Sa puissance) afin que vous raisonniez",
    "tadabburAr": "إِحْيَاءُ الْمَوْتَى هَيِّنٌ عَلَى اللَّهِ، وَفِيهِ دَلِيلٌ قَاطِعٌ عَلَى الْبَعْثِ وَالْحِسَابِ.",
    "tadabburFr": "Ressusciter les morts est chose facile pour Allah, et c'est une preuve irréfutable de la Résurrection.",
    "amalAr": "تَفَكَّرْ فِي قُدْرَةِ اللَّهِ عَلَى الْبَعْثِ وَاسْتَعِدَّ لِيَوْمِ الْحِسَابِ.",
    "amalFr": "Médite sur la puissance d'Allah à ressusciter et prépare-toi pour le Jour du Jugement.",
    "tawjihAr": "الْآيَاتُ الْإِلَهِيَّةُ مَنَارَةٌ لِأُولِي الْعُقُولِ لِيَعْقِلُوا وَيَعْتَبِرُوا.",
    "tawjihFr": "Les signes divins sont un enseignement pour les doués d'intelligence afin qu'ils comprennent et réfléchissent.",
    "words": [
      {
        "word": "ويريكم",
        "count": 2,
        "refs": [
          "2:73",
          "40:81"
        ]
      },
      {
        "word": "فقلنا",
        "count": 6,
        "refs": [
          "2:60",
          "2:65",
          "2:73",
          "20:117"
        ]
      },
      {
        "word": "الموتي",
        "count": 16,
        "refs": [
          "2:73",
          "2:260",
          "3:49",
          "5:110"
        ]
      }
    ]
  },
  {
    "n": 74,
    "arabic": "ثُمَّ قَسَتْ قُلُوبُكُم مِّنۢ بَعْدِ ذَٰلِكَ فَهِىَ كَٱلْحِجَارَةِ أَوْ أَشَدُّ قَسْوَةًۭ ۚ وَإِنَّ مِنَ ٱلْحِجَارَةِ لَمَا يَتَفَجَّرُ مِنْهُ ٱلْأَنْهَٰرُ ۚ وَإِنَّ مِنْهَا لَمَا يَشَّقَّقُ فَيَخْرُجُ مِنْهُ ٱلْمَآءُ ۚ وَإِنَّ مِنْهَا لَمَا يَهْبِطُ مِنْ خَشْيَةِ ٱللَّهِ ۗ وَمَا ٱللَّهُ بِغَٰفِلٍ عَمَّا تَعْمَلُونَ",
    "french": "Puis, et en dépit de tout cela, vos cœurs se sont endurcis; ils sont devenus comme des pierres ou même plus durs encore; car il y a des pierres d'où jaillissent les ruisseaux, d'autres se fendent pour qu'en surgisse l'eau, d'autres s'affaissent par crainte d'Allah. Et Allah n'est certainement jamais inattentif à ce que vous faites",
    "tadabburAr": "قَسَاوَةُ الْقَلْبِ أَعْظَمُ عُقُوبَةٍ، حَتَّى غَدَتْ بَعْضُ الْقُلُوبِ أَقْسَى مِنَ الْحِجَارَةِ.",
    "tadabburFr": "La dureté du cœur est le plus grand des châtiments, au point que certains cœurs deviennent plus durs que la pierre.",
    "amalAr": "أَلِنْ قَلْبَكَ بِذِكْرِ اللَّهِ وَتِلَاوَةِ الْقُرْآنِ وَإِطْعَامِ الْمَسَاكِينِ.",
    "amalFr": "Adoucis ton cœur par l'évocation d'Allah, la lecture du Coran et le soutien aux nécessiteux.",
    "tawjihAr": "الْخَشْيَةُ مِنَ اللَّهِ تُدْرِكُ حَتَّى الْجَمَادَاتِ، فَالْحَذَرَ مِنْ جَمَادِيَّةِ الْقُلُوبِ.",
    "tawjihFr": "La crainte d'Allah touche même les objets inanimés ; prenons garde à la rigidité de nos cœurs.",
    "words": [
      {
        "word": "خشيه",
        "count": 6,
        "refs": [
          "2:74",
          "4:77",
          "17:31",
          "17:100"
        ]
      },
      {
        "word": "قلوبكم",
        "count": 14,
        "refs": [
          "2:74",
          "2:225",
          "3:103",
          "3:126"
        ]
      },
      {
        "word": "الماء",
        "count": 17,
        "refs": [
          "2:74",
          "7:50",
          "7:57",
          "11:7"
        ]
      }
    ]
  },
  {
    "n": 75,
    "arabic": "۞ أَفَتَطْمَعُونَ أَن يُؤْمِنُوا۟ لَكُمْ وَقَدْ كَانَ فَرِيقٌۭ مِّنْهُمْ يَسْمَعُونَ كَلَٰمَ ٱللَّهِ ثُمَّ يُحَرِّفُونَهُۥ مِنۢ بَعْدِ مَا عَقَلُوهُ وَهُمْ يَعْلَمُونَ",
    "french": "- Eh bien, espérez-vous [Musulmans] que des pareils gens (les Juifs) vous partageront la foi? alors qu'un groupe d'entre eux; après avoir entendu et compris la parole d'Allah, la falsifièrent sciemment.",
    "tadabburAr": "تَحْرِيفُ الْحَقِّ بَعْدَ مَعْرِفَتِهِ أَعْظَمُ جُرْمٍ، وَلَا يُرْجَى الْخَيْرُ مِمَّنْ يَتَّبِعُ الْهَوَى.",
    "tadabburFr": "Altérer la vérité après l'avoir connue est un crime grave ; on ne peut rien espérer de bon de celui qui suit ses passions.",
    "amalAr": "احْذَرْ مِنْ تَأْوِيلِ النَّصِّ الشَّرْعِيِّ لِيُوَافِقَ هَوَاكَ.",
    "amalFr": "Prends garde à ne pas déformer les textes sacrés pour les adapter à tes désirs.",
    "tawjihAr": "الْعِلْمُ حُجَّةٌ عَلَى صَاحِبِهِ إِذَا لَمْ يَقْتَرِنْ بِالِانْقِيَادِ وَالْعَمَلِ.",
    "tawjihFr": "La connaissance se retourne contre son détenteur si elle ne s'accompagne pas de la soumission et de la pratique.",
    "words": [
      {
        "word": "يؤمنوا",
        "count": 12,
        "refs": [
          "2:75",
          "2:221",
          "6:25",
          "6:110"
        ]
      },
      {
        "word": "فريق",
        "count": 13,
        "refs": [
          "2:75",
          "2:100",
          "2:101",
          "3:23"
        ]
      },
      {
        "word": "يسمعون",
        "count": 20,
        "refs": [
          "2:75",
          "6:36",
          "7:100",
          "7:179"
        ]
      }
    ]
  },
  {
    "n": 76,
    "arabic": "وَإِذَا لَقُوا۟ ٱلَّذِينَ ءَامَنُوا۟ قَالُوٓا۟ ءَامَنَّا وَإِذَا خَلَا بَعْضُهُمْ إِلَىٰ بَعْضٍۢ قَالُوٓا۟ أَتُحَدِّثُونَهُم بِمَا فَتَحَ ٱللَّهُ عَلَيْكُمْ لِيُحَآجُّوكُم بِهِۦ عِندَ رَبِّكُمْ ۚ أَفَلَا تَعْقِلُونَ",
    "french": "Et quand ils rencontrent des croyants, ils disent: «Nous croyons» et, une fois seuls entre eux, ils disent: «Allez-vous confier aux musulmans ce qu'Allah vous a révélé pour leur fournir, ainsi, un argument contre vous devant votre Seigneur! Etes-vous donc dépourvus de raison?».",
    "tadabburAr": "النِّفَاقُ يَجْعَلُ الصَّاحِبَ بَوَجْهَيْنِ، يُظْهِرُ الْإِيمَانَ وَيُبْطِنُ الْخِدَاعَ وَالْمَكْرَ.",
    "tadabburFr": "L'hypocrisie donne à l'homme un double visage : il affiche la foi mais dissimule la tromperie.",
    "amalAr": "احْرِصْ عَلَى أَنْ يَكُونَ ظَاهِرُكَ كَبَاطِنِكَ فِي الصِّدْقِ وَالْإِيمَانِ.",
    "amalFr": "Veille à ce que ton apparence soit conforme à ton intérieur en matière de sincérité et de foi.",
    "tawjihAr": "الْمُخَادَعَةُ وَالْمَكْرُ شِيمَةُ الْمُنَافِقِينَ، وَالْمُؤْمِنُ صَادِقٌ ثَابِتٌ.",
    "tawjihFr": "La ruse et la tromperie sont les caractéristiques des hypocrites, tandis que le croyant est sincère et constant.",
    "words": [
      {
        "word": "لقوا",
        "count": 2,
        "refs": [
          "2:14",
          "2:76"
        ]
      },
      {
        "word": "تعقلون",
        "count": 24,
        "refs": [
          "2:44",
          "2:73",
          "2:76",
          "2:242"
        ]
      },
      {
        "word": "بعضهم",
        "count": 33,
        "refs": [
          "2:76",
          "2:145",
          "2:251",
          "2:253"
        ]
      }
    ]
  },
  {
    "n": 77,
    "arabic": "أَوَلَا يَعْلَمُونَ أَنَّ ٱللَّهَ يَعْلَمُ مَا يُسِرُّونَ وَمَا يُعْلِنُونَ",
    "french": "- Ne savent-ils pas qu'en vérité Allah sait ce qu'ils cachent et ce qu'ils divulguent?",
    "tadabburAr": "عِلْمُ اللَّهِ الْمُحِيطُ بِالسِّرِّ وَالْعَلَنِ يُوجِبُ اسْتِحْيَاءَ الْعَبْدِ مِنْ رَبِّهِ.",
    "tadabburFr": "L'omniscience d'Allah, qui engloge le secret et le public, impose au serviteur d'éprouver de la pudeur envers son Seigneur.",
    "amalAr": "اِسْتَحْضِرْ مُرَاقَبَةَ اللَّهِ لَكَ فِي خَلَوَاتِكَ كَمَا فِي جَلَوَاتِكَ.",
    "amalFr": "Garde à l'esprit qu'Allah t'observe dans ton intimité tout comme en public.",
    "tawjihAr": "إِيمَانُ الْعَبْدِ بِإِحَاطَةِ عِلْمِ اللَّهِ يَعْصِمُهُ مِنَ النِّفَاقِ وَالرِّيَاءِ.",
    "tawjihFr": "La foi du serviteur en l'omniscience d'Allah le préserve de l'hypocrisie et de l'ostentation.",
    "words": [
      {
        "word": "اولا",
        "count": 3,
        "refs": [
          "2:77",
          "9:126",
          "19:67"
        ]
      },
      {
        "word": "يسرون",
        "count": 4,
        "refs": [
          "2:77",
          "11:5",
          "16:23",
          "36:76"
        ]
      },
      {
        "word": "يعلنون",
        "count": 6,
        "refs": [
          "2:77",
          "11:5",
          "16:23",
          "27:74"
        ]
      }
    ]
  },
  {
    "n": 78,
    "arabic": "وَمِنْهُمْ أُمِّيُّونَ لَا يَعْلَمُونَ ٱلْكِتَٰبَ إِلَّآ أَمَانِىَّ وَإِنْ هُمْ إِلَّا يَظُنُّونَ",
    "french": "Et il y a parmi eux des illettrés qui ne savent rien du Livre hormis des prétentions et ils ne font que des conjectures.",
    "tadabburAr": "ذَمَّ اللهُ مَنْ يَقْرَأُ الْكِتَابَ دُونَ فَهْمٍ أَوْ يَعْتَمِدُ عَلَى الْأَمَانِيِّ؛ فَالْعِلْمُ النَّافِعُ هُوَ الْفَهْمُ وَالْعَمَلُ.",
    "tadabburFr": "Allah blâme ceux qui lisent le Livre sans en comprendre le sens et se contentent de vaines espérances ; la vraie connaissance exige méditation et mise en pratique.",
    "amalAr": "اقْرَأْ صَفْحَةً مِنَ الْقُرْآنِ الْيَوْمَ مَعَ قِرَاءَةِ تَفْسِيرِهَا لِتَفْهَمَ مَعْنَاهَا.",
    "amalFr": "Lis une page du Coran aujourd'hui en consultant son exégèse pour bien en comprendre le sens.",
    "tawjihAr": "الْعِلْمُ الشَّرْعِيُّ يُؤْخَذُ بِالتَّعَلُّمِ وَالتَّحَقُّقِ، لَا بِالظَّنِّ وَالْأَمَانِيِّ.",
    "tawjihFr": "Le savoir religieux s'acquiert par l'apprentissage rigoureux et non par des conjectures ou des souhaits illusoires.",
    "words": [
      {
        "word": "اماني",
        "count": 2,
        "refs": [
          "2:78",
          "4:123"
        ]
      },
      {
        "word": "يظنون",
        "count": 5,
        "refs": [
          "2:46",
          "2:78",
          "2:249",
          "3:154"
        ]
      },
      {
        "word": "ومنهم",
        "count": 26,
        "refs": [
          "2:78",
          "2:201",
          "2:253",
          "3:75"
        ]
      }
    ]
  },
  {
    "n": 79,
    "arabic": "فَوَيْلٌۭ لِّلَّذِينَ يَكْتُبُونَ ٱلْكِتَٰبَ بِأَيْدِيهِمْ ثُمَّ يَقُولُونَ هَٰذَا مِنْ عِندِ ٱللَّهِ لِيَشْتَرُوا۟ بِهِۦ ثَمَنًۭا قَلِيلًۭا ۖ فَوَيْلٌۭ لَّهُم مِّمَّا كَتَبَتْ أَيْدِيهِمْ وَوَيْلٌۭ لَّهُم مِّمَّا يَكْسِبُونَ",
    "french": "Malheur, donc, à ceux qui de leurs propres mains composent un livre puis le présentent comme venant d'Allah pour en tirer un vil profit! - Malheur à eux, donc, à cause de ce que leurs mains ont écrit, et malheur à eux à cause de ce qu'ils en profitent!",
    "tadabburAr": "الْوَعِيدُ الشَّدِيدُ لِمَنْ يُحَرِّفُ شَرْعَ اللهِ أَوْ يَبِيعُ الدِّينَ بِالْكَسْبِ الدُّنْيَوِيِّ الْحَقِيرِ.",
    "tadabburFr": "Une menace sévère pèse sur quiconque altère la religion d'Allah ou vend le sacré pour un profit terrestre éphémère.",
    "amalAr": "احْرِصْ عَلَى أَنْ تَكُونَ صَادِقًا فِي كَلَامِكَ وَلَا تُحَرِّفِ الْحَقِيقَةَ لِمَصْلَحَةٍ دُنْيَوِيَّةٍ.",
    "amalFr": "Sois rigoureusement véridique dans tes paroles et ne tord pas la vérité pour un intérêt personnel.",
    "tawjihAr": "خِيَانَةُ الْعِلْمِ وَتَحْرِيفُ الدِّينِ مِنْ أَعْظَمِ الْكَبَائِرِ عِنْدَ اللهِ.",
    "tawjihFr": "La trahison du savoir sacré et la falsification de la religion comptent parmi les plus grands péchés.",
    "words": [
      {
        "word": "كتبت",
        "count": 2,
        "refs": [
          "2:79",
          "4:77"
        ]
      },
      {
        "word": "بايديهم",
        "count": 3,
        "refs": [
          "2:79",
          "6:7",
          "59:2"
        ]
      },
      {
        "word": "وويل",
        "count": 3,
        "refs": [
          "2:79",
          "14:2",
          "41:6"
        ]
      }
    ]
  },
  {
    "n": 80,
    "arabic": "وَقَالُوا۟ لَن تَمَسَّنَا ٱلنَّارُ إِلَّآ أَيَّامًۭا مَّعْدُودَةًۭ ۚ قُلْ أَتَّخَذْتُمْ عِندَ ٱللَّهِ عَهْدًۭا فَلَن يُخْلِفَ ٱللَّهُ عَهْدَهُۥٓ ۖ أَمْ تَقُولُونَ عَلَى ٱللَّهِ مَا لَا تَعْلَمُونَ",
    "french": "Et ils ont dit: «Le Feu ne nous touchera que pour quelques jours comptés!». Dis: «Auriez-vous pris un engagement avec Allah - car Allah ne manque jamais à Son engagement; - non, mais vous dites sur Allah ce que vous ne savez pas».",
    "tadabburAr": "لَا يَنْفَعُ الْإِنْسَانَ الِادِّعَاءُ وَالْأَمَانِيُّ فِي نَجَاتِهِ، بَلِ الْعِبْرَةُ بِالْعَهْدِ وَالْعَمَلِ الصَّالِحِ.",
    "tadabburFr": "Les prétentions injustifiées et le faux sentiment de sécurité ne sauvent pas du châtiment ; seule l'obéissance aux engagements envers Allah compte.",
    "amalAr": "حَاسِبْ نَفْسَكَ الْيَوْمَ وَلَا تَغْتَرَّ بِرَحْمَةِ اللهِ دُونَ أَنْ تُقَدِّمَ عَمَلًا صَالِحًا.",
    "amalFr": "Fais ton examen de conscience aujourd'hui et ne te berce pas d'illusions sans accomplir d'œuvres pieuses.",
    "tawjihAr": "النَّجَاةُ عِنْدَ اللهِ تَكُونُ بِالْإِيمَانِ وَالتَّقْوَى، لَا بِالْأَمَانِيِّ وَالِانْتِسَابِ.",
    "tawjihFr": "Le salut auprès d'Allah s'obtient par la foi et la pieuse conduite, non par des privilèges présumés.",
    "words": [
      {
        "word": "تمسنا",
        "count": 2,
        "refs": [
          "2:80",
          "3:24"
        ]
      },
      {
        "word": "اياما",
        "count": 3,
        "refs": [
          "2:80",
          "2:184",
          "3:24"
        ]
      },
      {
        "word": "معدوده",
        "count": 3,
        "refs": [
          "2:80",
          "11:8",
          "12:20"
        ]
      }
    ]
  },
  {
    "n": 81,
    "arabic": "بَلَىٰ مَن كَسَبَ سَيِّئَةًۭ وَأَحَٰطَتْ بِهِۦ خَطِيٓـَٔتُهُۥ فَأُو۟لَٰٓئِكَ أَصْحَٰبُ ٱلنَّارِ ۖ هُمْ فِيهَا خَٰلِدُونَ",
    "french": "Bien au contraire! Ceux qui font le mal et qui se font cerner par leurs péchés, ceux-là sont les gens du Feu où ils demeureront éternellement.",
    "tadabburAr": "خَطَرُ الْإِصْرَارِ عَلَى الذُّنُوبِ؛ فَإِنَّهَا إِذَا كَثُرَتْ وَأَحَاطَتْ بِالْعَبْدِ أَهْلَكَتْهُ.",
    "tadabburFr": "Persister dans les péchés est un grand danger, car lorsqu'ils encerclent le cœur de l'homme, ils le conduisent à la ruine.",
    "amalAr": "بَادِرْ بِالتَّوْبَةِ وَالاسْتِغْفَارِ الْآنَ مِنْ ذَنْبٍ تُكَرِّرُهُ قَبْلَ أَنْ يُحِيطَ بِكَ.",
    "amalFr": "Hâte-toi de demander pardon pour un péché répétitif avant qu'il ne t'enferme dans son emprise.",
    "tawjihAr": "الذُّنُوبُ إِذَا تَكَاثَرَتْ دُونَ تَوْبَةٍ أَدَّتْ إِلَى الْهَلَاكِ وَالْخُلُودِ فِي النَّارِ.",
    "tawjihFr": "L'accumulation des péchés sans repentir conduit à la perdition éternelle.",
    "words": [
      {
        "word": "سيئه",
        "count": 13,
        "refs": [
          "2:81",
          "3:120",
          "4:78",
          "4:79"
        ]
      },
      {
        "word": "فاولئك",
        "count": 46,
        "refs": [
          "2:81",
          "2:121",
          "2:160",
          "2:217"
        ]
      },
      {
        "word": "النار",
        "count": 102,
        "refs": [
          "2:24",
          "2:39",
          "2:80",
          "2:81"
        ]
      }
    ]
  },
  {
    "n": 82,
    "arabic": "وَٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّٰلِحَٰتِ أُو۟لَٰٓئِكَ أَصْحَٰبُ ٱلْجَنَّةِ ۖ هُمْ فِيهَا خَٰلِدُونَ",
    "french": "Et ceux qui croient et pratiquent les bonnes œuvres, ceux-là sont les gens du Paradis où ils demeureront éternellement.",
    "tadabburAr": "الْإِيمَانُ الصَّادِقُ لَا بُدَّ أَنْ يُصَدِّقَهُ الْعَمَلُ الصَّالِحُ، وَهُمَا طَرِيقُ الْخُلُودِ فِي الْجَنَّةِ.",
    "tadabburFr": "La foi authentique doit être confirmée par les bonnes actions ; c'est ce duo indissociable qui ouvre les portes du Paradis éternel.",
    "amalAr": "اقْتَرِنْ إِيمَانَكَ الْيَوْمَ بِعَمَلٍ صَالِحٍ خَفِيٍّ كَصَدَقَةٍ أَوْ صَلَاةِ نَافِلَةٍ.",
    "amalFr": "Associe ta foi aujourd'hui à une bonne action discrète, comme une aumône secrète ou une prière surérogatoire.",
    "tawjihAr": "الْجَنَّةُ نَصِيبُ مَنْ جَمَعَ بَيْنَ الْإِيمَانِ الصَّحِيحِ وَالْعَمَلِ الصَّالِحِ.",
    "tawjihFr": "Le Paradis est la demeure de ceux qui allient la croyance pure aux actes vertueux.",
    "words": [
      {
        "word": "وعملوا",
        "count": 53,
        "refs": [
          "2:25",
          "2:82",
          "2:277",
          "3:57"
        ]
      },
      {
        "word": "الجنه",
        "count": 56,
        "refs": [
          "2:35",
          "2:82",
          "2:111",
          "2:214"
        ]
      },
      {
        "word": "اولئك",
        "count": 133,
        "refs": [
          "2:5",
          "2:16",
          "2:27",
          "2:39"
        ]
      }
    ]
  },
  {
    "n": 83,
    "arabic": "وَإِذْ أَخَذْنَا مِيثَٰقَ بَنِىٓ إِسْرَٰٓءِيلَ لَا تَعْبُدُونَ إِلَّا ٱللَّهَ وَبِٱلْوَٰلِدَيْنِ إِحْسَانًۭا وَذِى ٱلْقُرْبَىٰ وَٱلْيَتَٰمَىٰ وَٱلْمَسَٰكِينِ وَقُولُوا۟ لِلنَّاسِ حُسْنًۭا وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ ثُمَّ تَوَلَّيْتُمْ إِلَّا قَلِيلًۭا مِّنكُمْ وَأَنتُم مُّعْرِضُونَ",
    "french": "Et [rappelle-toi], lorsque Nous avons pris l'engagement des enfants d'Israël de n'adorer qu'Allah, de faire le bien envers les pères, les mères, les proches parents, les orphelins et les nécessiteux, d'avoir de bonnes paroles avec les gens; d'accomplir régulièrement la Salât et d'acquitter la Zakât! - Mais à l'exception d'un petit nombre de vous, vous manquiez à vos engagements en vous détournant de Nos commandements.",
    "tadabburAr": "أُصُولُ الشَّرَائِعِ الإِلَهِيَّةِ وَاحِدَةٌ: التَّوْحِيدُ، وَالإِحْسَانُ إِلَى الْخَلْقِ، وَإِقَامَةُ الْعِبَادَاتِ.",
    "tadabburFr": "Les fondements des lois divines sont immuables : le monothéisme pur, la bienfaisance envers autrui et l'accomplissement des rites.",
    "amalAr": "اتَّصِلْ بِوَالِدَيْكَ أَوْ بِأَحَدِ أَقَارِبِكَ الْيَوْمَ وَأَحْسِنْ إِلَيْهِ بِكَلِمَةٍ طَيِّبَةٍ.",
    "amalFr": "Contacte tes parents ou un proche aujourd'hui et adresse-lui une parole bienveillante.",
    "tawjihAr": "حُسْنُ الْخُلُقِ وَالْكَلَامُ الطَّيِّبُ مَعَ جَمِيعِ النَّاسِ مِنْ أَعْظَمِ التَّكَالِيفِ الشَّرْعِيَّةِ.",
    "tawjihFr": "La gentillesse dans le comportement et le bon parler envers tous les hommes sont des devoirs majeurs.",
    "words": [
      {
        "word": "والمسكين",
        "count": 2,
        "refs": [
          "17:26",
          "30:38"
        ]
      },
      {
        "word": "احسانا",
        "count": 6,
        "refs": [
          "2:83",
          "4:36",
          "4:62",
          "6:151"
        ]
      },
      {
        "word": "وقولوا",
        "count": 8,
        "refs": [
          "2:58",
          "2:83",
          "2:104",
          "4:5"
        ]
      }
    ]
  },
  {
    "n": 84,
    "arabic": "وَإِذْ أَخَذْنَا مِيثَٰقَكُمْ لَا تَسْفِكُونَ دِمَآءَكُمْ وَلَا تُخْرِجُونَ أَنفُسَكُم مِّن دِيَٰرِكُمْ ثُمَّ أَقْرَرْتُمْ وَأَنتُمْ تَشْهَدُونَ",
    "french": "Et rappelez-vous, lorsque Nous obtînmes de vous l'engagement de ne pas vous verser le sang, [par le meurtre] de ne pas vous expulser les uns les autres de vos maisons. Puis vous y avez souscrit avec votre propre témoignage.",
    "tadabburAr": "حُرْمَةُ دَمِ الْمُسْلِمِ وَمَالِهِ وَعِرْضِهِ مِنْ أَعْظَمِ الْعُهُودِ الَّتِي أَخَذَهَا اللهُ عَلَى الْعِبَادِ.",
    "tadabburFr": "La sacralité de la vie, des biens et de l'honneur de son prochain constitue un engagement fondamental pris devant Allah.",
    "amalAr": "كُفَّ لِسَانَكَ وَيَدَكَ عَنْ أَيِّ إِذَايَةٍ لِمُسْلِمٍ، وَكُنْ سَبَبًا فِي إِصْلَاحِ ذَاتِ الْبَيْنِ.",
    "amalFr": "Abstiens-toi de tout préjudice verbal ou physique envers ton frère et favorise la réconciliation.",
    "tawjihAr": "حِفْظُ الدِّمَاءِ وَالْأَمْنِ فِي الْمُجْتَمَعِ مَسْؤُولِيَّةٌ دِينِيَّةٌ وَأَخْلَاقِيَّةٌ.",
    "tawjihFr": "La préservation de la vie humaine et de la paix sociale est une obligation religieuse et éthique absolue.",
    "words": [
      {
        "word": "تشهدون",
        "count": 3,
        "refs": [
          "2:84",
          "3:70",
          "27:32"
        ]
      },
      {
        "word": "تخرجون",
        "count": 5,
        "refs": [
          "2:84",
          "7:25",
          "30:19",
          "30:25"
        ]
      },
      {
        "word": "اخذنا",
        "count": 12,
        "refs": [
          "2:63",
          "2:83",
          "2:84",
          "2:93"
        ]
      }
    ]
  },
  {
    "n": 85,
    "arabic": "ثُمَّ أَنتُمْ هَٰٓؤُلَآءِ تَقْتُلُونَ أَنفُسَكُمْ وَتُخْرِجُونَ فَرِيقًۭا مِّنكُم مِّن دِيَٰرِهِمْ تَظَٰهَرُونَ عَلَيْهِم بِٱلْإِثْمِ وَٱلْعُدْوَٰنِ وَإِن يَأْتُوكُمْ أُسَٰرَىٰ تُفَٰدُوهُمْ وَهُوَ مُحَرَّمٌ عَلَيْكُمْ إِخْرَاجُهُمْ ۚ أَفَتُؤْمِنُونَ بِبَعْضِ ٱلْكِتَٰبِ وَتَكْفُرُونَ بِبَعْضٍۢ ۚ فَمَا جَزَآءُ مَن يَفْعَلُ ذَٰلِكَ مِنكُمْ إِلَّا خِزْىٌۭ فِى ٱلْحَيَوٰةِ ٱلدُّنْيَا ۖ وَيَوْمَ ٱلْقِيَٰمَةِ يُرَدُّونَ إِلَىٰٓ أَشَدِّ ٱلْعَذَابِ ۗ وَمَا ٱللَّهُ بِغَٰفِلٍ عَمَّا تَعْمَلُونَ",
    "french": "Quoique ainsi engagés, voilà que vous vous entretuez, que vous expulsez de leurs maisons une partie d'entre vous contre qui vous prêtez main forte par péché et agression. Mais quelle contradiction! Si vos coreligionnaires vous viennent captifs vous les rançonnez alors qu'il vous était interdit de les expulser (de chez eux). Croyez-vous donc en une partie du Livre et rejetez-vous le reste? Ceux d'entre vous qui agissent de la sorte ne méritent que l'ignominie dans cette vie, et au Jour de la Résurrection ils seront refoulés au plus dur châtiment, et Allah n'est pas inattentif à ce que vous faites.",
    "tadabburAr": "الإِيمَانُ كُلٌّ لَا يَتَبَعَّضُ، وَمَنْ أَخَذَ بِبَعْضِ أَحْكَامِ الدِّينِ وَتَرَكَ بَعْضَهَا اتِّبَاعًا لِلْهَوَى تَعَرَّضَ لِلْخِزْيِ فِي الدُّنْيَا وَالْعَذَابِ فِي الآخِرَةِ.",
    "tadabburFr": "La foi est un tout indissociable : accepter une partie de la religion et en rejeter une autre selon ses désirs expose à l'improbité ici-bas et au châtiment dans l'au-delà.",
    "amalAr": "ارْفِضِ التَّنَقِّيَ فِي أَحْكَامِ الشَّرِيعَةِ وَالْتَزِمْ بِالشَّرْعِ كُلِّهِ.",
    "amalFr": "Applique tous les enseignements de l'Islam sans trier selon tes envies.",
    "tawjihAr": "الحَذَرُ مِنَ التَّنَاقُضِ بَيْنَ ادِّعَاءِ الإِيمَانِ وَالمُمَارَسَةِ الصَّادِقَةِ لَهُ.",
    "tawjihFr": "Gare à la contradiction entre la prétention à la foi et la pratique sélective de la religion.",
    "words": [
      {
        "word": "اسري",
        "count": 2,
        "refs": [
          "8:67",
          "17:1"
        ]
      },
      {
        "word": "يردون",
        "count": 2,
        "refs": [
          "2:85",
          "9:101"
        ]
      },
      {
        "word": "تقتلون",
        "count": 4,
        "refs": [
          "2:85",
          "2:87",
          "2:91",
          "33:26"
        ]
      }
    ]
  },
  {
    "n": 86,
    "arabic": "أُو۟لَٰٓئِكَ ٱلَّذِينَ ٱشْتَرَوُا۟ ٱلْحَيَوٰةَ ٱلدُّنْيَا بِٱلْءَاخِرَةِ ۖ فَلَا يُخَفَّفُ عَنْهُمُ ٱلْعَذَابُ وَلَا هُمْ يُنصَرُونَ",
    "french": "Voilà ceux qui échangent la vie présente contre la vie future. Eh bien, leur châtiment ne sera pas diminué. Et ils ne seront point secourus.",
    "tadabburAr": "إِيثَارُ الدُّنْيَا الْفَانِيَةِ عَلَى الآخِرَةِ الْبَاقِيَةِ خَسَارَةٌ مُحَقَّقَةٌ تُورِثُ الْعَذَابَ الَّذِي لَا يُخَفَّفُ.",
    "tadabburFr": "Préférer cette vie éphémère à l'au-delà éternel est une perte certaine qui entraîne un châtiment perpétuel sans soulagement.",
    "amalAr": "قَدِّمْ طَاعَةَ اللَّهِ وَمَرْضَاتَهُ عَلَى مَكَاسِبِ الدُّنْيَا الزَّائِلَةِ.",
    "amalFr": "Privilégie l'obéissance à Allah face aux gains éphémères de ce monde.",
    "tawjihAr": "الدُّنْيَا مَزْرَعَةُ الآخِرَةِ، فَلا تَجْعَلْهَا غَايَةَ مُرَادِكَ.",
    "tawjihFr": "Ce monde n'est que le champ de l'au-delà : ne le prends pas pour ultime objectif.",
    "words": [
      {
        "word": "اشتروا",
        "count": 6,
        "refs": [
          "2:16",
          "2:86",
          "2:90",
          "2:175"
        ]
      },
      {
        "word": "يخفف",
        "count": 7,
        "refs": [
          "2:86",
          "2:162",
          "3:88",
          "4:28"
        ]
      },
      {
        "word": "ينصرون",
        "count": 13,
        "refs": [
          "2:48",
          "2:86",
          "2:123",
          "3:111"
        ]
      }
    ]
  },
  {
    "n": 87,
    "arabic": "وَلَقَدْ ءَاتَيْنَا مُوسَى ٱلْكِتَٰبَ وَقَفَّيْنَا مِنۢ بَعْدِهِۦ بِٱلرُّسُلِ ۖ وَءَاتَيْنَا عِيسَى ٱبْنَ مَرْيَمَ ٱلْبَيِّنَٰتِ وَأَيَّدْنَٰهُ بِرُوحِ ٱلْقُدُسِ ۗ أَفَكُلَّمَا جَآءَكُمْ رَسُولٌۢ بِمَا لَا تَهْوَىٰٓ أَنفُسُكُمُ ٱسْتَكْبَرْتُمْ فَفَرِيقًۭا كَذَّبْتُمْ وَفَرِيقًۭا تَقْتُلُونَ",
    "french": "Certes, Nous avons donné le Livre à Moïse; Nous avons envoyé après lui des prophètes successifs. Et Nous avons donné des preuves à Jésus fils de Marie, et Nous l'avons renforcé du Saint-Esprit. Est-ce qu'à chaque fois, qu'un Messager vous apportait des vérités contraires à vos souhaits vous vous enfliez d'orgueil? Vous traitiez les uns d'imposteurs et vous tuiez les autres.",
    "tadabburAr": "اتِّبَاعُ الهَوَى يُعْمِي عَنِ الحَقِّ وَيُؤَدِّي إِلَى الِاسْتِكْبَارِ عَلَى رُسُلِ اللَّهِ وَأَحْكَامِهِ.",
    "tadabburFr": "Suivre ses passions aveugle face à la vérité et mène à l'orgueil envers les messagers d'Allah et Ses lois.",
    "amalAr": "اخْضَعْ لِلْحَقِّ مَتَى تَبَيَّنَ لَكَ وَإِنْ خَالَفَ هَوَاكَ.",
    "amalFr": "Soumets-toi à la vérité dès qu'elle te clarifie, même lorsqu'elle va à l'encontre de tes penchants.",
    "tawjihAr": "الكِبْرُ وَاتِّبَاعُ الهَوَى مَفْتَاحُ التَّكْذِيبِ وَالضَّلَالِ.",
    "tawjihFr": "L'orgueil et le suivi des passions sont les clés du déni et de l'égarement.",
    "words": [
      {
        "word": "كذبتم",
        "count": 2,
        "refs": [
          "2:87",
          "25:77"
        ]
      },
      {
        "word": "وقفينا",
        "count": 3,
        "refs": [
          "2:87",
          "5:46",
          "57:27"
        ]
      },
      {
        "word": "وفريقا",
        "count": 3,
        "refs": [
          "2:87",
          "5:70",
          "7:30"
        ]
      }
    ]
  },
  {
    "n": 88,
    "arabic": "وَقَالُوا۟ قُلُوبُنَا غُلْفٌۢ ۚ بَل لَّعَنَهُمُ ٱللَّهُ بِكُفْرِهِمْ فَقَلِيلًۭا مَّا يُؤْمِنُونَ",
    "french": "Et ils dirent: «Nos cœurs sont enveloppés et impénétrables» - Non mais Allah les a maudits à cause de leur infidélité, leur foi est donc médiocre.",
    "tadabburAr": "الادِّعَاءُ بِأَنَّ القَلْبَ لا يَفْهَمُ الحَقَّ هُوَ حُجَّةٌ بَاطِلَةٌ؛ فَالصَّدُّ عَنِ الْحَقِّ سَبَبُهُ طَرْدُ اللَّهِ لَهُمْ بِسَبَبِ كُفْرِهِمْ.",
    "tadabburFr": "Prétendre que le cœur est incapable de comprendre la vérité est un faux prétexte ; le refus vient de l'éloignement de la miséricorde divine causé par la mécréance.",
    "amalAr": "اسْأَلِ اللَّهَ دَائِمًا ثَبَاتَ القَلْبِ وَفَتْحَ بَصِيرَتِكَ لِلْحَقِّ.",
    "amalFr": "Demande constamment à Allah d'affermir ton cœur et de l'abreuver de la vérité.",
    "tawjihAr": "الإِصْرَارُ عَلَى الذَّنْبِ وَالْكُفْرِ يُغْلِقُ القَلْبَ وَيَحْرِمُ مِنْ رَحْمَةِ اللَّهِ.",
    "tawjihFr": "Persister dans le péché verrouille le cœur et prive de la miséricorde d'Allah.",
    "words": [
      {
        "word": "بكفرهم",
        "count": 4,
        "refs": [
          "2:88",
          "2:93",
          "4:46",
          "4:155"
        ]
      },
      {
        "word": "لعنهم",
        "count": 5,
        "refs": [
          "2:88",
          "4:46",
          "4:52",
          "33:57"
        ]
      },
      {
        "word": "قلوبنا",
        "count": 6,
        "refs": [
          "2:88",
          "3:8",
          "4:155",
          "5:113"
        ]
      }
    ]
  },
  {
    "n": 89,
    "arabic": "وَلَمَّا جَآءَهُمْ كِتَٰبٌۭ مِّنْ عِندِ ٱللَّهِ مُصَدِّقٌۭ لِّمَا مَعَهُمْ وَكَانُوا۟ مِن قَبْلُ يَسْتَفْتِحُونَ عَلَى ٱلَّذِينَ كَفَرُوا۟ فَلَمَّا جَآءَهُم مَّا عَرَفُوا۟ كَفَرُوا۟ بِهِۦ ۚ فَلَعْنَةُ ٱللَّهِ عَلَى ٱلْكَٰفِرِينَ",
    "french": "Et quand leur vint d'Allah un Livre confirmant celui qu'ils avaient déjà, - alors qu'auparavant ils cherchaient la suprématie sur les mécréants, - quand donc leur vint cela même qu'ils reconnaissaient, ils refusèrent d'y croire. Que la malédiction d'Allah soit sur les mécréants!",
    "tadabburAr": "الْحَسَدُ وَالْكِبْرُ يَمْنَعَانِ العَبْدَ مِنْ قَبُولِ الحَقِّ بَعْدَ مَعْرِفَتِهِ، مِمَّا يُوجِبُ الطَّرْدَ مِنْ رَحْمَةِ اللَّهِ.",
    "tadabburFr": "L'envie et l'orgueil empêchent l'Homme d'accepter la vérité même après l'avoir reconnue, attirant sur lui la malédiction divine.",
    "amalAr": "طَهِّرْ قَلْبَكَ مِنَ الحَسَدِ وَاقْبَلِ الحَقَّ مِمَّنْ جَاءَ بِهِ.",
    "amalFr": "Purifie ton cœur de l'envie et accepte la vérité d'où qu'elle vienne.",
    "tawjihAr": "مَعْرِفَةُ الحَقِّ لَا تَكْفِي بِدُونِ الِانْقِيَادِ وَالْعَمَلِ بِهِ.",
    "tawjihFr": "Connaître la vérité ne suffit pas sans la soumission et la mise en pratique.",
    "words": [
      {
        "word": "عرفوا",
        "count": 2,
        "refs": [
          "2:89",
          "5:83"
        ]
      },
      {
        "word": "مصدق",
        "count": 5,
        "refs": [
          "2:89",
          "2:101",
          "3:81",
          "6:92"
        ]
      },
      {
        "word": "معهم",
        "count": 14,
        "refs": [
          "2:89",
          "2:91",
          "2:101",
          "2:213"
        ]
      }
    ]
  },
  {
    "n": 90,
    "arabic": "بِئْسَمَا ٱشْتَرَوْا۟ بِهِۦٓ أَنفُسَهُمْ أَن يَكْفُرُوا۟ بِمَآ أَنزَلَ ٱللَّهُ بَغْيًا أَن يُنَزِّلَ ٱللَّهُ مِن فَضْلِهِۦ عَلَىٰ مَن يَشَآءُ مِنْ عِبَادِهِۦ ۖ فَبَآءُو بِغَضَبٍ عَلَىٰ غَضَبٍۢ ۚ وَلِلْكَٰفِرِينَ عَذَابٌۭ مُّهِينٌۭ",
    "french": "Comme est vil ce contre quoi ils ont troqué leurs âmes! Ils ne croient pas en ce qu'Allah a fait descendre, révoltés à l'idée qu'Allah, de par Sa grâce, fasse descendre la révélation sur ceux de Ses serviteurs qu'Il veut. Ils ont donc acquis colère sur colère, car un châtiment avilissant attend les infidèles!",
    "tadabburAr": "اعْتِرَاضُ العَبْدِ عَلَى فَضْلِ اللَّهِ وَقِسْمَتِهِ جَهْلٌ وَحَسَدٌ يُؤَدِّي إِلَى سَخَطِ اللَّهِ وَعَذَابِهِ.",
    "tadabburFr": "Contester les grâces et le choix d'Allah découle de l'ignorance et de la jalousie, attirant la colère divine sur soi.",
    "amalAr": "ارْضَ بِمَا قَسَمَ اللَّهُ لَكَ وَلِغَيْرِكَ وَلا تَحْسُدْ أَحَدًا عَلَى فَضْلِ اللَّهِ.",
    "amalFr": "Sois satisfait de ce qu'Allah t'a accordé ainsi qu'aux autres, sans jalouser la grâce d'Allah.",
    "tawjihAr": "فَضْلُ اللَّهِ يُؤْتِيهِ مَنْ يَشَاءُ، وَالْوَاجِبُ التَّسْلِيمُ لِحُكْمِهِ وَحِكْمَتِهِ.",
    "tawjihFr": "La grâce d'Allah est accordée à qui Il veut : le devoir du croyant est la soumission complète à Sa sagesse.",
    "words": [
      {
        "word": "بئسما",
        "count": 3,
        "refs": [
          "2:90",
          "2:93",
          "7:150"
        ]
      },
      {
        "word": "يكفروا",
        "count": 3,
        "refs": [
          "2:90",
          "4:60",
          "28:48"
        ]
      },
      {
        "word": "بغضب",
        "count": 4,
        "refs": [
          "2:61",
          "2:90",
          "3:112",
          "8:16"
        ]
      }
    ]
  },
  {
    "n": 91,
    "arabic": "وَإِذَا قِيلَ لَهُمْ ءَامِنُوا۟ بِمَآ أَنزَلَ ٱللَّهُ قَالُوا۟ نُؤْمِنُ بِمَآ أُنزِلَ عَلَيْنَا وَيَكْفُرُونَ بِمَا وَرَآءَهُۥ وَهُوَ ٱلْحَقُّ مُصَدِّقًۭا لِّمَا مَعَهُمْ ۗ قُلْ فَلِمَ تَقْتُلُونَ أَنۢبِيَآءَ ٱللَّهِ مِن قَبْلُ إِن كُنتُم مُّؤْمِنِينَ",
    "french": "Et quand on leur dit: «Croyez à ce qu'Allah a fait descendre», ils disent: «Nous croyons à ce qu'on a fait descendre à nous». Et ils rejettent le reste, alors qu'il est la vérité confirmant ce qu'il y avait déjà avec eux. - Dis: «Pourquoi donc avez-vous tué auparavant les prophètes d'Allah, si vous étiez croyants?».",
    "tadabburAr": "التَّعَصُّبُ لِلْجَمَاعَةِ أَوْ لِلْمَذْهَبِ مَعَ رَدِّ الحَقِّ الأَخَرِ دَلِيلٌ عَلَى كَذِبِ ادِّعَاءِ الإِيمَانِ.",
    "tadabburFr": "Le fanatisme envers son groupe ou sa tradition tout en rejetant la vérité universelle démontre la fausseté de la prétention à la foi.",
    "amalAr": "اتَّبِعِ الحَقَّ حَيْثُمَا كَانَ وَلا تَتَعَصَّبْ لِقَوْمٍ أَوْ رَأْيٍ.",
    "amalFr": "Suis la vérité où qu'elle se trouve sans préjugé ni sectarisme.",
    "tawjihAr": "المِعْيَارُ فِي الحَقِّ هُوَ الوَحْيُ، لا الانْتِمَاءاتُ العَصَبِيَّةُ.",
    "tawjihFr": "Le critère ultime de la vérité est la révélation divine, non l'appartenance communautaire.",
    "words": [
      {
        "word": "انبياء",
        "count": 2,
        "refs": [
          "2:91",
          "5:20"
        ]
      },
      {
        "word": "تقتلون",
        "count": 4,
        "refs": [
          "2:85",
          "2:87",
          "2:91",
          "33:26"
        ]
      },
      {
        "word": "نؤمن",
        "count": 10,
        "refs": [
          "2:55",
          "2:91",
          "3:183",
          "4:150"
        ]
      }
    ]
  },
  {
    "n": 92,
    "arabic": "۞ وَلَقَدْ جَآءَكُم مُّوسَىٰ بِٱلْبَيِّنَٰتِ ثُمَّ ٱتَّخَذْتُمُ ٱلْعِجْلَ مِنۢ بَعْدِهِۦ وَأَنتُمْ ظَٰلِمُونَ",
    "french": "Et en effet Moïse vous est venu avec les preuves. Malgré cela, une fois absent, vous avez pris le Veau pour idole, alors que vous étiez injustes.",
    "tadabburAr": "مَهْمَا وُجِدَتِ الْبَيِّنَاتُ الْوَاضِحَةُ، فَإِنَّ الْقَلْبَ الزَّاغَ قَدْ يَرْتَدُّ إِلَى الْبَاطِلِ إِذَا غَابَ عَنْهُ الْمُرَبِّي.",
    "tadabburFr": "Malgré les preuves les plus claires, un cœur déviant peut succomber au faux dès que le guide s'absente.",
    "amalAr": "حَصِّنْ قَلْبَكَ مِنَ الشِّرْكِ وَالْهَوَى بِالتَّوْحِيدِ وَالدُّعَاءِ بِالثَّبَاتِ.",
    "amalFr": "Protège ton cœur du shirk et des passions par le tawhid et l'invocation de la constance.",
    "tawjihAr": "الظُّلْمُ الْأَعْظَمُ هُوَ اتِّخَاذُ الْأَنْدَادِ مَعَ اللَّهِ بَعْدَ وُضُوحِ الْحَقِّ.",
    "tawjihFr": "L'injustice suprême consiste à donner des associés à Allah après que la vérité est devenue claire.",
    "words": [
      {
        "word": "اتخذتم",
        "count": 5,
        "refs": [
          "2:51",
          "2:80",
          "2:92",
          "29:25"
        ]
      },
      {
        "word": "العجل",
        "count": 6,
        "refs": [
          "2:51",
          "2:54",
          "2:92",
          "2:93"
        ]
      },
      {
        "word": "بعده",
        "count": 21,
        "refs": [
          "2:51",
          "2:87",
          "2:92",
          "3:65"
        ]
      }
    ]
  },
  {
    "n": 93,
    "arabic": "وَإِذْ أَخَذْنَا مِيثَٰقَكُمْ وَرَفَعْنَا فَوْقَكُمُ ٱلطُّورَ خُذُوا۟ مَآ ءَاتَيْنَٰكُم بِقُوَّةٍۢ وَٱسْمَعُوا۟ ۖ قَالُوا۟ سَمِعْنَا وَعَصَيْنَا وَأُشْرِبُوا۟ فِى قُلُوبِهِمُ ٱلْعِجْلَ بِكُفْرِهِمْ ۚ قُلْ بِئْسَمَا يَأْمُرُكُم بِهِۦٓ إِيمَٰنُكُمْ إِن كُنتُم مُّؤْمِنِينَ",
    "french": "Et rappelez-vous, lorsque Nous avons pris l'engagement de vous, et brandi sur vous AT-Tûr (le Mont Sinaï) en vous disant: «Tenez ferme à ce que Nous vous avons donné, et écoutez!». Ils dirent: «Nous avons écouté et désobéi». Dans leur impiété, leurs cœurs étaient passionnément épris du Veau (objet de leur culte). Dis-[leur]: «Quelles mauvaises prescriptions ordonnées par votre foi, si vous êtes croyants».",
    "tadabburAr": "الذُّنُوبُ إِذَا اسْتَقَرَّتْ فِي الْقُلُوبِ أَوْرَثَتِ الْعِصْيَانَ وَمَحَتْ حَلَاوَةَ الْإِيمَانِ.",
    "tadabburFr": "Lorsque les péchés s'enracinent dans le cœur, ils engendrent la désobéissance et effacent la douceur de la foi.",
    "amalAr": "اقْبَلْ أَوَامِرَ اللَّهِ بِالسَّمْعِ وَالطَّاعَةِ دُونَ تَرَدُّدٍ أَوْ تَسْوِيفٍ.",
    "amalFr": "Accueille les ordres d'Allah par l'écoute et l'obéissance, sans hésitation ni report.",
    "tawjihAr": "الْإِيمَانُ الصَّادِقُ يَأْمُرُ بِالطَّاعَةِ وَيَنْهَى عَنِ الْمَعْصِيَةِ.",
    "tawjihFr": "La foi sincère commande l'obéissance et interdit la désobéissance.",
    "words": [
      {
        "word": "وعصينا",
        "count": 2,
        "refs": [
          "2:93",
          "4:46"
        ]
      },
      {
        "word": "بئسما",
        "count": 3,
        "refs": [
          "2:90",
          "2:93",
          "7:150"
        ]
      },
      {
        "word": "واسمعوا",
        "count": 4,
        "refs": [
          "2:93",
          "2:104",
          "5:108",
          "64:16"
        ]
      }
    ]
  },
  {
    "n": 94,
    "arabic": "قُلْ إِن كَانَتْ لَكُمُ ٱلدَّارُ ٱلْءَاخِرَةُ عِندَ ٱللَّهِ خَالِصَةًۭ مِّن دُونِ ٱلنَّاسِ فَتَمَنَّوُا۟ ٱلْمَوْتَ إِن كُنتُمْ صَٰدِقِينَ",
    "french": "- Dis: «Si l'Ultime demeure auprès d'Allah est pour vous seuls, à l'exclusion des autres gens, souhaitez donc la mort [immédiate] si vous êtes véridiques!»",
    "tadabburAr": "ادِّعَاءُ أَنَّ الْجَنَّةَ خَالِصَةٌ لِفِئَةٍ دُونَ غَيْرِهَا يُبْطِلُهُ خَوْفُهُمْ مِنَ الْمَوْتِ لِفَسَادِ أَعْمَالِهِمْ.",
    "tadabburFr": "Prétendre détenir l'exclusivité du Paradis est démenti par la peur de la mort due à la corruption de leurs actes.",
    "amalAr": "حَاسِبْ نَفْسَكَ قَبْلَ الْمَوْتِ وَأَعِدَّ لِلْآخِرَةِ الزَّادَ الصَّالِحَ.",
    "amalFr": "Fais l'examen de ta conscience avant la mort et prépare de bonnes provisions pour l'au-delà.",
    "tawjihAr": "الصِّدْقُ فِي ادِّعَاءِ مَحَبَّةِ الْآخِرَةِ يَتَطَلَّبُ الِاسْتِعْدَادَ لَهَا بِالْعَمَلِ.",
    "tawjihFr": "La sincérité dans la prétention d'aimer l'au-delà exige de s'y préparer par les actes.",
    "words": [
      {
        "word": "فتمنوا",
        "count": 2,
        "refs": [
          "2:94",
          "62:6"
        ]
      },
      {
        "word": "خالصه",
        "count": 4,
        "refs": [
          "2:94",
          "6:139",
          "7:32",
          "33:50"
        ]
      },
      {
        "word": "الدار",
        "count": 13,
        "refs": [
          "2:94",
          "6:135",
          "13:22",
          "13:24"
        ]
      }
    ]
  },
  {
    "n": 95,
    "arabic": "وَلَن يَتَمَنَّوْهُ أَبَدًۢا بِمَا قَدَّمَتْ أَيْدِيهِمْ ۗ وَٱللَّهُ عَلِيمٌۢ بِٱلظَّٰلِمِينَ",
    "french": "Or, ils ne la souhaiteront jamais, sachant tout le mal qu'ils ont perpétré de leurs mains. Et Allah connait bien les injustes.",
    "tadabburAr": "الْخَوْفُ مِنَ الْمَوْتِ لَدَى الظَّالِمِينَ نَاتِجٌ عَنْ سُوءِ أَعْمَالِهِمْ وَعِلْمِهِمْ بِمَصِيرِهِمْ.",
    "tadabburFr": "La peur de la mort chez les injustes provient de la laideur de leurs actes et de la conscience de leur sort.",
    "amalAr": "اسْتَغْفِرِ اللَّهَ مِنْ ذُنُوبِكَ الَّتِي خَلَتْ كَيْ تَلْقَى اللَّهَ بِقَلْبٍ سَلِيمٍ.",
    "amalFr": "Demande pardon à Allah pour tes péchés passés afin de Le rencontrer avec un cœur sain.",
    "tawjihAr": "اللَّهُ عَلِيمٌ بِأَعْمَالِ الظَّالِمِينَ وَلَا يَخْفَى عَلَيْهِ شَيْءٌ مِنْ سَرَائِرِهِمْ.",
    "tawjihFr": "Allah connaît parfaitement les actes des injustes et rien de leurs secrets ne Lui échappe.",
    "words": [
      {
        "word": "قدمت",
        "count": 16,
        "refs": [
          "2:95",
          "3:182",
          "4:62",
          "5:80"
        ]
      },
      {
        "word": "ابدا",
        "count": 28,
        "refs": [
          "2:95",
          "4:57",
          "4:122",
          "4:169"
        ]
      },
      {
        "word": "ايديهم",
        "count": 33,
        "refs": [
          "2:79",
          "2:95",
          "2:255",
          "4:62"
        ]
      }
    ]
  },
  {
    "n": 96,
    "arabic": "وَلَتَجِدَنَّهُمْ أَحْرَصَ ٱلنَّاسِ عَلَىٰ حَيَوٰةٍۢ وَمِنَ ٱلَّذِينَ أَشْرَكُوا۟ ۚ يَوَدُّ أَحَدُهُمْ لَوْ يُعَمَّرُ أَلْفَ سَنَةٍۢ وَمَا هُوَ بِمُزَحْزِحِهِۦ مِنَ ٱلْعَذَابِ أَن يُعَمَّرَ ۗ وَٱللَّهُ بَصِيرٌۢ بِمَا يَعْمَلُونَ",
    "french": "Et certes tu les trouveras les plus attachés à la vie [d'ici-bas], pire en cela que les Associateurs. Tel d'entre eux aimerait vivre mille ans. Mais une pareille longévité ne le sauvera pas du châtiment! Et Allah voit bien leurs actions.",
    "tadabburAr": "الرَّغْبَةُ فِي طُولِ الْعُمُرِ دُونَ عَمَلٍ صَالِحٍ لَا تُنْجِي الْعَبْدَ مِنْ عَذَابِ اللَّهِ.",
    "tadabburFr": "Désirer une longue vie sans accomplir de bonnes œuvres ne sauve pas le serviteur du châtiment d'Allah.",
    "amalAr": "اغْتَنِمْ حَيَاتَكَ وَوَقْتَكَ فِي الطَّاعَاتِ وَلَا تَغْرُرْكَ الْأَمَانِيُّ.",
    "amalFr": "Profite de ta vie et de ton temps dans les obéissances, et ne te laisse pas tromper par de vains espoirs.",
    "tawjihAr": "الْقِيمَةُ لَيْسَتْ فِي طُولِ الْعُمُرِ وَإِنَّمَا فِي حُسْنِ الْعَمَلِ وَبَرَكَتِهِ.",
    "tawjihFr": "La vraie valeur ne réside pas dans la longévité de la vie, mais dans la bonté et la bénédiction des actes.",
    "words": [
      {
        "word": "يعمر",
        "count": 4,
        "refs": [
          "2:96",
          "2:96",
          "9:18",
          "35:11"
        ]
      },
      {
        "word": "احدهم",
        "count": 7,
        "refs": [
          "2:96",
          "3:91",
          "4:18",
          "16:58"
        ]
      },
      {
        "word": "اشركوا",
        "count": 12,
        "refs": [
          "2:96",
          "3:151",
          "3:186",
          "5:82"
        ]
      }
    ]
  },
  {
    "n": 97,
    "arabic": "قُلْ مَن كَانَ عَدُوًّۭا لِّجِبْرِيلَ فَإِنَّهُۥ نَزَّلَهُۥ عَلَىٰ قَلْبِكَ بِإِذْنِ ٱللَّهِ مُصَدِّقًۭا لِّمَا بَيْنَ يَدَيْهِ وَهُدًۭى وَبُشْرَىٰ لِلْمُؤْمِنِينَ",
    "french": "Dis: «Quiconque est ennemi de Gabriel doit connaître que c'est lui qui, avec la permission d'Allah, a fait descendre sur ton cœur cette révélation qui déclare véridiques les messages antérieurs et qui sert aux croyants de guide et d'heureuse annonce»",
    "tadabburAr": "جِبْرِيلُ عَلَيْهِ السَّلَامُ هُوَ رَسُولُ الْوَحْيِ الْأَمِينُ، وَمُعَادَاتُهُ مُعَادَاةٌ لِلْحَقِّ الَّذِي نَزَلَ بِهِ.",
    "tadabburFr": "Gabriel (paix sur lui) est le messager fidèle de la Révélation; lui vouer de l'inimitié, c'est s'opposer à la vérité qu'il a apportée.",
    "amalAr": "اقْرَأِ الْقُرْآنَ بِتَدَبُّرٍ فَهُوَ هُدًى وَبُشْرَى لِقَلْبِكَ.",
    "amalFr": "Lis le Coran avec méditation, car il est une guidance et une bonne nouvelle pour ton cœur.",
    "tawjihAr": "مَنْ أَحَبَّ الْقُرْآنَ وَالْوَحْيَ فَقَدْ أَحَبَّ جِبْرِيلَ وَالْمَلَائِكَةَ.",
    "tawjihFr": "Quiconque aime le Coran et la Révélation aime Gabriel et les anges.",
    "words": [
      {
        "word": "نزله",
        "count": 3,
        "refs": [
          "2:97",
          "16:102",
          "53:13"
        ]
      },
      {
        "word": "قلبك",
        "count": 3,
        "refs": [
          "2:97",
          "26:194",
          "42:24"
        ]
      },
      {
        "word": "وبشري",
        "count": 5,
        "refs": [
          "2:97",
          "16:89",
          "16:102",
          "27:2"
        ]
      }
    ]
  },
  {
    "n": 98,
    "arabic": "مَن كَانَ عَدُوًّۭا لِّلَّهِ وَمَلَٰٓئِكَتِهِۦ وَرُسُلِهِۦ وَجِبْرِيلَ وَمِيكَىٰلَ فَإِنَّ ٱللَّهَ عَدُوٌّۭ لِّلْكَٰفِرِينَ",
    "french": "[Dis:] «Quiconque est ennemi d'Allah, de Ses anges, de Ses messagers, de Gabriel et de Michaël... [Allah sera son ennemi] car Allah est l'ennemi des infidèles».",
    "tadabburAr": "مُعَادَاةُ أَوْلِيَاءِ اللَّهِ وَمَلَائِكَتِهِ كُفْرٌ صَرِيحٌ يُوجِبُ عَدَاوَةَ اللَّهِ وَغَضَبَهُ.",
    "tadabburFr": "L'inimitié envers les alliés d'Allah et Ses anges est une mécréance manifeste qui attire l'inimitié et la colère d'Allah.",
    "amalAr": "أَوْثِقْ عُرَى الْإِيمَانِ بِمُوَالَاةِ أَوْلِيَاءِ اللَّهِ وَمَلَائِكَتِهِ وَرُسُلِهِ.",
    "amalFr": "Renforce les liens de la foi en t'alliant aux pieux serviteurs d'Allah, à Ses anges et à Ses messagers.",
    "tawjihAr": "مَنْ عَادَى حِزْبَ اللَّهِ فَقَدْ جَعَلَ اللَّهَ لَهُ عَدُوًّا، وَلَا نَاصِرَ لِمَنْ عَادَاهُ اللَّهُ.",
    "tawjihFr": "Quiconque prend pour ennemi le parti d'Allah s'expose à l'inimitié d'Allah, et nul ne peut secourir celui qu'Allah combat.",
    "words": [
      {
        "word": "وجبريل",
        "count": 2,
        "refs": [
          "2:98",
          "66:4"
        ]
      },
      {
        "word": "عدوا",
        "count": 11,
        "refs": [
          "2:97",
          "2:98",
          "4:101",
          "6:108"
        ]
      },
      {
        "word": "ورسله",
        "count": 12,
        "refs": [
          "2:98",
          "2:285",
          "3:179",
          "4:136"
        ]
      }
    ]
  },
  {
    "n": 99,
    "arabic": "وَلَقَدْ أَنزَلْنَآ إِلَيْكَ ءَايَٰتٍۭ بَيِّنَٰتٍۢ ۖ وَمَا يَكْفُرُ بِهَآ إِلَّا ٱلْفَٰسِقُونَ",
    "french": "Et très certainement Nous avons fait descendre vers toi des signes évidents. Et seuls les pervers n'y croient pas.",
    "tadabburAr": "آيَاتُ اللهِ وَاضِحَةٌ جَلِيَّةٌ، وَلَا يَكْفُرُ بِهَا إِلَّا مَنْ خَرَجَ عَنْ طَاعَةِ اللهِ وَتَمَرَّدَ عَلَى الحَقِّ.",
    "tadabburFr": "Les preuves d'Allah sont claires et explicites ; seul celui qui s'écarte de Son obéissance et se rebelle contre la vérité les rejette.",
    "amalAr": "اتْلُ آيَاتِ اللهِ بِتَدَبُّرٍ وَخُضُوعٍ لِتَسْلَمَ مِنَ الفِسْقِ.",
    "amalFr": "Récite les versets d'Allah avec méditation et humilité pour préserver ton cœur de la désobéissance.",
    "tawjihAr": "الكُفْرُ بِالحَقِّ المَبِينِ نَاتِجٌ عَنْ الفِسْقِ وَفَسَادِ القَلْبِ.",
    "tawjihFr": "Le rejet de la vérité évidente découle de la perversité du cœur et de la désobéissance à Allah.",
    "words": [
      {
        "word": "يكفر",
        "count": 15,
        "refs": [
          "2:99",
          "2:121",
          "2:256",
          "3:19"
        ]
      },
      {
        "word": "انزلنا",
        "count": 25,
        "refs": [
          "2:99",
          "2:159",
          "4:105",
          "5:44"
        ]
      },
      {
        "word": "اليك",
        "count": 77,
        "refs": [
          "2:4",
          "2:99",
          "2:260",
          "3:44"
        ]
      }
    ]
  },
  {
    "n": 100,
    "arabic": "أَوَكُلَّمَا عَٰهَدُوا۟ عَهْدًۭا نَّبَذَهُۥ فَرِيقٌۭ مِّنْهُم ۚ بَلْ أَكْثَرُهُمْ لَا يُؤْمِنُونَ",
    "french": "Faudrait-il chaque fois qu'ils concluent un pacte, qu'une partie d'entre eux le dénonce? C'est que plutôt la plupart d'entre eux ne sont pas croyants.",
    "tadabburAr": "مِنْ صِفَاتِ أَهْلِ الضَّلَالِ نَقْضُ العُهُودِ وَالعُقُودِ كُلَّمَا أَبْرَمُوهَا.",
    "tadabburFr": "La rupture constante des engagements et des pactes est une caractéristique propre aux gens de l'égarement.",
    "amalAr": "أَوْفِ بِكُلِّ عَهْدٍ أَوْ وَعْدٍ قَطَعْتَهُ اليَوْمَ مَعَ اللهِ أَوْ مَعَ النَّاسِ.",
    "amalFr": "Honore aujourd'hui chaque engagement ou promesse que tu as pris envers Allah ou envers les gens.",
    "tawjihAr": "الوَفَاءُ بِالعُهُودِ مِنْ أَعْظَمِ خِصَالِ الإِيمَانِ، وَنَقْضُهَا مِنْ صِفَاتِ أَهْلِ الخِذْلَانِ.",
    "tawjihFr": "Le respect des pactes est une noble qualité de la foi, tandis que leur violation est une marque d'impiété.",
    "words": [
      {
        "word": "عهدا",
        "count": 4,
        "refs": [
          "2:80",
          "2:100",
          "19:78",
          "19:87"
        ]
      },
      {
        "word": "فريق",
        "count": 13,
        "refs": [
          "2:75",
          "2:100",
          "2:101",
          "3:23"
        ]
      },
      {
        "word": "اكثرهم",
        "count": 38,
        "refs": [
          "2:100",
          "6:37",
          "6:111",
          "7:17"
        ]
      }
    ]
  },
  {
    "n": 101,
    "arabic": "وَلَمَّا جَآءَهُمْ رَسُولٌۭ مِّنْ عِندِ ٱللَّهِ مُصَدِّقٌۭ لِّمَا مَعَهُمْ نَبَذَ فَرِيقٌۭ مِّنَ ٱلَّذِينَ أُوتُوا۟ ٱلْكِتَٰبَ كِتَٰبَ ٱللَّهِ وَرَآءَ ظُهُورِهِمْ كَأَنَّهُمْ لَا يَعْلَمُونَ",
    "french": "Et quand leur vint d'Allah un messager confirmant ce qu'il y avait déjà avec eux, certains à qui le Livre avait été donné, jetèrent derrière leur dos le Livre d'Allah comme s'ils ne savaient pas!",
    "tadabburAr": "حِينَ يَتَعَارَضُ الهَوَى مَعَ الوَحْيِ، يَنبِذُ أَهْلُ البَاطِلِ كِتَابَ اللهِ كَأَنَّهُمْ لَا يَعْلَمُونَ.",
    "tadabburFr": "Lorsque la passion contredit la révélation, les partisans du faux rejettent le Livre d'Allah comme s'ils ne savaient pas.",
    "amalAr": "قَدِّمْ حُكْمَ القُرْآنِ عَلَى هَوَاكَ فِي أَيِّ مَوْقِفٍ تُوَاجِهُهُ اليَوْمَ.",
    "amalFr": "Fais passer le jugement du Coran avant tes désirs personnels dans toutes tes décisions du jour.",
    "tawjihAr": "إِعْرَاضُ المَرْءِ عَنِ العِلْمِ بَعْدَ مَعْرِفَتِهِ سَبَبٌ فِي الخِذْلَانِ وَالحِرْمَانِ.",
    "tawjihFr": "Ignorer volontairement la vérité après l'avoir connue mène à la privation de la guidée.",
    "words": [
      {
        "word": "مصدق",
        "count": 5,
        "refs": [
          "2:89",
          "2:101",
          "3:81",
          "6:92"
        ]
      },
      {
        "word": "ظهورهم",
        "count": 5,
        "refs": [
          "2:101",
          "3:187",
          "6:31",
          "7:172"
        ]
      },
      {
        "word": "كانهم",
        "count": 11,
        "refs": [
          "2:101",
          "46:35",
          "52:24",
          "54:7"
        ]
      }
    ]
  },
  {
    "n": 102,
    "arabic": "وَٱتَّبَعُوا۟ مَا تَتْلُوا۟ ٱلشَّيَٰطِينُ عَلَىٰ مُلْكِ سُلَيْمَٰنَ ۖ وَمَا كَفَرَ سُلَيْمَٰنُ وَلَٰكِنَّ ٱلشَّيَٰطِينَ كَفَرُوا۟ يُعَلِّمُونَ ٱلنَّاسَ ٱلسِّحْرَ وَمَآ أُنزِلَ عَلَى ٱلْمَلَكَيْنِ بِبَابِلَ هَٰرُوتَ وَمَٰرُوتَ ۚ وَمَا يُعَلِّمَانِ مِنْ أَحَدٍ حَتَّىٰ يَقُولَآ إِنَّمَا نَحْنُ فِتْنَةٌۭ فَلَا تَكْفُرْ ۖ فَيَتَعَلَّمُونَ مِنْهُمَا مَا يُفَرِّقُونَ بِهِۦ بَيْنَ ٱلْمَرْءِ وَزَوْجِهِۦ ۚ وَمَا هُم بِضَآرِّينَ بِهِۦ مِنْ أَحَدٍ إِلَّا بِإِذْنِ ٱللَّهِ ۚ وَيَتَعَلَّمُونَ مَا يَضُرُّهُمْ وَلَا يَنفَعُهُمْ ۚ وَلَقَدْ عَلِمُوا۟ لَمَنِ ٱشْتَرَىٰهُ مَا لَهُۥ فِى ٱلْءَاخِرَةِ مِنْ خَلَٰقٍۢ ۚ وَلَبِئْسَ مَا شَرَوْا۟ بِهِۦٓ أَنفُسَهُمْ ۚ لَوْ كَانُوا۟ يَعْلَمُونَ",
    "french": "Et ils suivirent ce que les diables racontent contre le règne de Solayman. Alors que Solayman n'a jamais été mécréant mais bien les diables: ils enseignent aux gens la magie ainsi que ce qui est descendu aux deux anges Hârout et Mârout, à Babylone; mais ceux-ci n'enseignaient rien à personne, qu'ils n'aient dit d'abord: «Nous ne sommes rien qu'une tentation: ne sois pas mécréant» ils apprennent auprès d'eux ce qui sème la désunion entre l'homme et son épouse. Or ils ne sont capables de nuire à personne qu'avec la permission d'Allah. Et les gens apprennent ce qui leur nuit et ne leur est pas profitable. Et ils savent, très certainement, que celui qui acquiert [ce pouvoir] n'aura aucune part dans l'au-delà. Certes, quelle détestable marchandise pour laquelle ils ont vendu leurs âmes! Si seulement ils savaient!",
    "tadabburAr": "السِّحْرُ كُفْرٌ وَضَرَرٌ مَحضٌ، وَلَا يَضُرُّ وَلَا يَنْفَعُ أَحَدٌ إِلَّا بِإِذْنِ اللهِ وَقَدَرِهِ.",
    "tadabburFr": "La sorcellerie est une mécréance et un mal absolu ; nul ne peut nuire ou profiter à quiconque sans la permission d'Allah.",
    "amalAr": "حَصِّنْ نَفْسَكَ وَأَهْلَكَ اليَوْمَ بِأَذْكَارِ الصَّبَاحِ وَالمَسَاءِ وَالمُعَوِّذَاتِ.",
    "amalFr": "Protège-toi ainsi que ta famille aujourd'hui avec les invocations du matin, du soir et les sourates protectrices.",
    "tawjihAr": "النَّفْعُ وَالضَّرُّ بِيَدِ اللهِ وَحْدَهُ، وَالسِّحْرُ كُفْرٌ يُوبِقُ صَاحِبَهُ فِي الآخِرَةِ.",
    "tawjihFr": "Le bien et le mal sont exclusivement entre les mains d'Allah, et la sorcellerie est une mécréance ruineuse.",
    "words": [
      {
        "word": "يفرقون",
        "count": 2,
        "refs": [
          "2:102",
          "9:56"
        ]
      },
      {
        "word": "يضرهم",
        "count": 3,
        "refs": [
          "2:102",
          "10:18",
          "25:55"
        ]
      },
      {
        "word": "المرء",
        "count": 4,
        "refs": [
          "2:102",
          "8:24",
          "78:40",
          "80:34"
        ]
      }
    ]
  },
  {
    "n": 103,
    "arabic": "وَلَوْ أَنَّهُمْ ءَامَنُوا۟ وَٱتَّقَوْا۟ لَمَثُوبَةٌۭ مِّنْ عِندِ ٱللَّهِ خَيْرٌۭ ۖ لَّوْ كَانُوا۟ يَعْلَمُونَ",
    "french": "Et s'ils croyaient et vivaient en piété, une récompense de la part d'Allah serait certes meilleure. Si seulement ils savaient!",
    "tadabburAr": "ثَوَابُ اللهِ المَعْدُّ لِلْمُؤْمِنِينَ المُتَّقِينَ خَيْرٌ مِنْ كُلِّ مَتَاعِ الدُّنْيَا الزَّائِلِ.",
    "tadabburFr": "La récompense d'Allah réservée aux pieux croyants est infiniment meilleure que tous les biens effémères d'ici-bas.",
    "amalAr": "اعْمَلْ طَاعَةً خَالِصَةً خُفْيَةً اليَوْمَ ابْتِغَاءَ ثَوَابِ اللهِ وَوَادِهِ.",
    "amalFr": "Accomplis aujourd'hui une bonne action discrète dans le seul but d'obtenir la récompense d'Allah.",
    "tawjihAr": "الإِيمَانُ وَالتَّقْوَى هُمَا سَبِيلُ النَّجَاةِ وَالحُصُولِ عَلَى الأَجْرِ العَظِيمِ.",
    "tawjihFr": "La foi et la pieuse crainte (taqwa) sont la seule voie de salut et d'accès à la récompense suprême.",
    "words": [
      {
        "word": "واتقوا",
        "count": 42,
        "refs": [
          "2:48",
          "2:103",
          "2:123",
          "2:189"
        ]
      },
      {
        "word": "يعلمون",
        "count": 82,
        "refs": [
          "2:13",
          "2:75",
          "2:77",
          "2:78"
        ]
      },
      {
        "word": "انهم",
        "count": 104,
        "refs": [
          "2:12",
          "2:13",
          "2:46",
          "2:103"
        ]
      }
    ]
  },
  {
    "n": 104,
    "arabic": "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ لَا تَقُولُوا۟ رَٰعِنَا وَقُولُوا۟ ٱنظُرْنَا وَٱسْمَعُوا۟ ۗ وَلِلْكَٰفِرِينَ عَذَابٌ أَلِيمٌۭ",
    "french": "O vous qui croyez! Ne dites pas: «Râ'inâ» (favorise-nous) mais dites: «Onzurnâ» (regarde-nous); et écoutez! Un châtiment douloureux sera pour les infidèles.",
    "tadabburAr": "أَمَرَ اللهُ المُؤْمِنِينَ بِاخْتِيَارِ الأَلْفَاظِ الحَسَنَةِ الشَّرِيفَةِ وَتَرْكِ الكَلَامِ المُحْتَمِلِ لِلإِسَاءَةِ.",
    "tadabburFr": "Allah ordonne aux croyants de choisir des termes polis et clairs, en évitant les mots équivoques pouvant prêter à injure.",
    "amalAr": "انْتَقِ أَلْفَاظَكَ بِدِقَّةٍ اليَوْمَ وَتَكَلَّمْ بِأَحْسَنِ القَوْلِ مَعَ الآخَرِينَ.",
    "amalFr": "Sois très attentif au choix de tes mots aujourd'hui et adresse-toi aux gens avec la meilleure élocution.",
    "tawjihAr": "أَدَبُ الخِطَابِ مِنْ كَمَالِ الإِيمَانِ، وَمُخَالَفَةُ سَبِيلِ المُنَافِقِينَ وَالكُفَّارِ وَاجِبَةٌ.",
    "tawjihFr": "La bienséance dans le langage fait partie de la perfection de la foi, et le démarquage des infidèles est requis.",
    "words": [
      {
        "word": "واسمعوا",
        "count": 4,
        "refs": [
          "2:93",
          "2:104",
          "5:108",
          "64:16"
        ]
      },
      {
        "word": "وقولوا",
        "count": 8,
        "refs": [
          "2:58",
          "2:83",
          "2:104",
          "4:5"
        ]
      },
      {
        "word": "تقولوا",
        "count": 15,
        "refs": [
          "2:104",
          "2:154",
          "2:169",
          "2:235"
        ]
      }
    ]
  },
  {
    "n": 105,
    "arabic": "مَّا يَوَدُّ ٱلَّذِينَ كَفَرُوا۟ مِنْ أَهْلِ ٱلْكِتَٰبِ وَلَا ٱلْمُشْرِكِينَ أَن يُنَزَّلَ عَلَيْكُم مِّنْ خَيْرٍۢ مِّن رَّبِّكُمْ ۗ وَٱللَّهُ يَخْتَصُّ بِرَحْمَتِهِۦ مَن يَشَآءُ ۚ وَٱللَّهُ ذُو ٱلْفَضْلِ ٱلْعَظِيمِ",
    "french": "Ni les mécréants parmi les gens du Livre, ni les Associateurs n'aiment qu'on fasse descendre sur vous un bienfait de la part de votre Seigneur, alors qu'Allah réserve à qui Il veut sa Miséricorde. Et c'est Allah le Détenteur de l'abondante grâce.",
    "tadabburAr": "أَعْدَاءُ الدِّينِ يَحْسُدُونَ المُؤْمِنِينَ عَلَى مَا آتَاهُمُ اللهُ مِنْ فَضْلِهِ وَرَحْمَتِهِ.",
    "tadabburFr": "Les ennemis de la foi envient les croyants pour les bienfaits et la miséricorde qu'Allah leur a accordés.",
    "amalAr": "اشْكُرِ اللهَ اليَوْمَ عَلَى نِعْمَةِ الإِسْلَامِ وَالقُرْآنِ الَّتِي اختَصَّكَ بِهَا.",
    "amalFr": "Remercie Allah aujourd'hui pour la grâce de l'Islam et du Coran dont Il t'a favorisé.",
    "tawjihAr": "الفَضْلُ كُلُّهُ بِيَدِ اللهِ يُؤْتِيهِ مَنْ يَشَاءُ، وَلا يَضُرُّ حَسَدُ الحَاسِدِينَ مَنْ طَبَقَ أَمْرَ اللهِ.",
    "tawjihFr": "La grâce appartient entièrement à Allah qui l'accorde à qui Il veut, et l'envie des envieux ne peut nuire au serviteur obéissant.",
    "words": [
      {
        "word": "يختص",
        "count": 2,
        "refs": [
          "2:105",
          "3:74"
        ]
      },
      {
        "word": "برحمته",
        "count": 2,
        "refs": [
          "2:105",
          "3:74"
        ]
      },
      {
        "word": "الفضل",
        "count": 14,
        "refs": [
          "2:105",
          "2:237",
          "3:73",
          "3:74"
        ]
      }
    ]
  },
  {
    "n": 106,
    "arabic": "۞ مَا نَنسَخْ مِنْ ءَايَةٍ أَوْ نُنسِهَا نَأْتِ بِخَيْرٍۢ مِّنْهَآ أَوْ مِثْلِهَآ ۗ أَلَمْ تَعْلَمْ أَنَّ ٱللَّهَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ",
    "french": "Si Nous abrogeons un verset quelconque ou que Nous le fassions oublier, Nous en apportons un meilleur, ou un semblable. Ne sais-tu pas qu'Allah est Omnipotent?",
    "tadabburAr": "حِكْمَةُ اللهِ فِي نَسْخِ الأَحْكَامِ تُحَقِّقُ المَصْلَحَةَ لِلْعِبَادِ، فَهُوَ سُبْحَانَهُ القَادِرُ عَلَى كُلِّ شَيْءٍ.",
    "tadabburFr": "La sagesse d'Allah dans l'abrogation des versets vise toujours le bien supérieur des serviteurs, car Il est Omnipotent.",
    "amalAr": "ثِقْ بِحِكْمَةِ اللهِ فِي أَمْرِهِ وَنَهْيِهِ وَارْضَ بِمَا شَرَعَهُ لَكَ.",
    "amalFr": "Aie une confiance totale en la sagesse des prescriptions d'Allah et accepte Ses décrets.",
    "tawjihAr": "التَّشْرِيعُ الإِلَهِيُّ يَدُورُ مَعَ مَصَالِحِ العِبَادِ فِي الدُّنْيَا وَالآخِرَةِ.",
    "tawjihFr": "La législation divine évolue selon l'intérêt suprême des serviteurs dans ce monde et dans l'au-delà.",
    "words": [
      {
        "word": "مثلها",
        "count": 5,
        "refs": [
          "2:106",
          "6:160",
          "40:40",
          "42:40"
        ]
      },
      {
        "word": "بخير",
        "count": 6,
        "refs": [
          "2:106",
          "3:15",
          "6:17",
          "10:107"
        ]
      },
      {
        "word": "تعلم",
        "count": 9,
        "refs": [
          "2:106",
          "2:107",
          "4:113",
          "5:40"
        ]
      }
    ]
  },
  {
    "n": 107,
    "arabic": "أَلَمْ تَعْلَمْ أَنَّ ٱللَّهَ لَهُۥ مُلْكُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ ۗ وَمَا لَكُم مِّن دُونِ ٱللَّهِ مِن وَلِىٍّۢ وَلَا نَصِيرٍ",
    "french": "Ne sais-tu pas qu'à Allah, appartient le royaume des cieux et de la terre, et qu'en dehors d'Allah vous n'avez ni protecteur ni secoureur?",
    "tadabburAr": "المُلْكُ المـُطْلَقُ لِلَّهِ وَحْدَهُ، وَلا وَلِيَّ وَلا نَصِيرَ لِلْعَبْدِ سِوَاهُ.",
    "tadabburFr": "La royauté absolue appartient à Allah seul ; l'être humain n'a d'autre protecteur ni secours en dehors de Lui.",
    "amalAr": "تَوَكَّلْ عَلَى اللهِ وَحْدَهُ وَاطْلُبْ مِنْهُ النَّصْرَ وَالتَّوْفِيقَ فِي يَوْمِكَ.",
    "amalFr": "Place ta confiance en Allah seul et demande-Lui Son secours pour toutes tes affaires aujourd'hui.",
    "tawjihAr": "التَّعَلُّقُ بِغَيْرِ اللهِ عَجْزٌ، فَهُوَ المَالِكُ الحَقِيقِيُّ لِكُلِّ شَيْءٍ.",
    "tawjihFr": "S'attacher à autre qu'Allah est une faiblesse, car Il est le seul Souverain de toutes choses.",
    "words": [
      {
        "word": "تعلم",
        "count": 9,
        "refs": [
          "2:106",
          "2:107",
          "4:113",
          "5:40"
        ]
      },
      {
        "word": "نصير",
        "count": 9,
        "refs": [
          "2:107",
          "2:120",
          "9:74",
          "9:116"
        ]
      },
      {
        "word": "والارض",
        "count": 157,
        "refs": [
          "2:33",
          "2:107",
          "2:116",
          "2:117"
        ]
      }
    ]
  },
  {
    "n": 108,
    "arabic": "أَمْ تُرِيدُونَ أَن تَسْـَٔلُوا۟ رَسُولَكُمْ كَمَا سُئِلَ مُوسَىٰ مِن قَبْلُ ۗ وَمَن يَتَبَدَّلِ ٱلْكُفْرَ بِٱلْإِيمَٰنِ فَقَدْ ضَلَّ سَوَآءَ ٱلسَّبِيلِ",
    "french": "Voudriez-vous interroger votre Messager comme auparavant on interrogea Moïse? Quiconque substitue la mécréance à la foi s'égare certes du droit chemin.",
    "tadabburAr": "كَثْرَةُ الأَسْئِلَةِ القَائِمَةِ عَلَى التَّعَنُّتِ قَدْ تُؤَدِّي إِلَى الضَّلاَلِ وَفَقْدَانِ الإِيمَانِ.",
    "tadabburFr": "Les questions obstinées et inutiles posées aux prophètes affaiblissent la foi et mènent à l'égarement.",
    "amalAr": "احْرِصْ عَلَى سُؤَالِ العِلْمِ الَّذِي يَنْفَعُكَ وَابْتَعِدْ عَنِ الجَدَلِ وَالتَّعَنُّتِ.",
    "amalFr": "Pose des questions utiles pour apprendre ta religion et évite les polémiques stériles.",
    "tawjihAr": "الاسْتِسْلاَمُ لِأَمْرِ اللهِ وَرَسُولِهِ يَحْفَظُ العَبْدَ مِنَ الإِنْحِرَافِ.",
    "tawjihFr": "La soumission aux ordres d'Allah et de Son messager préserve l'homme de la déviation.",
    "words": [
      {
        "word": "رسولكم",
        "count": 2,
        "refs": [
          "2:108",
          "26:27"
        ]
      },
      {
        "word": "تريدون",
        "count": 5,
        "refs": [
          "2:108",
          "8:67",
          "14:10",
          "30:39"
        ]
      },
      {
        "word": "الكفر",
        "count": 11,
        "refs": [
          "2:108",
          "3:52",
          "3:176",
          "3:177"
        ]
      }
    ]
  },
  {
    "n": 109,
    "arabic": "وَدَّ كَثِيرٌۭ مِّنْ أَهْلِ ٱلْكِتَٰبِ لَوْ يَرُدُّونَكُم مِّنۢ بَعْدِ إِيمَٰنِكُمْ كُفَّارًا حَسَدًۭا مِّنْ عِندِ أَنفُسِهِم مِّنۢ بَعْدِ مَا تَبَيَّنَ لَهُمُ ٱلْحَقُّ ۖ فَٱعْفُوا۟ وَٱصْفَحُوا۟ حَتَّىٰ يَأْتِىَ ٱللَّهُ بِأَمْرِهِۦٓ ۗ إِنَّ ٱللَّهَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌۭ",
    "french": "Nombre de gens du Livre aimeraient par jalousie de leur part, pouvoir vous rendre mécréants après que vous ayez cru. Et après que la vérité s'est manifestée à eux! Pardonnez et oubliez jusqu'à ce qu'Allah fasse venir Son commandement. Allah est très certainement Omnipotent!",
    "tadabburAr": "الحَسَدُ يَدْفَعُ بَعْضَ النَّاسِ لِمَحْوِ النِّعْمَةِ عَنِ الآخَرِينَ، وَالعَفْوُ خُلُقٌ كَرِيمٌ عِنْدَ القُدْرَةِ.",
    "tadabburFr": "L'envie peut pousser certains à vouloir nuire aux croyants ; le pardon et l'indulgence restent une noble attitude.",
    "amalAr": "اعْفُ عَمَّنْ أَسَاءَ إِلَيْكَ اليَوْمَ وَاضْفَحْ لِوَجْهِ اللهِ تَعَالَى.",
    "amalFr": "Pardonne aujourd'hui à celui qui t'a causé du tort, en recherchant uniquement l'agrément d'Allah.",
    "tawjihAr": "مَقَابَلَةُ الإِسَاءَةِ بِالعَفْوِ وَالصَّفْحِ تُطَهِّرُ القَلْبَ وَتَرْفَعُ الدَّرَجَاتِ.",
    "tawjihFr": "Répondre au mal par le pardon purifie le cœur et élève en degrés auprès d'Allah.",
    "words": [
      {
        "word": "كفارا",
        "count": 2,
        "refs": [
          "2:109",
          "71:27"
        ]
      },
      {
        "word": "كثير",
        "count": 10,
        "refs": [
          "2:109",
          "3:146",
          "4:114",
          "5:15"
        ]
      },
      {
        "word": "تبين",
        "count": 10,
        "refs": [
          "2:109",
          "2:256",
          "2:259",
          "4:115"
        ]
      }
    ]
  },
  {
    "n": 110,
    "arabic": "وَأَقِيمُوا۟ ٱلصَّلَوٰةَ وَءَاتُوا۟ ٱلزَّكَوٰةَ ۚ وَمَا تُقَدِّمُوا۟ لِأَنفُسِكُم مِّنْ خَيْرٍۢ تَجِدُوهُ عِندَ ٱللَّهِ ۗ إِنَّ ٱللَّهَ بِمَا تَعْمَلُونَ بَصِيرٌۭ",
    "french": "Et accomplissez la Salât et acquittez la Zakât. Et tout ce que vous avancez de bien pour vous-mêmes, vous le retrouverez auprès d'Allah, car Allah voit parfaitement ce que vous faites.",
    "tadabburAr": "الصَّلاَةُ وَالزَّكَاةُ زَادُ المـُؤْمِنِ، وَكُلُّ خَيْرٍ تُقَدِّمُهُ سَتَجِدُ أَجْرَهُ مُضَاعَفًا عِنْدَ اللهِ.",
    "tadabburFr": "La prière et l'aumône sont le viatique du croyant, et tout bien accompli sera retrouvé multiplié auprès d'Allah.",
    "amalAr": "أَقِمْ صَلاَتَكَ فِي وَقْتِهَا وَتَصَدَّقْ بِشَيْءٍ وَلَوْ قَلِيلٍ اليَوْمَ.",
    "amalFr": "Accomplis ta prière à l'heure et donne une aumône, même minime, aujourd'hui.",
    "tawjihAr": "العَمَلُ الصَّالِحُ هُوَ الإِدَّخَارُ الحَقِيقِيُّ لِلْيَوْمِ الآخِرِ.",
    "tawjihFr": "Les bonnes œuvres constituent la véritable épargne pour le Jour du Jugement.",
    "words": [
      {
        "word": "تجدوه",
        "count": 2,
        "refs": [
          "2:110",
          "73:20"
        ]
      },
      {
        "word": "تقدموا",
        "count": 4,
        "refs": [
          "2:110",
          "49:1",
          "58:13",
          "73:20"
        ]
      },
      {
        "word": "لانفسكم",
        "count": 6,
        "refs": [
          "2:110",
          "2:223",
          "9:35",
          "17:7"
        ]
      }
    ]
  },
  {
    "n": 111,
    "arabic": "وَقَالُوا۟ لَن يَدْخُلَ ٱلْجَنَّةَ إِلَّا مَن كَانَ هُودًا أَوْ نَصَٰرَىٰ ۗ تِلْكَ أَمَانِيُّهُمْ ۗ قُلْ هَاتُوا۟ بُرْهَٰنَكُمْ إِن كُنتُمْ صَٰدِقِينَ",
    "french": "Et ils ont dit: «Nul n'entrera au Paradis que Juifs ou Chrétiens». Voilà leurs chimères. - Dis: «Donnez votre preuve, si vous êtes véridiques».",
    "tadabburAr": "دَعَاوَى الفَوْزِ بِالجَنَّةِ بِلاَ دَلِيلٍ مُجَرَّدُ أَمَانِيَّ بَاطِلَةٍ لاَ تُغْنِي عَنِ الحَقِّ شَيْئًا.",
    "tadabburFr": "Prétendre au Paradis sans preuve ni foi véritable n'est que pure illusion ne reposant sur rien.",
    "amalAr": "لاَ تَكْتَفِ بِالأَمَانِيِّ، بَلْ حَقِّقْ إِيمَانَكَ بِالعَمَلِ الصَّالِحِ وَالدَّلِيلِ.",
    "amalFr": "Ne te contente pas de souhaits illusoires, concrétise ta foi par des actes pieux et fondés.",
    "tawjihAr": "الحَقُّ يُقَامُ بِالبُرْهَانِ وَالدَّلِيلِ، لاَ بِالدَّعَاوَى وَالأَمَانِيِّ.",
    "tawjihFr": "La vérité s'établit par des preuves évidentes et non par de simples prétentions.",
    "words": [
      {
        "word": "هاتوا",
        "count": 4,
        "refs": [
          "2:111",
          "21:24",
          "27:64",
          "28:75"
        ]
      },
      {
        "word": "هودا",
        "count": 6,
        "refs": [
          "2:111",
          "2:135",
          "2:140",
          "7:65"
        ]
      },
      {
        "word": "يدخل",
        "count": 8,
        "refs": [
          "2:111",
          "22:14",
          "22:23",
          "42:8"
        ]
      }
    ]
  },
  {
    "n": 112,
    "arabic": "بَلَىٰ مَنْ أَسْلَمَ وَجْهَهُۥ لِلَّهِ وَهُوَ مُحْسِنٌۭ فَلَهُۥٓ أَجْرُهُۥ عِندَ رَبِّهِۦ وَلَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ",
    "french": "Non, mais quiconque soumet à Allah son être tout en faisant le bien, aura sa rétribution auprès de son Seigneur. Pour eux, nulle crainte, et ils ne seront point attristés.",
    "tadabburAr": "شَرْطَا القَبُولِ عِنْدَ اللهِ: الإِخْلاَصُ لِلَّهِ وَالإِحْسَانُ بِاتِّبَاعِ السَّنَّةِ، وَبِهِمَا يَحْصُلُ الأَمْنُ.",
    "tadabburFr": "L'acceptation des œuvres repose sur deux conditions : la sincérité envers Allah et le suivi de la Sunnah, garantissant la paix de l'âme.",
    "amalAr": "إِخْلِصْ نِيَّتَكَ لِلَّهِ فِي عَمَلِكَ اليَوْمَ وَاحْرِصْ عَلَى مُتَابَعَةِ السَّنَّةِ.",
    "amalFr": "Purifie ton intention pour Allah dans tes actions d'aujourd'hui et veille à suivre la Sunnah.",
    "tawjihAr": "الإِخْلاَصُ وَالمـُتَابَعَةُ هُمَا أَسَاسُ النَّجَاةِ وَالأَمْنِ يَوْمَ القِيَامَةِ.",
    "tawjihFr": "La sincérité envers Allah et la conformité au Prophète sont les deux piliers du salut.",
    "words": [
      {
        "word": "اجره",
        "count": 3,
        "refs": [
          "2:112",
          "4:100",
          "29:27"
        ]
      },
      {
        "word": "محسن",
        "count": 4,
        "refs": [
          "2:112",
          "4:125",
          "31:22",
          "37:113"
        ]
      },
      {
        "word": "اسلم",
        "count": 7,
        "refs": [
          "2:112",
          "2:131",
          "3:83",
          "4:125"
        ]
      }
    ]
  },
  {
    "n": 113,
    "arabic": "وَقَالَتِ ٱلْيَهُودُ لَيْسَتِ ٱلنَّصَٰرَىٰ عَلَىٰ شَىْءٍۢ وَقَالَتِ ٱلنَّصَٰرَىٰ لَيْسَتِ ٱلْيَهُودُ عَلَىٰ شَىْءٍۢ وَهُمْ يَتْلُونَ ٱلْكِتَٰبَ ۗ كَذَٰلِكَ قَالَ ٱلَّذِينَ لَا يَعْلَمُونَ مِثْلَ قَوْلِهِمْ ۚ فَٱللَّهُ يَحْكُمُ بَيْنَهُمْ يَوْمَ ٱلْقِيَٰمَةِ فِيمَا كَانُوا۟ فِيهِ يَخْتَلِفُونَ",
    "french": "Et les Juifs disent: «Les Chrétiens ne tiennent sur rien» et les Chrétiens disent: «Les Juifs ne tiennent sur rien», alors qu'ils lisent le Livre! De même ceux qui ne savent rien tiennent un langage semblable au leur. Eh bien, Allah jugera sur ce quoi ils s'opposent, au Jour de la Résurrection.",
    "tadabburAr": "يُظْهِرُ النَّصُّ خَطَرَ التَّعَصُّبِ وَالْجَهْلِ؛ إِذْ يَتَجَاهَلُ أَهْلُ الْأَهْوَاءِ الْحَقَّ الْمَوْجُودَ عِنْدَ غَيْرِهِمْ رَغْمَ قِرَاءَتِهِمْ لِلْكُتُبِ.",
    "tadabburFr": "Ce verset montre le danger du fanatisme et de l'ignorance, lorsque les gens passionnés renient la vérité détenue par autrui malgré leur lecture des Écritures.",
    "amalAr": "اتْرُكِ التَّعَصُّبَ وَاحْرِصْ عَلَى قَبُولِ الْحَقِّ مِمَّنْ جَاءَ بِهِ كَائِنًا مَنْ كَانَ.",
    "amalFr": "Délaisse le fanatisme et veille à accepter la vérité de quiconque la apporte.",
    "tawjihAr": "الْفَصْلُ فِي الْخِلَافَاتِ الدِّينِيَّةِ وَالْحُكْمُ الْعَادِلُ يَكُونُ لِلَّهِ وَحْدَهُ يَوْمَ الْقِيَامَةِ.",
    "tawjihFr": "Le jugement ultime sur les divergences religieuses appartient exclusivement à Allah au Jour de la Résurrection.",
    "words": [
      {
        "word": "ليست",
        "count": 2,
        "refs": [
          "2:113",
          "2:113"
        ]
      },
      {
        "word": "يتلون",
        "count": 5,
        "refs": [
          "2:113",
          "3:113",
          "22:72",
          "35:29"
        ]
      },
      {
        "word": "فالله",
        "count": 6,
        "refs": [
          "2:113",
          "4:135",
          "4:141",
          "9:13"
        ]
      }
    ]
  },
  {
    "n": 114,
    "arabic": "وَمَنْ أَظْلَمُ مِمَّن مَّنَعَ مَسَٰجِدَ ٱللَّهِ أَن يُذْكَرَ فِيهَا ٱسْمُهُۥ وَسَعَىٰ فِى خَرَابِهَآ ۚ أُو۟لَٰٓئِكَ مَا كَانَ لَهُمْ أَن يَدْخُلُوهَآ إِلَّا خَآئِفِينَ ۚ لَهُمْ فِى ٱلدُّنْيَا خِزْىٌۭ وَلَهُمْ فِى ٱلْءَاخِرَةِ عَذَابٌ عَظِيمٌۭ",
    "french": "Qui est plus injuste que celui qui empêche que dans les mosquées d'Allah, on mentionne Son Nom, et qui s'efforce à les détruire? De tels gens ne devraient y entrer qu'apeurés. Pour eux, ignominie ici-bas; et dans l'au-delà un énorme châtiment.",
    "tadabburAr": "عِظَمُ جُرْمِ مَنْ صَدَّ عَنْ مَسَاجِدِ اللَّهِ أَوْ سَعَى فِي خَرَابِهَا، وَوَعِيدُهُ بِالْخِزْيِ فِي الدُّنْيَا وَالْعَذَابِ فِي الْآخِرَةِ.",
    "tadabburFr": "C'est un crime immense que d'interdire l'accès aux mosquées d'Allah ou de chercher à les détruire, d'où la promesse d'humiliation ici-bas et de châtiment dans l'au-delà.",
    "amalAr": "سَاهِمْ الْيَوْمَ فِي عِمَارَةِ الْمَسْجِدِ أَوْ نَظَافَتِهِ أَوْ إِعَانَةِ الْمُصَلِّينَ فِيهِ.",
    "amalFr": "Contribue aujourd'hui à l'entretien d'une mosquée, à sa propreté ou à l'aide aux fidèles.",
    "tawjihAr": "لِلْمَسَاجِدِ حُرْمَةٌ عَظِيمَةٌ، وَتَعْظِيمُهَا يَكُونُ بِإِقَامَةِ الذِّكْرِ وَالصَّلَاةِ فِيهَا وَحِمَايَتِهَا.",
    "tawjihFr": "Les mosquées ont une sacralité immense qui s'honore par l'accomplissement de la prière, le rappel d'Allah et leur protection.",
    "words": [
      {
        "word": "مسجد",
        "count": 2,
        "refs": [
          "7:29",
          "7:31"
        ]
      },
      {
        "word": "وسعي",
        "count": 2,
        "refs": [
          "2:114",
          "17:19"
        ]
      },
      {
        "word": "يدخلوها",
        "count": 2,
        "refs": [
          "2:114",
          "7:46"
        ]
      }
    ]
  },
  {
    "n": 115,
    "arabic": "وَلِلَّهِ ٱلْمَشْرِقُ وَٱلْمَغْرِبُ ۚ فَأَيْنَمَا تُوَلُّوا۟ فَثَمَّ وَجْهُ ٱللَّهِ ۚ إِنَّ ٱللَّهَ وَٰسِعٌ عَلِيمٌۭ",
    "french": "A Allah seul appartiennent l'Est et l'Ouest. Où que vous vous tourniez, la Face (direction) d'Allah est donc là, car Allah a la grâce immense; Il est Omniscient.",
    "tadabburAr": "سَعَةُ مُلْكِ اللَّهِ وَرَحْمَتِهِ، فَحَيْثُمَا تَوَّجَهَ الْعَبْدُ بِأَمْرِ اللَّهِ فَاللَّهُ مَطَّلِعٌ عَلَيْهِ وَمُتَقَبِّلٌ مِنْهُ.",
    "tadabburFr": "La royauté et la miséricorde d'Allah sont infinies; où que le serviteur se tourne selon Son ordre, Allah l'observe et agrée son acte.",
    "amalAr": "أَدِّ صَلَاتَكَ بِخُشُوعٍ مَهْمَا كُنْتَ، مُسْتَحْضِرًا أَنَّ اللَّهَ مَعَكَ بِعِلْمِهِ وَإِحَاطَتِهِ.",
    "amalFr": "Accomplis ta prière avec humilité où que tu sois, en gardant à l'esprit qu'Allah est avec toi par Son savoir.",
    "tawjihAr": "الشَّرِيعَةُ مَبْنِيَّةٌ عَلَى التَّيْسِيرِ وَالسَّعَةِ لَا عَلَى الْحَرَجِ وَالْمَشَقَّةِ.",
    "tawjihFr": "La législation islamique repose sur la facilité et la largeur, non me sur la gêne ou la contrainte.",
    "words": [
      {
        "word": "والمغرب",
        "count": 5,
        "refs": [
          "2:115",
          "2:142",
          "2:177",
          "26:28"
        ]
      },
      {
        "word": "المشرق",
        "count": 6,
        "refs": [
          "2:115",
          "2:142",
          "2:177",
          "2:258"
        ]
      },
      {
        "word": "تولوا",
        "count": 23,
        "refs": [
          "2:115",
          "2:137",
          "2:177",
          "2:246"
        ]
      }
    ]
  },
  {
    "n": 116,
    "arabic": "وَقَالُوا۟ ٱتَّخَذَ ٱللَّهُ وَلَدًۭا ۗ سُبْحَٰنَهُۥ ۖ بَل لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ ۖ كُلٌّۭ لَّهُۥ قَٰنِتُونَ",
    "french": "Et ils ont dit: «Allah s'est donné un fils»! Gloire à Lui! Non! mais c'est à Lui qu'appartient ce qui est dans les cieux et la terre et c'est à Lui que tous obéissent.",
    "tadabburAr": "تَنْزِيهُ اللَّهِ عَنِ النَّقْصِ وَالشَّرِيكِ، فَكُلُّ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ مِلْكٌ لَهُ وَخَاضِعٌ لِعَظَمَتِهِ.",
    "tadabburFr": "Allah est exempt de tout défaut et d'associé; tout ce qui est dans les cieux et sur la terre Lui appartient et s'soumet à Sa grandeur.",
    "amalAr": "كَرِّرْ سُبْحَانَ اللَّهِ وَبِحَمْدِهِ مِئَةَ مَرَّةٍ الْيَوْمَ مُسْتَحْضِرًا تَنْزِيهَ اللَّهِ عَنْ كُلِّ نَقْصٍ.",
    "amalFr": "Répète «SubhanAllahi wa bihamdihi» cent fois aujourd'hui en méditant sur la pureté absolue d'Allah.",
    "tawjihAr": "الْوَاجِبُ عَقِيدِيًّا إِثْبَاتُ الْكَمَالِ الْمُطْلَقِ لِلَّهِ وَنَفْيُ النَّدِّ وَالْوَلَدِ عَنْهُ.",
    "tawjihFr": "Le devoir dogmatique est d'affirmer la perfection absolue d'Allah et de Nier tout égal ou enfant qu'on Lui attribuerait.",
    "words": [
      {
        "word": "ولدا",
        "count": 13,
        "refs": [
          "2:116",
          "10:68",
          "12:21",
          "17:111"
        ]
      },
      {
        "word": "اتخذ",
        "count": 17,
        "refs": [
          "2:116",
          "6:14",
          "10:68",
          "18:4"
        ]
      },
      {
        "word": "وقالوا",
        "count": 61,
        "refs": [
          "2:80",
          "2:88",
          "2:111",
          "2:116"
        ]
      }
    ]
  },
  {
    "n": 117,
    "arabic": "بَدِيعُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ ۖ وَإِذَا قَضَىٰٓ أَمْرًۭا فَإِنَّمَا يَقُولُ لَهُۥ كُن فَيَكُونُ",
    "french": "Il est le Créateur des cieux et de la terre à partir du néant. Lorsqu'Il décide une chose, Il dit seulement: «Sois», et elle est aussitôt.",
    "tadabburAr": "كَمَالُ قُدْرَةِ اللَّهِ فِي خَلْقِ الْكَوْنِ بِلَا مِثَالٍ سَابِقٍ، وَنَفَاذُ أَمْرِهِ بِمُجَرَّدِ قَوْلِهِ «كُنْ».",
    "tadabburFr": "La toute-puissance d'Allah se manifeste dans la création de l'univers sans modèle préalable, et l'exécution de Son ordre dépend du seul mot «Sois».",
    "amalAr": "ادْعُ اللَّهَ بِحَاجَاتِكَ الصَّعْبَةِ مُوقِنًا بِأَنَّ أَمْرَهُ بَيْنَ الْكَافِ وَالنُّونِ.",
    "amalFr": "Invoque Allah pour tes besoins difficiles, convaincu que Son ordre s'accomplit par un simple mot.",
    "tawjihAr": "عَظَمَةُ الْخَالِقِ تَسْتَوْجِبُ كَمَالَ التَّوَكُّلِ عَلَيْهِ وَالْإِيمَانِ بِقُدْرَتِهِ الْمُطْلَقَةِ.",
    "tawjihFr": "La grandeur du Créateur exige une confiance totale en Lui et une foi inébranlable en Sa puissance absolue.",
    "words": [
      {
        "word": "بديع",
        "count": 2,
        "refs": [
          "2:117",
          "6:101"
        ]
      },
      {
        "word": "فيكون",
        "count": 10,
        "refs": [
          "2:117",
          "3:47",
          "3:49",
          "3:59"
        ]
      },
      {
        "word": "امرا",
        "count": 19,
        "refs": [
          "2:117",
          "3:47",
          "8:42",
          "8:44"
        ]
      }
    ]
  },
  {
    "n": 118,
    "arabic": "وَقَالَ ٱلَّذِينَ لَا يَعْلَمُونَ لَوْلَا يُكَلِّمُنَا ٱللَّهُ أَوْ تَأْتِينَآ ءَايَةٌۭ ۗ كَذَٰلِكَ قَالَ ٱلَّذِينَ مِن قَبْلِهِم مِّثْلَ قَوْلِهِمْ ۘ تَشَٰبَهَتْ قُلُوبُهُمْ ۗ قَدْ بَيَّنَّا ٱلْءَايَٰتِ لِقَوْمٍۢ يُوقِنُونَ",
    "french": "Et ceux qui ne savent pas ont dit: «Pourquoi Allah ne nous parle-t-Il pas [directement], ou pourquoi un signe ne nous vient-il pas?» De même, ceux d'avant eux disaient une parole semblable. Leurs cœurs se ressemblent. Nous avons clairement exposé les signes pour des gens qui ont la foi ferme.",
    "tadabburAr": "تَشَابُهُ قُلُوبِ أَهْلِ الْجَهْلِ وَالْعِنَادِ عَبْرَ العُصُورِ فِي طَلَبِ التَّعَنُّتِ، مَعَ وُضُوحِ الآيَاتِ لِلْمُوقِنِينَ.",
    "tadabburFr": "Les cœurs des ignorants et des obstinés se ressemblent à travers les âges dans leur quête d'obstination, alors que les preuves sont claires pour les gens de certitude.",
    "amalAr": "اسْأَلِ اللَّهَ الْيَوْمَ أَنْ يَرْزُقَكَ الْيَقِينَ وَالثَّبَاتَ عَلَى الْحَقِّ.",
    "amalFr": "Demande aujourd'hui à Allah de t'accorder la certitude et la fermeté sur la vérité.",
    "tawjihAr": "الآيَاتُ وَالْبَرَاهِينُ نَافِعَةٌ لِمَنْ طَلَبَ الْحَقَّ بِإِخْلَاصٍ، لَا لِمَنْ طَلَبَهُ بِعِنَادٍ.",
    "tawjihFr": "Les signes et les preuves profitent à celui qui cherche la vérité avec sincérité, non à celui qui la recherche par entêtement.",
    "words": [
      {
        "word": "بينا",
        "count": 3,
        "refs": [
          "2:118",
          "3:118",
          "57:17"
        ]
      },
      {
        "word": "تاتينا",
        "count": 4,
        "refs": [
          "2:118",
          "7:129",
          "15:7",
          "34:3"
        ]
      },
      {
        "word": "قولهم",
        "count": 8,
        "refs": [
          "2:113",
          "2:118",
          "3:147",
          "5:63"
        ]
      }
    ]
  },
  {
    "n": 119,
    "arabic": "إِنَّآ أَرْسَلْنَٰكَ بِٱلْحَقِّ بَشِيرًۭا وَنَذِيرًۭا ۖ وَلَا تُسْـَٔلُ عَنْ أَصْحَٰبِ ٱلْجَحِيمِ",
    "french": "Certes, Nous t'avons envoyé avec la vérité, en annonciateur et avertisseur; et on ne te demande pas compte des gens de l'Enfer.",
    "tadabburAr": "بَعْثَةُ النَّبِيِّ ﷺ قَامَتْ عَلَى الْحَقِّ وَالْبَشَارَةِ وَالنَّذَارَةِ، وَالْمَكَلَّفُ مَسْئُولٌ عَنْ نَفْسِهِ فَقَطْ.",
    "tadabburFr": "La mission du Prophète ﷺ repose sur la vérité, l'annonce des bonnes nouvelles et l'avertissement; chaque individu est seul responsable de son choix.",
    "amalAr": "بَلِّغْ آيَةً أَوْ خُلُقًا حَسَنًا لِمَنْ حَوْلَكَ الْيَوْمَ بِنِيَّةِ الْبَشَارَةِ وَالتَّذْكِيرِ.",
    "amalFr": "Transmets un verset ou un bon comportement à ton entourage aujourd'hui avec l'intention de réjouir et de rappeler.",
    "tawjihAr": "مَسْؤُولِيَّةُ الدَّاعِي هِيَ الْبَلَاغُ الْمُبِينُ، وَلَيْسَ مَكَلَّفًا بِإِجْبَارِ النَّاسِ عَلَى الْهِدَايَةِ.",
    "tawjihFr": "La responsabilité de celui qui appelle à Allah est la transmission claire, sans être chargé de forcer les gens à la guidée.",
    "words": [
      {
        "word": "بشيرا",
        "count": 4,
        "refs": [
          "2:119",
          "34:28",
          "35:24",
          "41:4"
        ]
      },
      {
        "word": "ونذيرا",
        "count": 8,
        "refs": [
          "2:119",
          "17:105",
          "25:56",
          "33:45"
        ]
      },
      {
        "word": "الجحيم",
        "count": 23,
        "refs": [
          "2:119",
          "5:10",
          "5:86",
          "9:113"
        ]
      }
    ]
  },
  {
    "n": 120,
    "arabic": "وَلَن تَرْضَىٰ عَنكَ ٱلْيَهُودُ وَلَا ٱلنَّصَٰرَىٰ حَتَّىٰ تَتَّبِعَ مِلَّتَهُمْ ۗ قُلْ إِنَّ هُدَى ٱللَّهِ هُوَ ٱلْهُدَىٰ ۗ وَلَئِنِ ٱتَّبَعْتَ أَهْوَآءَهُم بَعْدَ ٱلَّذِى جَآءَكَ مِنَ ٱلْعِلْمِ ۙ مَا لَكَ مِنَ ٱللَّهِ مِن وَلِىٍّۢ وَلَا نَصِيرٍ",
    "french": "Ni les Juifs, ni les Chrétiens ne seront jamais satisfaits de toi, jusqu'à ce que tu suives leur religion. - Dis: «Certes, c'est la direction d'Allah qui est la vraie direction». Mais si tu suis leurs passions après ce que tu as reçu de science, tu n'auras contre Allah ni protecteur ni secoureur.",
    "tadabburAr": "الْهُدَى الْحَقِيقِيُّ هُوَ هُدَى اللَّهِ، وَمُحَاوَلَةُ إِرْضَاءِ أَهْلِ الْأَهْوَاءِ عَلَى حِسَابِ الدِّينِ تُفْقِدُ الْعَبْدَ وَلَايَةَ اللَّهِ.",
    "tadabburFr": "La vraie guidée est celle d'Allah ; chercher à plaire aux partisans des passions au détriment de sa foi prive l'homme de la protection divine.",
    "amalAr": "اثْبُتْ عَلَى الْحَقِّ وَلَا تُقَدِّمْ أَهْوَاءَ النَّاسِ عَلَى أَمْرِ اللَّهِ.",
    "amalFr": "Demeurez ferme sur la vérité et ne faites pas passer les désirs des gens avant les ordres d'Allah.",
    "tawjihAr": "الرِّضَا المَطْلُوبُ هُوَ رِضَا اللَّهِ، وَاتِّبَاعُ أَهْوَاءِ الْخَلْقِ يُؤَدِّي إِلَى الْخِذْلَانِ.",
    "tawjihFr": "La seule satisfaction à rechercher est celle d'Allah, car suivre les passions mène à la perdition.",
    "words": [
      {
        "word": "ترضي",
        "count": 2,
        "refs": [
          "2:120",
          "20:130"
        ]
      },
      {
        "word": "ملتهم",
        "count": 2,
        "refs": [
          "2:120",
          "18:20"
        ]
      },
      {
        "word": "اتبعت",
        "count": 3,
        "refs": [
          "2:120",
          "2:145",
          "13:37"
        ]
      }
    ]
  },
  {
    "n": 121,
    "arabic": "ٱلَّذِينَ ءَاتَيْنَٰهُمُ ٱلْكِتَٰبَ يَتْلُونَهُۥ حَقَّ تِلَاوَتِهِۦٓ أُو۟لَٰٓئِكَ يُؤْمِنُونَ بِهِۦ ۗ وَمَن يَكْفُرْ بِهِۦ فَأُو۟لَٰٓئِكَ هُمُ ٱلْخَٰسِرُونَ",
    "french": "Ceux à qui Nous avons donné le Livre, qui le récitent comme il se doit, ceux-là y croient. Et ceux qui n'y croient pas sont les perdants.",
    "tadabburAr": "حَقُّ التِّلَاوَةِ يَكُونُ بِالْقِرَاءَةِ الصَّحِيحَةِ، وَالْفَهْمِ السَّلِيمِ، وَالْعَمَلِ بِمَا فِيهَا.",
    "tadabburFr": "Bien réciter le Livre d'Allah implique de le lire correctement, de le comprendre et d'en appliquer fidèlement les enseignements.",
    "amalAr": "اقْرَأْ وِرْدَكَ الْيَوْمِيَّ مِنَ الْقُرْآنِ بِتَدَبُّرٍ وَاطَّبِقْ آيَةً مِنْهُ.",
    "amalFr": "Lisez votre portion quotidienne du Coran avec méditation et mettez en pratique un de ses versets aujourd'hui.",
    "tawjihAr": "الْإِيمَانُ الصَّادِقُ بِالْكِتَابِ يَقْتَضِي اتِّبَاعَهُ وَالْعَمَلَ بِأَحْكَامِهِ.",
    "tawjihFr": "La foi sincère envers le Livre sacré exige son suivi rigoureux et la mise en pratique de ses lois.",
    "words": [
      {
        "word": "يكفر",
        "count": 15,
        "refs": [
          "2:99",
          "2:121",
          "2:256",
          "3:19"
        ]
      },
      {
        "word": "فاولئك",
        "count": 46,
        "refs": [
          "2:81",
          "2:121",
          "2:160",
          "2:217"
        ]
      },
      {
        "word": "يؤمنون",
        "count": 86,
        "refs": [
          "2:3",
          "2:4",
          "2:6",
          "2:88"
        ]
      }
    ]
  },
  {
    "n": 122,
    "arabic": "يَٰبَنِىٓ إِسْرَٰٓءِيلَ ٱذْكُرُوا۟ نِعْمَتِىَ ٱلَّتِىٓ أَنْعَمْتُ عَلَيْكُمْ وَأَنِّى فَضَّلْتُكُمْ عَلَى ٱلْعَٰلَمِينَ",
    "french": "O Enfants d'Israël, rappelez-vous Mon bienfait dont Je vous ai comblés et que Je vous ai favorisés par-dessus le reste du monde (de leur époque).",
    "tadabburAr": "التَّذْكِيرُ بِالنِّعَمِ يَحُثُّ الْعَبْدَ عَلَى الشُّكْرِ وَيَمْنَعُهُ مِنَ الْكِبْرِ وَالْعِصْيَانِ.",
    "tadabburFr": "Se rappeler les bienfaits d'Allah incite à la gratitude et préserve l'être humain de l'orgueil et de la désobéissance.",
    "amalAr": "اذْكُرْ ثَلَاثَ نِعَمٍ أَنْعَمَ اللَّهُ بِهَا عَلَيْكَ الْيَوْمَ وَاشْكُرْهُ عَلَيْهَا.",
    "amalFr": "Énumérez trois bienfaits qu'Allah vous a accordés aujourd'hui et remerciez-Le sincèrement.",
    "tawjihAr": "شُكْرُ النِّعْمَةِ يَكُونُ بِالْإِيمَانِ وَالطَّاعَةِ لَا بِالافْتِخَارِ وَالنَّسَبِ.",
    "tawjihFr": "La gratitude envers les bienfaits se traduit par la foi et l'obéissance, non par la vanité ou la lignée.",
    "words": [
      {
        "word": "فضلتكم",
        "count": 2,
        "refs": [
          "2:47",
          "2:122"
        ]
      },
      {
        "word": "نعمتي",
        "count": 6,
        "refs": [
          "2:40",
          "2:47",
          "2:122",
          "2:150"
        ]
      },
      {
        "word": "انعمت",
        "count": 7,
        "refs": [
          "1:7",
          "2:40",
          "2:47",
          "2:122"
        ]
      }
    ]
  },
  {
    "n": 123,
    "arabic": "وَٱتَّقُوا۟ يَوْمًۭا لَّا تَجْزِى نَفْسٌ عَن نَّفْسٍۢ شَيْـًۭٔا وَلَا يُقْبَلُ مِنْهَا عَدْلٌۭ وَلَا تَنفَعُهَا شَفَٰعَةٌۭ وَلَا هُمْ يُنصَرُونَ",
    "french": "Et redoutez le jour où nulle âme ne bénéficiera à une autre, où l'on n'acceptera d'elle aucune compensation, et où aucune intercession ne lui sera utile. Et ils ne seront point secourus.",
    "tadabburAr": "يَوْمُ الْقِيَامَةِ لَا يَنْفَعُ فِيهِ نَسَبٌ وَلَا فِدْيَةٌ، وَإِنَّمَا الْمَعْوَلُ عَلَى الْإِيمَانِ وَالْعَمَلِ الصَّالِحِ.",
    "tadabburFr": "Le Jour du Jugement, ni la lignée ni la compensation ne seront d'aucune utilité ; seul comptera l'acte pieux émanant de la foi.",
    "amalAr": "قَدِّمْ الْيَوْمَ عَمَلًا صَالِحًا خَالِصًا لِلَّهِ تَبْتَغِي بِهِ النَّجَاةَ يَوْمَ الْقِيَامَةِ.",
    "amalFr": "Accomplissez aujourd'hui une bonne action sincère envers Allah pour préparer votre salut le Jour Dernier.",
    "tawjihAr": "النَّجَاةُ الْأُخْرَوِيَّةُ مَسْؤُولِيَّةٌ فَرْدِيَّةٌ تُنَالُ بِالتَّقْوَى وَالْعَمَلِ الصَّالِحِ.",
    "tawjihFr": "Le salut dans l'au-delà est une responsabilité individuelle fondée sur la piété et les bonnes œuvres.",
    "words": [
      {
        "word": "تجزي",
        "count": 4,
        "refs": [
          "2:48",
          "2:123",
          "40:17",
          "92:19"
        ]
      },
      {
        "word": "يقبل",
        "count": 6,
        "refs": [
          "2:48",
          "2:123",
          "3:85",
          "3:91"
        ]
      },
      {
        "word": "ينصرون",
        "count": 13,
        "refs": [
          "2:48",
          "2:86",
          "2:123",
          "3:111"
        ]
      }
    ]
  },
  {
    "n": 124,
    "arabic": "۞ وَإِذِ ٱبْتَلَىٰٓ إِبْرَٰهِۦمَ رَبُّهُۥ بِكَلِمَٰتٍۢ فَأَتَمَّهُنَّ ۖ قَالَ إِنِّى جَاعِلُكَ لِلنَّاسِ إِمَامًۭا ۖ قَالَ وَمِن ذُرِّيَّتِى ۖ قَالَ لَا يَنَالُ عَهْدِى ٱلظَّٰلِمِينَ",
    "french": "[Et rappelle-toi] quand ton Seigneur eut éprouvé Abraham par certains commandements, et qu'il les eut accomplis, le Seigneur lui dit: «Je vais faire de toi un exemple à suivre pour les gens». - «Et parmi ma descendance?» demanda-t-il. - «Mon engagement, dit Allah, ne s'applique pas aux injustes»",
    "tadabburAr": "الْإِمَامَةُ فِي الدِّينِ تُنَالُ بِالصَّبْرِ وَالْيَقِينِ وَإِتْمَامِ أَمْرِ اللَّهِ، وَلَا يَنَالُهَا الظَّالِمُونَ.",
    "tadabburFr": "La direction spirituelle s'obtient par la patience, la certitude et la pleine obéissance aux ordres d'Allah, et elle est refusée aux injustes.",
    "amalAr": "اصْبِرْ عَلَى أَدَاءِ طَاعَةٍ ثَقِيلَةٍ عَلَى نَفْسِكَ الْيَوْمَ ابْتِغَاءَ وَجْهِ اللَّهِ.",
    "amalFr": "Patientez aujourd'hui dans l'accomplissement d'une obéissance exigeante, uniquement pour la face d'Allah.",
    "tawjihAr": "عَهْدُ اللَّهِ وَالإِمَامَةُ فِي الدِّينِ لَا يُنَالَانِ بِالنَّسَبِ بَلْ بِالْعَدْلِ وَالتَّقْوَى.",
    "tawjihFr": "L'alliance avec Allah et le rang de guide ne s'héritent pas, mais s'acquièrent par la justice et la piété.",
    "words": [
      {
        "word": "ابتلي",
        "count": 2,
        "refs": [
          "2:124",
          "33:11"
        ]
      },
      {
        "word": "ينال",
        "count": 2,
        "refs": [
          "2:124",
          "22:37"
        ]
      },
      {
        "word": "اماما",
        "count": 4,
        "refs": [
          "2:124",
          "11:17",
          "25:74",
          "46:12"
        ]
      }
    ]
  },
  {
    "n": 125,
    "arabic": "وَإِذْ جَعَلْنَا ٱلْبَيْتَ مَثَابَةًۭ لِّلنَّاسِ وَأَمْنًۭا وَٱتَّخِذُوا۟ مِن مَّقَامِ إِبْرَٰهِۦمَ مُصَلًّۭى ۖ وَعَهِدْنَآ إِلَىٰٓ إِبْرَٰهِۦمَ وَإِسْمَٰعِيلَ أَن طَهِّرَا بَيْتِىَ لِلطَّآئِفِينَ وَٱلْعَٰكِفِينَ وَٱلرُّكَّعِ ٱلسُّجُودِ",
    "french": "[Et rappelle-toi], quand nous fîmes de la Maison un lieu de visite et un asile pour les gens - Adoptez donc pour lieu de prière, ce lieu où Abraham se tint debout - Et Nous confiâmes à Abraham et à Ismaël ceci: «Purifiez Ma Maison pour ceux qui tournent autour, y font retraite pieuse, s'y inclinent et s'y prosternent.",
    "tadabburAr": "جَعَلَ اللَّهُ الْبَيْتَ الْحَرَامَ مَلْجَأً وَأَمْنًا، وَأَمَرَ بِتَطْهِيرِهِ لِلْعِبَادَةِ وَالصَّلَاةِ.",
    "tadabburFr": "Allah a fait de la Maison Sacrée un havre de paix et un refuge pour les hommes, ordonnant sa purification pour le culte.",
    "amalAr": "صَلِّ رَكْعَتَيْنِ بِخُشُوعٍ تَسْتَشْعِرُ فِيهِمَا عَظَمَةَ الصَّلَاةِ وَعِبَادَةِ اللَّهِ.",
    "amalFr": "Accomplissez deux unités de prière avec humilité en méditant sur la grandeur du culte rendu à Allah.",
    "tawjihAr": "العِنَايَةُ بِمَسَاجِدِ اللَّهِ وَتَطْهِيرُهَا حِسِّيًّا وَمَعْنَوِيًّا مِنْ أَعْظَمِ الْقُرُبَاتِ.",
    "tawjihFr": "Prendre soin des lieux de culte et les purifier physiquement et spirituellement fait partie des plus nobles actions.",
    "words": [
      {
        "word": "للطائفين",
        "count": 2,
        "refs": [
          "2:125",
          "22:26"
        ]
      },
      {
        "word": "والركع",
        "count": 2,
        "refs": [
          "2:125",
          "22:26"
        ]
      },
      {
        "word": "بيتي",
        "count": 3,
        "refs": [
          "2:125",
          "22:26",
          "71:28"
        ]
      }
    ]
  },
  {
    "n": 126,
    "arabic": "وَإِذْ قَالَ إِبْرَٰهِۦمُ رَبِّ ٱجْعَلْ هَٰذَا بَلَدًا ءَامِنًۭا وَٱرْزُقْ أَهْلَهُۥ مِنَ ٱلثَّمَرَٰتِ مَنْ ءَامَنَ مِنْهُم بِٱللَّهِ وَٱلْيَوْمِ ٱلْءَاخِرِ ۖ قَالَ وَمَن كَفَرَ فَأُمَتِّعُهُۥ قَلِيلًۭا ثُمَّ أَضْطَرُّهُۥٓ إِلَىٰ عَذَابِ ٱلنَّارِ ۖ وَبِئْسَ ٱلْمَصِيرُ",
    "french": "Et quand Abraham supplia: «O mon Seigneur, fais de cette cité un lieu de sécurité, et fais attribution des fruits à ceux qui parmi ses habitants auront cru en Allah et au Jour dernier», le Seigneur dit: «Et quiconque n'y aura pas cru, alors Je lui concèderai une courte jouissance [ici-bas], puis Je le contraindrai au châtiment du Feu [dans l'au-delà]. Et quelle mauvaise destination!»",
    "tadabburAr": "الْأَمْنُ قَبْلَ الرِّزْقِ فِي دُعَاءِ إِبْرَاهِيمَ، وَالإِمْتَاعُ الدُّنْيَوِيُّ شَامِلٌ لِلْكُلِّ أَمَّا النَّعِيمُ الْآخِرُ فَلِلْمُؤْمِنِينَ.",
    "tadabburFr": "Dans l'invocation d'Abraham, la sécurité précède la subsistance ; si les jouissances terrestres sont données à tous, l'au-delà est réservé aux croyants.",
    "amalAr": "ادْعُ اللَّهَ الْيَوْمَ أَنْ يَحْفَظَ بَلَدَكَ وَبِلَادَ الْمُسْلِمِينَ بِالْأَمْنِ وَالرِّزْقِ.",
    "amalFr": "Invoquez Allah aujourd'hui pour qu'Il préserve votre pays et la communauté dans la sécurité et la prospérité.",
    "tawjihAr": "الْعَطَاءُ الدُّنْيَوِيُّ لَيْسَ دَلِيلًا عَلَى رِضَا اللَّهِ، بَلِ الْعِبْرَةُ بِمَصِيرِ الْآخِرَةِ.",
    "tawjihFr": "L'abondance matérielle en ce monde n'est pas une preuve de l'agrément divin ; seule compte la destinée finale.",
    "words": [
      {
        "word": "اجعل",
        "count": 8,
        "refs": [
          "2:126",
          "2:260",
          "3:41",
          "7:138"
        ]
      },
      {
        "word": "اهله",
        "count": 14,
        "refs": [
          "2:126",
          "2:196",
          "2:217",
          "4:35"
        ]
      },
      {
        "word": "وبئس",
        "count": 15,
        "refs": [
          "2:126",
          "3:12",
          "3:151",
          "3:162"
        ]
      }
    ]
  },
  {
    "n": 127,
    "arabic": "وَإِذْ يَرْفَعُ إِبْرَٰهِۦمُ ٱلْقَوَاعِدَ مِنَ ٱلْبَيْتِ وَإِسْمَٰعِيلُ رَبَّنَا تَقَبَّلْ مِنَّآ ۖ إِنَّكَ أَنتَ ٱلسَّمِيعُ ٱلْعَلِيمُ",
    "french": "Et quand Abraham et Ismaël élevaient les assises de la Maison: «O notre Seigneur, accepte ceci de notre part! Car c'est Toi l'Audient, l'Omniscient.",
    "tadabburAr": "الإِخْلَاصُ يَجْعَلُ العَبْدَ يَخَافُ عَدَمَ القَبُولِ رَغْمَ عِظَمِ العَمَلِ، كَمَا فَعَلَ إِبْرَاهِيمُ وَإِسْمَاعِيلُ وَهُمَا يَبْنِيَانِ الكَعْبَةَ.",
    "tadabburFr": "Malgré la grandeur de leur œuvre (la construction de la Kaaba), Ibrahim et Isma'il craignaient que cela ne soit pas accepté, montrant une sincérité exemplaire.",
    "amalAr": "ادْعُ اللَّهَ بَعْدَ كُلِّ طَاعَةٍ تُؤَدِّيهَا اليَوْمَ أَنْ يَتَقَبَّلَهَا مِنْكَ.",
    "amalFr": "Invoque Allah après chaque bonne action accomplie aujourd'hui pour qu'Il l'accepte.",
    "tawjihAr": "المَقْبُولُ عِنْدَ اللَّهِ هُوَ مَنْ جَمَعَ بَيْنَ إِحْسَانِ العَمَلِ وَخَوْفِ عَدَمِ القَبُولِ.",
    "tawjihFr": "La véritable piété consiste à parfaire ses œuvres tout en implorant humblement l'agrément d'Allah.",
    "words": [
      {
        "word": "يرفع",
        "count": 2,
        "refs": [
          "2:127",
          "58:11"
        ]
      },
      {
        "word": "القواعد",
        "count": 2,
        "refs": [
          "2:127",
          "16:26"
        ]
      },
      {
        "word": "تقبل",
        "count": 4,
        "refs": [
          "2:127",
          "3:90",
          "5:36",
          "9:54"
        ]
      }
    ]
  },
  {
    "n": 128,
    "arabic": "رَبَّنَا وَٱجْعَلْنَا مُسْلِمَيْنِ لَكَ وَمِن ذُرِّيَّتِنَآ أُمَّةًۭ مُّسْلِمَةًۭ لَّكَ وَأَرِنَا مَنَاسِكَنَا وَتُبْ عَلَيْنَآ ۖ إِنَّكَ أَنتَ ٱلتَّوَّابُ ٱلرَّحِيمُ",
    "french": "Notre Seigneur! Fais de nous Tes Soumis, et de notre descendance une communauté soumise à Toi. Et montre nous nos rites et accepte de nous le repentir. Car c'est Toi certes l'Accueillant au repentir, le Miséricordieux.",
    "tadabburAr": "الحِرْصُ عَلَى الثَّبَاتِ عَلَى الإِسْلَامِ وَالصَّلَاحِ لِلذُّرِّيَّةِ مِنْ أَعْظَمِ أَدْعِيَةِ الأَنْبِيَاءِ.",
    "tadabburFr": "Demander la fermeté dans l'Islam et une descendance pieuse est l'une des plus grandes invocations des prophètes.",
    "amalAr": "ادْعُ اللَّهَ اليَوْمَ لِنَفْسِكَ وَلِذُّرِّيَّتِكَ بِالثَّبَاتِ عَلَى الدِّينِ وَالتَّوْبَةِ.",
    "amalFr": "Prie aujourd'hui pour toi et ta descendance afin d'obtenir la fermeté dans la foi et le pardon.",
    "tawjihAr": "التَّوْبَةُ وَتَعَلُّمُ أَحْكَامِ العِبَادَةِ سَبِيلُ الِاسْتِقَامَةِ وَالتَّمَكُّنِ فِي الإِسْلَامِ.",
    "tawjihFr": "Le repentir continu et l'apprentissage des rites d'adoration sont essentiels pour maintenir sa soumission à Allah.",
    "words": [
      {
        "word": "واجعلنا",
        "count": 2,
        "refs": [
          "2:128",
          "25:74"
        ]
      },
      {
        "word": "مسلمه",
        "count": 4,
        "refs": [
          "2:71",
          "2:128",
          "4:92",
          "4:92"
        ]
      },
      {
        "word": "التواب",
        "count": 6,
        "refs": [
          "2:37",
          "2:54",
          "2:128",
          "2:160"
        ]
      }
    ]
  },
  {
    "n": 129,
    "arabic": "رَبَّنَا وَٱبْعَثْ فِيهِمْ رَسُولًۭا مِّنْهُمْ يَتْلُوا۟ عَلَيْهِمْ ءَايَٰتِكَ وَيُعَلِّمُهُمُ ٱلْكِتَٰبَ وَٱلْحِكْمَةَ وَيُزَكِّيهِمْ ۚ إِنَّكَ أَنتَ ٱلْعَزِيزُ ٱلْحَكِيمُ",
    "french": "Notre Seigneur! Envoie l'un des leurs comme messager parmi eux, pour leur réciter Tes versets, leur enseigner le Livre et la Sagesse, et les purifier. Car c'est Toi certes le Puissant, le Sage!",
    "tadabburAr": "النَّبِيُّ ﷺ هُوَ دَعْوَةُ إِبْرَاهِيمَ، وَتَزْكِيَةُ النُّفُوسِ لَا تَكُونُ إِلَّا بِاتِّبَاعِ الكِتَابِ وَالسُّنَّةِ.",
    "tadabburFr": "Le Prophète ﷺ est la réponse à l'invocation d'Ibrahim, et la purification de l'âme se fait uniquement par le Coran et la Sunnah.",
    "amalAr": "اقْرَأْ آيَاتٍ مِنَ القُرْآنِ اليَوْمَ وَتَدَبَّرْ مَعْنَاهَا لِتَزْكِيَةِ قَلْبِكَ.",
    "amalFr": "Lis quelques versets du Coran aujourd'hui en méditant leur sens pour purifier ton cœur.",
    "tawjihAr": "العِلْمُ بِالكِتَابِ وَالحِكْمَةِ هُوَ الأَسَاسُ لِتَزْكِيَةِ القُلُوبِ وَإِصْلَاحِ الأَعْمَالِ.",
    "tawjihFr": "La connaissance du Livre et de la Sagesse (Sunnah) est le fondement de la purification des cœurs et des actes.",
    "words": [
      {
        "word": "وابعث",
        "count": 2,
        "refs": [
          "2:129",
          "26:36"
        ]
      },
      {
        "word": "ويعلمهم",
        "count": 3,
        "refs": [
          "2:129",
          "3:164",
          "62:2"
        ]
      },
      {
        "word": "ويزكيهم",
        "count": 3,
        "refs": [
          "2:129",
          "3:164",
          "62:2"
        ]
      }
    ]
  },
  {
    "n": 130,
    "arabic": "وَمَن يَرْغَبُ عَن مِّلَّةِ إِبْرَٰهِۦمَ إِلَّا مَن سَفِهَ نَفْسَهُۥ ۚ وَلَقَدِ ٱصْطَفَيْنَٰهُ فِى ٱلدُّنْيَا ۖ وَإِنَّهُۥ فِى ٱلْءَاخِرَةِ لَمِنَ ٱلصَّٰلِحِينَ",
    "french": "Qui donc aura en aversion la religion d'Abraham, sinon celui qui sème son âme dans la sottise? Car très certainement Nous l'avons choisi en ce monde; et, dans l'au-delà, il est certes du nombre des gens de bien.",
    "tadabburAr": "الرَّغْبَةُ عَنْ مِلَّةِ التَّوْحِيدِ سَفَهٌ فِي العَقْلِ، وَالِاقْتِدَاءُ بِإِبْرَاهِيمَ شَرَفٌ فِي الدُّنْيَا وَالآخِرَةِ.",
    "tadabburFr": "Se détourner du monothéisme pur est une folie de l'esprit, tandis que suivre la voie d'Ibrahim est un honneur ici-bas et dans l'au-delà.",
    "amalAr": "جَدِّدْ تَوْحِيدَكَ وَإِخْلَاصَكَ لِلَّهِ تَعَالَى وَابْتَعِدْ عَنْ كُلِّ شُبْهَةٍ.",
    "amalFr": "Renouvelle ton monothéisme et ta sincérité envers Allah et éloigne-toi de tout doute.",
    "tawjihAr": "المِلَّةُ الإِبْرَاهِيمِيَّةُ المَبْنِيَّةُ عَلَى التَّوْحِيدِ هِيَ جَوْهَرُ العَقْلِ وَالحِكْمَةِ.",
    "tawjihFr": "La voie d'Ibrahim, fondée sur le monothéisme pur, représente l'essence de la sagesse et de la raison.",
    "words": [
      {
        "word": "نفسه",
        "count": 26,
        "refs": [
          "2:130",
          "2:207",
          "2:231",
          "3:28"
        ]
      },
      {
        "word": "وانه",
        "count": 38,
        "refs": [
          "2:130",
          "2:149",
          "6:121",
          "6:165"
        ]
      },
      {
        "word": "الدنيا",
        "count": 115,
        "refs": [
          "2:85",
          "2:86",
          "2:114",
          "2:130"
        ]
      }
    ]
  },
  {
    "n": 131,
    "arabic": "إِذْ قَالَ لَهُۥ رَبُّهُۥٓ أَسْلِمْ ۖ قَالَ أَسْلَمْتُ لِرَبِّ ٱلْعَٰلَمِينَ",
    "french": "Quand son Seigneur lui avait dit: «Soumets-toi», il dit: «Je me soumets au Seigneur de l'Univers».",
    "tadabburAr": "المُبَادَرَةُ إِلَى الِاسْتِسْلَامِ لِأَمْرِ اللَّهِ دُونَ تَرَدُّدٍ هِيَ سِمَةُ الأَنْبِيَاءِ وَالصَّالِحِينَ.",
    "tadabburFr": "La soumission immédiate et sans hésitation aux ordres d'Allah est la marque caractéristique des prophètes et des pieux.",
    "amalAr": "اسْتَجِبْ لِأَمْرٍ شَرِعِيٍّ تَعْلَمُهُ اليَوْمَ دُونَ تَسْوِيفٍ.",
    "amalFr": "Obéis immédiatement aujourd'hui à un ordre divin que tu connais, sans procrastiner.",
    "tawjihAr": "حَقِيقَةُ الإِسْلَامِ هِيَ الِانْقِيَادُ التَّامُّ لِلَّهِ رَبِّ العَالَمِينَ ظَاهِرًا وَبَاطِنًا.",
    "tawjihFr": "La réalité de l'Islam réside dans la soumission totale à Allah, Seigneur des mondes, extérieurement et intérieurement.",
    "words": [
      {
        "word": "اسلمت",
        "count": 2,
        "refs": [
          "2:131",
          "3:20"
        ]
      },
      {
        "word": "اسلم",
        "count": 7,
        "refs": [
          "2:112",
          "2:131",
          "3:83",
          "4:125"
        ]
      }
    ]
  },
  {
    "n": 132,
    "arabic": "وَوَصَّىٰ بِهَآ إِبْرَٰهِۦمُ بَنِيهِ وَيَعْقُوبُ يَٰبَنِىَّ إِنَّ ٱللَّهَ ٱصْطَفَىٰ لَكُمُ ٱلدِّينَ فَلَا تَمُوتُنَّ إِلَّا وَأَنتُم مُّسْلِمُونَ",
    "french": "Et c'est ce qu'Abraham recommanda à ses fils, de même que Jacob: «O mes fils, certes Allah vous a choisi la religion: ne mourrez point, donc, autrement qu'en Soumis!» (à Allah).",
    "tadabburAr": "أَعْظَمُ وَصِيَّةٍ يُقَدِّمُهَا الآبَاءُ لِلأَبْنَاءِ هِيَ الثَّبَاتُ عَلَى الدِّينِ حَتَّى المَمَاتِ.",
    "tadabburFr": "Le plus grand testament que les parents puissent laisser à leurs enfants est le conseil de rester fermes sur la religion jusqu'à la mort.",
    "amalAr": "وَجِّهْ نَصِيحَةً إِيمَانِيَّةً لِأَحَدِ أَبْنَائِكَ أَوْ أَقَارِبِكَ اليَوْمَ.",
    "amalFr": "Donne aujourd'hui un conseil spirituel affectueux à l'un de tes enfants ou proches.",
    "tawjihAr": "المَوْتُ عَلَى الإِسْلَامِ ثَمَرَةُ العَيْشِ عَلَيْهِ وَالِاسْتِقَامَةِ فِي الحَيَاةِ.",
    "tawjihFr": "Mourir en état de soumission (Islam) est le fruit d'une vie vécue dans la droiture et l'obéissance.",
    "words": [
      {
        "word": "تموتن",
        "count": 2,
        "refs": [
          "2:132",
          "3:102"
        ]
      },
      {
        "word": "اصطفي",
        "count": 4,
        "refs": [
          "2:132",
          "3:33",
          "27:59",
          "37:153"
        ]
      },
      {
        "word": "ويعقوب",
        "count": 11,
        "refs": [
          "2:132",
          "2:136",
          "2:140",
          "3:84"
        ]
      }
    ]
  },
  {
    "n": 133,
    "arabic": "أَمْ كُنتُمْ شُهَدَآءَ إِذْ حَضَرَ يَعْقُوبَ ٱلْمَوْتُ إِذْ قَالَ لِبَنِيهِ مَا تَعْبُدُونَ مِنۢ بَعْدِى قَالُوا۟ نَعْبُدُ إِلَٰهَكَ وَإِلَٰهَ ءَابَآئِكَ إِبْرَٰهِۦمَ وَإِسْمَٰعِيلَ وَإِسْحَٰقَ إِلَٰهًۭا وَٰحِدًۭا وَنَحْنُ لَهُۥ مُسْلِمُونَ",
    "french": "Etiez-vous témoins quand la mort se présenta à Jacob et qu'il dit à ses fils: «Qu'adorerez-vous après moi?» - Ils répondirent: «Nous adorerons ta divinité et la divinité de tes pères, Abraham, Ismaël et Isaac, Divinité Unique et à laquelle nous sommes Soumis».",
    "tadabburAr": "كَانَ هَمُّ الأَنْبِيَاءِ عِنْدَ المَوْتِ هُوَ سَلَامَةُ عَقِيدَةِ أَبْنَائِهِمْ وَتَوْحِيدِهِمْ لِلَّهِ.",
    "tadabburFr": "La préoccupation majeure des prophètes au moment de la mort était la préservation de la foi et du monothéisme de leurs enfants.",
    "amalAr": "نَاقِشْ مَعَ أَهْلِ بَيْتِكَ اليَوْمَ أَهَمِّيَّةَ التَّوْحِيدِ وَعِبَادَةِ اللَّهِ وَحْدَهُ.",
    "amalFr": "Discute aujourd'hui avec ta famille de l'importance du monothéisme et du culte exclusif à Allah.",
    "tawjihAr": "التَّوْحِيدُ هُوَ الدِّينُ المُنَشَّأُ عَلَيْهِ جَمِيعُ الأَنْبِيَاءِ وَالوَاجِبُ أَنْ يَتَوَارَثَهُ الأَجْيَالُ.",
    "tawjihFr": "Le monothéisme pur est le message commun de tous les prophètes, transmis de génération en génération.",
    "words": [
      {
        "word": "الهك",
        "count": 2,
        "refs": [
          "2:133",
          "20:97"
        ]
      },
      {
        "word": "واله",
        "count": 2,
        "refs": [
          "2:133",
          "20:88"
        ]
      },
      {
        "word": "بعدي",
        "count": 4,
        "refs": [
          "2:133",
          "7:150",
          "38:35",
          "61:6"
        ]
      }
    ]
  },
  {
    "n": 134,
    "arabic": "تِلْكَ أُمَّةٌۭ قَدْ خَلَتْ ۖ لَهَا مَا كَسَبَتْ وَلَكُم مَّا كَسَبْتُمْ ۖ وَلَا تُسْـَٔلُونَ عَمَّا كَانُوا۟ يَعْمَلُونَ",
    "french": "Voilà une génération bel et bien révolue. A elle ce qu'elle a acquis, et à vous ce que vous avez acquis. On ne vous demandera pas compte de ce qu'ils faisaient.",
    "tadabburAr": "كُلُّ أُمَّةٍ وَشَخْصٍ مُحَاسَبٌ عَلَى عَمَلِهِ، وَلَا يَنْفَعُ الإِنْسَانَ صَلَاحُ آبَائِهِ إِذَا كَانَ مُقَصِّرًا.",
    "tadabburFr": "Chaque communauté et chaque individu sera jugé selon ses propres actes. La pieuse lignée des ancêtres ne saurait profiter à celui qui néglige son propre travail.",
    "amalAr": "اعْمَلْ صَالِحًا الْيَوْمَ وَلَا تَعْتَمِدْ عَلَى شَرَفِ نَسَبِكَ أَوْ صَلَاحِ غَيْرِكَ.",
    "amalFr": "Réalise aujourd'hui une bonne action sans compter sur le mérite de tes proches ou de tes ancêtres.",
    "tawjihAr": "المَسْؤُولِيَّةُ الفَرْدِيَّةُ هِيَ أَسَاسُ العَدْلِ الإِلَهِيِّ.",
    "tawjihFr": "La responsabilité individuelle est le fondement de la justice divine.",
    "words": [
      {
        "word": "كسبتم",
        "count": 3,
        "refs": [
          "2:134",
          "2:141",
          "2:267"
        ]
      },
      {
        "word": "كسبت",
        "count": 16,
        "refs": [
          "2:134",
          "2:141",
          "2:225",
          "2:281"
        ]
      },
      {
        "word": "ولكم",
        "count": 19,
        "refs": [
          "2:36",
          "2:134",
          "2:139",
          "2:141"
        ]
      }
    ]
  },
  {
    "n": 135,
    "arabic": "وَقَالُوا۟ كُونُوا۟ هُودًا أَوْ نَصَٰرَىٰ تَهْتَدُوا۟ ۗ قُلْ بَلْ مِلَّةَ إِبْرَٰهِۦمَ حَنِيفًۭا ۖ وَمَا كَانَ مِنَ ٱلْمُشْرِكِينَ",
    "french": "Ils ont dit : «Soyez Juifs ou Chrétiens, vous serez donc sur la bonne voie». - Dis: «Non, mais nous suivons la religion d'Abraham le modèle même de la droiture et qui ne fut point parmi les Associateurs».",
    "tadabburAr": "الهِدَايَةُ الحَقِيقِيَّةُ هِيَ اتِّبَاعُ مِلَّةِ إِبْرَاهِيمَ الحَنِيفِيَّةِ القَائِمَةِ عَلَى التَّوْحِيدِ الخَالِصِ.",
    "tadabburFr": "La vraie guidée réside dans le suivi de la religion d'Abraham, fondée sur le monothéisme pur et dégagée de tout polythéisme.",
    "amalAr": "ثَبِّتْ قَلْبَكَ عَلَى التَّوْحِيدِ وَاحْذَرْ مِنَ التَّعَصُّبِ المَذْهَبِيِّ أَوْ الحِزْبِيِّ.",
    "amalFr": "Raffermis ton cœur dans le monothéisme pur et préserve-toi de tout fanatisme.",
    "tawjihAr": "التَّوْحِيدُ الخَالِصُ هُوَ المِعْيَارُ الوَحِيدُ لِلْهِدَايَةِ.",
    "tawjihFr": "Le monothéisme pur est le seul véritable critère de la guidée.",
    "words": [
      {
        "word": "تهتدوا",
        "count": 2,
        "refs": [
          "2:135",
          "24:54"
        ]
      },
      {
        "word": "هودا",
        "count": 6,
        "refs": [
          "2:111",
          "2:135",
          "2:140",
          "7:65"
        ]
      },
      {
        "word": "كونوا",
        "count": 9,
        "refs": [
          "2:65",
          "2:135",
          "3:79",
          "3:79"
        ]
      }
    ]
  },
  {
    "n": 136,
    "arabic": "قُولُوٓا۟ ءَامَنَّا بِٱللَّهِ وَمَآ أُنزِلَ إِلَيْنَا وَمَآ أُنزِلَ إِلَىٰٓ إِبْرَٰهِۦمَ وَإِسْمَٰعِيلَ وَإِسْحَٰقَ وَيَعْقُوبَ وَٱلْأَسْبَاطِ وَمَآ أُوتِىَ مُوسَىٰ وَعِيسَىٰ وَمَآ أُوتِىَ ٱلنَّبِيُّونَ مِن رَّبِّهِمْ لَا نُفَرِّقُ بَيْنَ أَحَدٍۢ مِّنْهُمْ وَنَحْنُ لَهُۥ مُسْلِمُونَ",
    "french": "Dites: «Nous croyons en Allah et en ce qu'on nous a révélé, et en ce qu'on a fait descendre vers Abraham et Ismaël et Isaac et Jacob et les Tribus, et en ce qui a été donné à Moïse et à Jésus, et en ce qui a été donné aux prophètes, venant de leur Seigneur: nous ne faisons aucune distinction entre eux. Et à Lui nous sommes Soumis».",
    "tadabburAr": "الإِيمَانُ فِي الإِسْلَامِ شَامِلٌ لِجَمِيعِ الأَنْبِيَاءِ وَالرُّسُلِ وَالكُتُبِ المُنَزَّلَةِ دُونَ تَفْرِيقٍ.",
    "tadabburFr": "La foi islamique englobe tous les prophètes et les livres révélés par Allah, sans faire aucune distinction entre eux.",
    "amalAr": "جَدِّدْ إِيمَانَكَ اليَوْمَ بِالإِقْرَارِ بِجَمِيعِ أَنْبِيَاءِ اللهِ وَرُسُلِهِ.",
    "amalFr": "Renouvelle aujourd'hui ta foi en affirmant ta croyance en tous les prophètes de Dieu.",
    "tawjihAr": "عَدَمُ التَّفْرِيقِ بَيْنَ الرُّسُلِ أَصْلٌ مِنْ أُصُولِ العَقِيدَةِ.",
    "tawjihFr": "Ne faire aucune distinction entre les messagers est un pilier fondamental de la foi.",
    "words": [
      {
        "word": "قولوا",
        "count": 2,
        "refs": [
          "2:136",
          "49:14"
        ]
      },
      {
        "word": "النبيون",
        "count": 2,
        "refs": [
          "2:136",
          "5:44"
        ]
      },
      {
        "word": "نفرق",
        "count": 3,
        "refs": [
          "2:136",
          "2:285",
          "3:84"
        ]
      }
    ]
  },
  {
    "n": 137,
    "arabic": "فَإِنْ ءَامَنُوا۟ بِمِثْلِ مَآ ءَامَنتُم بِهِۦ فَقَدِ ٱهْتَدَوا۟ ۖ وَّإِن تَوَلَّوْا۟ فَإِنَّمَا هُمْ فِى شِقَاقٍۢ ۖ فَسَيَكْفِيكَهُمُ ٱللَّهُ ۚ وَهُوَ ٱلسَّمِيعُ ٱلْعَلِيمُ",
    "french": "Alors, s'ils croient à cela même à quoi vous croyez, ils seront certainement sur la bonne voie. Et s'ils s'en détournent, ils seront certes dans le schisme! Alors Allah te suffira contre eux. Il est l'Audient, l'Omniscient.",
    "tadabburAr": "مَنْ آمَنَ بِمِثْلِ إِيمَانِ الصَّحَابَةِ فَقَدِ اهْتَدَى، وَاللهُ كَافٍ عِبَادَهُ الصَّالِحِينَ شَرَّ الخُصُومِ.",
    "tadabburFr": "Quiconque embrasse la foi des compagnons du Prophète est sur la bonne voie, et Allah suffit aux croyants contre l'animosité de leurs adversaires.",
    "amalAr": "تَوَكَّلْ عَلَى اللهِ وَلَا تَخَفْ مِنْ كَيْدِ المُنَاوِئِينَ لِلْحَقِّ.",
    "amalFr": "Place ta confiance en Allah et ne crains pas les hostilités envers la vérité.",
    "tawjihAr": "الكِفَايَةُ وَالحِمَايَةُ مِنَ اللهِ مَرْهُونَةٌ بِصِحَّةِ الإِيمَانِ.",
    "tawjihFr": "La protection d'Allah dépend de la sincérité et de la justesse de la foi.",
    "words": [
      {
        "word": "اهتدوا",
        "count": 4,
        "refs": [
          "2:137",
          "3:20",
          "19:76",
          "47:17"
        ]
      },
      {
        "word": "شقاق",
        "count": 5,
        "refs": [
          "2:137",
          "2:176",
          "4:35",
          "22:53"
        ]
      },
      {
        "word": "بمثل",
        "count": 6,
        "refs": [
          "2:137",
          "2:194",
          "16:126",
          "17:88"
        ]
      }
    ]
  },
  {
    "n": 138,
    "arabic": "صِبْغَةَ ٱللَّهِ ۖ وَمَنْ أَحْسَنُ مِنَ ٱللَّهِ صِبْغَةًۭ ۖ وَنَحْنُ لَهُۥ عَٰبِدُونَ",
    "french": "«Nous suivons la religion d'Allah! Et qui est meilleur qu'Allah en Sa religion? C'est Lui que nous adorons».",
    "tadabburAr": "صِبْغَةُ اللهِ هِيَ الفِطْرَةُ وَالدِّينُ الَّذِي يَظْهَرُ أَثَرُهُ عَلَى ظَاهِرِ العَبْدِ وَبَاطِنِهِ.",
    "tadabburFr": "L'empreinte d'Allah (Sibghatullah) est la religion naturelle dont l'effet embellit l'être humain intérieurement et extérieurement.",
    "amalAr": "اجْعَلْ أَثَرَ الدِّينِ يَظْهَرُ فِي أَخْلَاقِكَ وَتَعَامُلِكَ مَعَ النَّاسِ اليَوْمَ.",
    "amalFr": "Laisse l'empreinte de la foi se manifester aujourd'hui dans ton comportement et tes valeurs.",
    "tawjihAr": "الدِّينُ الصَّحِيحُ هُوَ الَّذِي يَصْبُغُ الحَيَاةَ كُلَّهَا بِالعِبَادَةِ.",
    "tawjihFr": "La vraie foi est celle qui imprègne l'ensemble de la vie de dévotion.",
    "words": [
      {
        "word": "صبغه",
        "count": 2,
        "refs": [
          "2:138",
          "2:138"
        ]
      },
      {
        "word": "ونحن",
        "count": 15,
        "refs": [
          "2:30",
          "2:133",
          "2:136",
          "2:138"
        ]
      },
      {
        "word": "احسن",
        "count": 32,
        "refs": [
          "2:138",
          "4:125",
          "5:50",
          "6:152"
        ]
      }
    ]
  },
  {
    "n": 139,
    "arabic": "قُلْ أَتُحَآجُّونَنَا فِى ٱللَّهِ وَهُوَ رَبُّنَا وَرَبُّكُمْ وَلَنَآ أَعْمَٰلُنَا وَلَكُمْ أَعْمَٰلُكُمْ وَنَحْنُ لَهُۥ مُخْلِصُونَ",
    "french": "Dis: «Discutez vous avec nous au sujet d'Allah, alors qu'Il est notre Seigneur et le vôtre? A nous nos actions et à vous les vôtres! C'est à Lui que nous sommes dévoués.",
    "tadabburAr": "العِبْرَةُ عِنْدَ اللهِ بِالإِخْلَاصِ وَالصَّدَقَةِ فِي العَمَلِ، لَا بِالدَّعَاوَى العَارِيَةِ عَنِ الدَّلِيلِ.",
    "tadabburFr": "Auprès d'Allah, la valeur des actes repose sur la sincérité et non sur des prétentions partisanes sans preuve.",
    "amalAr": "أَخْلِصْ نِيَّتَكَ لِلَّهِ فِي عَمَلٍ وَاحِدٍ تَقُومُ بِهِ اليَوْمَ.",
    "amalFr": "Purifie ton intention exclusivement pour Allah dans une action que tu accomplis aujourd'hui.",
    "tawjihAr": "الإِخْلَاصُ شَرْطُ قَبُولِ الأَعْمَالِ عِنْدَ اللهِ.",
    "tawjihFr": "La sincérité pure est la condition sine qua non de l'acceptation des œuvres.",
    "words": [
      {
        "word": "وربكم",
        "count": 10,
        "refs": [
          "2:139",
          "3:51",
          "5:72",
          "5:117"
        ]
      },
      {
        "word": "ونحن",
        "count": 15,
        "refs": [
          "2:30",
          "2:133",
          "2:136",
          "2:138"
        ]
      },
      {
        "word": "ولكم",
        "count": 19,
        "refs": [
          "2:36",
          "2:134",
          "2:139",
          "2:141"
        ]
      }
    ]
  },
  {
    "n": 140,
    "arabic": "أَمْ تَقُولُونَ إِنَّ إِبْرَٰهِۦمَ وَإِسْمَٰعِيلَ وَإِسْحَٰقَ وَيَعْقُوبَ وَٱلْأَسْبَاطَ كَانُوا۟ هُودًا أَوْ نَصَٰرَىٰ ۗ قُلْ ءَأَنتُمْ أَعْلَمُ أَمِ ٱللَّهُ ۗ وَمَنْ أَظْلَمُ مِمَّن كَتَمَ شَهَٰدَةً عِندَهُۥ مِنَ ٱللَّهِ ۗ وَمَا ٱللَّهُ بِغَٰفِلٍ عَمَّا تَعْمَلُونَ",
    "french": "Ou dites-vous qu'Abraham, Ismaël, Isaac et Jacob et les tribus étaient Juifs ou Chrétiens?» - Dis: «Est-ce vous les plus savants ou Allah?» - Qui est plus injuste que celui qui cache un témoignage qu'il détient d'Allah? Et Allah n'est pas inattentif à ce que vous faites.",
    "tadabburAr": "كَتْمُ الشَّهَادَةِ وَالحَقِّ مِنْ أَعْظَمِ الظُّلْمِ، وَاللهُ مُحِيطٌ بِأَعْمَالِ العِبَادِ لَا يَغْفُلُ عَنْهَا.",
    "tadabburFr": "Dissimuler le témoignage de la vérité est une injustice majeure. Allah n'est jamais distrait de ce que font les hommes.",
    "amalAr": "قُلِ الحَقَّ وَلَا تَكْتُمْ شَهَادَةً عِنْدَكَ مَهْمَا كَانَتِ الظُّرُوفُ.",
    "amalFr": "Dis la vérité et ne dissimule aucun témoignage, quelles que soient les circonstances.",
    "tawjihAr": "كِتْمَانُ الحَقِّ إِثْمٌ عَظِيمٌ وَعَدَمُ الغَفْلَةِ الإِلَهِيَّةِ وَعِيدٌ لِلظَّالِمِينَ.",
    "tawjihFr": "Cacher la vérité est un péché grave, et la vigilance d'Allah est un avertissement pour les injustes.",
    "words": [
      {
        "word": "والاسباط",
        "count": 4,
        "refs": [
          "2:136",
          "2:140",
          "3:84",
          "4:163"
        ]
      },
      {
        "word": "تقولون",
        "count": 6,
        "refs": [
          "2:80",
          "2:140",
          "4:43",
          "6:93"
        ]
      },
      {
        "word": "هودا",
        "count": 6,
        "refs": [
          "2:111",
          "2:135",
          "2:140",
          "7:65"
        ]
      }
    ]
  },
  {
    "n": 141,
    "arabic": "تِلْكَ أُمَّةٌۭ قَدْ خَلَتْ ۖ لَهَا مَا كَسَبَتْ وَلَكُم مَّا كَسَبْتُمْ ۖ وَلَا تُسْـَٔلُونَ عَمَّا كَانُوا۟ يَعْمَلُونَ",
    "french": "Voilà une génération bel et bien révolue. A elle ce qu'elle a acquis, et à vous ce que vous avez acquis. Et on ne vous demandera pas compte de ce qu'ils faisaient.",
    "tadabburAr": "النَّسَبُ وَالصَّلَاحُ لِلْآبَاءِ لَا يَنْفَعُ الْأَبْنَاءَ، بَلْ كُلُّ نَفْسٍ مَرْهُونَةٌ بِمَا كَسَبَتْ مِنْ عَمَلٍ.",
    "tadabburFr": "L'honneur des ancêtres et leur pieuse renommée ne sauraient profiter aux descendants ; chaque âme est seule responsable de ses propres actes devant Allah.",
    "amalAr": "رَكِّزِ الْيَوْمَ عَلَى إِصْلَاحِ عَمَلِكَ الشَّخْصِيِّ وَلَا تَعْتَمِدْ عَلَى فَضْلِ غَيْرِكَ.",
    "amalFr": "Concentre-toi aujourd'hui sur l'amélioration de tes propres actions sans te reposer sur la pieuse réputation de ta famille.",
    "tawjihAr": "الْمَسْؤُولِيَّةُ الْفَرْدِيَّةُ هِيَ الْأَصْلُ فِي الْحِسَابِ يَوْمَ الْقِيَامَةِ.",
    "tawjihFr": "La responsabilité individuelle est le principe fondamental du jugement auprès d'Allah au Jour de la Résurrection.",
    "words": [
      {
        "word": "كسبتم",
        "count": 3,
        "refs": [
          "2:134",
          "2:141",
          "2:267"
        ]
      },
      {
        "word": "كسبت",
        "count": 16,
        "refs": [
          "2:134",
          "2:141",
          "2:225",
          "2:281"
        ]
      },
      {
        "word": "ولكم",
        "count": 19,
        "refs": [
          "2:36",
          "2:134",
          "2:139",
          "2:141"
        ]
      }
    ]
  }
];
