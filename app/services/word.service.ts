import { openai } from '@/lib/openai';
import { parseAIResponse } from '@/lib/utils';
import { PROMPTS } from '@/lib/prompts';
import { GrammarAnalysis, Word } from '@/types/dictionary';

export const WordService = {
  async getDailyWords(excludeWords: string[] = []): Promise<Word[]> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: PROMPTS.SYSTEM_IDENTITY },
          { role: 'user', content: PROMPTS.generateDailyWords(3, 'C1', excludeWords) },
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
  async checkSentence(
    word: string,
    definition: string,
    sentence: string,
    example: string = '',
  ): Promise<GrammarAnalysis> {
    try {
      const systemPrompt = `
        You are an expert English teacher.
        The user is learning the word: "${word}"
        Definition: ${definition}
        Example usage: ${example}

        TASK:
        1. Check the user's sentence for grammar, spelling, and correct usage of "${word}".
        2. If incorrect, rewrite it to be natural but keep the same meaning.
        3. Do NOT use the provided example sentence in your rewrite.

        OUTPUT RULES:
        - Return ONLY a valid JSON object.
        - JSON Structure: { "corrected": "string", "is_correct": boolean, "explanation": "string" }
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `User Sentence: ${sentence}` },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0]?.message?.content;
      return parseAIResponse<GrammarAnalysis>(content);
    } catch (error) {
      console.error('WordService CheckSentence Error:', error);
      throw error;
    }
  },
};
