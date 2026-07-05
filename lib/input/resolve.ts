import { DateTime } from "luxon";
import type { BirthInput, ResolvedBirthInput } from "@/types/reading";
import { resolveTimeZone } from "./timezone";
import { trueSolarTimeCorrectionMinutes } from "./solarTime";

export interface ResolvedInputWithSolarTime {
  resolved: ResolvedBirthInput;
  /** Local wall-clock birth date/time, adjusted by the true solar time correction. */
  solarAdjusted: { year: number; month: number; day: number; hour: number; minute: number };
  utcDateTime: DateTime;
}

export function resolveBirthInput(input: BirthInput): ResolvedInputWithSolarTime {
  const wallClock = {
    year: input.year,
    month: input.month,
    day: input.day,
    hour: input.hour,
    minute: input.minute,
  };

  const tz = resolveTimeZone(input.latitude, input.longitude, wallClock);

  const localDateTime = DateTime.fromObject(wallClock, { zone: tz.timeZone });
  const utcDateTime = localDateTime.toUTC();

  const solarTimeCorrectionMinutes = trueSolarTimeCorrectionMinutes(
    input.longitude,
    tz.utcOffsetMinutes,
    utcDateTime.toJSDate()
  );

  const solarAdjustedDateTime = localDateTime.plus({ minutes: solarTimeCorrectionMinutes });

  const resolved: ResolvedBirthInput = {
    ...input,
    timeZone: tz.timeZone,
    utcOffsetMinutes: tz.utcOffsetMinutes,
    solarTimeCorrectionMinutes,
    timeZoneReliable: tz.reliable,
  };

  return {
    resolved,
    solarAdjusted: {
      year: solarAdjustedDateTime.year,
      month: solarAdjustedDateTime.month,
      day: solarAdjustedDateTime.day,
      hour: solarAdjustedDateTime.hour,
      minute: solarAdjustedDateTime.minute,
    },
    utcDateTime,
  };
}
