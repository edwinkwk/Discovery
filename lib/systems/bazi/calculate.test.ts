import { describe, it, expect } from "vitest";
import { calculate } from "./calculate";

describe("bazi calculate", () => {
  it("matches known EightChar output for 1990-01-15 10:30", () => {
    const chart = calculate({ year: 1990, month: 1, day: 15, hour: 10, minute: 30 });

    expect(chart.pillars.map((p) => p.ganZhi)).toEqual(["己巳", "丁丑", "庚辰", "辛巳"]);
    expect(chart.dayMasterGan).toBe("庚");
    expect(chart.dayMasterWuXing).toBe("金");
    expect(chart.zodiac).toBe("蛇");
  });

  it("counts wu xing elements across all 4 pillars (8 characters total)", () => {
    const chart = calculate({ year: 1990, month: 1, day: 15, hour: 10, minute: 30 });
    const total = Object.values(chart.wuXingCounts).reduce((a, b) => a + b, 0);
    expect(total).toBe(8);
  });
});
