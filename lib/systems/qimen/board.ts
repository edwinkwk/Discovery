import type { Lunar, Solar } from "lunar-typescript";
import type { DunDirection, QiMenBoard, QiMenPalaceEntry } from "./types";

/**
 * Classical Ju/Dun table: for each of the 24 solar terms (jieqi), which "Dun" (Yang from
 * Winter Solstice to before Summer Solstice, Yin from Summer Solstice to before Winter
 * Solstice) is in effect, and the Ju number (1-9) for each of the 3 five-day Yuan periods
 * (upper/middle/lower) within that jieqi's ~15-day span.
 *
 * NOTE: this is the standard textbook table without the "chao-shen/jie-qi" leap-day
 * correction some almanacs apply near jieqi boundaries — a known simplification.
 */
const JIEQI_DUN_JU: Record<string, { dun: DunDirection; ju: [number, number, number] }> = {
  冬至: { dun: "yang", ju: [1, 7, 4] },
  小寒: { dun: "yang", ju: [2, 8, 5] },
  大寒: { dun: "yang", ju: [3, 9, 6] },
  立春: { dun: "yang", ju: [8, 5, 2] },
  雨水: { dun: "yang", ju: [9, 6, 3] },
  惊蛰: { dun: "yang", ju: [1, 7, 4] },
  春分: { dun: "yang", ju: [3, 9, 6] },
  清明: { dun: "yang", ju: [4, 1, 7] },
  谷雨: { dun: "yang", ju: [5, 2, 8] },
  立夏: { dun: "yang", ju: [4, 1, 7] },
  小满: { dun: "yang", ju: [5, 2, 8] },
  芒种: { dun: "yang", ju: [6, 3, 9] },
  夏至: { dun: "yin", ju: [9, 3, 6] },
  小暑: { dun: "yin", ju: [8, 2, 5] },
  大暑: { dun: "yin", ju: [7, 1, 4] },
  立秋: { dun: "yin", ju: [2, 5, 8] },
  处暑: { dun: "yin", ju: [1, 4, 7] },
  白露: { dun: "yin", ju: [9, 3, 6] },
  秋分: { dun: "yin", ju: [7, 1, 4] },
  寒露: { dun: "yin", ju: [6, 9, 3] },
  霜降: { dun: "yin", ju: [5, 8, 2] },
  立冬: { dun: "yin", ju: [6, 9, 3] },
  小雪: { dun: "yin", ju: [5, 8, 2] },
  大雪: { dun: "yin", ju: [4, 7, 1] },
};

// getJieQiTable() also includes boundary entries keyed by the English/pinyin constant
// names (for the jieqi just before/after the table's main span) — map those back to
// their canonical Chinese name so lookups against JIEQI_DUN_JU work uniformly.
const BOUNDARY_KEY_TO_CANONICAL: Record<string, string> = {
  DA_XUE: "大雪",
  DONG_ZHI: "冬至",
  XIAO_HAN: "小寒",
  DA_HAN: "大寒",
  LI_CHUN: "立春",
  YU_SHUI: "雨水",
  JING_ZHE: "惊蛰",
};

const PALACE_DIRECTIONS: Record<number, string> = {
  1: "North (Kan)",
  2: "Southwest (Kun)",
  3: "East (Zhen)",
  4: "Southeast (Xun)",
  5: "Center",
  6: "Northwest (Qian)",
  7: "West (Dui)",
  8: "Northeast (Gen)",
  9: "South (Li)",
};

// Fixed home-palace order (index i -> home palace i+1) for the 6 Yi + 3 Qi stems,
// the 9 stars, and the 8 gates (palace 5/center has no gate of its own; it "borrows"
// palace 2, per the classical 五寄坤二 rule, applied when rendering the final board).
const STEM_HOME_ORDER = ["戊", "己", "庚", "辛", "壬", "癸", "丁", "丙", "乙"];
const STAR_HOME_ORDER = ["天蓬", "天芮", "天冲", "天辅", "天禽", "天心", "天柱", "天任", "天英"];
const GATE_HOME_ORDER = ["休门", "死门", "伤门", "杜门", "", "开门", "惊门", "生门", "景门"];

