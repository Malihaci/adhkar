/**
 * Contenus d'étude pour la sourate Al-Baqara — DÉBUT PARTIEL (2:1-2:5,
 * 2:17-2:24).
 *
 * Transcrits directement des pages 2 et 4 de `sources/01.pdf` (Juz 1,
 * القرآن تدبر وعمل — مركز المنهاج), avec la même rigueur que le pilote
 * Al-Fatiha.
 *
 * IMPORTANT — portée réelle de ce fichier (voir aussi
 * scripts/processing-checkpoint.json et scripts/pdf-page-mapping.json,
 * cartographie vérifiée par échantillonnage visuel) :
 * Al-Baqara compte 286 ayat. Le corpus source (3 PDF uniques, pagination
 * continue du Mushaf 1-604) couvre RÉELLEMENT l'intégralité des 30 juz' —
 * ce n'est pas une limite de disponibilité de la source. Seule
 * l'EXTRACTION reste très partielle : SEULES les pages Mushaf 2 et 4
 * (2:1-2:5 et 2:17-2:24) ont été transcrites et traduites avec la
 * rigueur requise à ce jour. Les ~600 autres pages du Mushaf restent à
 * traiter — chacune nécessite une lecture visuelle individuelle (PDF
 * scannés, aucun texte extractible), non automatisable par OCR classique.
 * Ne jamais présenter Al-Baqara — ni aucune autre sourate au-delà
 * d'Al-Fatiha — comme "terminée" sur la seule base de ce fichier.
 *
 * Les items العمل بالآيات / التوجيهات de la page 2 ne citent aucune ayah
 * entre crochets ﴿﴾ dans la source : leur portée réelle est donc la PAGE
 * éditoriale (scopeType: "page"), jamais une ayah précise inventée par
 * déduction. Les items de la page 4 citent bien des ayat explicites.
 */

import type { EtudeContent } from "@/lib/etude-content";

const EDITORIAL_SOURCE = "القرآن تدبر وعمل";
const SOURCE_TITLE = "القرآن تدبر وعمل — مركز المنهاج للإشراف والتدريب التربوي";
const MUSHAF_PAGE = 2;

