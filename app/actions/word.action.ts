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
      The user is trying to learn the word: "${word}" (Definition: ${definition}).

      Task 1: Check the user's sentence for grammar and spelling errors.
      Task 2: Check if the word "${word}" is used correctly based on its definition.

      Return ONLY a JSON object with this exact structure:
      {
        "corrected": "The corrected version of the sentence (fix grammar AND usage if needed)",
        "is_correct": boolean, // true ONLY if grammar is perfect AND the word is used correctly
        "explanation": "A brief explanation. If the grammar is fine but the word usage is wrong, explain why."
      }
      Do not include markdown formatting. Just the raw JSON string.
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
