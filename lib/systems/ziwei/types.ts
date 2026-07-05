export interface ZiweiPalace {
  name: string;
  heavenlyStem: string;
  earthlyBranch: string;
  majorStars: string[];
  minorStars: string[];
  adjectiveStars: string[];
}

export interface ZiweiChart {
  sign: string;
  zodiac: string;
  soul: string;
  body: string;
  fiveElementsClass: string;
  palaces: ZiweiPalace[];
  soulPalace?: ZiweiPalace;
  careerPalace?: ZiweiPalace;
  wealthPalace?: ZiweiPalace;
}
