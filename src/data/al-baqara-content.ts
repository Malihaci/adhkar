/**
 * Contenus d'étude pour la sourate Al-Baqara — EXTRACTION PARTIELLE
 * (Mushaf pages 2, 4, 6, 12 : 2:1-2:5, 2:17-2:24, 2:30-2:37, 2:77-2:83).
 *
 * Transcrits directement de `sources/1-10.pdf` (Juz 1, القرآن تدبر وعمل —
 * مركز المنهاج), pages 2/4 depuis `sources/01.pdf` (doublon confirmé des
 * mêmes pages, voir scripts/pdf-page-mapping.json), pages 6/12 lues à la
 * page PDF réelle via la cartographie vérifiée (mushafPage = pdfPage - 9
 * sur 1-10.pdf, ex. mushafPage 12 = pdfPage 21).
 *
 * IMPORTANT — portée réelle de ce fichier (voir aussi
 * scripts/processing-checkpoint.json et scripts/pdf-page-mapping.json,
 * cartographie vérifiée par échantillonnage visuel) :
 * Al-Baqara compte 286 ayat. Le corpus source (3 PDF uniques, pagination
 * continue du Mushaf 1-604) couvre RÉELLEMENT l'intégralité des 30 juz' —
 * ce n'est pas une limite de disponibilité de la source. Seule
 * l'EXTRACTION reste partielle : SEULES les pages Mushaf 2, 4, 6 et 12
 * ont été transcrites et traduites avec la rigueur requise à ce jour. Les
 * ~600 autres pages du Mushaf restent à traiter — chacune nécessite une
 * lecture visuelle individuelle (PDF scannés, aucun texte extractible),
 * non automatisable par OCR classique. Ne jamais présenter Al-Baqara — ni
 * aucune autre sourate au-delà d'Al-Fatiha — comme "terminée" sur la
 * seule base de ce fichier.
 *
 * Les items العمل بالآيات / التوجيهات de la page 2 ne citent aucune ayah
 * entre crochets ﴿﴾ dans la source : leur portée réelle est donc la PAGE
 * éditoriale (scopeType: "page"), jamais une ayah précise inventée par
 * déduction. Les items des pages 4, 6 et 12 citent des ayat explicites,
 * SAUF un العمل بالآيات de la page 6 (baqara-a9) qui cite littéralement
 * 7:23 (une invocation) au sein d'un item thématiquement rattaché à 2:37 —
 * conservé en scopeType "page" plutôt que rattaché de force à 2:37, pour
 * ne jamais forcer une portée que la source elle-même ne cite pas.
 */

import type { EtudeContent } from "@/lib/etude-content";

