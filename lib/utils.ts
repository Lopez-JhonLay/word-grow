export function parseAIResponse<T>(content: string | null): T {
  if (!content) throw new Error('Empty response from AI');

  const cleanJson = content.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleanJson) as T;
  } catch (e) {
    console.error('Failed to parse AI JSON:', cleanJson);
    throw new Error('Failed to parse AI response');
  }
}
