// Extraction automatisée du texte ARABE source (الوقفات التدبرية / العمل
// بالآيات / التوجيهات) depuis l'API interne de archive.altadabbur.com —
// l'archive officielle du même corpus القرآن تدبر وعمل que nos PDF sources
// (contenu vérifié identique mot pour mot sur plusieurs pages avant de
// lancer ce script). AUCUNE traduction ici : extraction arabe uniquement,
// conformément au pipeline "extraction → structuration → traduction"
// (la traduction française reste un travail séparé, fait ensuite, item
// par item, jamais automatique).
//
// Usage : node --experimental-strip-types scripts/extract-tadabbur-corpus.mjs [start] [end]
// Reprise : relit tadabbur-corpus-raw.json existant, saute les pages déjà
// présentes (idempotent) sauf si elles sont dans `errors`.

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const OUT_FILE = "C:\\adhkar\\scripts\\tadabbur-corpus-raw.json";
const START = Number(process.argv[2] ?? 1);
const END = Number(process.argv[3] ?? 604);
const DELAY_MS = 350; // respectueux du serveur tiers, pas de rafale

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function loadState() {
  if (existsSync(OUT_FILE)) {
    return JSON.parse(readFileSync(OUT_FILE, "utf8"));
  }
  return { generatedAt: null, source: "https://archive.altadabbur.com/interface.php", pages: {}, errors: {} };
}

function saveState(state) {
  state.generatedAt = new Date().toISOString();
  writeFileSync(OUT_FILE, JSON.stringify(state, null, 2), "utf8");
}

/** Décode les entités HTML minimales présentes dans ce corpus. */
function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(s) {
  return decodeEntities(s.replace(/<[^>]+>/g, "")).replace(/\r\n/g, " ").replace(/\s+/g, " ").trim();
}