const EDITORIAL_SOURCE = "القرآن تدبر وعمل";
const SOURCE_TITLE = "القرآن تدبر وعمل — مركز المنهاج للإشراف والتدريب التربوي";
const MUSHAF_PAGE = 2;
const MUSHAF_PAGE_6 = 6;
const MUSHAF_PAGE_12 = 12;

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

  // --- ✨ Leçons à retenir / 🌍 Dans ma vie (page 2) — synthèses
  // pédagogiques fidèles condensées à partir des items ci-dessus.
  {
    id: "baqara-l1",
    category: "lesson",
    scopeType: "verse",
    verseKey: "2:3",
    contentOrigin: "pedagogical_synthesis",
    sourceIds: ["baqara-w3"],
    textAr:
      "الإيمان بالغيب حظ القلب، وإقامة الصلاة حظ البدن، و(ومما رزقناهم ينفقون) حظ المال، وهذا ظاهر.",
    translationFr:
      "On peut retenir que la piété véritable se vit dans trois dimensions concrètes : la foi intérieure (le cœur), la prière (le corps) et la dépense dans le bien (les biens).",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-today1",
    category: "today",
    scopeType: "page",
    pageNumber: MUSHAF_PAGE,
    contentOrigin: "pedagogical_synthesis",
    sourceIds: ["baqara-a1", "baqara-t1"],
    textAr:
      "مبنى التقوى على مخالفة شرع الله لهوى نفسك اختباراً لإيمانك، فحدد أمراً في حياتك ترى أنك تقدّم فيه هوى نفسك على شرع الله سبحانه وتراجع عنه مستغفراً ربك.",
    translationFr:
      "Dans ma vie : je peux identifier une situation concrète où je fais passer mon désir avant ce qu'Allah demande, y renoncer et Lui en demander pardon — selon les sources citées, c'est là le fondement de la piété.",
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

  // --- ✨ Leçons à retenir / 🌍 Dans ma vie (page 4) ---
  {
    id: "baqara-l2",
    category: "lesson",
    scopeType: "verse",
    verseKey: "2:22",
    contentOrigin: "pedagogical_synthesis",
    sourceIds: ["baqara-w12", "baqara-t5"],
    textAr:
      "هذه الآية من المحكم الذي اتفقت عليه الشرائع واجتمعت عليه الكتب، وهو عمود الخشوع، وعليه مدار الذل والخضوع.",
    translationFr:
      "On peut retenir que méditer sur la création d'Allah — la terre, le ciel, la pluie, les fruits — renforce la certitude et la foi dans le cœur, et rappelle que Lui seul mérite d'être adoré sans associé.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-today2",
    category: "today",
    scopeType: "verse",
    verseKey: "2:17",
    contentOrigin: "pedagogical_synthesis",
    sourceIds: ["baqara-a4", "baqara-a5"],
    textAr:
      "اقرأ اليوم مثلاً واحداً من أمثلة القرآن، واجتهد في فهمه... ونور القلب بيد الله سبحانه، فادعُ الله بقولك: «اللهم اجعل في قلبي نوراً، وفي سمعي نوراً، وفي بصري نوراً».",
    translationFr:
      "Dans ma vie : je peux lire aujourd'hui une parabole du Coran en cherchant à la comprendre, et demander à Allah, comme le suggèrent les sources citées, de mettre de la lumière dans mon cœur, mon ouïe et ma vue.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },

  // ================================================================
  // Page 6 du Mushaf (1-10.pdf, pdfPage 15 ; ayat 2:30-2:37)
  // ================================================================

  // --- الوقفات التدبرية (Méditer) ---
  {
    id: "baqara-w15",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:30",
    contentOrigin: "source_quote",
    textAr:
      "هذه الآية أصل في نصب إمام وخليفة يُسمع له ويُطاع؛ لتجتمع به الكلمة، وتنفذ به أحكام الخليفة، ولا خلاف في وجوب ذلك بين الأمة ولا بين الأئمة.",
    translationFr:
      "Cette ayah est le fondement de l'institution d'un imam/calife à qui l'on obéit, afin que la communauté soit unie autour de lui et que ses décisions soient appliquées ; il n'y a aucune divergence, ni parmi la communauté ni parmi les imams, sur l'obligation de cela.",
    reflectionQuestionAr: "بقاء الأمة بلا إمام ذنب يأثمون به لكثرة المفاسد، وضح ذلك من الآية.",
    reflectionQuestionFr:
      "L'absence d'imam pour la communauté est un péché en raison des maux qui en découlent ; explique cela à partir de l'ayah.",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "القرطبي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "٣٩٥/١",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w16",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:30",
    contentOrigin: "source_quote",
    textAr: "فهذان السببان اللذان ذكرتهما الملائكة هما اللذان كتب الله بهما على بني إسرائيل القتل.",
    translationFr:
      "Ces deux causes mentionnées par les anges sont celles pour lesquelles Allah a décrété le châtiment du meurtre chez les Enfants d'Israël.",
    reflectionQuestionAr: "ما السببان المؤديان إلى هلاك الأمم إذا انتشرا فيها؟",
    reflectionQuestionFr:
      "Quelles sont les deux causes qui mènent à la perte des nations lorsqu'elles s'y répandent ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "ابن تيمية",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "١٩٢/١",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w17",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:30",
    contentOrigin: "source_quote",
    textAr:
      "وقول الملائكة هذا ليس على وجه الاعتراض على الله، ولا على وجه الحسد لبني آدم... وإنما هو سؤال استعلام واستكشاف عن الحكمة في ذلك.",
    translationFr:
      "Cette parole des anges n'est ni une objection envers Allah, ni de la jalousie envers les fils d'Adam... ce n'est qu'une question pour s'informer et découvrir la sagesse [derrière ce décret].",
    reflectionQuestionAr: "لِمَ عاتب الله سبحانه إبليس على سؤاله، ولم يعاتب الملائكة على سؤالهم؟",
    reflectionQuestionFr:
      "Pourquoi Allah a-t-Il blâmé Iblis pour sa question, sans blâmer les anges pour la leur ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "ابن كثير",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "٦٧/١",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w18",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:30",
    contentOrigin: "source_quote",
    textAr:
      "(أتجعل فيها من يفسد فيها) بالمعاصي، (ويسفك الدماء) وهذا تخصيص بعد تعميم؛ لبيان شدة مفسدة القتل.",
    translationFr:
      "« Y placeras-Tu quelqu'un qui y sèmera la corruption » par les péchés, « et y versera le sang » — une mention particulière après une mention générale, pour souligner la gravité du méfait du meurtre.",
    reflectionQuestionAr: "لماذا خُصَّ سفك الدماء بالذكر مع أنه داخل في الإفساد؟",
    reflectionQuestionFr:
      "Pourquoi le fait de verser le sang est-il mentionné à part, alors qu'il fait déjà partie de la corruption ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "السعدي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "٤٨",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w19",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:32",
    contentOrigin: "source_quote",
    textAr:
      "الواجب على من سُئل عن علم إن لم يعلم أن يقول: الله أعلم، ولا أدري؛ اقتداء بالملائكة والأنبياء والفضلاء من العلماء، لكن أخبر الصادق أن بموت العلماء يُقبض العلم، فيبقى ناس جهال يُستفتَون؛ فيُفتون برأيهم؛ فيَضلون ويُضلون.",
    translationFr:
      "Celui à qui l'on pose une question sur un savoir qu'il ne possède pas doit dire : « Allah sait mieux » ou « je ne sais pas », à l'exemple des anges, des prophètes et des savants vertueux ; mais le Véridique a annoncé qu'à la mort des savants le savoir se retire, si bien que des ignorants, consultés, répondent selon leur propre avis : ils s'égarent et égarent autrui.",
    reflectionQuestionAr: "ماذا نفيد من قول الملائكة: (سبحانك لا علم لنا إلا ما علمتنا)؟",
    reflectionQuestionFr:
      "Que retenir de la parole des anges : « Gloire à Toi ! Nous n'avons de savoir que ce que Tu nous as enseigné » ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "القرطبي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "٤٢٥/١",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w20",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:35",
    contentOrigin: "source_quote",
    textAr:
      "النهي عن القرب يقتضي النهي عن الأكل بطريق الأولى؛ وإنما نهى عن القرب سدا للذريعة، فهذا أصل في سد الذرائع.",
    translationFr:
      "L'interdiction de s'approcher implique, à plus forte raison, l'interdiction d'en manger ; s'Il a interdit de s'en approcher, c'est pour fermer la voie [au péché] — c'est là un fondement du principe consistant à barrer les moyens menant à l'interdit.",
    reflectionQuestionAr: "ما الطريقة المثالية في الحذر من المعاصي؟",
    reflectionQuestionFr: "Quelle est la méthode idéale pour se prémunir des péchés ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "ابن جزي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "٦٢/١",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w21",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:37",
    contentOrigin: "source_quote",
    textAr:
      "سبقت رحمته غضبه؛ فيرحم عبده في عين غضبه، كما جعل هبوط آدم سبب ارتفاعه، ويعده سبب قربه، فسبحانه من تواب على من أكرمه، ومن رحيم ما أعظمه.",
    translationFr:
      "Sa miséricorde précède Sa colère : Il fait miséricorde à Son serviteur au cœur même de Sa colère, tout comme Il a fait de la descente d'Adam une cause de son élévation, et Il lui promet qu'elle sera une cause de son rapprochement — gloire à Lui, quel Accueillant au repentir envers celui qu'Il honore, et quel Miséricordieux Il est !",
    reflectionQuestionAr: "بعد قصة آدم -عليه السلام- لا نيأس من رحمة الله سبحانه، وضح ذلك.",
    reflectionQuestionFr:
      "Après le récit d'Adam (sur lui la paix), nous ne désespérons pas de la miséricorde d'Allah ; explique cela.",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "الألوسي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "٢٣٨/١",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },

  // --- العمل بالآيات (Agir) ---
  {
    id: "baqara-a7",
    category: "amal",
    scopeType: "verse",
    verseKey: "2:31",
    contentOrigin: "source_quote",
    textAr:
      "ضع لنفسك جدولا تتعلم فيه أهم المسائل التي تحتاجها، ﴿وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا﴾.",
    translationFr:
      "Établis-toi un programme pour apprendre les questions [de savoir religieux] les plus importantes dont tu as besoin.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "cf. 2:31",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-a8",
    category: "amal",
    scopeType: "verse",
    verseKey: "2:35",
    contentOrigin: "source_quote",
    textAr:
      "اقرأ قصة آدم عليه الصلاة والسلام من كتب التفسير وقصص الأنبياء، ثم استخرج ثلاث فوائد تهمك في حياتك، ﴿وَلَا تَقْرَبَا هَذِهِ الشَّجَرَةَ فَتَكُونَا مِنَ الظَّالِمِينَ﴾.",
    translationFr:
      "Lis le récit d'Adam (sur lui la paix) dans les livres de tafsir et les récits des prophètes, puis dégages-en trois enseignements utiles pour ta vie.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "cf. 2:35",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-a9",
    category: "amal",
    // La source cite littéralement 7:23 (une invocation) au sein d'un item
    // thématiquement rattaché au repentir d'Adam (2:37) — jamais rattaché de
    // force à 2:37, portée réelle = la page éditoriale.
    scopeType: "page",
    pageNumber: MUSHAF_PAGE_6,
    contentOrigin: "source_quote",
    textAr:
      "تذكر ما وقع منك أو من أسرتك من ذنب، ثم قل: ﴿رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ﴾.",
    translationFr:
      "Souviens-toi d'un péché commis par toi ou par ta famille, puis dis : « Notre Seigneur, nous nous sommes fait du tort à nous-mêmes ; si Tu ne nous pardonnes pas et ne nous fais pas miséricorde, nous serons certainement du nombre des perdants. »",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "invocation citée : 7:23 (thème du repentir d'Adam, 2:37)",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },

  // --- التوجيهات (S'orienter) ---
  {
    id: "baqara-t7",
    category: "tawjihat",
    scopeType: "verse",
    verseKey: "2:34",
    contentOrigin: "source_quote",
    textAr:
      "اعرف قدر أهل العلم، وتأدب معهم، فقد أمر الله تعالى الملائكة بالسجود لآدم بسبب علمه، ﴿وَإِذْ قُلْنَا لِلْمَلَائِكَةِ اسْجُدُوا لِآدَمَ فَسَجَدُوا﴾.",
    translationFr:
      "Reconnais la valeur des gens de savoir et sois poli avec eux : Allah a ordonné aux anges de se prosterner devant Adam en raison de son savoir.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "cf. 2:34",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-t8",
    category: "tawjihat",
    scopeType: "verse",
    verseKey: "2:30",
    contentOrigin: "source_quote",
    textAr:
      "التسبيح من صفات الملائكة؛ فتشبَّه بهم، ﴿وَنَحْنُ نُسَبِّحُ بِحَمْدِكَ وَنُقَدِّسُ لَكَ﴾.",
    translationFr:
      "La glorification d'Allah est l'une des qualités des anges ; efforce-toi de leur ressembler.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "cf. 2:30",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-t9",
    category: "tawjihat",
    scopeType: "verse",
    verseKey: "2:32",
    contentOrigin: "source_quote",
    textAr:
      "تواضع لله تعالى مهما بلغت من درجات العلم، واطلب منه سبحانه الزيادة، ﴿قَالُوا سُبْحَانَكَ لَا عِلْمَ لَنَا إِلَّا مَا عَلَّمْتَنَا إِنَّكَ أَنْتَ الْعَلِيمُ الْحَكِيمُ﴾.",
    translationFr:
      "Sois humble envers Allah, quel que soit ton niveau de savoir, et demande-Lui, exalté soit-Il, de l'accroître.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "cf. 2:32",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },

  // ================================================================
  // Page 12 du Mushaf (1-10.pdf, pdfPage 21 ; ayat 2:77-2:83)
  // ================================================================

  // --- الوقفات التدبرية (Méditer) ---
  {
    id: "baqara-w22",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:78",
    contentOrigin: "source_quote",
    textAr: "(إلا أماني): تلاوة بغير فهم.",
    translationFr: "« Sauf des chimères » : c'est-à-dire une simple récitation sans compréhension.",
    reflectionQuestionAr: "كيف تفهم من هذه الآية الذم لمن يقرأ القرآن بغير فهم؟",
    reflectionQuestionFr:
      "Comment comprends-tu, à partir de cette ayah, le blâme adressé à celui qui lit le Coran sans le comprendre ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "ابن جزي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "٧٢/١",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w23",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:78",
    contentOrigin: "source_quote",
    textAr:
      "هذه صفة من لا يفقه كلام الله، ويعمل به، وإنما يقتصر على مجرد تلاوته، كما قال الحسن البصري: نزل القرآن ليعمل به؛ فاتخذوا تلاوته عملا.",
    translationFr:
      "Ceci décrit celui qui ne comprend pas la parole d'Allah et ne la met pas en pratique, se limitant à sa simple récitation ; comme l'a dit Al-Hasan al-Basri : « Le Coran a été révélé pour qu'on le mette en pratique, et l'on a fait de sa récitation une pratique [suffisante en soi] ».",
    reflectionQuestionAr: "ترك تدبر القرآن الكريم والعمل به مذموم في القرآن الكريم؛ بيّن ذلك.",
    reflectionQuestionFr:
      "Délaisser la méditation du noble Coran et sa mise en pratique est blâmé dans le Coran lui-même ; montre-le.",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "ابن تيمية",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "٢٤٧/١",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w24",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:79",
    contentOrigin: "source_quote",
    textAr:
      "وإنما فعلوا ذلك مع علمهم (ليشتروا به ثمنا قليلا)، والدنيا كلها من أولها إلى آخرها ثمن قليل، فجعلوا لباطلهم شركا يصطادون به ما في أيدي الناس، فظلموهم من وجهين: من جهة تلبيس دينهم عليهم، ومن جهة أخذ أموالهم بغير حق، بل بأبطل الباطل، وذلك أعظم ممن يأخذها غصبا وسرقة ونحوهما.",
    translationFr:
      "Ils ont agi ainsi tout en sachant que c'était « pour en tirer un vil prix » — alors que ce bas monde tout entier, du début à la fin, n'est qu'un vil prix ; ils ont fait de leur fausseté un piège pour s'emparer des biens des gens, leur faisant ainsi du tort de deux façons : en dénaturant leur religion, et en prenant leurs biens indûment, de la pire manière, plus grave encore que celui qui les prend par la spoliation ou le vol.",
    reflectionQuestionAr: "من حرف نص الكتاب أو معناه فهو ظالم من جهتين؛ بيّنهما.",
    reflectionQuestionFr:
      "Quiconque falsifie le texte du Livre ou son sens commet une injustice sous deux aspects ; précise-les.",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "السعدي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "٥٦",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w25",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:83",
    contentOrigin: "source_quote",
    textAr:
      "وقرن الله عز وجل في هذه الآية حق الوالدين بالتوحيد؛ لأن النشأة الأولى من عند الله، والنشء الثاني -وهو التربية- من جهة الوالدين، ولهذا قرن تعالى بشكره لهما شكره.",
    translationFr:
      "Allah, exalté soit-Il, a associé dans cette ayah le droit des parents à l'unicité divine, car la première formation [de l'être] vient d'Allah, tandis que la seconde — l'éducation — vient des parents ; c'est pourquoi Il a associé la reconnaissance envers eux à Sa propre reconnaissance.",
    reflectionQuestionAr: "لماذا قرن الله سبحانه بين حقه وحق الوالدين؟",
    reflectionQuestionFr:
      "Pourquoi Allah, exalté soit-Il, a-t-Il associé Son droit à celui des parents ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "القرطبي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "٢٢٩/٢",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w26",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:83",
    contentOrigin: "source_quote",
    textAr:
      "وناسب أن يقولوا للناس حسنا بعد ما أمرهم بالإحسان إليهم؛ فجمع بين طريق الإحسان الفعلي والقولي.",
    translationFr:
      "Il convenait de leur ordonner de dire de bonnes paroles aux gens après leur avoir ordonné de bien agir envers eux : Il a ainsi réuni la voie de la bienfaisance en actes et en paroles.",
    reflectionQuestionAr: "لماذا ذكر القول الحسن بعد ذكر الإحسان؟",
    reflectionQuestionFr:
      "Pourquoi la bonne parole est-elle mentionnée après la bienfaisance [en actes] ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "ابن كثير",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "١١٥/١",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w27",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:83",
    contentOrigin: "source_quote",
    textAr:
      "وجعل الإحسان لسائر الناس بالقول؛ لأنه القدر الذي يمكن معاملة جميع الناس به، وذلك أن أصل القول أن يكون عن حسن اعتقاد، فهم إذا قالوا للناس حسنا فقد أضمروا لهم خيرا.",
    translationFr:
      "Il a fait de la bonne parole la forme de bienfaisance envers tous les gens, car c'est la mesure par laquelle on peut traiter tout le monde ; en effet, la bonne parole procède d'ordinaire d'une bonne intention, de sorte que dire de bonnes paroles aux gens révèle qu'on leur veut du bien.",
    reflectionQuestionAr: "لماذا جعل الله تعالى الإحسان لسائر الناس بالقول؟",
    reflectionQuestionFr:
      "Pourquoi Allah a-t-Il fait de la parole la forme de bienfaisance envers l'ensemble des gens ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "ابن عاشور",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "٥٨٣/١",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-w28",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "2:83",
    contentOrigin: "source_quote",
    textAr: "هو اللين في القول، والمعاشرة بحسن الخلق.",
    translationFr:
      "C'est la douceur dans la parole, et le fait de fréquenter [les gens] avec un bon caractère.",
    reflectionQuestionAr: "بيّن فضل الإحسان في القول ومكانته في الدين.",
    reflectionQuestionFr:
      "Explique le mérite de la bienfaisance dans la parole et sa place dans la religion.",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "البغوي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "٧٢/١",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },

  // --- العمل بالآيات (Agir) ---
  {
    id: "baqara-a10",
    category: "amal",
    scopeType: "verse",
    verseKey: "2:77",
    contentOrigin: "source_quote",
    textAr:
      "أرسل رسالة عن أهمية إصلاح السريرة من خلال هذه الآية الكريمة، ﴿أَوَلَا يَعْلَمُونَ أَنَّ اللَّهَ يَعْلَمُ مَا يُسِرُّونَ وَمَا يُعْلِنُونَ﴾.",
    translationFr:
      "Envoie un message sur l'importance de rectifier son for intérieur, en t'appuyant sur cette noble ayah.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "cf. 2:77",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-a11",
    category: "amal",
    scopeType: "verse",
    verseKey: "2:78",
    contentOrigin: "source_quote",
    textAr:
      "ابدأ اليوم ببرنامج لفهم آيات القرآن من خلال قراءة أحد التفاسير الميسرة؛ لتكون ممن فهم كلام الله تعالى، ﴿وَمِنْهُمْ أُمِّيُّونَ لَا يَعْلَمُونَ الْكِتَابَ إِلَّا أَمَانِيَّ وَإِنْ هُمْ إِلَّا يَظُنُّونَ﴾.",
    translationFr:
      "Commence aujourd'hui un programme pour comprendre les versets du Coran en lisant l'un des tafsirs accessibles, afin d'être de ceux qui comprennent la parole d'Allah.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "cf. 2:78",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-a12",
    category: "amal",
    scopeType: "verse",
    verseKey: "2:83",
    contentOrigin: "source_quote",
    textAr:
      "اختر إحدى هذه العبادات، ونفذها اليوم حتى تكون عاملا بالقرآن، وانظر كيف تجد قلبك بعد ذلك، ﴿لَا تَعْبُدُونَ إِلَّا اللَّهَ وَبِالْوَالِدَيْنِ إِحْسَانًا وَذِي الْقُرْبَى وَالْيَتَامَى وَالْمَسَاكِينِ﴾.",
    translationFr:
      "Choisis l'un de ces actes d'adoration et accomplis-le aujourd'hui pour mettre le Coran en pratique, puis observe l'état de ton cœur ensuite.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "cf. 2:83",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },

  // --- التوجيهات (S'orienter) ---
  {
    id: "baqara-t10",
    category: "tawjihat",
    scopeType: "verse",
    verseKey: "2:77",
    contentOrigin: "source_quote",
    textAr:
      "تذكر أن الله يعلم ما تسر وما تعلن؛ فلا يرينك في سرك وعلانيتك إلا على خير، ﴿أَوَلَا يَعْلَمُونَ أَنَّ اللَّهَ يَعْلَمُ مَا يُسِرُّونَ وَمَا يُعْلِنُونَ﴾.",
    translationFr:
      "Souviens-toi qu'Allah sait ce que tu caches et ce que tu divulgues ; qu'Il ne te voie, en secret comme en public, que dans le bien.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "cf. 2:77",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-t11",
    category: "tawjihat",
    scopeType: "verse",
    verseKey: "2:80",
    contentOrigin: "source_quote",
    textAr:
      "لا تتهاون بعذاب؛ فذلك يفضي إلى القسوة ومزيد من المعاصي، ﴿وَقَالُوا لَنْ تَمَسَّنَا النَّارُ إِلَّا أَيَّامًا مَعْدُودَةً قُلْ أَتَّخَذْتُمْ عِنْدَ اللَّهِ عَهْدًا﴾.",
    translationFr:
      "Ne prends pas le châtiment à la légère : cela mène à la dureté du cœur et à davantage de péchés.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "cf. 2:80",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "baqara-t12",
    category: "tawjihat",
    scopeType: "verse",
    verseKey: "2:83",
    contentOrigin: "source_quote",
    textAr:
      "قرن الله حق الوالدين بحقه؛ فلا تتساهل في حق والديك، ﴿لَا تَعْبُدُونَ إِلَّا اللَّهَ وَبِالْوَالِدَيْنِ إِحْسَانًا﴾.",
    translationFr:
      "Allah a associé le droit des parents à Son propre droit ; ne néglige donc pas le droit de tes parents.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "cf. 2:83",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
];
