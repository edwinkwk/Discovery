import type { StructuredTraits } from "@/types/reading";
import type { WesternAstrologyChart } from "./types";

export function extractTraits(chart: WesternAstrologyChart): StructuredTraits {
  const headline = [
    `Sun in ${chart.sunSign}`,
    `Moon in ${chart.moonSign}`,
    `Rising sign: ${chart.ascendantSign}`,
  ];

  const traits = [
    `Sun in ${chart.sunSign} shapes their core identity and ego expression.`,
    `Moon in ${chart.moonSign} shapes their emotional nature and inner needs.`,
    `Rising sign ${chart.ascendantSign} shapes the persona they present to the world.`,
  ];

  const retrogrades = chart.planets.filter((p) => p.isRetrograde);
  if (retrogrades.length > 0) {
    traits.push(`Retrograde at birth: ${retrogrades.map((p) => p.body).join(", ")}, suggesting internalized or reworked expression of those planetary themes.`);
  }

  const tightAspects = [...chart.majorAspects].sort((a, b) => a.orb - b.orb).slice(0, 3);
  for (const aspect of tightAspects) {
    traits.push(`${aspect.point1} ${aspect.aspect} ${aspect.point2} (orb ${aspect.orb.toFixed(1)}°) is a defining dynamic in their chart.`);
  }

  return {
    system: "western-astrology",
    label: "Western Astrology",
    headline,
    traits,
    raw: chart,
  };
}
