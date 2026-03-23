export function getMoonAge(date: Date = new Date()): number {
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  const d = date.getDate();
  if (m < 3) { y--; m += 12; }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    d + b - 1524.5;
  let age = (jd - 2451549.5) % 29.53058868;
  return age < 0 ? age + 29.53058868 : age;
}

export interface MoonPhase {
  name: string;
  sym: string;
  energy: string;
  tip: string;
  age: number;
}

const PHASES = [
  { max: 1.85,  name: "New Moon",        sym: "🌑", energy: "Deep restoration & cellular autophagy",       tip: "Ideal for fasting protocols & intention setting" },
  { max: 7.38,  name: "Waxing Crescent", sym: "🌒", energy: "Building momentum & new beginnings",          tip: "Begin new supplement cycles & skin protocols" },
  { max: 9.22,  name: "First Quarter",   sym: "🌓", energy: "Action & physical momentum",                  tip: "Peak time for high-intensity workouts" },
  { max: 14.77, name: "Waxing Gibbous",  sym: "🌔", energy: "Amplification & refinement",                  tip: "Maximize nutrient absorption & deep hydration" },
  { max: 16.61, name: "Full Moon",        sym: "🌕", energy: "Peak vitality & emotional release",           tip: "Lymphatic drainage, detox rituals & breathwork" },
  { max: 22.15, name: "Waning Gibbous",  sym: "🌖", energy: "Integration & reflection",                    tip: "Prioritize sleep quality & cortisol regulation" },
  { max: 23.99, name: "Last Quarter",    sym: "🌗", energy: "Release & letting go",                        tip: "Detox protocols & reduce inflammatory foods" },
  { max: 29.53, name: "Waning Crescent", sym: "🌘", energy: "Rest, surrender & deep recovery",             tip: "Adaptogens, slow mornings & minimal stressors" },
];

export function getPhase(date: Date = new Date()): MoonPhase {
  const age = getMoonAge(date);
  const phase = PHASES.find(p => age < p.max) ?? PHASES[7];
  return { ...phase, age };
}

export interface MoonCalMark {
  d: number;
  type: "new" | "full";
  sym: string;
}

export function getMoonCalendar(year: number, month: number): MoonCalMark[] {
  const total = new Date(year, month + 1, 0).getDate();
  const marks: MoonCalMark[] = [];
  let last: string | null = null;
  for (let d = 1; d <= total; d++) {
    const age = getMoonAge(new Date(year, month, d));
    if (age < 1.8 && last !== "n") {
      marks.push({ d, type: "new", sym: "🌑" });
      last = "n";
    } else if (age >= 13.5 && age < 16 && last !== "f") {
      marks.push({ d, type: "full", sym: "🌕" });
      last = "f";
    }
  }
  return marks;
}
