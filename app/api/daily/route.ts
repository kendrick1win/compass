import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { createClient } from "@/utils/supabase/server";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  try {
    // Get the currently authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user is subscribed - get most recent subscription
    const { data: subscriptions, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (
      subscriptionError ||
      !subscriptions ||
      subscriptions.length === 0 ||
      subscriptions[0]?.status !== "active"
    ) {
      return NextResponse.json(
        { error: "Subscription required" },
        { status: 403 }
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

    // Get today's date
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];

    // Generate daily reading using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a Bazi expert providing daily readings based on a person's birth chart.",
        },
        {
          role: "user",
          content: `Generate a daily reading for ${dateStr} based on the following Bazi chart:
            Chinese Characters: ${profile.chinese_characters}
            Analysis: ${JSON.stringify(profile.analysis)}
            
            Format the response EXACTLY as follows:
            
            # 🌟 TODAY'S READING
            
            Lucky Number: [generate a lucky number based on the chart and today's date.]
            
            Lucky Colour: [generate a lucky color based on the chart and today's date.]
            
            Quote of the day: "[generate an inspiring quote]"
            
            ## General Outlook for ${dateStr}
            [Write exactly 2 concise paragraphs using "you" language. Make it personal and insightful. No questions or disclaimers.]
            
            ## 🌱 Activities To Embrace or Avoid
            **DO's:**
            • [bullet point 1]
            • [bullet point 2] 
            • [bullet point 3]
            
            **DONT'S:**
            • [bullet point 1]
            • [bullet point 2]
            • [bullet point 3]
            
            ## 🎁 Potential Opportunities or Challenges (${dateStr})
            **Opportunities:**

            🌟 [opportunity 1]
            
            💡 [opportunity 2]
            
            🤝 [opportunity 3]
            
            **Challenges:**

            🔥 [challenge 1]
            
            🕰 [challenge 2]
            
            🌀 [challenge 3]
            
            Keep it practical. Write personality profile paragraphs using "you" language. 
            Make it personal and insightful. No questions or disclaimers. Use markdown format to display headers with emojis. Add a section for DO's and DONT'S. Use different emojis each time for opportunities and challenges to keep the content fresh and varied.`,
        },
      ],
    });

    const dailyReading = completion.choices[0].message.content;

    // Save the daily reading to the database
    const { data: savedReading, error: saveError } = await supabase
      .from("daily_readings")
      .upsert({
        user_id: user.id,
        date: dateStr,
        reading: dailyReading,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (saveError) {
      console.error("Failed to save daily reading", saveError);
      return NextResponse.json(
        { error: "Failed to save daily reading" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Daily reading generated successfully",
      reading: dailyReading,
      date: dateStr,
    });
  } catch (error) {
    console.error("Daily reading generation failed", error);
    return NextResponse.json(
      { error: "Failed to generate daily reading" },
      { status: 500 }
    );
  }
}
