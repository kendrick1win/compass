import { NextRequest, NextResponse } from "next/server";
import { BaziCalculator } from "@/lib/bazi-calculator-by-alvamind/src/bazi-calculator";
import { OpenAI } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { year, month, day, hour, gender } = body;

    // Generate Bazi analysis
    const calculator = new BaziCalculator(year, month, day, hour, gender);
    const analysis = calculator.getCompleteAnalysis();
    const chineseCharacters = calculator.toString();

    // Create a prompt for AI to generate a reading
    const prompt = `
    Based on this BaZi chart analysis:
    
    Chinese characters: ${chineseCharacters}
    
    Bazi analysis: ${analysis}
    
    Please provide a concise (300-500 word) Bazi reading that offers:
    1. An overview of this person's character
    2. Key strengths and weaknesses
    3. General career aptitude
    4. Important life insights
    
    Keep the tone professional but accessible. Focus only on insights that can be directly derived from the BaZi chart.
    `;

    // Generate the reading using AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // or your preferred model
      messages: [
        {
          role: "system",
          content:
            "You are an expert in Chinese Bazi analysis, providing insightful readings based on birth charts.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const reading = completion.choices[0].message.content;

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
