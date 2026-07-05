import { describe, it, expect } from "vitest";
import { longitudeCorrectionMinutes, equationOfTimeMinutes } from "./solarTime";

describe("longitudeCorrectionMinutes", () => {
  it("is zero at the standard meridian", () => {
    // UTC+8 -> standard meridian 120E
    expect(longitudeCorrectionMinutes(120, 480)).toBeCloseTo(0, 5);
  });

  it("is positive east of the standard meridian", () => {
    // Shanghai (121.47E) is east of the UTC+8 meridian (120E)
    expect(longitudeCorrectionMinutes(121.47, 480)).toBeGreaterThan(0);
  });

  it("is negative west of the standard meridian", () => {
    // Chengdu (104.06E) is west of the UTC+8 meridian (120E)
    expect(longitudeCorrectionMinutes(104.06, 480)).toBeLessThan(0);
  });
});

describe("equationOfTimeMinutes", () => {
  it("stays within the known +/-16 minute range", () => {
    for (let day = 0; day < 365; day += 5) {
      const date = new Date(Date.UTC(2024, 0, 1 + day));
      const eot = equationOfTimeMinutes(date);
      expect(eot).toBeGreaterThan(-17);
      expect(eot).toBeLessThan(17);
    }
  });
});
