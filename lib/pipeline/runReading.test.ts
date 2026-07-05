import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/synthesis/geminiClient", () => ({
  getGeminiClient: () => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: "A synthesized narrative reading.",
      }),
    },
  }),
}));

import { runReading } from "./runReading";

describe("runReading", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("runs all 5 systems and synthesizes a reading for a valid modern birth date", async () => {
    const reading = await runReading({
      year: 1990,
      month: 1,
      day: 15,
      hour: 10,
      minute: 30,
      gender: "male",
      place: "New York, NY",
      latitude: 40.7128,
      longitude: -74.006,
      fullName: "Jane Doe",
    });

    expect(reading.narrative).toBe("A synthesized narrative reading.");
    expect(reading.systemResults).toHaveLength(5);
    expect(reading.systemResults.every((r) => r.ok)).toBe(true);
    expect(reading.warnings).toHaveLength(0);
  });

  it("surfaces a timezone-reliability warning for pre-1900 birth dates", async () => {
    const reading = await runReading({
      year: 1850,
      month: 6,
      day: 1,
      hour: 12,
      minute: 0,
      gender: "female",
      place: "London, UK",
      latitude: 51.5074,
      longitude: -0.1278,
    });

    expect(reading.warnings.length).toBeGreaterThan(0);
    expect(reading.warnings[0]).toContain("1850");
  });

  it("rejects invalid input via validation", async () => {
    await expect(
      runReading({
        year: 1990,
        month: 13,
        day: 15,
        hour: 10,
        minute: 30,
        gender: "male",
        place: "Nowhere",
        latitude: 0,
        longitude: 0,
      })
    ).rejects.toThrow();
  });
});
