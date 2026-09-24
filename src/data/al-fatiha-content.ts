/**
 * Contenus d'étude pour la sourate Al-Fatiha (pilote).
 *
 * Transcrits directement depuis la page 1 de `sources/01.pdf`
 * (القرآن تدبر وعمل — مركز المنهاج), pas depuis le CDN spa5k/QUL.
 *
 * Le CDN pour cette sourate contient un bug de pipeline confirmé par
 * comparaison avec le PDF : l'en-tête « العمل بالآيات » et le texte de
 * l'action A1 y ont été perdus, et A2/A3 s'y trouvent accolés à
 * التوجيهات avec une numérotation dupliquée. Ce fichier utilise donc la
 * structure réelle du PDF (W1–W7 / T1–T3 / A1–A3), pas celle du CDN.
 *
 * `translationFr` est une traduction faite pour l'application, pas une
 * traduction officiellement publiée — d'où `translationStatus: "draft"`
 * partout. `sourceStatus: "needs_review"` reflète des droits de
 * réutilisation non confirmés, pas un doute sur le contenu lui-même
 * (transcription vérifiée visuellement page par page).
 */

import type { EtudeContent } from "@/lib/etude-content";

const EDITORIAL_SOURCE = "القرآن تدبر وعمل";
const SOURCE_TITLE = "القرآن تدبر وعمل — مركز المنهاج للإشراف والتدريب التربوي";