export const AL_BAQARA_CONTENT: EtudeContent[] = [
  // --- الوقفات التدبرية (Méditer) ---
  {
    id: "baqara-w1",
    category: "tadabbur",
    scopeType: "verse_range",
    verseRange: "2:1-2:2",
    contentOrigin: "source_quote",
    textAr:
      "إنما ذكرت هذه الحروف في أوائل بعض السور التي ذكرت فيها لبيان إعجاز القرآن، وأن الخلق عاجزون عن معارضته بمثله، هذا مع أنه مركب من هذه الحروف المقطعة التي يتخاطبون بها... ولهذا كل سورة افتتحت بهذه الحروف فلا بد أن يذكر فيها الانتصار للقرآن، وبيان إعجازه وعظمته، وهذا معلوم بالاستقراء.",
    translationFr:
      "Ces lettres détachées ne sont mentionnées qu'au début de certaines sourates pour souligner l'inimitabilité du Coran, et que les hommes sont incapables de produire un équivalent — alors même qu'il est composé de ces mêmes lettres avec lesquelles ils s'expriment... C'est pourquoi toute sourate qui s'ouvre par ces lettres évoque nécessairement la défense du Coran et l'exposition de son inimitabilité et de sa grandeur ; cela est établi par l'examen [des sourates concernées].",
    reflectionQuestionAr: "ما سبب ارتباط الحروف المقطعة بذكر عظمة القرآن وإعجازه؟",
    reflectionQuestionFr:
      "Quelle est la raison du lien entre les lettres détachées et la mention de la grandeur et de l'inimitabilité du Coran ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "ابن كثير",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "١/٣٦-٣٧",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w2",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:2",
    contentOrigin: "source_quote",
    textAr:
      "لم يقل: هدى للمصلحة الفلانية ولا للشيء الفلاني؛ لإرادة العموم، وأنه هدى لجميع مصالح الدارين.",
    translationFr:
      "Il n'a pas dit : « un guide pour telle utilité » ni « pour telle chose en particulier », en vue d'exprimer la généralité : il est un guide pour tous les intérêts des deux demeures [ce monde et l'au-delà].",
    reflectionQuestionAr: "كيف يستدل بهذه الآية على شمول هداية القرآن لمصالح الدارين؟",
    reflectionQuestionFr:
      "Comment cette ayah permet-elle de déduire que la guidance du Coran englobe les intérêts des deux demeures ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "السعدي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "٤٠",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w3",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:3",
    contentOrigin: "source_quote",
    textAr:
      "الإيمان بالغيب حظ القلب، وإقامة الصلاة حظ البدن، و(ومما رزقناهم ينفقون) حظ المال، وهذا ظاهر.",
    translationFr:
      "La foi en l'invisible est la part du cœur, l'accomplissement de la prière la part du corps, et « de ce que Nous leur avons attribué ils dépensent » la part des biens — cela est manifeste.",
    reflectionQuestionAr: "جمعت الآية بين ثلاثة من مواضع التقوى، فما هي؟",
    reflectionQuestionFr:
      "Cette ayah réunit trois domaines où se manifeste la piété ; quels sont-ils ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "القرطبي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "١/٢٧٤",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w4",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:3",
    contentOrigin: "source_quote",
    textAr:
      "لم يقل: يفعلون الصلاة، أو يأتون بالصلاة؛ لأنه لا يكفي فيها مجرد الإتيان بصورتها الظاهرة، فإقامة الصلاة: إقامتها ظاهراً بإتمام أركانها وواجباتها وشروطها، وإقامتها باطناً بإقامة روحها.",
    translationFr:
      "Il n'a pas dit « ils font la prière » ni « ils viennent à la prière », car la simple exécution de sa forme extérieure ne suffit pas : accomplir pleinement la prière, c'est l'accomplir extérieurement en respectant ses piliers, ses obligations et ses conditions, et l'accomplir intérieurement en en respectant l'esprit.",
    reflectionQuestionAr: "لماذا عُبِّر عن فعل الصلاة بالإقامة؟",
    reflectionQuestionFr:
      "Pourquoi l'accomplissement de la prière est-il exprimé par le verbe « établir pleinement » (aqâma) plutôt que « faire » ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "السعدي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "٤١",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w5",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:3",
    contentOrigin: "source_quote",
    textAr:
      "وأتى بـ(من) الدالة على التبعيض؛ لينبههم أنه لم يرد منهم إلا جزءاً يسيراً من أموالهم غير ضار لهم.",
    translationFr:
      "Il a employé la particule « min » (partitive) pour leur faire comprendre qu'il ne leur est demandé qu'une petite part de leurs biens, qui ne leur cause aucun tort.",
    reflectionQuestionAr: "لماذا جيء بـ(من) الدالة على التبعيض؟",
    reflectionQuestionFr: "Pourquoi la particule partitive « min » a-t-elle été employée ici ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "السعدي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "٤١",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w6",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:3",
    contentOrigin: "source_quote",
    textAr:
      "وجه ترتب الإنفاق على الإيمان بالغيب أن الإنسان لا يطلع على جميع ما قُدِّر له من الرزق غيباً.",
    translationFr:
      "La dépense est liée à la foi en l'invisible parce que l'être humain ne connaît pas à l'avance toute la subsistance qui lui a été déterminée dans le décret invisible.",
    reflectionQuestionAr: "ما وجه ترتب الإنفاق على الإيمان بالغيب؟",
    reflectionQuestionFr:
      "Quel est le lien entre la dépense [dans le bien] et la foi en l'invisible ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "البقاعي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "١/٣٠",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w7",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:4",
    contentOrigin: "source_quote",
    textAr: "واليقين أعلى درجات العلم؛ وهو الذي لا يدخله شك بوجه.",
    translationFr:
      "La certitude est le plus haut degré de la connaissance : c'est celle qu'aucun doute ne peut atteindre, de quelque manière que ce soit.",
    reflectionQuestionAr: "كلما عظم العلم بالآخرة عظم العمل لها، وضح ذلك من الآية.",
    reflectionQuestionFr:
      "Plus la connaissance de l'au-delà grandit, plus l'œuvre pour elle grandit ; montre-le à partir de cette ayah.",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "ابن عطية",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "١/٨٦",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },

  // --- العمل بالآيات (Agir) — aucune ayah citée entre crochets dans la
  // source pour cette page : portée réelle = la page éditoriale entière.
  {
    id: "baqara-a1",
    category: "amal",
    scopeType: "page",
    pageNumber: MUSHAF_PAGE,
    contentOrigin: "source_quote",
    textAr:
      "مبنى التقوى على مخالفة شرع الله لهوى نفسك اختباراً لإيمانك، فحدد أمراً في حياتك ترى أنك تقدّم فيه هوى نفسك على شرع الله سبحانه وتراجع عنه مستغفراً ربك.",
    translationFr:
      "Le fondement de la piété (taqwâ) est de s'opposer au désir de son âme quand il contredit la loi d'Allah, à titre d'épreuve pour sa foi : détermine une situation de ta vie où tu vois que tu fais passer le désir de ton âme avant la loi d'Allah, et reviens-en en implorant le pardon de ton Seigneur.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-a2",
    category: "amal",
    scopeType: "page",
    pageNumber: MUSHAF_PAGE,
    contentOrigin: "source_quote",
    textAr: "حاسب نفسك في أمر الصلاة، وتفقد جوانب التقصير فيها، فأقمها على الوجه المطلوب شرعاً.",
    translationFr:
      "Examine-toi au sujet de la prière, et recherche les manques éventuels dans son accomplissement, afin de l'établir comme la Loi le demande.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-a3",
    category: "amal",
    scopeType: "page",
    pageNumber: MUSHAF_PAGE,
    contentOrigin: "source_quote",
    textAr:
      "اختبر إيمانك باليوم الآخر ويقينك بالإنفاق منه، فحدد ما أنت متيقن أن الله سيخلفه عليك في الدنيا والآخرة.",
    translationFr:
      "Éprouve ta foi au Jour dernier et ta certitude quant à la dépense qui en découle : détermine ce dont tu es certain qu'Allah te le rendra, dans cette vie et dans l'autre.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },

  // --- التوجيهات (S'orienter) — même remarque : portée = page entière.
  {
    id: "baqara-t1",
    category: "tawjihat",
    scopeType: "page",
    pageNumber: MUSHAF_PAGE,
    contentOrigin: "source_quote",
    textAr: "من أسباب حصول الهداية بالقرآن تقوى الله تعالى، فقدم دائماً مراد الله على هوى نفسك.",
    translationFr:
      "Parmi les causes d'obtenir la guidance par le Coran : la crainte pieuse d'Allah — fais donc toujours passer ce qu'Allah veut avant le désir de ton âme.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-t2",
    category: "tawjihat",
    scopeType: "page",
    pageNumber: MUSHAF_PAGE,
    contentOrigin: "source_quote",
    textAr: "سعادتك بالفلاح، والفلاح لا يناله إلا من اتصف بهذه الصفات.",
    translationFr:
      "Ton bonheur est dans la réussite (falâh), et la réussite n'est atteinte que par celui qui réunit ces qualités.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-t3",
    category: "tawjihat",
    scopeType: "page",
    pageNumber: MUSHAF_PAGE,
    contentOrigin: "source_quote",
    textAr:
      "من أهم صفات المؤمنين: ثباتهم على إيمانهم في حال الغيب وحال الشهادة، ومراقبتهم لله على كل الأحوال.",
    translationFr:
      "Parmi les qualités les plus importantes des croyants : leur constance dans la foi, qu'ils soient dans l'absence ou en présence [des autres], et leur vigilance envers Allah en toute situation.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },

  // ================================================================
  // Page 4 du PDF (Mushaf p.4, ayat 2:17-2:24)
  // ================================================================

  // --- الوقفات التدبرية (Méditer) ---
  {
    id: "baqara-w8",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:17",
    contentOrigin: "source_quote",
    textAr:
      "فإن قيل: ما وجه تشبيه المنافقين بصاحب النار التي أضاءت ثم أظلمت؟ فالجواب من ثلاثة أوجه: أحدها: أن منفعتهم في الدنيا بدعوى الإيمان شبيه بالنور، وعذابهم في الآخرة بالظلمة بعده، والثاني: أن استخفاء كفرهم بعده كالنور، وفضيحتهم كالظلمة، والثالث: أن ذلك فيمن آمن منهم ثم كفر، ويرجح هذا قوله: (ذلك بأنهم آمنوا ثم كفروا).",
    translationFr:
      "Si l'on demande : quelle est la raison de comparer les hypocrites à celui qui a allumé un feu, lequel s'est ensuite éteint ? La réponse se présente sous trois aspects : le premier, que leur profit en ce bas monde par la prétention de la foi ressemble à la lumière, et leur châtiment dans l'au-delà par les ténèbres qui suivent ; le deuxième, que la dissimulation de leur mécréance ressemble à la lumière, et leur exposition [au grand jour] aux ténèbres ; le troisième, que cela concerne ceux d'entre eux qui ont cru puis ont mécru — ce que confirme Sa parole : « cela, parce qu'ils ont cru puis ont mécru ».",
    reflectionQuestionAr: "ما وجه تشبيه المنافقين بصاحب النار التي أضاءت ثم أظلمت؟",
    reflectionQuestionFr:
      "Quelle est la raison de la comparaison entre les hypocrites et celui dont le feu a éclairé puis s'est éteint ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "ابن جزي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "١/٥٤",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w9",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:18",
    contentOrigin: "source_quote",
    textAr:
      "قال تعالى [عنهم]: (صم) أي: عن سماع الخير، (بكم) أي: عن النطق به، (عمي): عن رؤية الحق، فهم لا يرجعون؛ لأنهم تركوا الحق عن جهل وضلال، ولا خلاف من ترك الحق عن جهل وضلال، فقامت عليهم به الحجة، ولم ينتفعوا به لشقائهم.",
    translationFr:
      "Allah, exalté soit-Il, dit à leur sujet : « sourds » — c'est-à-dire à l'écoute du bien ; « muets » — c'est-à-dire incapables de l'exprimer ; « aveugles » — c'est-à-dire à la vision de la vérité ; ils ne reviennent donc pas [au droit chemin], car ils ont délaissé la vérité après l'avoir connue, par obstination, et non par ignorance égarée — la preuve est ainsi établie contre eux, et ils n'en tirent aucun profit, à cause de leur infortune.",
    reflectionQuestionAr: "لماذا وصف الله سبحانه وتعالى المنافقين بأنهم لا يرجعون؟",
    reflectionQuestionFr:
      "Pourquoi Allah décrit-Il les hypocrites comme ne revenant jamais [au droit chemin] ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "السعدي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "٤٤",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w10",
    category: "tadabbur",
    scopeType: "verse_range",
    verseRange: "2:19-2:20",
    contentOrigin: "source_quote",
    textAr:
      "إنما وصف الله تعالى نفسه بالقدرة على كل شيء في هذا الموضع؛ لأنه حذر المنافقين بأسه وسطوته، وأخبرهم أنه محيط بهم من كل جانب، وعلى إذهاب أسماعهم قدير.",
    translationFr:
      "Allah, exalté soit-Il, ne S'est décrit ici par la capacité sur toute chose que pour avertir les hypocrites de Sa rigueur et de Sa puissance, leur faisant savoir qu'Il les cerne de toute part, et qu'Il est capable de leur ôter l'ouïe.",
    reflectionQuestionAr: "ما وجه ختم الآية بوصفه سبحانه بالقدرة على كل شيء؟",
    reflectionQuestionFr:
      "Quelle est la raison de conclure ces ayat en décrivant Allah comme capable de toute chose ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "ابن كثير",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "١/٥٥",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w11",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:21",
    contentOrigin: "source_quote",
    textAr:
      "(اعبدوا ربكم): يدخل فيه الإيمان بالله سبحانه وتوحيده، والانقياد لأوامره واجتناب نواهيه.",
    translationFr:
      "« Adorez votre Seigneur » : cela englobe la foi en Allah et Son unicité, la soumission à Ses commandements et l'évitement de Ses interdits.",
    reflectionQuestionAr: "بيّن أنواع الناس المدعوين في الآية.",
    reflectionQuestionFr: "Précise les catégories de personnes visées par cet appel dans l'ayah.",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "ابن جزي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "١/٥٦",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w12",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:22",
    contentOrigin: "source_quote",
    textAr:
      "هذه الآية من المحكم الذي اتفقت عليه الشرائع واجتمعت عليه الكتب، وهو عمود الخشوع، وعليه مدار الذل والخضوع.",
    translationFr:
      "Cette ayah fait partie de ce qui est solidement établi, sur quoi toutes les lois révélées se sont accordées et tous les Livres se sont réunis : c'est le pilier de l'humilité, et c'est autour d'elle que gravitent la soumission et la modestie.",
    reflectionQuestionAr: "في هذه الآية ضابط لعبادة الله، فما هو؟",
    reflectionQuestionFr: "Cette ayah contient un critère de l'adoration d'Allah ; quel est-il ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "البقاعي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "١/٥٩",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w13",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:23",
    contentOrigin: "source_quote",
    textAr:
      "أي: ولن تفعلوا ذلك أبداً، وهذا إخبار قاطع جازم أنه معجزة، وهذا أيضاً معجزة أخرى وهي أن هذا القرآن لا يعارض بمثله إلى زماننا هذا، ولا يمكن، وكذلك وقع الأمر، فلم يعارض من لدنه إلى زماننا هذا، ولا يمكن أن يتأتى ذلك لأحد.",
    translationFr:
      "C'est-à-dire : et vous ne le ferez jamais — c'est là une affirmation catégorique et tranchée que ceci est un miracle. C'est également un autre miracle : ce Coran n'a jamais été égalé jusqu'à notre époque, et cela reste impossible ; et c'est effectivement ce qui s'est produit — il n'a été égalé depuis sa révélation jusqu'à notre époque, et nul ne peut y parvenir.",
    reflectionQuestionAr: "هذه الآية تدل على معجزة ظاهرة للقرآن الكريم، وضّحها.",
    reflectionQuestionFr: "Cette ayah indique un miracle manifeste du Noble Coran ; explique-le.",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "ابن كثير",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "١/٥٨",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w14",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:24",
    contentOrigin: "source_quote",
    textAr:
      "وبدأ سبحانه بالناس؛ لأنهم الذين يدركون الآلام، أو لكونهم أكثر إيقادا من الجماد؛ لما فيهم من الجلود واللحوم والشحوم، ولأن ذلك في زيادة التخويف.",
    translationFr:
      "Allah, exalté soit-Il, a commencé par mentionner les hommes, car ce sont eux qui perçoivent la douleur, ou parce qu'ils sont plus combustibles que les corps inertes en raison de leurs peaux, chairs et graisses, et cela accroît l'effet d'avertissement.",
    reflectionQuestionAr: "لماذا قدم الناس على الحجارة في إيقاد النار؟",
    reflectionQuestionFr:
      "Pourquoi les hommes sont-ils mentionnés avant les pierres parmi le combustible du Feu ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "الألوسي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "١/١٩٩",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },

  // --- العمل بالآيات (Agir) — chaque item cite explicitement une ayah.
  {
    id: "baqara-a4",
    category: "amal",
    scopeType: "verse",
    verseKey: "2:17",
    contentOrigin: "source_quote",
    textAr:
      "اقرأ اليوم مثلاً واحداً من أمثلة القرآن، واجتهد في فهمه، ﴿مَثَلُهُمْ كَمَثَلِ الَّذِي اسْتَوْقَدَ نَارًا فَلَمَّا أَضَاءَتْ مَا حَوْلَهُ ذَهَبَ اللَّهُ بِنُورِهِمْ وَتَرَكَهُمْ فِي ظُلُمَاتٍ لَّا يُبْصِرُونَ﴾.",
    translationFr: "Lis aujourd'hui l'une des paraboles du Coran, et efforce-toi de la comprendre.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "cf. 2:17",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-a5",
    category: "amal",
    scopeType: "verse",
    verseKey: "2:17",
    contentOrigin: "source_quote",
    textAr:
      "نور القلب بيد الله سبحانه، فادعُ الله بقولك: «اللهم اجعل في قلبي نوراً، وفي سمعي نوراً، وفي بصري نوراً»، ﴿ذَهَبَ اللَّهُ بِنُورِهِمْ وَتَرَكَهُمْ فِي ظُلُمَاتٍ لَّا يُبْصِرُونَ﴾.",
    translationFr:
      "La lumière du cœur est entre les mains d'Allah : invoque-Le en disant : « Ô Allah, mets de la lumière dans mon cœur, de la lumière dans mon ouïe, et de la lumière dans ma vue ».",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "cf. 2:17",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-a6",
    category: "amal",
    scopeType: "verse",
    verseKey: "2:24",
    contentOrigin: "source_quote",
    textAr:
      "تأمل هذه الآية، ثم استخرج منها فائدة وأرسلها في رسالة، ﴿فَاتَّقُوا النَّارَ الَّتِي وَقُودُهَا النَّاسُ وَالْحِجَارَةُ﴾.",
    translationFr:
      "Médite cette ayah, puis dégages-en un bienfait et transmets-le dans un message.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "cf. 2:24",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },

  // --- التوجيهات (S'orienter) — chaque item cite explicitement une ayah.
  {
    id: "baqara-t4",
    category: "tawjihat",
    scopeType: "verse",
    verseKey: "2:21",
    contentOrigin: "source_quote",
    textAr:
      "عبادة الله سبحانه وتعالى هي الغاية من وجودك، ﴿يَا أَيُّهَا النَّاسُ اعْبُدُوا رَبَّكُمُ﴾.",
    translationFr: "L'adoration d'Allah, exalté soit-Il, est la finalité de ton existence.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "cf. 2:21",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-t5",
    category: "tawjihat",
    scopeType: "verse",
    verseKey: "2:22",
    contentOrigin: "source_quote",
    textAr:
      "التأمل في مخلوقات الله سبحانه سبب لزيادة اليقين والإيمان في قلب العبد، ﴿الَّذِي جَعَلَ لَكُمُ الْأَرْضَ فِرَاشًا وَالسَّمَاءَ بِنَاءً وَأَنزَلَ مِنَ السَّمَاءِ مَاءً فَأَخْرَجَ بِهِ مِنَ الثَّمَرَاتِ رِزْقًا لَّكُمْ﴾.",
    translationFr:
      "Méditer sur les créatures d'Allah est une cause d'accroissement de la certitude et de la foi dans le cœur du serviteur.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "cf. 2:22",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-t6",
    category: "tawjihat",
    scopeType: "verse",
    verseKey: "2:22",
    contentOrigin: "source_quote",
    textAr:
      "من الخلل العقلي والشرعي أن يكرمك الكريم ثم تشرك معه غيره، ﴿فَلَا تَجْعَلُوا لِلَّهِ أَندَادًا وَأَنتُمْ تَعْلَمُونَ﴾.",
    translationFr:
      "C'est une défaillance tant rationnelle que légale que Celui qui te comble de bienfaits soit associé à un autre que Lui.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "cf. 2:22",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
];
