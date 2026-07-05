import { describe, it, expect } from "vitest";
import { calculate, hourToTimeIndex } from "./calculate";

describe("hourToTimeIndex", () => {
  it("maps early/late zi hour boundaries correctly", () => {
    expect(hourToTimeIndex(0)).toBe(0);
    expect(hourToTimeIndex(23)).toBe(12);
  });

  it("maps the other 11 two-hour shichen periods", () => {
    expect(hourToTimeIndex(1)).toBe(1);
    expect(hourToTimeIndex(2)).toBe(1);
    expect(hourToTimeIndex(3)).toBe(2);
    expect(hourToTimeIndex(11)).toBe(6);
    expect(hourToTimeIndex(12)).toBe(6);
    expect(hourToTimeIndex(21)).toBe(11);
    expect(hourToTimeIndex(22)).toBe(11);
  });
});

describe("ziwei calculate", () => {
  it("matches known astrolabe output for 1990-01-15 10:30 male", () => {
    const chart = calculate({ year: 1990, month: 1, day: 15, hour: 10, minute: 30, gender: "male" });

    expect(chart.sign).toBe("capricorn");
    expect(chart.zodiac).toBe("snake");
    expect(chart.soul).toBe("judge");
    expect(chart.body).toBe("advisor");
    expect(chart.fiveElementsClass).toBe("metal 4th");
    expect(chart.palaces).toHaveLength(12);
    expect(chart.soulPalace?.earthlyBranch).toBe("shen");
  });
});
