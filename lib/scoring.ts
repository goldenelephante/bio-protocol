export interface QuizAnswers {
  [key: string]: string | string[] | number | undefined;
}

export interface ScoreResult {
  score: number;
  type: string;
  typeCode: string;
  typeDesc: string;
  priorities: Array<{ icon: string; title: string; desc: string }>;
  isMenopause: boolean;
}

export function scoreAnswers(answers: QuizAnswers): ScoreResult {
  const isMenopause = ["Perimenopause", "Menopause (12+ months no period)", "Post-menopause"].includes(
    answers.q3 as string
  );

  const sleepHrs = ["7–8h", "8–9h"].includes(answers.q7 as string)
    ? 10 : ["6–7h", "9h+"].includes(answers.q7 as string) ? 7 : 3;

  const sleepQual = typeof answers.q8 === "number" ? answers.q8 * 2 : 5;
  const energy    = typeof answers.q13 === "number" ? answers.q13 * 2 : 5;
  const stress    = typeof answers.q25 === "number" ? (5 - answers.q25) * 2 : 5;

  const diet = ["Whole foods, mostly home-cooked", "Mediterranean style", "Plant-based / vegan"].includes(
    answers.q31 as string
  ) ? 10 : 5;

  const move = ["3–4 days", "5–6 days", "Daily"].includes(answers.q37 as string) ? 10
    : ["1–2 days"].includes(answers.q37 as string) ? 6 : 2;

  const skin   = answers.q45 === "Yes — SPF 50 every day" ? 10
    : answers.q45 === "Yes — most days" ? 8 : 4;
  const motive = typeof answers.q49 === "number" ? answers.q49 * 2 : 5;

  const base  = sleepHrs + sleepQual + energy + stress + diet + move + skin + motive;
  const score = Math.min(98, Math.max(28, Math.round(base * 1.15)));

  let type = "Balanced Vata";
  let typeCode = "BV-4";
  let typeDesc =
    "You carry adaptability and sensitivity in your biology. Your system is responsive to lifestyle inputs — the right protocol will create fast, visible results.";

  if (sleepHrs >= 9 && energy >= 8 && stress >= 7) {
    type = "Radiant Pitta"; typeCode = "RP-2";
    typeDesc = "Your biology runs hot and efficient. Strong metabolic drive with a tendency to overstimulate. Your protocol focuses on cooling, recovery optimization & anti-inflammatory mastery.";
  } else if (energy <= 5 && sleepHrs <= 6) {
    type = "Lunar Kapha"; typeCode = "LK-7";
    typeDesc = "Deep reserves, slower metabolism, strong lunar sensitivity. You respond profoundly to consistency, grounding rituals & hormonal attunement protocols.";
  } else if (stress >= 8 || energy <= 4) {
    type = "Adaptive Vata"; typeCode = "AV-3";
    typeDesc = "High nervous system sensitivity with reactive biology. Your protocol is built around nervous system regulation, adrenal recovery & deep nourishment.";
  }

  const priorities: ScoreResult["priorities"] = [];

  if (sleepHrs < 7 || sleepQual < 7)
    priorities.push({ icon: "◐", title: "Sleep Optimization",    desc: "Your sleep data indicates recovery deficits that accelerate biological aging." });
  if (energy < 6)
    priorities.push({ icon: "⚡", title: "Cellular Energy",       desc: "Mitochondrial support & NAD+ protocols are priority for your profile." });
  if (isMenopause)
    priorities.push({ icon: "◎", title: "Hormonal Rebalancing",  desc: "Targeted phytoestrogen, adaptogen & lifestyle protocols for your hormonal stage." });
  if (stress > 6)
    priorities.push({ icon: "〜", title: "Cortisol Regulation",  desc: "HPA axis recalibration is foundational before other interventions take effect." });
  if (diet !== 10)
    priorities.push({ icon: "◈", title: "Metabolic Reset",       desc: "Nutritional foundation needs addressing — anti-inflammatory protocol incoming." });
  if (priorities.length < 3)
    priorities.push({ icon: "✦", title: "Longevity Activation",  desc: "General cellular optimization, senolytic cycling & skin longevity protocol." });

  return { score, type, typeCode, typeDesc, priorities: priorities.slice(0, 3), isMenopause };
}
