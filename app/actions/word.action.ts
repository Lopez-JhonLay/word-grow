"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";

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
