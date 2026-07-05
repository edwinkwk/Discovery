import type { StructuredTraits } from "@/types/reading";
import type { NumerologyChart } from "./types";

const LIFE_PATH_MEANINGS: Record<number, string> = {
  1: "independent, driven, a natural leader who forges their own path",
  2: "diplomatic, sensitive, a natural partner and peacemaker",
  3: "expressive, creative, drawn to communication and joy",
  4: "disciplined, practical, a builder who values stability",
  5: "adventurous, adaptable, hungry for freedom and change",
  6: "nurturing, responsible, oriented around family and service",
  7: "introspective, analytical, a seeker of truth and depth",
  8: "ambitious, authoritative, focused on material mastery and achievement",
  9: "compassionate, idealistic, oriented toward humanitarian goals",
  11: "intuitive and visionary, a master number carrying spiritual insight and inspiration",
  22: "a master builder, capable of turning big visions into lasting practical reality",
  33: "a master teacher, expressing compassion and healing on a large scale",
};

const EXPRESSION_MEANINGS: Record<number, string> = {
  1: "expresses themselves through initiative and leadership",
  2: "expresses themselves through cooperation and tact",
  3: "expresses themselves through creativity and words",
  4: "expresses themselves through order and reliability",
  5: "expresses themselves through versatility and exploration",
  6: "expresses themselves through care and responsibility",
  7: "expresses themselves through analysis and inner wisdom",
  8: "expresses themselves through ambition and organization",
  9: "expresses themselves through generosity and vision",
  11: "expresses themselves with heightened intuition and inspiration",
  22: "expresses themselves by manifesting large-scale practical achievements",
  33: "expresses themselves through selfless teaching and healing",
};

export function extractTraits(chart: NumerologyChart): StructuredTraits {
  const headline = [
    `Life Path ${chart.lifePathNumber}${chart.lifePathIsMaster ? " (Master Number)" : ""}`,
  ];
  const traits = [
    `Life Path ${chart.lifePathNumber}: ${LIFE_PATH_MEANINGS[chart.lifePathNumber] ?? "on a distinctive personal path"}`,
    `Birthday Number ${chart.birthdayNumber} colors their natural talents and first impressions.`,
  ];

  if (chart.expressionNumber !== undefined) {
    headline.push(`Expression ${chart.expressionNumber}${chart.expressionIsMaster ? " (Master Number)" : ""}`);
    traits.push(
      `Expression Number ${chart.expressionNumber}: ${EXPRESSION_MEANINGS[chart.expressionNumber] ?? "expresses themselves in a distinctive way"}`
    );
  }
  if (chart.soulUrgeNumber !== undefined) {
    traits.push(`Soul Urge Number ${chart.soulUrgeNumber} reflects their inner motivation and heart's desire.`);
  }
  if (chart.personalityNumber !== undefined) {
    traits.push(`Personality Number ${chart.personalityNumber} shapes how others perceive them at first glance.`);
  }

  return {
    system: "numerology",
    label: "Numerology",
    headline,
    traits,
    raw: chart,
  };
}
