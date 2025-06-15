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
          content: `You are a Bazi expert providing relationship-specific compatibility readings. Use conversational, direct language with "You" for the user and "They" for the partner. 
          Focus on elemental dynamics and practical relationship insights. Keep tone warm, postive, and honest about challenges. Generate reading tailored to relationtype: ${relationshipType}`,
        },
        {
          role: "user",
          content: `Generate a compatibility reading for these two Bazi charts:

            Person 1 (User):
            Chinese Characters: ${profile.chinese_characters}
            Analysis: ${JSON.stringify(profile.analysis)}

            Person 2 (Partner):
            Chinese Characters: ${partnerChart.chineseCharacters}
            Analysis: ${JSON.stringify(partnerChart.analysis)}
            
            Relationship Type: ${relationshipType}

            Create a natural, conversational reading using "You" for the user and "They" for the partner. Include these key areas with the specified format:

            **PAIR READING**

            **Overview:** Start with a short paragraph (3-4 sentences) that captures the essence of this pairing and their overall dynamic.

            **Elemental Interaction:** Start with the elemental dynamic (e.g., "土 vs 水 — Control Cycle") then provide bullet points explaining how this plays out between them practically.

            **Communication Style:** Use bullet points to describe how they express themselves differently and what this means for understanding each other.

            **Emotional Compatibility:** Use bullet points to describe their emotional needs and chemistry.

            **Hidden Tensions:** Use bullet points to explain what underlying conflicts might arise based on their elemental natures.

            **Growth Potential Together:** Use bullet points to describe what they can learn from each other and how they evolve together.

            Format each section (except Overview) with bullet points using "•" symbols with proper spacing like this example:

            • [bullet point 1]

            • [bullet point 2]

            • [bullet point 3]

            Each bullet point should be on its own line with a blank line between each one for better readability. Use appropriate emojis in your headings. Keep tone warm, positive, but honest. Let each reading be unique to their specific elemental combination and relationship dynamics. Avoid formulaic language - make it feel like personalized insight.`,
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