function rotatePalaceSequence(startPalace: number, direction: DunDirection): number[] {
  const seq: number[] = [];
  let p = startPalace;
  for (let i = 0; i < 9; i++) {
    seq.push(p);
    p = direction === "yang" ? (p % 9) + 1 : ((p - 2 + 9) % 9) + 1;
  }
  return seq;
}

export interface JuDunResult {
  jieqi: string;
  dun: DunDirection;
  ju: number;
  yuan: "upper" | "middle" | "lower";
}

/**
 * Determine the Ju number and Yin/Yang Dun in effect for a birth moment, using the
 * governing solar term and the day's position (in 5-day Fu Tou groups) within it.
 */
export function determineJuDun(solar: Solar, lunar: Lunar): JuDunResult {
  const jieQiTable = lunar.getJieQiTable();
  const currentJulianDay = solar.getJulianDay();

  let governingName: string | null = null;
  let governingJulianDay = -Infinity;
  let governingSolar: Solar | null = null;
  for (const [rawName, jieqiSolar] of Object.entries(jieQiTable)) {
    const canonicalName = BOUNDARY_KEY_TO_CANONICAL[rawName] ?? rawName;
    if (!(canonicalName in JIEQI_DUN_JU)) continue;
    const jd = (jieqiSolar as Solar).getJulianDay();
    if (jd <= currentJulianDay && jd > governingJulianDay) {
      governingJulianDay = jd;
      governingName = canonicalName;
      governingSolar = jieqiSolar as Solar;
    }
  }

  if (!governingName || !governingSolar) {
    throw new Error("Could not determine the governing solar term (jieqi) for this birth date");
  }

  const jieqiSolar = governingSolar;
  const jieqiDayGanIndex = jieqiSolar.getLunar().getDayGanIndex();
  const jieqiFuTouJulianDay = Math.floor(jieqiSolar.getJulianDay()) - (jieqiDayGanIndex % 5);

  const currentDayGanIndex = lunar.getDayGanIndex();
  const currentFuTouJulianDay = Math.floor(currentJulianDay) - (currentDayGanIndex % 5);

  const fuTouGroupsSinceJieqi = Math.round((currentFuTouJulianDay - jieqiFuTouJulianDay) / 5);
  const yuanIndex = ((fuTouGroupsSinceJieqi % 3) + 3) % 3;

  const { dun, ju } = JIEQI_DUN_JU[governingName];
  const yuanNames: Array<"upper" | "middle" | "lower"> = ["upper", "middle", "lower"];

  return {
    jieqi: governingName,
    dun,
    ju: ju[yuanIndex],
    yuan: yuanNames[yuanIndex],
  };
}

export function buildBoard(juDun: JuDunResult): QiMenBoard {
  const sequence = rotatePalaceSequence(juDun.ju, juDun.dun);

  const byPalace = new Map<number, QiMenPalaceEntry>();
  for (let i = 0; i < 9; i++) {
    const palace = sequence[i];
    byPalace.set(palace, {
      palace,
      direction: PALACE_DIRECTIONS[palace],
      stem: STEM_HOME_ORDER[i],
      star: STAR_HOME_ORDER[i],
      gate: GATE_HOME_ORDER[i],
    });
  }

  // Palace 5 (center) has no compass gate/direct star seat of its own; fold its
  // contents into palace 2, per the classical "5 borrows Kun-2" (五寄坤二) rule.
  // Both palaces' stems/stars are combined rather than dropping the center's data.
  const center = byPalace.get(5);
  const palace2 = byPalace.get(2);
  if (center && palace2) {
    palace2.stem = `${palace2.stem}/${center.stem}`;
    palace2.star = `${palace2.star}/${center.star}`;
    palace2.gate = palace2.gate || center.gate;
  }
  byPalace.delete(5);

  const palaces = Array.from(byPalace.values()).sort((a, b) => a.palace - b.palace);

  return {
    jieqi: juDun.jieqi,
    dun: juDun.dun,
    ju: juDun.ju,
    yuan: juDun.yuan,
    palaces,
  };
}
