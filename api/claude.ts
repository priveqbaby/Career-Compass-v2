import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_ORIGINS = [
  'https://career-compass-v2.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const origin = req.headers.origin ?? '';
  const isAllowed =
    ALLOWED_ORIGINS.includes(origin) ||
    /^https:\/\/career-compass-v2[^.]*\.vercel\.app$/.test(origin);
  const allowedOrigin = isAllowed ? origin : ALLOWED_ORIGINS[0];

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, x-api-token'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional token auth
  const expectedToken = process.env.API_TOKEN;
  if (expectedToken) {
    const provided = req.headers['x-api-token'];
    if (provided !== expectedToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: ANTHROPIC_API_KEY is not set' });
  }

  const { prompt, max_tokens } = req.body ?? {};

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required and must be a string' });
  }
  if (prompt.length > 30000) {
    return res.status(400).json({ error: 'Prompt exceeds maximum length of 30,000 characters' });
  }

  const maxTokens = typeof max_tokens === 'number' ? max_tokens : 2000;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (response.status === 429) {
      return res.status(429).json({ error: 'Too many requests — please wait a moment and try again.' });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API Error:', response.status, errorText);
      return res.status(response.status).json({
        error: `Anthropic API returned ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Serverless Function Error:', error);
    return res.status(500).json({
      error: 'An internal server error occurred',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
