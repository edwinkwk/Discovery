export interface Pillar {
  name: "year" | "month" | "day" | "hour";
  ganZhi: string;
  gan: string;
  zhi: string;
  hideGan: string[];
  wuXing: string;
  naYin: string;
  shiShenGan: string;
}

export interface BaziChart {
  pillars: Pillar[];
  dayMasterGan: string;
  dayMasterWuXing: string;
  /** Count of each of the 5 elements (Wood/Fire/Earth/Metal/Water) across all 4 pillars' stems */
  wuXingCounts: Record<string, number>;
  zodiac: string;
}
