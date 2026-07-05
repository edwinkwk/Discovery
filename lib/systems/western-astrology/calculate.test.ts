import { describe, it, expect } from "vitest";
import { calculate } from "./calculate";

describe("western astrology calculate", () => {
  it("matches known chart for 1990-01-15 10:30 New York", () => {
    const chart = calculate({
      year: 1990,
      month: 1,
      day: 15,
      hour: 10,
      minute: 30,
      latitude: 40.7128,
      longitude: -74.006,
    });

    expect(chart.sunSign).toBe("Capricorn");
    expect(chart.moonSign).toBe("Virgo");
    expect(chart.planets).toHaveLength(10);
    expect(chart.majorAspects.length).toBeGreaterThan(0);
  });
});
