import type { StructuredTraits } from "@/types/reading";
import type { BaziChart } from "./types";

const WU_XING_TRAITS: Record<string, string> = {
  木: "growth-oriented, idealistic, and adaptable like Wood",
  火: "passionate, expressive, and dynamic like Fire",
  土: "grounded, dependable, and nurturing like Earth",
  金: "resolute, precise, and principled like Metal",
  水: "flexible, perceptive, and deep like Water",
};

export function extractTraits(chart: BaziChart): StructuredTraits {
  const pillarSummary = chart.pillars.map((p) => `${p.name}: ${p.ganZhi}`).join(", ");
  const headline = [
    `Day Master: ${chart.dayMasterGan} (${chart.dayMasterWuXing})`,
    `Four Pillars: ${chart.pillars.map((p) => p.ganZhi).join(" ")}`,
  ];

  const dominantElement = Object.entries(chart.wuXingCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const missingElements = Object.entries(chart.wuXingCounts)
    .filter(([, count]) => count === 0)
    .map(([element]) => element);

  const traits = [
    `Day Master ${chart.dayMasterGan} (${chart.dayMasterWuXing}) suggests someone ${WU_XING_TRAITS[chart.dayMasterWuXing] ?? "with a distinctive elemental nature"}, as this is the core of their identity in BaZi.`,
    `Four Pillars (${pillarSummary}) frame their year/month/day/hour influences from ancestry to inner drive.`,
    `Chinese zodiac sign: ${chart.zodiac}.`,
  ];

  if (dominantElement) {
    traits.push(`Their chart is dominated by the ${dominantElement} element, reinforcing ${WU_XING_TRAITS[dominantElement]}.`);
  }
  if (missingElements.length > 0) {
    traits.push(`Elements notably absent from their chart: ${missingElements.join(", ")}, which may represent growth areas.`);
  }

  return {
    system: "bazi",
    label: "Four Pillars (BaZi)",
    headline,
    traits,
    raw: chart,
  };
}
