import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateBaziReading(
  chineseCharacters: string,
  analysis: string
) {
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
  Write personality profile paragraphs using "you" language. Make it personal and insightful. No questions or disclaimers Use markdown format to display headers with emojis. Add a section for DO's and DONT'S.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
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

  return completion.choices[0].message.content;
}
