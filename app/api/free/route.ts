import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { generateBaziData } from "./(components)/calculator";
import { generateBaziReading } from "./(components)/generateReading";
import { getDateMappingLoader } from "../../../lib/bazi-calculator-by-alvamind/src/utils/date-mapping";

// Initialize Adaptive OpenAI client
const openai = new OpenAI({
  apiKey: process.env.ADAPTIVE_API_KEY,
  baseURL: "https://llmadaptive.uk/api/v1",
});

export async function POST(req: NextRequest) {
  try {
    // Simple API key protection - add DEMO_API_KEY to your .env.local
    const apiKey = req.headers.get("x-api-key");
    const expectedKey = process.env.DEMO_API_KEY;

    if (expectedKey && apiKey !== expectedKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const body = await req.json();
    const { year, month, day, hour, gender } = body;

    // Get singleton DateMappingLoader
    const dateLoader = getDateMappingLoader();

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
