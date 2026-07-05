import { find } from "geo-tz/all";
import { DateTime } from "luxon";

export interface TimeZoneResolution {
  timeZone: string;
  utcOffsetMinutes: number;
  /** false for dates old enough that historical DST/LMT rules are not reliably known */
  reliable: boolean;
}

/**
 * Resolve the IANA timezone at a lat/long, and the UTC offset in effect for a given
 * local wall-clock birth date/time (including historical DST where the tz database has it).
 */
export function resolveTimeZone(
  latitude: number,
  longitude: number,
  wallClock: { year: number; month: number; day: number; hour: number; minute: number }
): TimeZoneResolution {
  const zones = find(latitude, longitude);
  if (zones.length === 0) {
    throw new Error(`No timezone found for coordinates (${latitude}, ${longitude})`);
  }
  const timeZone = zones[0];

  const dt = DateTime.fromObject(
    {
      year: wallClock.year,
      month: wallClock.month,
      day: wallClock.day,
      hour: wallClock.hour,
      minute: wallClock.minute,
    },
    { zone: timeZone }
  );

  if (!dt.isValid) {
    throw new Error(`Could not resolve local time in zone ${timeZone}: ${dt.invalidReason}`);
  }

  return {
    timeZone,
    utcOffsetMinutes: dt.offset,
    // Historical DST/LMT rules become increasingly approximate before ~1900 in the tz database.
    reliable: wallClock.year >= 1900,
  };
}
