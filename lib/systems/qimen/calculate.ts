import { Solar } from "lunar-typescript";
import { determineJuDun, buildBoard } from "./board";
import type { QiMenBoard } from "./types";

/**
 * Builds a simplified Qi Men Dun Jia day-board (Ju number, Dun direction, and the
 * resulting 9-palace layout of stems/stars/gates) for the birth date. This is a
 * day-level board, not a full hour-precise 时家奇门 chart — see board.ts for the
 * documented simplifications (no chao-shen leap correction, no 值符/值使 hourly
 * tracking, 8 Gods/八神 omitted). Treat this system's output as directional/thematic
 * rather than a classically complete divination chart.
 */
export function calculate(solarAdjusted: {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}): QiMenBoard {
  const solar = Solar.fromYmdHms(
    solarAdjusted.year,
    solarAdjusted.month,
    solarAdjusted.day,
    solarAdjusted.hour,
    solarAdjusted.minute,
    0
  );
  const lunar = solar.getLunar();
  const juDun = determineJuDun(solar, lunar);
  return buildBoard(juDun);
}
