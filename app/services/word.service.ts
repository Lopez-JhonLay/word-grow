import { openai } from '@/lib/openai';
import { parseAIResponse } from '@/lib/utils';
import { PROMPTS } from '@/lib/prompts';
import { Word } from '@/types/dictionary';

export const WordService = {
  async getDailyWords(): Promise<Word[]> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: PROMPTS.SYSTEM_IDENTITY },
          { role: 'user', content: PROMPTS.generateDailyWords(3, 'C1') },
        ],
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content;
      return parseAIResponse<Word[]>(content);
    } catch (error) {
      console.error('WordService Error:', error);
      throw error;
    }
  },
};
