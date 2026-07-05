import { describe, it, expect } from "vitest";
import { calculate, calculateLifePathNumber, reduceNumber } from "./calculate";

describe("reduceNumber", () => {
  it("reduces to a single digit", () => {
    expect(reduceNumber(48)).toBe(3); // 4+8=12 -> 1+2=3
    expect(reduceNumber(23)).toBe(5); // 2+3=5
  });

  it("preserves master numbers", () => {
    expect(reduceNumber(11)).toBe(11);
    expect(reduceNumber(22)).toBe(22);
    expect(reduceNumber(33)).toBe(33);
  });

  it("stops reducing once an intermediate sum is a master number", () => {
    // 29 -> 2+9=11, and 11 is a master number, so reduction stops there
    expect(reduceNumber(29)).toBe(11);
  });
});

describe("calculateLifePathNumber", () => {
  it("matches a known hand-computed example: 1990-01-15", () => {
    // month=1->1, day=15->1+5=6, year=1990->1+9+9+0=19->1+9=10->1+0=1
    // sum = 1+6+1 = 8
    const result = calculateLifePathNumber(1990, 1, 15);
    expect(result.value).toBe(8);
    expect(result.isMaster).toBe(false);
  });

  it("produces a master number life path: 1988-11-29", () => {
    // month=11 (master, kept as 11), day=29->2+9=11 (master, kept), year=1988->1+9+8+8=26->2+6=8
    // sum = 11+11+8 = 30 -> 3+0 = 3
    const result = calculateLifePathNumber(1988, 11, 29);
    expect(result.value).toBe(3);
  });
});

describe("calculate", () => {
  it("computes name-based numbers when fullName is provided", () => {
    const chart = calculate({ year: 1990, month: 1, day: 15, fullName: "John Doe" });
    expect(chart.expressionNumber).toBeDefined();
    expect(chart.soulUrgeNumber).toBeDefined();
    expect(chart.personalityNumber).toBeDefined();
  });

  it("omits name-based numbers without fullName", () => {
    const chart = calculate({ year: 1990, month: 1, day: 15 });
    expect(chart.expressionNumber).toBeUndefined();
  });
});
