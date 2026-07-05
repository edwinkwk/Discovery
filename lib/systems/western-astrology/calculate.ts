import { Origin, Horoscope } from "circular-natal-horoscope-js";
import type { WesternAstrologyChart, PlanetPlacement, AspectSummary } from "./types";

// circular-natal-horoscope-js's own type declarations are untyped (`any`) at these
// leaves; these interfaces describe just the shape this module actually reads.
interface LibCelestialBody {
  label: string;
  Sign: { label: string };
  House: { label: string };
  isRetrograde?: boolean;
}
interface LibAspect {
  point1Label: string;
  point2Label: string;
  label: string;
  orb: number;
}

const MAJOR_BODIES = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];

export function calculate(input: {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
}): WesternAstrologyChart {
  const origin = new Origin({
    year: input.year,
    month: input.month - 1, // library uses 0 = January
    date: input.day,
    hour: input.hour,
    minute: input.minute,
    latitude: input.latitude,
    longitude: input.longitude,
  });

  const horoscope = new Horoscope({
    origin,
    houseSystem: "whole-sign",
    zodiac: "tropical",
    aspectPoints: ["bodies", "angles"],
    aspectWithPoints: ["bodies", "angles"],
    aspectTypes: ["major"],
    customOrbs: {},
    language: "en",
  });

  const celestialBodies = horoscope.CelestialBodies as unknown as Record<string, LibCelestialBody>;
  const planets: PlanetPlacement[] = MAJOR_BODIES.map((key) => {
    const body = celestialBodies[key];
    return {
      body: body.label,
      sign: body.Sign.label,
      house: body.House.label,
      isRetrograde: Boolean(body.isRetrograde),
    };
  });

  const majorAspects: AspectSummary[] = (horoscope.Aspects.all as LibAspect[]).map((a) => ({
    point1: a.point1Label,
    point2: a.point2Label,
    aspect: a.label,
    orb: a.orb,
  }));

  const sun = planets.find((p) => p.body === "Sun");
  const moon = planets.find((p) => p.body === "Moon");
  const ascendant = horoscope.Ascendant as unknown as { Sign: { label: string } };

  return {
    sunSign: sun?.sign ?? "unknown",
    moonSign: moon?.sign ?? "unknown",
    ascendantSign: ascendant.Sign.label,
    planets,
    majorAspects,
  };
}
