import { Solar, EightChar } from "lunar-typescript";
import type { BaziChart, Pillar } from "./types";

const WU_XING_KEYS = ["木", "火", "土", "金", "水"];

function buildPillar(
  name: Pillar["name"],
  gan: string,
  zhi: string,
  hideGan: string[],
  wuXing: string,
  naYin: string,
  shiShenGan: string
): Pillar {
  return { name, ganZhi: `${gan}${zhi}`, gan, zhi, hideGan, wuXing, naYin, shiShenGan };
}

export function calculate(solarAdjusted: {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}): BaziChart {
  const solar = Solar.fromYmdHms(
    solarAdjusted.year,
    solarAdjusted.month,
    solarAdjusted.day,
    solarAdjusted.hour,
    solarAdjusted.minute,
    0
  );
  const lunar = solar.getLunar();
  const eightChar: EightChar = lunar.getEightChar();

  const pillars: Pillar[] = [
    buildPillar(
      "year",
      eightChar.getYearGan(),
      eightChar.getYearZhi(),
      eightChar.getYearHideGan(),
      eightChar.getYearWuXing(),
      eightChar.getYearNaYin(),
      eightChar.getYearShiShenGan()
    ),
    buildPillar(
      "month",
      eightChar.getMonthGan(),
      eightChar.getMonthZhi(),
      eightChar.getMonthHideGan(),
      eightChar.getMonthWuXing(),
      eightChar.getMonthNaYin(),
      eightChar.getMonthShiShenGan()
    ),
    buildPillar(
      "day",
      eightChar.getDayGan(),
      eightChar.getDayZhi(),
      eightChar.getDayHideGan(),
      eightChar.getDayWuXing(),
      eightChar.getDayNaYin(),
      eightChar.getDayShiShenGan()
    ),
    buildPillar(
      "hour",
      eightChar.getTimeGan(),
      eightChar.getTimeZhi(),
      eightChar.getTimeHideGan(),
      eightChar.getTimeWuXing(),
      eightChar.getTimeNaYin(),
      eightChar.getTimeShiShenGan()
    ),
  ];

  const wuXingCounts: Record<string, number> = {};
  for (const key of WU_XING_KEYS) wuXingCounts[key] = 0;
  for (const pillar of pillars) {
    // wuXing string is 2 concatenated characters: stem element + branch element, e.g. "土火"
    for (const element of pillar.wuXing) {
      if (wuXingCounts[element] !== undefined) wuXingCounts[element]++;
    }
  }

  return {
    pillars,
    dayMasterGan: eightChar.getDayGan(),
    dayMasterWuXing: eightChar.getDayWuXing()[0],
    wuXingCounts,
    zodiac: lunar.getYearShengXiao(),
  };
}
