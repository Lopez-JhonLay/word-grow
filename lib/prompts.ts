type Level = 'A1' | 'B2' | 'C1';

export const PROMPTS = {
  SYSTEM_IDENTITY: `
    You are an expert English dictionary and linguistics professor. 
    Your goal is to provide accurate, context-aware vocabulary data.
  `,

  // A dynamic prompt generator
  generateDailyWords: (count: number = 3, level: Level = 'B2') => `
    Generate ${count} random, useful vocabulary words at the ${level} English proficiency level.
    
    Rules:
    1. Return ONLY a valid JSON array.
    2. Do NOT include markdown formatting (like \`\`\`json).
    3. Each object must have: "word", "definition", "example", "phonetic".
    4. Ensure the examples are modern and relatable.
  `,
};
