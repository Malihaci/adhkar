import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  text: z.string().min(1).max(20000),
  kind: z.enum(["waqafat", "tafsir"]).default("waqafat"),
});

export const translateToFrench = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Traduction indisponible");

    const system =
      data.kind === "waqafat"
        ? "Tu es un traducteur spécialisé en sciences islamiques. Traduis fidèlement en français clair et respectueux le texte arabe fourni (waqafât tadabburiyya, questions, orientations, actions et sens des mots). Conserve la structure : titres de sections, numérotation, et laisse les versets coraniques entre ﴿ ﴾ en arabe suivis de leur traduction française entre parenthèses. Ne commente pas, ne résume pas, ne rajoute rien."
        : "Tu es un traducteur spécialisé en exégèse coranique. Traduis fidèlement en français clair le texte de tafsîr arabe fourni. Garde les chaînes de transmission simplifiées, les versets entre ﴿ ﴾ suivis de leur sens en français. Ne commente pas et ne résume pas.";

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: data.text },
        ],
      }),
    });

    if (res.status === 429)
      throw new Error("Trop de traductions demandées, réessaie dans un instant.");
    if (res.status === 402)
      throw new Error("Crédits IA épuisés pour la traduction.");
    if (!res.ok) throw new Error("La traduction a échoué.");

    const json = (await res.json()) as any;
    const out = json?.choices?.[0]?.message?.content;
    if (typeof out !== "string" || !out.trim())
      throw new Error("Traduction vide.");
    return { text: out.trim() };
  });
