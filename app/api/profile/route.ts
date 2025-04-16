import { NextRequest, NextResponse } from "next/server";
import { BaziCalculator } from "@/lib/bazi-calculator-by-alvamind/src/bazi-calculator";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { year, month, day, hour, gender } = body;

  const calculator = new BaziCalculator(year, month, day, hour, gender);
  const analysis = calculator.getCompleteAnalysis();
  const chineseCharacters = calculator.toString();

  return NextResponse.json({
    message: "Bazi analysis successful",
    chineseCharacters,
    analysis,
  });
}
