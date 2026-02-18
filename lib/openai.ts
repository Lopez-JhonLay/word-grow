import OpenAI from 'openai';

if (!process.env.OPEN_ROUTER_API_KEY) {
  throw new Error('Missing OPEN_ROUTER_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});
