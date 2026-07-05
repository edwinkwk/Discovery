/**
 * True solar time correction, needed by BaZi/Zi Wei hour-pillar (shichen) boundaries.
 *
 * correction (minutes) = longitude offset from the timezone's standard meridian
 *                       + equation of time at the given date
 *
 * Longitude offset: 4 minutes per degree east of the standard meridian is added
 * (local solar time runs ahead of zone time east of the meridian), subtracted west of it.
 * Standard meridian = utcOffsetMinutes/60 * 15 degrees (15 deg per hour of UTC offset).
 */
export function longitudeCorrectionMinutes(longitude: number, utcOffsetMinutes: number): number {
  const standardMeridian = (utcOffsetMinutes / 60) * 15;
  return (longitude - standardMeridian) * 4;
}

/**
 * Equation of time in minutes, using the standard low-precision solar approximation
 * (Meeus, "Astronomical Algorithms", ch. 28, simplified form).
 */
export function equationOfTimeMinutes(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - start) / 86_400_000) + 1;
  const B = (2 * Math.PI * (dayOfYear - 81)) / 364;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

export function trueSolarTimeCorrectionMinutes(
  longitude: number,
  utcOffsetMinutes: number,
  utcDate: Date
): number {
  return longitudeCorrectionMinutes(longitude, utcOffsetMinutes) + equationOfTimeMinutes(utcDate);
}
