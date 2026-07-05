export type DunDirection = "yang" | "yin";

export interface QiMenPalaceEntry {
  palace: number;
  direction: string;
  stem: string;
  star: string;
  gate: string;
}

export interface QiMenBoard {
  jieqi: string;
  dun: DunDirection;
  ju: number;
  yuan: "upper" | "middle" | "lower";
  palaces: QiMenPalaceEntry[];
}
