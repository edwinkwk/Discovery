import type { StructuredTraits } from "@/types/reading";
import type { ZiweiChart } from "./types";

export function extractTraits(chart: ZiweiChart): StructuredTraits {
  const headline = [
    `Life Palace (Ming Gong) stars: ${chart.soulPalace?.majorStars.join(", ") || "none dominant"}`,
    `Soul star: ${chart.soul}, Body star: ${chart.body}`,
  ];

  const traits = [
    `Their Life Palace sits in ${chart.soulPalace?.earthlyBranch ?? "an unresolved branch"}, hosting ${
      chart.soulPalace && chart.soulPalace.majorStars.length > 0
        ? `the major star(s) ${chart.soulPalace.majorStars.join(", ")}`
        : "no major star, taking on the character of its opposite palace instead"
    }, which anchors their core identity in Zi Wei Dou Shu.`,
    `Their soul star (命主) is ${chart.soul} and body star (身主) is ${chart.body}, jointly shaping temperament and life focus.`,
    `Their Five Elements Class is ${chart.fiveElementsClass}, which sets the pace of their destiny's unfolding.`,
  ];

  if (chart.careerPalace) {
    traits.push(
      `Career Palace stars (${chart.careerPalace.majorStars.join(", ") || "none major"}) suggest the shape of their professional path.`
    );
  }
  if (chart.wealthPalace) {
    traits.push(
      `Wealth Palace stars (${chart.wealthPalace.majorStars.join(", ") || "none major"}) suggest their relationship with money and resources.`
    );
  }

  return {
    system: "ziwei",
    label: "Purple Star Astrology (Zi Wei Dou Shu)",
    headline,
    traits,
    raw: chart,
  };
}
