'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

import { Word, WordData } from '@/types/dictionary';

import { WordService } from '../services/word.service';
import { Prisma } from '../generated/prisma/client';

const SaveSentenceSchema = z.object({
  word: z.string(),
  definition: z.string(),
  userSentence: z.string().min(1, 'Please type a sentence first.'),
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

export async function fetchDailyWords(): Promise<WordData | null> {
  try {
    const user = await requireAuth();

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const existingEntry = await prisma.dailyUserWords.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (existingEntry && existingEntry.words) {
      console.log('Returning cached words from DB');
      return existingEntry.words as WordData;
    }

    console.log('Fetching new words from AI Service...');
    const words = await WordService.getDailyWords();

    if (!words) return null;

    await prisma.dailyUserWords.create({
      data: {
        userId: user.id,
        words: words as unknown as Prisma.InputJsonValue,
      },
    });

    return words;
  } catch (error) {
    console.error('Action Error:', error);
    return null;
  }
}

export async function saveUserSentence(prevState: State, formData: FormData): Promise<State> {
  let user;

  try {
    user = await requireAuth();
  } catch (error) {
    return { message: 'You must be logged in to save.' };
  }

  const validatedFields = SaveSentenceSchema.safeParse({
    word: formData.get('word'),
    definition: formData.get('definition'),
    userSentence: formData.get('userSentence'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Save.',
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
    console.error('Detailed Database Error:', error);
    return { message: 'Database Error: Failed to save sentence.' };
  }

  revalidatePath('/dashboard');

  return { message: 'Saved successfully!' };
}

export async function checkUserSentence(prevState: GrammarState, formData: FormData): Promise<GrammarState> {
  const word = formData.get('word') as string;
  const definition = formData.get('definition') as string;
  const example = formData.get('example') as string;
  const sentence = formData.get('userSentence') as string;

  if (!sentence || sentence.trim() === '') {
    return {
      success: false,
      error: 'Please enter a sentence.',
    };
  }

  try {
    const analysis = await WordService.checkSentence(word, definition, sentence, example);

    return {
      success: true,
      original: sentence,
      ...analysis,
    };
  } catch (error) {
    console.error('Action Error:', error);
    return {
      success: false,
      error: 'Failed to check grammar. Please try again.',
      is_correct: false,
      explanation: '',
    };
  }
}

export async function getUserDashboardStats(todaysWords: Word[]) {
  try {
    const user = await requireAuth();

    const totalWordsLearned = await prisma.wordResponse.count({
      where: { userId: user.id },
    });

    if (!todaysWords || todaysWords.length === 0) {
      return {
        totalWordsLearned,
        completedWordList: [],
        dailyProgress: 0,
      };
    }

    const completedDailyWords = await prisma.wordResponse.findMany({
      where: {
        userId: user.id,
        word: {
          in: todaysWords.map((w) => w.word),
        },
      },
      select: { word: true },
    });

    const completedWordList = completedDailyWords.map((w) => w.word);

    return {
      totalWordsLearned,
      completedWordList,
      dailyProgress: completedWordList.length,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalWordsLearned: 0,
      completedWordList: [],
      dailyProgress: 0,
    };
  }
}
