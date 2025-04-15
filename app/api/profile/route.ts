import { NextResponse } from "next/server";
import { BaziCalculator } from "@/lib/bazi-calculator-by-alvamind/src/bazi-calculator";

export async function POST(request: Request) {
  try {
    // Initialize calculator with hardcoded values
    const calculator = new BaziCalculator(
      1990, // Year
      5, // Month
      10, // Day
      12, // Hour (24-hour format)
      "male" // Gender
    );

    // Get Bazi results
    const completeAnalysis = calculator.getCompleteAnalysis();
    console.log("Bazi Results:", completeAnalysis);

    // Return just the Bazi analysis data
    return NextResponse.json(
      {
        success: true,
        baziAnalysis: completeAnalysis,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in Bazi calculation:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate Bazi analysis",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
