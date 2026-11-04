/**
 * Douas et hadiths authentiques proposés sur l'accueil (« Doua du moment »).
 *
 * Choix éditorial : uniquement des invocations qui NE figurent PAS déjà dans
 * les adhkār du matin / du soir de l'application, tirées du Coran, des deux Sahīh
 * (Al-Bukhārī, Muslim) ou des Sunan dont le degré « sahīh » est indiqué. Chaque entrée porte sa source et une courte explication
 * (quand la dire / ce qu'elle signifie). Aucune formule n'est reconstruite.
 */

export interface DuaMoment {
  id: string;
  kind: "dua" | "hadith";
  arabic: string;
  french: string;
  /** Références (collection + numéro, degré si hors Sahīh). */
  source: string;
  /** Quand la dire, ou ce que cela signifie. */
  note: string;
}

export const DUAS_DU_MOMENT: DuaMoment[] = [
  {
    id: "rabbana-atina",
    kind: "dua",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    french:
      "Notre Seigneur, accorde-nous une belle part ici-bas, une belle part dans l'au-delà, et protège-nous du châtiment du Feu.",
    source: "Coran 2:201 · Al-Bukhārī 6389 · Muslim 2690",
    note: "C'était l'invocation que le Prophète ﷺ répétait le plus (selon Anas). Elle réunit le bien de ce monde et celui de l'au-delà ; on peut la dire à tout moment.",
  },
  {
    id: "huda-tuqa",
    kind: "dua",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
    french:
      "Ô Allah, je Te demande la bonne direction, la piété, la chasteté et l'indépendance (de ne dépendre que de Toi).",
    source: "Muslim 2721",
    note: "Invocation du Prophète ﷺ. Elle demande l'essentiel : guidance, piété, pureté et suffisance. À dire à tout moment.",
  },
  {
    id: "sharh-sadr",
    kind: "dua",
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    french: "Seigneur, ouvre-moi la poitrine et facilite-moi ma tâche.",
    source: "Coran 20:25-26",
    note: "Invocation de Mūsā (ﷺ) avant d'affronter Pharaon. Utile avant une tâche difficile, un examen ou une prise de parole.",
  },
  {
    id: "zidni-ilma",
    kind: "dua",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    french: "Seigneur, augmente mon savoir.",
    source: "Coran 20:114",
    note: "Allah l'ordonne à Son Prophète ﷺ. À dire avant d'étudier, d'apprendre ou de lire le Coran.",
  },
  {
    id: "musarrif",
    kind: "dua",
    arabic: "اللَّهُمَّ مُصَرِّفَ الْقُلُوبِ صَرِّفْ قُلُوبَنَا عَلَى طَاعَتِكَ",
    french: "Ô Allah, Toi qui diriges les cœurs, oriente nos cœurs vers Ton obéissance.",
    source: "Muslim 2654",
    note: "Invocation du Prophète ﷺ : le cœur est entre les doigts du Miséricordieux. À dire à tout moment.",
  },
  {
    id: "aslih-li-dini",
    kind: "dua",
    arabic:
      "اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ",
    french:
      "Ô Allah, améliore ma religion, qui est la sauvegarde de toute mon affaire ; améliore ma vie ici-bas, où est ma subsistance ; améliore mon au-delà, où est mon retour ; fais de la vie un surcroît de bien pour moi et de la mort un repos loin de tout mal.",
    source: "Muslim 2720",
    note: "Invocation complète du Prophète ﷺ pour le bien de la religion, de ce monde et de l'au-delà. À dire à tout moment.",
  },
  {
    id: "niyyat",
    kind: "hadith",
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    french:
      "Les actes ne valent que par les intentions, et chacun n'obtient que ce qu'il a eu l'intention de faire.",
    source: "Al-Bukhārī 1 · Muslim 1907",
    note: "Hadith fondamental. Bon réflexe au début de la journée : renouveler son intention pour Allah avant ses actes, y compris ses lectures et ses adhkār.",
  },
  {
    id: "kalimatan",
    kind: "hadith",
    arabic:
      "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    french:
      "Deux paroles légères sur la langue, lourdes dans la balance, aimées du Miséricordieux : « Gloire et louange à Allah, gloire à Allah le Magnifique ».",
    source: "Al-Bukhārī 6406 · Muslim 2694",
    note: "Un dhikr très simple à répéter dans la journée, en marchant ou en attendant : très léger à dire, très lourd en récompense.",
  },
  {
    id: "adwamuha",
    kind: "hadith",
    arabic: "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
    french: "Les actes les plus aimés d'Allah sont les plus réguliers, même s'ils sont peu nombreux.",
    source: "Al-Bukhārī 6464 · Muslim 783",
    note: "Encouragement à la régularité : mieux vaut peu, chaque jour, que beaucoup rarement (Wird, adhkār, prières).",
  },
  {
    id: "khayrukum",
    kind: "hadith",
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    french: "Les meilleurs d'entre vous sont ceux qui apprennent le Coran et l'enseignent.",
    source: "Al-Bukhārī 5027",
    note: "Un rappel du mérite d'apprendre le Coran et de le transmettre, même un seul verset.",
  },
  {
    id: "yuhibbu-li-akhihi",
    kind: "hadith",
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    french:
      "Aucun de vous ne croit vraiment tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Al-Bukhārī 13 · Muslim 45",
    note: "La foi complète passe par le bon comportement envers les autres : vouloir pour eux le bien qu'on veut pour soi.",
  },
  {
    id: "talab-ilm",
    kind: "hadith",
    arabic:
      "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    french:
      "Quiconque emprunte un chemin pour y chercher une science, Allah lui facilite grâce à cela un chemin vers le Paradis.",
    source: "Muslim 2699",
    note: "Mérite de la quête du savoir : y compris le tadabbur (méditation du Coran) et l'étude de sa religion.",
  },
  {
    id: "salat-ashr",
    kind: "hadith",
    arabic: "مَنْ صَلَّى عَلَيَّ وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْرًا",
    french: "Quiconque prie une fois sur moi, Allah priera dix fois sur lui.",
    source: "Muslim 408",
    note: "Mérite de la prière sur le Prophète ﷺ, que l'on multiplie surtout le vendredi.",
  },
  {
    id: "hawqala",
    kind: "dua",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    french: "Il n'y a de force ni de puissance qu'en Allah.",
    source: "Al-Bukhārī 4205 · Muslim 2704",
    note: "Le Prophète ﷺ l'a décrite comme un trésor du Paradis. À dire dans la difficulté ou quand une tâche dépasse nos forces.",
  },
  {
    id: "hasbunallah",
    kind: "dua",
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    french: "Allah nous suffit, et quel excellent garant !",
    source: "Coran 3:173 · Al-Bukhārī 4563",
    note: "Paroles d'Ibrāhīm (ﷺ) quand il fut jeté dans le feu, et des Compagnons face à la peur. À dire en cas de crainte ou d'épreuve.",
  },
  {
    id: "ihtimam",
    kind: "dua",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    french:
      "Ô Allah, je cherche refuge auprès de Toi contre le souci et la tristesse, l'impuissance et la paresse, l'avarice et la lâcheté, le poids des dettes et la domination des hommes.",
    source: "Al-Bukhārī 6369",
    note: "Invocation que le Prophète ﷺ faisait très souvent. À dire en cas d'inquiétude, de tristesse ou de dette.",
  },
  {
    id: "adhab-qabr",
    kind: "dua",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَمِنْ عَذَابِ جَهَنَّمَ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ",
    french:
      "Ô Allah, je cherche refuge auprès de Toi contre le châtiment de la tombe, contre le châtiment de l'Enfer, contre les épreuves de la vie et de la mort, et contre le mal de l'épreuve de l'Antéchrist (Al-Masīh ad-Dajjāl).",
    source: "Muslim 588",
    note: "Le Prophète ﷺ ordonnait de la dire à la fin du tachahhud, avant le salām de la prière.",
  },
  {
    id: "khayr-aw-yasmut",
    kind: "hadith",
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    french: "Que celui qui croit en Allah et au Jour dernier dise du bien ou qu'il se taise.",
    source: "Al-Bukhārī 6018 · Muslim 47",
    note: "Règle d'or de la parole : avant de parler, se demander si cela est un bien, sinon garder le silence.",
  },
  {
    id: "shadid-ghadab",
    kind: "hadith",
    arabic: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ",
    french: "Le fort n'est pas celui qui terrasse les autres, le fort est celui qui se maîtrise lorsqu'il est en colère.",
    source: "Al-Bukhārī 6114 · Muslim 2609",
    note: "La vraie force est la maîtrise de soi. À se rappeler au moment où la colère monte.",
  },
  {
    id: "nasiha",
    kind: "hadith",
    arabic: "الدِّينُ النَّصِيحَةُ",
    french: "La religion, c'est la sincérité (le bon conseil).",
    source: "Muslim 55",
    note: "Être sincère envers Allah, Son Livre, Son Messager ﷺ, les dirigeants des musulmans et les gens en général.",
  },
  {
    id: "qulub",
    kind: "hadith",
    arabic: "إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ",
    french: "Allah ne regarde ni vos apparences ni vos biens, mais Il regarde vos cœurs et vos actes.",
    source: "Muslim 2564",
    note: "Ce qui compte devant Allah, c'est la sincérité du cœur et la qualité des actes, pas l'apparence ni la richesse.",
  },
  {
    id: "amr-mu-min",
    kind: "hadith",
    arabic:
      "عَجَبًا لِأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، وَلَيْسَ ذَاكَ لِأَحَدٍ إِلَّا لِلْمُؤْمِنِ: إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ",
    french:
      "Comme l'affaire du croyant est étonnante : tout est un bien pour lui, et cela n'appartient qu'au croyant. S'il lui arrive une joie, il remercie, et c'est un bien pour lui ; s'il lui arrive un malheur, il patiente, et c'est un bien pour lui.",
    source: "Muslim 2999",
    note: "Dans la joie comme dans l'épreuve, le croyant gagne : par la gratitude ou par la patience.",
  },
  {
    id: "afuww",
    kind: "dua",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    french: "Ô Allah, Tu es Pardonneur et Tu aimes le pardon : pardonne-moi.",
    source: "At-Tirmidhī 3513 (sahīh) · Ibn Māja 3850",
    note: "ʿĀʾisha demanda quoi dire si elle rencontrait la nuit du Destin : le Prophète ﷺ lui enseigna cette invocation. Surtout dans les dernières nuits du Ramadan, mais permise en tout temps.",
  },
  {
    id: "yunus",
    kind: "dua",
    arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    french: "Il n'y a de divinité que Toi ! Gloire à Toi ! J'étais vraiment du nombre des injustes.",
    source: "Coran 21:87 · At-Tirmidhī 3505 (sahīh)",
    note: "Invocation de Yūnus (ﷺ) dans le ventre de la baleine. Le Prophète ﷺ a dit qu'aucun musulman ne l'invoque pour une affaire sans qu'Allah l'exauce. À dire dans l'épreuve.",
  },
  {
    id: "aini-ala-dhikrik",
    kind: "dua",
    arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    french: "Ô Allah, aide-moi à T'évoquer, à Te remercier et à bien T'adorer.",
    source: "Abū Dāwūd 1522 · An-Nasāʾī 1303 (sahīh)",
    note: "Le Prophète ﷺ la recommanda à Muʿādh : à dire à la fin de chaque prière.",
  },
  {
    id: "dua-ibada",
    kind: "hadith",
    arabic: "الدُّعَاءُ هُوَ الْعِبَادَةُ",
    french: "L'invocation, c'est l'adoration.",
    source: "Abū Dāwūd 1479 · At-Tirmidhī 2969 (sahīh)",
    note: "Invoquer Allah est en soi un acte d'adoration : ne pas hésiter à Lui demander, grand ou petit.",
  },
];

/** Une entrée par jour et par moment (jour / nuit), stable toute la journée. */
export function pickDuaOfTheMoment(now: Date, isDay: boolean): DuaMoment {
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000);
  const i = (dayOfYear * 2 + (isDay ? 0 : 1)) % DUAS_DU_MOMENT.length;
  return DUAS_DU_MOMENT[i];
}
