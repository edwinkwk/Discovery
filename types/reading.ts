export interface BirthInput {
  /** Gregorian calendar date, wall-clock local time at the birth place */
  year: number;
  month: number; // 1-12
  day: number;
  hour: number; // 0-23
  minute: number;
  gender: "male" | "female";
  place: string;
  latitude: number;
  longitude: number;
  /** Full birth name, used only by numerology. Optional — numerology falls back to date-only numbers without it. */
  fullName?: string;
}

export interface ResolvedBirthInput extends BirthInput {
  /** IANA timezone name resolved from lat/long, e.g. "America/New_York" */
  timeZone: string;
  /** UTC offset in minutes at the birth instant, including historical DST */
  utcOffsetMinutes: number;
  /** True solar time correction applied, in minutes (can be negative) */
  solarTimeCorrectionMinutes: number;
  /** Whether timezone/offset resolution is considered reliable (false for edge cases, e.g. pre-1970 dates) */
  timeZoneReliable: boolean;
}

export type SystemId =
  | "western-astrology"
  | "bazi"
  | "ziwei"
  | "qimen"
  | "numerology";

export interface StructuredTraits {
  system: SystemId;
  label: string;
  /** Short list of key facts specific to this system, e.g. "Sun in Leo", "Day Master: Jia Wood" */
  headline: string[];
  /** Descriptive trait/theme statements this system contributes to the synthesis */
  traits: string[];
  /** Raw calculation data for optional per-system UI display */
  raw: unknown;
}

export interface SystemResult {
  system: SystemId;
  ok: boolean;
  traits?: StructuredTraits;
  error?: string;
}

export interface SynthesizedReading {
  narrative: string;
  systemResults: SystemResult[];
  warnings: string[];
}