/** Normalisation grossière pour comparer un fragment cité au texte réel de l'ayah (retire tashkeel/tatweel/ponctuation coranique). */
function normalizeArabic(s) {
  return s
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "") // tashkeel
    .replace(/\u0640/g, "") // tatweel
    .replace(/[﴿﴾۝«»""()\[\]{}.,،؛:؟!]/g, "")
    .replace(/[\u06D6-\u06DC\u06DE-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
function arabicToInt(s) {
  return Number([...s].map((c) => ARABIC_DIGITS.indexOf(c)).join(""));
}
function intToArabic(n) {
  return String(n)
    .split("")
    .map((d) => ARABIC_DIGITS[Number(d)])
    .join("");
}

function parseWaqafat(html) {
  const items = [];
  const re = /<div id="(\d+)_(\d+)__trans"\s*>([\s\S]*?)<\/div>/g;
  let m;
  while ((m = re.exec(html))) {
    const [, sura, aya, body] = m;
    const ayahMatch = body.match(
      /<span class="tadobr_ayah"\s*>([\s\S]*?)<\/span>\s*<br\s*\/?>([\s\S]*?)<a class="tadobr_source"/,
    );
    if (!ayahMatch) continue;
    const [, ayahSpanInner, explanationRaw] = ayahMatch;
    const bracketMatch = ayahSpanInner.match(
      /<span class="bracket"\s*>﴿<\/span>([\s\S]*?)<span class="bracket"\s*>﴾<\/span>/,
    );
    const textAr = bracketMatch ? stripTags(bracketMatch[1]) : null;
    const explanationAr = stripTags(explanationRaw);
    const sourceMatch = body.match(/<a class="tadobr_source"[^>]*>([^<]*)<\/a>/);
    let sourceAuthor = null;
    let sourceReference = null;
    if (sourceMatch) {
      const raw = decodeEntities(sourceMatch[1]).trim();
      const idx = raw.indexOf(":");
      if (idx > -1) {
        sourceAuthor = raw.slice(0, idx).trim();
        sourceReference = raw.slice(idx + 1).trim().replace(/\.$/, "");
      } else {
        sourceAuthor = raw || null;
      }
    }
    const qMatch = body.match(/<span class="tadobr_qus"\s*>([\s\S]*?)<\/span>/);
    const reflectionQuestionAr = qMatch ? stripTags(qMatch[1]) : null;
    if (!textAr || !explanationAr) {
      items.push({ verseKey: `${sura}:${aya}`, needsReview: true, reason: "champ manquant après parsing", rawBody: body.slice(0, 500) });
      continue;
    }
    // La citation peut s'étendre sur plusieurs ayat : des marqueurs
    // ﴿N﴾ (chiffres arabo-indiens) ponctuent la fin de chaque ayah citée
    // avant la dernière, non marquée. `sura_aya` de l'id donne l'ayah de
    // DÉPART (vérifié sur plusieurs exemples connus), jamais devinée.
    const markers = [...textAr.matchAll(/﴿([٠-٩]+)﴾/g)].map((mm) => arabicToInt(mm[1]));
    let scope;
    if (markers.length === 0) {
      scope = { scopeType: "verse", verseKey: `${sura}:${aya}` };
    } else {
      const lastMarker = markers[markers.length - 1];
      const afterLast = textAr.slice(textAr.lastIndexOf(`﴿${intToArabic(lastMarker)}﴾`)).replace(/﴿[٠-٩]+﴾/g, "").trim();
      const endAya = afterLast.length > 0 ? lastMarker + 1 : lastMarker;
      const startAya = Number(aya);
      scope =
        endAya > startAya
          ? { scopeType: "verse_range", verseRange: `${sura}:${startAya}-${sura}:${endAya}` }
          : { scopeType: "verse", verseKey: `${sura}:${aya}` };
    }
    items.push({ ...scope, textAr, explanationAr, sourceAuthor, sourceReference, reflectionQuestionAr });
  }
  return items;
}

/** التوجيهات / العمل بالآيات : liste numérotée "N- texte ﴿ ayah ﴾" dans un seul bloc. */
function parseNumberedBlock(html, blockId) {
  const blockMatch = html.match(
    new RegExp(`<div id="${blockId}__trans"[^>]*>([\\s\\S]*?)<\\/div>`),
  );
  if (!blockMatch) return [];
  const body = blockMatch[1].replace(/<span class="title_tadabor"[^>]*>[\s\S]*?<\/span>/, "");
  const rawItems = body
    .split(/<br\s*\/?>/)
    .map((s) => s.trim())
    .filter((s) => s && /^\d+[-.]/.test(stripTags(s)));
  return rawItems.map((raw) => {
    const citedSpans = [...raw.matchAll(/<span class="ayah"\s*>([\s\S]*?)<\/span>/g)].map((m) =>
      stripTags(m[1]),
    );
    const textAr = stripTags(raw).replace(/^\d+[-.]\s*/, "");
    return { textAr, citedFragments: citedSpans.filter(Boolean) };
  });
}

async function fetchPageContent(page) {
  const url = `https://archive.altadabbur.com/interface.php?ui=pc&do=tarjama&tafsir=tadabor&page=${page}&b_sura=1&b_aya=1&e_sura=1&e_aya=1`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const html = json?.tafsir?.jamal?.text;
  if (typeof html !== "string" || html.length < 20) {
    throw new Error("réponse vide ou format inattendu");
  }
  return html;
}

async function fetchPageVerses(page) {
  const res = await fetch(
    `https://api.quran.com/api/v4/verses/by_page/${page}?fields=text_uthmani&per_page=50`,
  );
  if (!res.ok) return [];
  const json = await res.json();
  return (json.verses ?? []).map((v) => ({
    key: v.verse_key,
    normalized: normalizeArabic(v.text_uthmani),
  }));
}

/** Tente de rattacher un item Amal/Tawjih à une ayah précise de la page ; sinon portée = page (jamais deviné). */
function resolveScope(item, pageVerses) {
  if (!item.citedFragments.length) return { scopeType: "page" };
  const matches = new Set();
  for (const frag of item.citedFragments) {
    const nf = normalizeArabic(frag);
    if (nf.length < 6) continue; // fragment trop court pour être fiable
    for (const v of pageVerses) {
      if (v.normalized.includes(nf) || nf.includes(v.normalized)) matches.add(v.key);
    }
  }
  if (matches.size === 1) return { scopeType: "verse", verseKey: [...matches][0] };
  if (matches.size > 1) {
    const keys = [...matches];
    const [s0, a0] = keys[0].split(":").map(Number);
    const sameSurah = keys.every((k) => Number(k.split(":")[0]) === s0);
    if (sameSurah) {
      const ayat = keys.map((k) => Number(k.split(":")[1])).sort((a, b) => a - b);
      if (ayat[ayat.length - 1] - ayat[0] === ayat.length - 1) {
        return { scopeType: "verse_range", verseRange: `${s0}:${ayat[0]}-${s0}:${ayat[ayat.length - 1]}` };
      }
    }
    return { scopeType: "page" };
  }
  return { scopeType: "page" };
}

async function main() {
  const state = loadState();
  let done = 0;
  let failed = 0;
  for (let page = START; page <= END; page++) {
    const key = String(page);
    if (state.pages[key]) continue; // déjà extrait — idempotent
    try {
      const [html, pageVerses] = await Promise.all([fetchPageContent(page), fetchPageVerses(page)]);
      const waqafat = parseWaqafat(html);
      const tawjihatRaw = parseNumberedBlock(html, "instructions");
      const amalRaw = parseNumberedBlock(html, "todo");
      const tawjihat = tawjihatRaw.map((it) => ({ textAr: it.textAr, ...resolveScope(it, pageVerses) }));
      const amal = amalRaw.map((it) => ({ textAr: it.textAr, ...resolveScope(it, pageVerses) }));
      state.pages[key] = { waqafat, amal, tawjihat };
      delete state.errors[key];
      done++;
    } catch (e) {
      state.errors[key] = String(e?.message ?? e);
      failed++;
    }
    if (page % 20 === 0 || page === END) saveState(state);
    await sleep(DELAY_MS);
  }
  saveState(state);
  console.log(`Terminé : ${done} pages extraites, ${failed} erreurs sur cette plage (${START}-${END}).`);
  console.log(`Total cumulé dans le fichier : ${Object.keys(state.pages).length} pages, ${Object.keys(state.errors).length} en erreur.`);
}

main();
