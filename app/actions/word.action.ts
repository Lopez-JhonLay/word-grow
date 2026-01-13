"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { WordData } from "@/lib/dictionary";

const SaveSentenceSchema = z.object({
  word: z.string(),
  definition: z.string(),
  userSentence: z.string().min(1, "Please type a sentence first."),
});

export type State = {
  message?: string | null;
  errors?: {
    userSentence?: string[];
  };
};

export interface GrammarState {
  success: boolean;
  error?: string;
  corrected?: string;
  explanation?: string;
  is_correct?: boolean;
  original?: string;
}

export async function saveUserSentence(prevState: State, formData: FormData): Promise<State> {
  let user;

  try {
    user = await requireAuth();
  } catch (error) {
    return { message: "You must be logged in to save." };
  }

  const validatedFields = SaveSentenceSchema.safeParse({
    word: formData.get("word"),
    definition: formData.get("definition"),
    userSentence: formData.get("userSentence"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Save.",
    };
  }

  const { word, definition, userSentence } = validatedFields.data;

  try {
    console.log(`Saving for User ID: ${user.id}`);

    await prisma.wordResponse.create({
      data: {
        userId: user.id,
        word,
        definition,
        sentence: userSentence,
      },
    });
  } catch (error) {
    console.error("Detailed Database Error:", error);
    return { message: "Database Error: Failed to save sentence." };
  }

  revalidatePath("/dashboard");

  return { message: "Saved successfully!" };
}

export async function checkUserSentence(prevState: GrammarState, formData: FormData): Promise<GrammarState> {
  const word = formData.get("word") as string;
  const definition = formData.get("definition") as string;
  const example = formData.get("example") as string;
  const sentence = formData.get("userSentence") as string;

  if (!sentence || sentence.trim() === "") {
    return {
      success: false,
      error: "Please enter a sentence.",
    };
  }

  try {
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemPrompt = `
      You are an expert English teacher.

      The user is learning the word: "${word}"
      Definition: ${definition}
      Example usage: ${example}

      TASK:
      1. Check the user's sentence for:
        - Grammar and spelling
        - Correct usage of the word "${word}" based on its definition

      2. If the sentence is incorrect:
        - Rewrite the sentence into a natural, correct version
        - The rewritten sentence MUST use "${word}" correctly
        - The rewritten sentence MUST be same with the user ${sentence}
        - The rewritten sentence MUST NOT be similar to the provided ${example}
        - Do NOT ask questions
        - Do NOT use phrases like "Did you mean", "Consider", or "You should"

      3. If the sentence is correct:
        - Return it unchanged

      OUTPUT RULES:
      - Return ONLY a valid JSON object
      - Do NOT include markdown
      - Do NOT include extra commentary outside the JSON

      JSON STRUCTURE (exact keys):
      {
        "corrected": "string",
        "is_correct": boolean,
        "explanation": "Brief, simple explanation of what was right or wrong"
      }
      `;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      config: { responseMimeType: "application/json" },
      contents: [{ role: "user", parts: [{ text: systemPrompt + "\n\nUser Sentence: " + sentence }] }],
    });

    const responseText = result.text;

    if (!responseText) {
      throw new Error("No response received from AI");
    }

    const data = JSON.parse(responseText);

    console.log(data);

    return {
      success: true,
      original: sentence,
      ...data,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: "Failed to check grammar. Please try again.",
    };
  }
}

export async function fetchWordData(word?: string): Promise<WordData | null> {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPEN_ROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    let prompt: string;

    if (word) {
      prompt = `
        You are an expert English dictionary and language teacher.
        Provide detailed information about the word "${word}".
        Return ONLY valid JSON with keys: word, definition, example, phonetic.
        No extra text or markdown.`;
    } else {
      prompt = `
        You are an expert English dictionary and language teacher.
        Generate a random useful vocabulary word.
        Return ONLY valid JSON with keys: word, definition, example, phonetic.
        No extra text or markdown.`;
    }

    const response = await client.chat.completions.create({
      model: "openai/gpt-5.2", // switched to reliable 5.2
      messages: [{ role: "user", content: prompt }],
      max_tokens: 250,
    });

    const responseText = response.choices?.[0]?.message?.content;

    if (!responseText) {
      throw new Error("No response received from OpenRouter");
    }

    // Safe JSON parse: extract first {...} block in case extra text is present
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in model response");
    }

    const data: WordData = JSON.parse(jsonMatch[0]);

    if (!data.word || !data.definition || !data.example) {
      throw new Error("Invalid response structure from OpenRouter");
    }

    return {
      word: data.word,
      definition: data.definition,
      example: data.example,
    };
  } catch (error) {
    console.error("Error fetching word data from OpenRouter:", error);
    return null;
  }
}

/* export async function fetchMultipleWords(count: number = 5): Promise<WordData[]> {
  try {
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemPrompt = `
      You are an expert English dictionary and language teacher.
      
      TASK: Generate ${count} different vocabulary words suitable for language learning
      
      REQUIREMENTS:
      1. Choose interesting but not overly complex vocabulary words
      2. Words should be useful for intermediate to advanced English learners
      3. Provide clear, concise definitions for each word
      4. Create natural example sentences using each word
      5. Include phonetic pronunciation if possible
      6. Avoid very common words and extremely rare words
      7. Focus on words that are valuable for academic, professional, or sophisticated conversation
      8. Make sure all words are different and diverse in topics
      
      OUTPUT RULES:
      - Return ONLY a valid JSON array
      - Do NOT include markdown formatting
      - Do NOT include extra commentary outside the JSON
      
      JSON STRUCTURE (exact format):
      [
        {
          "word": "The vocabulary word",
          "definition": "Clear and concise definition",
          "example": "Natural example sentence using the word",
          "phonetic": "Phonetic pronunciation (optional, use null if not available)"
        }
      ]
    `;

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      config: { responseMimeType: "application/json" },
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
    });

    const responseText = result.text;

    if (!responseText) {
      throw new Error("No response received from Gemini API");
    }

    const data: WordData[] = JSON.parse(responseText);

    // Validate the response structure
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid response structure from Gemini API");
    }

    return data.map((item) => ({
      word: item.word,
      definition: item.definition,
      example: item.example,
      phonetic: item.phonetic || undefined,
    }));
  } catch (error) {
    console.error("Error fetching multiple words from Gemini:", error);
    return [];
  }
} */
