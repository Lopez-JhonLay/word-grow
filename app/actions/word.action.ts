'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

import { Word, WordData } from '@/types/dictionary';

import { WordService } from '../services/word.service';
import { Prisma } from '../generated/prisma/client';

import { dateToString } from '@/lib/utils';

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

    const recentWords = await prisma.wordResponse.findMany({
      where: { userId: user.id },
      select: { word: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const excludeList = recentWords.map((record) => record.word);

    console.log(`Fetching new words from AI. Excluding ${excludeList.length} recent words. ${excludeList}`);

    const words = await WordService.getDailyWords(excludeList);

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
  let sessionUser;

  try {
    sessionUser = await requireAuth();
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
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { id: true, currentStreak: true, lastActivityDate: true },
    });

    if (!user) throw new Error('User not found');

    const today = new Date();
    const todayStr = dateToString(today);
    const lastActivityStr = user.lastActivityDate ? dateToString(user.lastActivityDate) : null;

    let newStreak = user.currentStreak;

    if (lastActivityStr !== todayStr) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = dateToString(yesterday);

      if (lastActivityStr === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1; // Streak broken or first time
      }
    }

    await prisma.$transaction([
      prisma.wordResponse.create({
        data: {
          userId: user.id,
          word,
          definition,
          sentence: userSentence,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          currentStreak: newStreak,
          lastActivityDate: today,
        },
      }),
    ]);
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
    const sessionUser = await requireAuth();

    // 1. Fetch User Streak Data
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { currentStreak: true, lastActivityDate: true },
    });

    const totalWordsLearned = await prisma.wordResponse.count({
      where: { userId: sessionUser.id },
    });

    let displayStreak = 0;

    if (user && user.lastActivityDate) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Use your existing helper 'dateToString'
      const todayStr = dateToString(today);
      const yesterdayStr = dateToString(yesterday);
      const lastActivityStr = dateToString(user.lastActivityDate);

      if (lastActivityStr === todayStr || lastActivityStr === yesterdayStr) {
        displayStreak = user.currentStreak;
      } else {
        displayStreak = 0;
      }
    }

    let completedWordList: string[] = [];

    if (todaysWords && todaysWords.length > 0) {
      const completedDailyWords = await prisma.wordResponse.findMany({
        where: {
          userId: sessionUser.id,
          word: {
            in: todaysWords.map((w) => w.word),
          },
        },
        select: { word: true },
      });

      completedWordList = completedDailyWords.map((w) => w.word);
    }

    return {
      totalWordsLearned,
      streak: displayStreak,
      completedWordList,
      dailyProgress: completedWordList.length,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalWordsLearned: 0,
      streak: 0,
      completedWordList: [],
      dailyProgress: 0,
    };
  }
}

export async function getUserLearnedWords() {
  try {
    const sessionUser = await requireAuth();

    const learnedWords = await prisma.wordResponse.findMany({
      where: { userId: sessionUser.id },
      select: {
        id: true,
        word: true,
        definition: true,
        sentence: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return learnedWords;
  } catch (error) {
    console.error('Error fetching learned words:', error);
    return [];
  }
}
