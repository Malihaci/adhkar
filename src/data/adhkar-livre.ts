/**
 * « Al-Adhkâr wa-l-Âdâb » (الأذكار والآداب), Dr ʿAbd al-Muḥsin al-Qāsim —
 * série Mutūn Ṭālib al-ʿIlm. Les hadiths sont repris avec la référence
 * donnée par le livre (aucun numéro ajouté de mémoire). Les traductions
 * françaises et les phonétiques sont rédigées pour l'app : elles restent
 * « à relire » tant qu'elles n'ont pas été validées. Numérotation = celle
 * du livre.
 */
import type { Dhikr } from "@/data/adhkar";

export interface LivreHadith {
  arabic: string;
  translation: string;
  /** Référence telle que donnée par le livre. */
  source: string;
}

export interface LivreFadl {
  n: number;
  title: string;
  titleAr: string;
  hadiths: LivreHadith[];
}

export const LIVRE_TITLE = "Adhkār et ādāb";
export const LIVRE_SOURCE_NOTE =
  "D'après « Al-Adhkâr wa-l-Âdâb » du Dr ʿAbd al-Muḥsin al-Qāsim. Traductions et phonétiques à relire.";

/** Section « Les mérites » (chapitres 1 à 3) : des hadiths à lire, pas des formules à compter. */
export const livreFadail: LivreFadl[] = [
  {
    n: 1,
    title: "Mérite de la quête du savoir",
    titleAr: "فَضْلُ طَلَبِ الْعِلْمِ",
    hadiths: [
      {
        arabic:
          "قَالَ النَّبِيُّ ﷺ: «مَنْ سَلَكَ طَرِيقاً يَلْتَمِسُ فِيهِ عِلْماً؛ سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقاً إِلَى الْجَنَّةِ».",
        translation:
          "Le Prophète ﷺ a dit : « Quiconque emprunte un chemin en y cherchant un savoir, Allah lui facilite par là un chemin vers le Paradis. »",
        source: "Rapporté par Muslim",
      },
      {
        arabic: "قَالَ النَّبِيُّ ﷺ: «مَنْ يُرِدِ اللَّهُ بِهِ خَيْراً؛ يُفَقِّهْهُ فِي الدِّينِ».",
        translation:
          "Le Prophète ﷺ a dit : « Celui pour qui Allah veut le bien, Il lui donne la compréhension de la religion. »",
        source: "Muttafaq ʿalayh (al-Bukhari et Muslim)",
      },
      {
        arabic:
          "قَالَ النَّبِيُّ ﷺ: «إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: إِلَّا مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ».",
        translation:
          "Le Prophète ﷺ a dit : « Quand l'homme meurt, ses œuvres s'interrompent, sauf trois : une aumône continue, un savoir dont on tire profit, ou un enfant pieux qui invoque pour lui. »",
        source: "Rapporté par Muslim",
      },
    ],
  },
  {
    n: 2,
    title: "Mérite d'apprendre le Coran",
    titleAr: "فَضْلُ تَعَلُّمِ الْقُرْآنِ",
    hadiths: [
      {
        arabic: "قَالَ النَّبِيُّ ﷺ: «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ».",
        translation:
          "Le Prophète ﷺ a dit : « Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne. »",
        source: "Rapporté par al-Bukhari",
      },
      {
        arabic:
          "قَالَ النَّبِيُّ ﷺ: «مَثَلُ الَّذِي يَقْرَأُ الْقُرْآنَ وَهُوَ حَافِظٌ لَهُ مَعَ السَّفَرَةِ الْكِرَامِ الْبَرَرَةِ، وَمَثَلُ الَّذِي يَقْرَأُ وَهُوَ يَتَعَاهَدُهُ وَهُوَ عَلَيْهِ شَدِيدٌ؛ فَلَهُ أَجْرَانِ».",
        translation:
          "Le Prophète ﷺ a dit : « Celui qui récite le Coran en le sachant par cœur sera avec les nobles et vertueux scribes (les anges). Et celui qui le récite en le répétant régulièrement, alors que cela lui est difficile, aura deux récompenses. » (Dans le livre : as-safara = les anges ; al-kirâm = les honorés auprès d'Allah ; al-barara = les obéissants ; yata'âhaduhu = il le répète pour ne pas l'oublier.)",
        source: "Rapporté par al-Bukhari",
      },
      {
        arabic:
          "قَالَ النَّبِيُّ ﷺ: «اقْرَؤُوا الْقُرْآنَ؛ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعاً لِأَصْحَابِهِ».",
        translation:
          "Le Prophète ﷺ a dit : « Récitez le Coran, car il viendra au Jour de la Résurrection intercéder en faveur de ses compagnons. »",
        source: "Rapporté par Muslim",
      },
    ],
  },
  {
    n: 3,
    title: "Mérite des assemblées de rappel",
    titleAr: "فَضْلُ مَجَالِسِ الذِّكْرِ",
    hadiths: [
      {
        arabic:
          "قَالَ النَّبِيُّ ﷺ: «وَمَا اجْتَمَعَ قَوْمٌ فِي بَيْتٍ مِنْ بُيُوتِ اللَّهِ، يَتْلُونَ كِتَابَ اللَّهِ، وَيَتَدَارَسُونَهُ بَيْنَهُمْ؛ إِلَّا نَزَلَتْ عَلَيْهِمُ السَّكِينَةُ، وَغَشِيَتْهُمُ الرَّحْمَةُ، وَحَفَّتْهُمُ الْمَلَائِكَةُ، وَذَكَرَهُمُ اللَّهُ فِيمَنْ عِنْدَهُ».",
        translation:
          "Le Prophète ﷺ a dit : « Jamais des gens ne se réunissent dans une maison d'Allah pour réciter le Livre d'Allah et l'étudier entre eux, sans que la sérénité (as-sakîna : le calme et la quiétude) descende sur eux, que la miséricorde les couvre, que les anges les entourent et qu'Allah les mentionne auprès de ceux qui sont auprès de Lui. »",
        source: "Rapporté par Muslim",
      },
    ],
  },
];

