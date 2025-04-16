import { BaziCalculator } from "@/lib/bazi-calculator-by-alvamind/src/bazi-calculator";
import { GenderType } from "@/lib/bazi-calculator-by-alvamind/src/types";

export function generateBaziData(
  year: number,
  month: number,
  day: number,
  hour: number,
  gender: GenderType
) {
  const calculator = new BaziCalculator(year, month, day, hour, gender);
  const analysis = calculator.getCompleteAnalysis();
  const chineseCharacters = calculator.toString();

  return { analysis, chineseCharacters };
}
