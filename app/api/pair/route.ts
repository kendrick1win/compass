import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { createClient } from "@/utils/supabase/server";
import { generateBaziData } from "./(components)/calculator";
import { GenderType } from "@/lib/bazi-calculator-by-alvamind/src/types";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define valid relationship types
type RelationType =
  | "romantic_partner"
  | "family_member"
  | "friend"
  | "business_partner"
  | "colleague";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  try {
    const {
      partnerName,
      partnerBirthdate,
      partnerBirthtime, // This is now an integer (0-23)
      partnerGender,
      relationshipType,
      specificRelation,
    } = await req.json();

    // Validate required fields and birth time range
    if (
      !partnerName ||
      !partnerBirthdate ||
      !partnerGender ||
      !relationshipType ||
      typeof partnerBirthtime !== "number" ||
      partnerBirthtime < 0 ||
      partnerBirthtime > 23
    ) {
      return NextResponse.json(
        {
          error:
            "Partner's name and complete birth information (including hour 0-23) and relationship type are required",
        },
        { status: 400 }
      );
    }

    // Parse date and generate chart with hour directly
    const birthDate = new Date(partnerBirthdate);

    // Generate partner's Bazi chart
    const partnerChart = generateBaziData(
      birthDate.getFullYear(),
      birthDate.getMonth() + 1, // Months are 0-based in JS
      birthDate.getDate(),
      partnerBirthtime, // Use the hour directly as an integer
      partnerGender.toLowerCase() as GenderType
    );

    // Get the currently authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check existing pair readings count
    const { count, error: countError } = await supabase
      .from("pair_readings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (countError) {
      return NextResponse.json(
        { error: "Failed to check pair readings limit" },
        { status: 500 }
      );
    }

    if (count && count >= 10) {
      return NextResponse.json(
        { error: "Maximum limit of 10 pair readings reached" },
        { status: 400 }
      );
    }

    // Fetch user's profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Generate pair reading using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a Bazi expert providing relationship-specific compatibility readings based on two people's birth charts. Use warm and personal langauge like 'you'(user) and 'they'(partner). Generate reading tailored to relationtype: ${relationshipType}`,
        },
        {
          role: "user",
          content: `Generate a compatibility reading for these two peoples' Bazi Charts.

            Person 1 (User):
            Chinese Characters: ${profile.chinese_characters}
            Analysis: ${JSON.stringify(profile.analysis)}

            Person 2:
            Chinese Characters: ${partnerChart.chineseCharacters}
            Analysis: ${JSON.stringify(partnerChart.analysis)}
            
            Include:
            1. Individual chart characteristics
            2. Element interactions between charts
            3. Relationship dynamics based on ${relationshipType} context
            4. Specific recommendations for harmony
            
            Format with markdown and emojis for headers. Include sections for:
            - 🔮 Overall Compatibility
            - ⚡ Energy Dynamics
            - 🤝 Relationship Wisdom
            - ✨ Growth Opportunities
            - 📝 Action Steps`,
        },
      ],
    });

    const pairReading = completion.choices[0].message.content;

    // Save the pair reading to the database
    const { data: savedReading, error: saveError } = await supabase
      .from("pair_readings")
      .insert({
        user_id: user.id,
        partner_name: partnerName,
        partner_birthdate: partnerBirthdate,
        partner_birthtime: partnerBirthtime,
        partner_gender: partnerGender,
        partner_chart: partnerChart,
        relationship_type: relationshipType,
        specific_relation: specificRelation,
        reading: pairReading,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (saveError) {
      console.error("Failed to save pair reading", saveError);
      return NextResponse.json(
        { error: "Failed to save pair reading" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Pair reading generated successfully",
      reading: pairReading,
    });
  } catch (error) {
    console.error("Pair reading generation failed", error);
    return NextResponse.json(
      { error: "Failed to generate pair reading" },
      { status: 500 }
    );
  }
}
