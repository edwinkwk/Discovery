import type { NumerologyChart } from "./types";

const MASTER_NUMBERS = new Set([11, 22, 33]);

export function reduceNumber(value: number): number {
  let n = Math.abs(value);
  while (n > 9 && !MASTER_NUMBERS.has(n)) {
    n = String(n)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return n;
}

const PYTHAGOREAN_MAP: Record<string, number> = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

function lettersOf(name: string): string[] {
  return name.toLowerCase().replace(/[^a-z]/g, "").split("");
}

function sumLetters(letters: string[]): number {
  return letters.reduce((sum, letter) => sum + (PYTHAGOREAN_MAP[letter] ?? 0), 0);
}

export function calculateLifePathNumber(year: number, month: number, day: number): { value: number; isMaster: boolean } {
  const reducedMonth = reduceNumber(month);
  const reducedDay = reduceNumber(day);
  const reducedYear = reduceNumber(
    String(year)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0)
  );
  const value = reduceNumber(reducedMonth + reducedDay + reducedYear);
  return { value, isMaster: MASTER_NUMBERS.has(value) };
}

export function calculate(input: {
  year: number;
  month: number;
  day: number;
  fullName?: string;
}): NumerologyChart {
  const lifePath = calculateLifePathNumber(input.year, input.month, input.day);
  const birthdayNumber = reduceNumber(input.day);

  const chart: NumerologyChart = {
    lifePathNumber: lifePath.value,
    lifePathIsMaster: lifePath.isMaster,
    birthdayNumber,
  };

  if (input.fullName) {
    const letters = lettersOf(input.fullName);
    const vowelLetters = letters.filter((l) => VOWELS.has(l));
    const consonantLetters = letters.filter((l) => !VOWELS.has(l));

    const expressionRaw = sumLetters(letters);
    chart.expressionNumber = reduceNumber(expressionRaw);
    chart.expressionIsMaster = MASTER_NUMBERS.has(chart.expressionNumber);
    chart.soulUrgeNumber = reduceNumber(sumLetters(vowelLetters));
    chart.personalityNumber = reduceNumber(sumLetters(consonantLetters));
  }

  return chart;
}
