import type { BirthInput, SynthesizedReading, SystemResult, StructuredTraits } from "@/types/reading";
import { parseBirthInput } from "@/lib/input/validation";
import { resolveBirthInput } from "@/lib/input/resolve";

import { calculate as calculateNumerology } from "@/lib/systems/numerology/calculate";
import { extractTraits as extractNumerologyTraits } from "@/lib/systems/numerology/extractTraits";

import { calculate as calculateBazi } from "@/lib/systems/bazi/calculate";
import { extractTraits as extractBaziTraits } from "@/lib/systems/bazi/extractTraits";

import { calculate as calculateZiwei } from "@/lib/systems/ziwei/calculate";
import { extractTraits as extractZiweiTraits } from "@/lib/systems/ziwei/extractTraits";

import { calculate as calculateWestern } from "@/lib/systems/western-astrology/calculate";
import { extractTraits as extractWesternTraits } from "@/lib/systems/western-astrology/extractTraits";

import { calculate as calculateQimen } from "@/lib/systems/qimen/calculate";
import { extractTraits as extractQimenTraits } from "@/lib/systems/qimen/extractTraits";

import { synthesize } from "@/lib/synthesis/synthesize";

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function runReading(rawInput: unknown): Promise<SynthesizedReading> {
  const input: BirthInput = parseBirthInput(rawInput);
  const { resolved, solarAdjusted } = resolveBirthInput(input);

  const systemResults: SystemResult[] = [
    (() => {
      try {
        const chart = calculateNumerology({
          year: input.year,
          month: input.month,
          day: input.day,
          fullName: input.fullName,
        });
        return { system: "numerology" as const, ok: true, traits: extractNumerologyTraits(chart) };
      } catch (error) {
        return { system: "numerology" as const, ok: false, error: toErrorMessage(error) };
      }
    })(),
    (() => {
      try {
        const chart = calculateBazi(solarAdjusted);
        return { system: "bazi" as const, ok: true, traits: extractBaziTraits(chart) };
      } catch (error) {
        return { system: "bazi" as const, ok: false, error: toErrorMessage(error) };
      }
    })(),
    (() => {
      try {
        const chart = calculateZiwei({ ...solarAdjusted, gender: input.gender });
        return { system: "ziwei" as const, ok: true, traits: extractZiweiTraits(chart) };
      } catch (error) {
        return { system: "ziwei" as const, ok: false, error: toErrorMessage(error) };
      }
    })(),
    (() => {
      try {
        const chart = calculateWestern({
          year: input.year,
          month: input.month,
          day: input.day,
          hour: input.hour,
          minute: input.minute,
          latitude: input.latitude,
          longitude: input.longitude,
        });
        return { system: "western-astrology" as const, ok: true, traits: extractWesternTraits(chart) };
      } catch (error) {
        return { system: "western-astrology" as const, ok: false, error: toErrorMessage(error) };
      }
    })(),
    (() => {
      try {
        const board = calculateQimen(solarAdjusted);
        return { system: "qimen" as const, ok: true, traits: extractQimenTraits(board) };
      } catch (error) {
        return { system: "qimen" as const, ok: false, error: toErrorMessage(error) };
      }
    })(),
  ];

  const successfulTraits: StructuredTraits[] = systemResults
    .filter((r): r is SystemResult & { traits: StructuredTraits } => r.ok && r.traits !== undefined)
    .map((r) => r.traits);

  const narrative = await synthesize(successfulTraits);

  const warnings: string[] = [];
  if (!resolved.timeZoneReliable) {
    warnings.push(
      `Birth year ${input.year} predates reliable historical timezone data (pre-1900); the BaZi, Zi Wei, and Qi Men hour/day calculations may be inaccurate.`
    );
  }

  return { narrative, systemResults, warnings };
}