/** Section « La purification » (chapitres 4 à 6) : de vrais adhkār, lus dans le viewer. */
export const livreAdhkar: Dhikr[] = [
  {
    id: "livre-04",
    category: "livre",
    title: "En entrant aux toilettes",
    titleAr: "دُخُولُ الْخَلَاءِ",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
    phonetic: "Allâhumma innî a'ûdhu bika mina-l-khubuthi wa-l-khabâ'ith",
    translation:
      "Ô Allah, je cherche refuge auprès de Toi contre les démons mâles et femelles.",
    repetitions: 1,
    explanation:
      "Le Prophète ﷺ disait cette invocation lorsqu'il entrait aux toilettes. Dans le livre : al-khubuth = les démons mâles ; al-khabâ'ith = les démons femelles.",
    merits: "",
    reference: "Source : Muttafaq ʿalayh (al-Bukhari et Muslim) — chapitre 4 du livre",
    context: "Avant d'entrer aux toilettes",
    propheticEvidenceType: "A",
    collection: "Al-Bukhari et Muslim",
    validationStatus: "needs_review",
  },
  {
    id: "livre-05",
    category: "livre",
    title: "En sortant des toilettes",
    titleAr: "الْخُرُوجُ مِنَ الْخَلَاءِ",
    arabic: "غُفْرَانَكَ",
    phonetic: "Ghufrânaka",
    translation: "(Ô Allah,) je te demande Ton pardon.",
    repetitions: 1,
    explanation:
      "Le Prophète ﷺ disait « Ghufrânaka » en sortant des toilettes. Dans le livre : c'est-à-dire « Allâhumma ighfir lî » (Ô Allah, pardonne-moi).",
    merits: "",
    reference: "Source : rapporté par Ahmad — chapitre 5 du livre",
    context: "En sortant des toilettes",
    propheticEvidenceType: "A",
    collection: "Ahmad",
    validationStatus: "needs_review",
  },
  {
    id: "livre-06",
    category: "livre",
    title: "Après les ablutions",
    titleAr: "إِذَا فَرَغَ مِنَ الْوُضُوءِ",
    arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ، وَأَنَّ مُحَمَّداً عَبْدُ اللَّهِ وَرَسُولُهُ",
    phonetic: "Ash-hadu an lâ ilâha illa-llâh, wa anna Muhammadan 'abdu-llâhi wa rasûluh",
    translation:
      "Je témoigne qu'il n'y a de divinité digne d'adoration qu'Allah, et que Muhammad est Son serviteur et Son messager.",
    repetitions: 1,
    explanation:
      "Le Prophète ﷺ a dit : « Il n'est personne parmi vous qui fasse ses ablutions, en les parachevant, puis dise : ‹ Je témoigne… ›, sans que lui soient ouvertes les huit portes du Paradis : il entrera par celle qu'il veut. »",
    merits: "",
    reference: "Source : rapporté par Muslim — chapitre 6 du livre",
    context: "Une fois les ablutions terminées",
    propheticEvidenceType: "B",
    collection: "Muslim",
    validationStatus: "needs_review",
  },
];
