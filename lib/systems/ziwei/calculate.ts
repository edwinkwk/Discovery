import { astro } from "iztro";
import type { ZiweiChart, ZiweiPalace } from "./types";

/**
 * Convert a 24-hour clock hour into iztro's shichen (two-hour Chinese time period) index.
 * 0 = early zi (00:00-01:00), 1 = chou (01:00-03:00), ... 11 = hai (21:00-23:00), 12 = late zi (23:00-24:00).
 */
export function hourToTimeIndex(hour: number): number {
  if (hour === 0) return 0;
  if (hour === 23) return 12;
  return Math.floor((hour + 1) / 2);
}

function mapPalace(palace: { name: string; heavenlyStem: string; earthlyBranch: string; majorStars: { name: string }[]; minorStars: { name: string }[]; adjectiveStars: { name: string }[] }): ZiweiPalace {
  return {
    name: palace.name,
    heavenlyStem: palace.heavenlyStem,
    earthlyBranch: palace.earthlyBranch,
    majorStars: palace.majorStars.map((s) => s.name),
    minorStars: palace.minorStars.map((s) => s.name),
    adjectiveStars: palace.adjectiveStars.map((s) => s.name),
  };
}

export function calculate(solarAdjusted: {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: "male" | "female";
}): ZiweiChart {
  const dateStr = `${solarAdjusted.year}-${solarAdjusted.month}-${solarAdjusted.day}`;
  const timeIndex = hourToTimeIndex(solarAdjusted.hour);
  const astrolabe = astro.bySolar(dateStr, timeIndex, solarAdjusted.gender, true, "en-US");

  const palaces = astrolabe.palaces.map(mapPalace);

  return {
    sign: astrolabe.sign,
    zodiac: astrolabe.zodiac,
    soul: astrolabe.soul,
    body: astrolabe.body,
    fiveElementsClass: astrolabe.fiveElementsClass,
    palaces,
    soulPalace: palaces.find((p) => p.name === "soul"),
    careerPalace: palaces.find((p) => p.name === "career"),
    wealthPalace: palaces.find((p) => p.name === "wealth"),
  };
}
