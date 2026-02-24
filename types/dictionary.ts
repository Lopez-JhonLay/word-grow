export type Word = {
  word: string;
  definition: string;
  example: string;
  phonetic: string;
};

export type WordData = Word[];

export type GrammarAnalysis = {
  is_correct: boolean;
  corrected?: string;
  explanation: string;
};
