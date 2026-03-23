import type { ScoreResult, QuizAnswers } from "./scoring";
import { SUPPLEMENTS, PROTOCOLS } from "./data";

export interface ReportData {
  name: string;
  email: string;
  generatedAt: string;
  score: ScoreResult;
  answers: QuizAnswers;
  // Derived fields for the report
  ageRange: string;
  hormoneStatus: string;
  sleepHours: string;
  dietPattern: string;
  exerciseDays: string;
  primaryGoal: string;
  topSupplements: Array<{ name: string; dose: string; timing: string; benefit: string }>;
  morningProtocol: Array<{ time: string; action: string; desc: string }>;
  moonPhaseNote: string;
}

export function buildReportData(
  name: string,
  email: string,
  answers: QuizAnswers,
  score: ScoreResult
): ReportData {
  // Pick top 6 supplements based on bio type
  const suppCategory = score.isMenopause ? 3 : // Hormonal Harmony
    score.type === "Lunar Kapha" ? 0 :          // Adaptogens
    score.type === "Radiant Pitta" ? 4 :         // Foundation Stack
    2;                                           // Cellular Longevity

  const topSupplements = [
    ...SUPPLEMENTS[suppCategory].items.filter(s => s.hi),
    ...SUPPLEMENTS[2].items.filter(s => s.hi), // Always include NMN + CoQ10
  ].slice(0, 6).map(s => ({
    name: s.n,
    dose: s.d,
    timing: s.t,
    benefit: s.b,
  }));

  const morningProtocol = PROTOCOLS["Morning Ritual"].map(p => ({
    time: p.t,
    action: p.a,
    desc: p.d,
  }));

  return {
    name,
    email,
    generatedAt: new Date().toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    }),
    score,
    answers,
    ageRange: (answers.q2 as string) ?? "Not specified",
    hormoneStatus: (answers.q3 as string) ?? "Not specified",
    sleepHours: (answers.q7 as string) ?? "Not specified",
    dietPattern: (answers.q31 as string) ?? "Not specified",
    exerciseDays: (answers.q37 as string) ?? "Not specified",
    primaryGoal: (answers.q50 as string) ?? "Overall optimization",
    topSupplements,
    morningProtocol,
    moonPhaseNote: "Your protocol is optimally timed with the lunar cycle. Begin new supplement cycles on the New Moon and use Full Moon energy for lymphatic drainage and peak vitality practices.",
  };
}
