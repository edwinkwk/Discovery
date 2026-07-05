import { describe, it, expect } from "vitest";
import { calculate } from "./calculate";
import { determineJuDun, buildBoard } from "./board";
import { Solar } from "lunar-typescript";

// NOTE: these tests check internal self-consistency of the simplified board
// construction (structural invariants + the classical Ju/Dun table), not
// byte-exact agreement with a live reference Qi Men calculator — see the
// caveats documented in board.ts and calculate.ts.

describe("determineJuDun", () => {
  it("produces a valid ju (1-9) and dun for a known date", () => {
    const solar = Solar.fromYmdHms(1990, 1, 15, 10, 30, 0);
    const juDun = determineJuDun(solar, solar.getLunar());
    expect(juDun.ju).toBeGreaterThanOrEqual(1);
    expect(juDun.ju).toBeLessThanOrEqual(9);
    expect(["yang", "yin"]).toContain(juDun.dun);
    expect(["upper", "middle", "lower"]).toContain(juDun.yuan);
  });

  it("assigns Yang Dun from Winter Solstice through Grain in Ear", () => {
    // 1990-01-15 falls between 小寒 and 大寒, within the Yang Dun half of the year
    const solar = Solar.fromYmdHms(1990, 1, 15, 10, 30, 0);
    const juDun = determineJuDun(solar, solar.getLunar());
    expect(juDun.dun).toBe("yang");
  });

  it("assigns Yin Dun from Summer Solstice through Heavy Snow", () => {
    // 1990-07-15 falls between 小暑 and 大暑, within the Yin Dun half of the year
    const solar = Solar.fromYmdHms(1990, 7, 15, 10, 30, 0);
    const juDun = determineJuDun(solar, solar.getLunar());
    expect(juDun.dun).toBe("yin");
  });
});

describe("buildBoard", () => {
  it("produces exactly 8 palaces (5/center folded into 2) covering all 9 stems/stars", () => {
    const solar = Solar.fromYmdHms(1990, 1, 15, 10, 30, 0);
    const board = buildBoard(determineJuDun(solar, solar.getLunar()));

    expect(board.palaces).toHaveLength(8);
    expect(board.palaces.map((p) => p.palace).sort()).toEqual([1, 2, 3, 4, 6, 7, 8, 9]);

    const palace2 = board.palaces.find((p) => p.palace === 2)!;
    expect(palace2.stem).toContain("/");
    expect(palace2.star).toContain("/");
  });
});

describe("qimen calculate", () => {
  it("returns a board with the expected shape", () => {
    const board = calculate({ year: 1990, month: 1, day: 15, hour: 10, minute: 30 });
    expect(board.ju).toBeGreaterThanOrEqual(1);
    expect(board.ju).toBeLessThanOrEqual(9);
    expect(board.palaces.length).toBe(8);
  });
});
