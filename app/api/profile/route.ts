import { NextRequest, NextResponse } from "next/server";

import { OpenAI } from "openai";
import { generateBaziData } from "./(components)/calculator";
import { generateBaziReading } from "./(components)/generateReading";
import { createClient } from "@/utils/supabase/server";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();

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

    // Get the currently authenticated user from Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check if a user is authenticated
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // AI Reading
    const reading = await generateBaziReading(
      chineseCharacters,
      JSON.stringify(analysis)
    );

    // Save user data, analysis, and reading to the database
    const { data: savedProfile, error: saveError } = await supabase
      .from("profiles")
      .upsert({
        user_id: user.id,
        year,
        month,
        day,
        hour,
        gender,
        chinese_characters: chineseCharacters,
        analysis: analysis,
        reading: reading, // Add the reading here
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (saveError) {
      console.error("Database operation failed", {
        error: saveError.code,
      });
      return NextResponse.json(
        { error: "Failed to save profile data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Bazi reading generated and saved successfully",
      chineseCharacters,
      analysis,
      reading,
      profile: savedProfile,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Generation failed", {
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: "Failed to generate Bazi reading" },
      { status: 500 }
    );
  }
}
