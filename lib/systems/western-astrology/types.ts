export interface PlanetPlacement {
  body: string;
  sign: string;
  house: string;
  isRetrograde: boolean;
}

export interface AspectSummary {
  point1: string;
  point2: string;
  aspect: string;
  orb: number;
}

export interface WesternAstrologyChart {
  sunSign: string;
  moonSign: string;
  ascendantSign: string;
  planets: PlanetPlacement[];
  majorAspects: AspectSummary[];
}
