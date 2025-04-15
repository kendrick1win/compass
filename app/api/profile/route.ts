import { NextResponse } from "next/server";
import { BaziCalculator } from "@/lib/bazi-calculator-by-alvamind/src/bazi-calculator";
import OpenAI from "openai";

export async function POST(request: Request) {
  // Initialize calculator
  const calculator = new BaziCalculator(
    1990, // Year
    5, // Month
    10, // Day
    12, // Hour (24-hour format)
    "male" // Gender
  );

  // Get Bazi results
  const completeAnalysis = calculator.getCompleteAnalysis();

  console.log("Bazi Results:", { completeAnalysis });

  // Initialize DeepSeek API
  const client = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY,
  });

  // Use completeAnalysis in prompts
  const prompt1 = `Write personality profile paragraphs using "you" language. Make it personal and insightful. No questions or disclaimers.\n\nAnalysis: ${JSON.stringify(
    completeAnalysis
  )}`;

  const prompt2 = `Describe strengths and growth areas with tips. Use "you" throughout. No bullets or numbers.\n\nAnalysis: ${JSON.stringify(
    completeAnalysis
  )}`;

  const prompt3 = `Provide career, relationship, and personal development guidance. Use "you" language and flowing paragraphs.\n\nAnalysis: ${JSON.stringify(
    completeAnalysis
  )}`;

  try {
    // Call DeepSeek API for all three prompts
    const [response1, response2, response3] = await Promise.all([
      client.chat.completions.create({
        messages: [{ role: "user", content: prompt1 }],
        model: "deepseek-chat",
      }),
      client.chat.completions.create({
        messages: [{ role: "user", content: prompt2 }],
        model: "deepseek-chat",
      }),
      client.chat.completions.create({
        messages: [{ role: "user", content: prompt3 }],
        model: "deepseek-chat",
      }),
    ]);

    const summary = response1.choices[0].message.content;
    const swot = response2.choices[0].message.content;
    const special = response3.choices[0].message.content;

    console.log("DeepSeek Analysis:", { summary, swot, special });

    // Return success response
    return NextResponse.redirect(new URL("/dashboard", request.url), 303);
    // OUTPUT JSON
    // return NextResponse.json({
    //   success: true,
    //   profile: profileData,
    //   analysis: { summary, swot, special },
    //   bazi: {
    //     chinese: baziResults,
    //     english: baziEnglish
    //   }
    // }, { status: 200 });
  } catch (error) {
    console.error("Error in profile analysis:", error);
    return NextResponse.json(
      { error: "Failed to generate analysis" },
      { status: 500 }
    );
  }
}
