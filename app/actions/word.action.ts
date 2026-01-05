"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

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