export const AL_FATIHA_CONTENT: EtudeContent[] = [
  // --- الوقفات التدبرية (Méditer) ---
  {
    id: "fatiha-w1",
    category: "tadabbur",
    scopeType: "verse_range",
    verseRange: "1:2-1:4",
    contentOrigin: "source_quote",
    textAr:
      "كأنه سبحانه يقول: يا عبادي إن كنتم تحمدون وتعظمون للكمال الذاتي والصفاتي فاحمدوني فإني أنا «الله»، وإن كان للإحسان والتربية والإنعام فإني أنا «رب العالمين»، وإن كان للرجاء والطمع في المستقبل فإني أنا «الرحمن الرحيم»، وإن كان للخوف فإني أنا «مالك يوم الدين».",
    translationFr:
      "C'est comme si Allah, exalté soit-Il, disait : « Ô Mes serviteurs, si vous Me louez et Me magnifiez pour Ma perfection essentielle et Mes attributs, alors louez-Moi, car Je suis ‘Allah’ ; si c'est pour Mon bienfait, Mon éducation et Mes faveurs, alors Je suis ‘le Seigneur des mondes’ ; si c'est par espoir et attente de l'avenir, alors Je suis ‘le Tout Miséricordieux, le Très Miséricordieux’ ; et si c'est par crainte, alors Je suis ‘le Maître du Jour de la Rétribution’. »",
    reflectionQuestionAr: "ما دلالة الأوصاف الأربعة في بداية سورة الفاتحة على الحمد لله؟",
    reflectionQuestionFr:
      "Quelle est la signification des quatre attributs mentionnés au début de la sourate Al-Fâtiha en lien avec la louange d'Allah ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "الألوسي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "١/٨٦",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "fatiha-w2",
    category: "tadabbur",
    scopeType: "verse_range",
    verseRange: "1:2-1:6",
    contentOrigin: "source_quote",
    textAr:
      "لما كان سؤال الله الهداية إلى الصراط المستقيم أجلّ المطالب ونيله أشرف المواهب علَّم الله عباده كيفية سؤاله، وأمرهم أن يقدموا بين يديه حمده والثناء عليه، وتمجيده ثم ذكر عبوديتهم وتوحيدهم، فهاتان وسيلتان إلى مطلوبهم: توسل إليه بأسمائه وصفاته، وتوسل إليه بعبوديته. وهاتان الوسيلتان لا يكاد يرد معهما الدعاء.",
    translationFr:
      "Puisque la demande faite à Allah de guider vers le droit chemin est la plus noble des requêtes et son obtention le plus noble des dons, Allah a enseigné à Ses serviteurs comment Le solliciter : Il leur a ordonné de faire précéder leur demande de Sa louange, de Son éloge et de Sa glorification, puis d'évoquer leur adoration exclusive et leur unicité envers Lui. Ce sont là deux moyens d'obtenir ce qu'ils recherchent : s'approcher de Lui par Ses noms et Ses attributs, et s'approcher de Lui par leur servitude. Avec ces deux moyens, l'invocation ne peut guère rester sans réponse.",
    reflectionQuestionAr: "ذكرت في الآيات وسيلتان لاستجابة الدعاء، ما هما؟",
    reflectionQuestionFr:
      "Deux moyens d'obtenir la réponse à l'invocation sont mentionnés dans ces versets ; quels sont-ils ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "ابن القيم",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "١/٣٦",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "fatiha-w3",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "1:5",
    contentOrigin: "source_quote",
    textAr:
      "ذكر الاستعانة بعد العبادة مع دخولها فيها لاحتياج العبد في جميع عباداته إلى الاستعانة بالله تعالى؛ فإن لم يعنه الله لم يحصل له ما يريده من فعل الأوامر واجتناب النواهي.",
    translationFr:
      "La demande de secours est mentionnée après l'adoration, bien qu'elle en fasse partie, en raison du besoin du serviteur, dans tous ses actes d'adoration, de rechercher le secours d'Allah : si Allah ne l'assiste pas, il n'obtiendra pas ce qu'il recherche dans l'accomplissement des commandements et l'évitement des interdits.",
    reflectionQuestionAr:
      "الاستعانة نوع من أنواع العبادة، فلماذا أفردها الله بالذكر بعد ذكر العبادة الشاملة للاستعانة وغيرها؟",
    reflectionQuestionFr:
      "La demande de secours est une forme d'adoration parmi d'autres ; pourquoi Allah l'a-t-Il mentionnée séparément après avoir évoqué l'adoration qui l'englobe déjà ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "السعدي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "٣٩",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "fatiha-w4",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "1:5",
    contentOrigin: "source_quote",
    textAr:
      "العبادة أعلى مراتب الخضوع ولا يجوز شرعاً ولا عقلا فعلها إلا لله تعالى لأنه المستحق لذلك لكونه موليا لأعظم النعم من الحياة والوجود وتوابعهما.",
    translationFr:
      "L'adoration est le degré le plus élevé de soumission ; il n'est licite, ni du point de vue de la Loi ni de la raison, de l'accomplir que pour Allah seul, car Lui seul le mérite, étant Celui qui accorde les plus grands bienfaits : la vie, l'existence, et ce qui en découle.",
    reflectionQuestionAr: "لماذا حصرت العبادة لله تعالى؟",
    reflectionQuestionFr: "Pourquoi l'adoration est-elle exclusivement réservée à Allah ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "الألوسي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "١/٨٦",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "fatiha-w5",
    category: "tadabbur",
    scopeType: "verse_range",
    verseRange: "1:5-1:6",
    contentOrigin: "source_quote",
    textAr: "في قوله: ﴿نعبد﴾ بنون الاستتباع إشعار بأن الصلاة بنيت على الاجتماع.",
    translationFr:
      "Dans Sa parole « nous adorons », le pronom pluriel suggère que la prière a été instituée sur le rassemblement.",
    reflectionQuestionAr: "لماذا كانت صيغة العبادة والاستعانة والدعاء في سورة الفاتحة بالجمع؟",
    reflectionQuestionFr:
      "Pourquoi la formule de l'adoration, de la demande de secours et de l'invocation dans la sourate Al-Fâtiha est-elle au pluriel ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "البقاعي",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "١/١٧",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "fatiha-w6",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "1:6",
    contentOrigin: "source_quote",
    textAr:
      "الحاجة إلى الهدى أعظم من الحاجة إلى النصر والرزق؛ بل لا نسبة بينهما؛ لأنه إذا هُدي كان من المتقين، ومن يتق الله يجعل له مخرجا ويرزقه من حيث لا يحتسب.",
    translationFr:
      "Le besoin de la guidance est plus grand que le besoin de la victoire et de la subsistance ; il n'y a même pas de commune mesure entre les deux, car celui qui est guidé fait partie des pieux, et quiconque craint Allah, Il lui donnera une issue et pourvoira à ses besoins par des moyens qu'il n'aurait jamais imaginés.",
    reflectionQuestionAr: "لماذا كانت الحاجة إلى الهدى أعظم من الحاجة إلى النصر والرزق؟",
    reflectionQuestionFr:
      "Pourquoi le besoin de la guidance est-il plus grand que le besoin de la victoire et de la subsistance ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "ابن تيمية",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "١/١١٦",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "fatiha-w7",
    category: "tadabbur",
    scopeType: "verse",
    verseKey: "1:6",
    contentOrigin: "source_quote",
    textAr:
      "على قدر ثبوت قدم العبد على هذا الصراط الذي نصبه الله لعباده في هذه الدار، يكون ثبوت قدمه على الصراط المنصوب على متن جهنم. وعلى قدر سيره على هذا الصراط يكون سيره على ذلك الصراط؛ فمنهم من يمر كالبرق، ومنهم من يمر كالطرف... فلينظر العبد سيره على ذلك الصراط من سيره على هذا؛ حذو القُذّة بالقُذّة جزاءً وفاقاً.",
    translationFr:
      "Selon la fermeté du pas du serviteur sur ce chemin qu'Allah a établi pour Ses serviteurs en cette demeure, sera la fermeté de son pas sur le chemin dressé au-dessus de la Géhenne. Et selon sa marche sur ce chemin-ci sera sa marche sur cet autre chemin : parmi eux, certains passeront comme l'éclair, d'autres comme un clin d'œil... Que le serviteur considère donc sa marche sur cet autre chemin à partir de sa marche sur celui-ci ; il y a correspondance exacte, comme rétribution méritée.",
    reflectionQuestionAr:
      "ما العلاقة بين التزام العبد الصراط المستقيم في الدنيا وسيره على الصراط في الآخرة؟",
    reflectionQuestionFr:
      "Quel est le lien entre l'attachement du serviteur au droit chemin dans ce bas monde et sa marche sur le chemin dans l'au-delà ?",
    sourceTitle: SOURCE_TITLE,
    sourceAuthor: "ابن القيم",
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "١/٣٥",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },

  // --- التوجيهات (S'orienter) — T1 à T3 uniquement ---
  {
    id: "fatiha-t1",
    category: "tawjihat",
    scopeType: "verse",
    verseKey: "1:5",
    contentOrigin: "source_quote",
    textAr:
      "هذه السورة مقسمة بين الله وعبده؛ فـ(إياك نعبد) مع ما قبلها لله، و(إياك نستعين) مع ما بعدها للعبد، فتأمل.",
    translationFr:
      "Cette sourate est partagée entre Allah et Son serviteur : « c'est Toi que nous adorons » et ce qui précède revient à Allah, « et c'est Toi dont nous implorons secours » et ce qui suit revient au serviteur. Médite cela.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "fatiha-t2",
    category: "tawjihat",
    scopeType: "verse",
    verseKey: "1:5",
    contentOrigin: "source_quote",
    textAr: "لن تعبد الله حق العبادة حتى يعينك الله على ذلك.",
    translationFr:
      "Tu n'adoreras véritablement Allah comme Il se doit d'être adoré que lorsqu'Il t'aidera à le faire.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "fatiha-t3",
    category: "tawjihat",
    scopeType: "verse",
    verseKey: "1:7",
    contentOrigin: "source_quote",
    textAr:
      "الحذر من اتباع منهج اليهود: (تقديم الهوى على الشرع). ومن منهج النصارى: (العبادة بالبدعة والجهل).",
    translationFr:
      "Se garder de suivre la voie des juifs : faire primer le désir sur la Loi révélée. Et la voie des chrétiens : l'adoration par l'innovation blâmable en religion (bid'a) et l'ignorance.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },

  // --- العمل بالآيات (Agir) — A1 à A3 uniquement ---
  {
    id: "fatiha-a1",
    category: "amal",
    scopeType: "surah",
    surahNumber: 1,
    contentOrigin: "source_quote",
    textAr:
      "ادع الله، وابدأ الدعاء بالحمد والثناء عليه سبحانه كما ابتدأت سورة الفاتحة، ثم اسأله ما تريد كما ختمت السورة.",
    translationFr:
      "Invoque Allah : commence ton invocation par la louange et l'éloge envers Lui, comme s'ouvre la sourate Al-Fâtiha, puis demande-Lui ce que tu souhaites, comme elle se conclut.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceReference: "cf. 1:2 et 1:6",
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "fatiha-a2",
    category: "amal",
    scopeType: "surah",
    surahNumber: 1,
    contentOrigin: "source_quote",
    textAr: "سورة الفاتحة أعظم سورة في القرآن، اقرأ تفسيرها من أحد التفاسير وأكثر من تدبر آياتها.",
    translationFr:
      "Al-Fâtiha est la plus grande sourate du Coran : lis son tafsîr dans l'un des ouvrages d'exégèse et médite davantage sur ses versets.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  // --- ✨ Leçons à retenir / 🌍 Dans ma vie — synthèses pédagogiques
  // fidèles, condensées à partir des الوقفات/العمل/التوجيهات ci-dessus.
  // L'IA condense et reformule ; elle n'ajoute aucune conclusion
  // religieuse absente des sources citées (sourceIds).
  {
    id: "fatiha-l1",
    category: "lesson",
    scopeType: "verse_range",
    verseRange: "1:2-1:6",
    contentOrigin: "pedagogical_synthesis",
    sourceIds: ["fatiha-w2"],
    textAr:
      "توسل إليه بأسمائه وصفاته، وتوسل إليه بعبوديته. وهاتان الوسيلتان لا يكاد يرد معهما الدعاء.",
    translationFr:
      "On peut retenir de ces versets que la demande de guidance s'appuie sur deux piliers : louer Allah par Ses noms et Ses attributs, et L'adorer avec sincérité — deux moyens par lesquels, selon la source citée, une invocation obtient difficilement de rester sans réponse.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "fatiha-l2",
    category: "lesson",
    scopeType: "verse",
    verseKey: "1:6",
    contentOrigin: "pedagogical_synthesis",
    sourceIds: ["fatiha-w6"],
    textAr:
      "الحاجة إلى الهدى أعظم من الحاجة إلى النصر والرزق؛ بل لا نسبة بينهما؛ لأنه إذا هُدي كان من المتقين، ومن يتق الله يجعل له مخرجا ويرزقه من حيث لا يحتسب.",
    translationFr:
      "Le besoin d'être guidé dépasse le besoin de réussite ou de subsistance : qui est guidé rejoint les pieux, et pour qui craint Allah, Il ouvre une issue et pourvoit par des voies inattendues.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "fatiha-today1",
    category: "today",
    scopeType: "verse",
    verseKey: "1:5",
    contentOrigin: "pedagogical_synthesis",
    sourceIds: ["fatiha-t2", "fatiha-a1"],
    textAr: "لن تعبد الله حق العبادة حتى يعينك الله على ذلك.",
    translationFr:
      "Dans ma vie : avant de demander quoi que ce soit à Allah, je peux commencer mon invocation par Sa louange comme le fait la Fâtiha, puis Lui demander de m'aider à L'adorer comme il se doit — car selon les sources citées, nul n'adore vraiment Allah sans Son secours.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
  {
    id: "fatiha-a3",
    category: "amal",
    scopeType: "verse",
    verseKey: "1:7",
    contentOrigin: "source_quote",
    textAr: "حدد مجموعة من أهل الخير والصلاح وأكثر من مصاحبتهم ومجالستهم.",
    translationFr:
      "Identifie un groupe de gens de bien et de piété, et multiplie leur compagnie et leur fréquentation.",
    sourceTitle: SOURCE_TITLE,
    editorialSource: EDITORIAL_SOURCE,
    sourceStatus: "needs_review",
    translationStatus: "draft",
  },
];
