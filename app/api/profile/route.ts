import { NextRequest, NextResponse } from "next/server";

import { OpenAI } from "openai";
import { generateBaziData } from "./(components)/calculator";
import { generateBaziReading } from "./(components)/generateReading";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { year, month, day, hour, gender } = body;

    // Generate Bazi data using the helper
    const { analysis, chineseCharacters } = generateBaziData(
      year,
      month,
      day,
      hour,
      gender
    );

    // AI Reading
    const reading = await generateBaziReading(
      chineseCharacters,
      JSON.stringify(analysis)
    );

    return NextResponse.json({
      message: "Bazi reading generated successfully",
      chineseCharacters,
      analysis,
      reading,
    });
  } catch (error) {
    console.error("Error generating Bazi reading:", error);
    return NextResponse.json(
      { error: "Failed to generate Bazi reading" },
      { status: 500 }
    );
  }
}
