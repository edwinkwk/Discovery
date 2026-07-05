import type { StructuredTraits } from "@/types/reading";
import type { QiMenBoard } from "./types";

const GATE_MEANINGS: Record<string, string> = {
  休门: "rest and recovery — a favorable, low-friction energy",
  生门: "growth and generation — an auspicious gate for new beginnings",
  伤门: "injury and conflict — a gate that favors direct, sometimes combative action",
  杜门: "obstruction and secrecy — a gate favoring caution and concealment",
  景门: "clarity and visibility — a gate favoring recognition and publicity",
  死门: "stillness and endings — a gate favoring closure and letting go",
  惊门: "shock and alertness — a gate favoring quick reflexes amid disruption",
  开门: "opening and opportunity — the most classically auspicious gate",
};

export function extractTraits(board: QiMenBoard): StructuredTraits {
  const soulPalace = board.palaces.find((p) => p.stem === "戊") ?? board.palaces[0];

  const headline = [
    `${board.dun === "yang" ? "Yang" : "Yin"} Dun, Ju ${board.ju} (governed by the ${board.jieqi} solar term)`,
    `Anchor palace: ${soulPalace.direction}, Gate: ${soulPalace.gate || "borrowed from center"}`,
  ];

  const traits = [
    `Born under ${board.dun === "yang" ? "Yang Dun (阳遁)" : "Yin Dun (阴遁)"}, Ju ${board.ju}, governed by the ${board.jieqi} solar term — this sets the overall directional energy of their chart.`,
    `Their anchor palace sits in the ${soulPalace.direction} direction, carrying the stem ${soulPalace.stem} and star ${soulPalace.star}.`,
  ];

  if (soulPalace.gate && GATE_MEANINGS[soulPalace.gate]) {
    traits.push(`Its gate, ${soulPalace.gate}, represents ${GATE_MEANINGS[soulPalace.gate]}.`);
  }

  traits.push(
    `This Qi Men reading is a simplified day-level board (no hourly time-board rotation), best read as a directional/strategic theme rather than a precise hour-by-hour forecast.`
  );

  return {
    system: "qimen",
    label: "Qi Men Dun Jia",
    headline,
    traits,
    raw: board,
  };
}
