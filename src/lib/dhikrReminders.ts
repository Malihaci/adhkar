import { readJSON } from "@/lib/storage";
import type { SmartCandidate } from "@/lib/smartReminders";
import {
  SALAT_DHIKR_ID,
  isChallengeEnded,
  isFriday,
  todayKey,
  type DhikrLog,
  type FridayChallengePrefs,
  type LocalChallenge,
} from "@/lib/dhikrCounter";

/**
 * Candidat de rappel "Défis Dhikr" pour le moteur existant. Priorité 4 =
 * la plus basse : prière, Adhkār et Wird passent toujours avant, et le
 * moteur applique déjà l'anti-empilement + la fenêtre autour des prières.
 * Un défi atteint/terminé ne génère plus jamais de rappel.
 */
export function challengeReminderCandidate(now: Date): SmartCandidate | null {
  if (now.getHours() < 10) return null;
  const day = todayKey(now);

  const challenges = readJSON<LocalChallenge[]>("dhikr:challenges:v1", []);
  for (const c of challenges) {
    if (isChallengeEnded(c)) continue;
    const done =
      c.type === "individual"
        ? c.myCount >= c.target
        : (c.lastKnownTotal ?? 0) >= c.target;
    if (done) continue;
    return {
      id: `challenge-${c.id}-${day}`,
      title: c.title,
      body:
        c.myCount > 0
          ? `Continuer votre défi · ${c.type === "individual" ? `${c.myCount}/${c.target}` : `vous : ${c.myCount}`}`
          : "Votre compteur est prêt",
      deepLink: `/challenge/${c.id}`,
      priority: 4,
    };
  }

  if (isFriday(now)) {
    const friday = readJSON<FridayChallengePrefs>("dhikr:friday:v1", { goal: 100 });
    const log = readJSON<DhikrLog>("dhikr:log:v1", {});
    const count = log[day]?.[SALAT_DHIKR_ID] ?? 0;
    if (count >= friday.goal) return null;
    return {
      id: `friday-${day}`,
      title: "Défi du vendredi 🌿",
      body: count > 0 ? `Continuer votre défi · ${count}/${friday.goal}` : "Votre compteur est prêt",
      deepLink: `/compteur/${SALAT_DHIKR_ID}`,
      priority: 4,
    };
  }
  return null;
}
