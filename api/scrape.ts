import type { VercelRequest, VercelResponse } from '@vercel/node';
import { lookup } from 'dns/promises';

async function isPrivateHost(hostname: string): Promise<boolean> {
  let ip = hostname;
  // If not a raw IPv4, resolve it
  if (!/^[\d.]+$/.test(hostname) && !hostname.includes(':')) {
    try {
      const result = await lookup(hostname);
      ip = result.address;
    } catch {
      return true; // can't resolve = block it
    }
  }
  return (
    /^127\./.test(ip) ||
    /^10\./.test(ip) ||
    /^192\.168\./.test(ip) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    /^169\.254\./.test(ip) ||
    ip === '::1'
  );
}

const ALLOWED_ORIGINS = [
  'https://career-compass-v2.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

function stripHtml(html: string): string {
  // Remove script, style, nav, footer tags and their contents
  let text = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '');

  // Remove remaining HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // Truncate to ~6000 chars
  if (text.length > 6000) {
    text = text.slice(0, 6000);
  }

  return text;
}

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

  const { url } = req.body ?? {};

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required and must be a string' });
  }

  // Validate URL is http/https
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return res.status(400).json({ error: 'URL must use http or https protocol' });
    }
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  // SSRF guard: block private/internal addresses
  if (await isPrivateHost(parsedUrl.hostname)) {
    return res.status(400).json({ error: 'URL resolves to a private address' });
  }

  // Fetch the page with a browser-like User-Agent and 10s timeout
  let pageText: string;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const pageResponse = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: controller.signal,
    });

    if (!pageResponse.ok) {
      return res.status(422).json({ error: `Failed to fetch the URL: ${pageResponse.status} ${pageResponse.statusText}` });
    }

    // Reject non-HTML content (PDFs, images, etc.)
    const contentType = pageResponse.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html')) {
      return res.status(422).json({ error: 'URL does not point to an HTML page' });
    }

    const html = await pageResponse.text();

    // Reject excessively large pages
    if (html.length > 5_000_000) {
      return res.status(422).json({ error: 'Page is too large to process' });
    }

    pageText = stripHtml(html);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return res.status(408).json({ error: 'Request timed out fetching the URL' });
    }
    console.error('Fetch error:', error);
    return res.status(422).json({ error: 'Could not fetch the job posting URL' });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!pageText || pageText.length < 50) {
    return res.status(422).json({ error: 'Could not extract readable content from the URL' });
  }

  // Call Anthropic API to extract job details
  const prompt = `Extract job details from this job posting. Return ONLY valid JSON with these fields:
{ "company": "", "role": "", "location": "", "salary": "", "source": "" }
- source: the website name (e.g. "LinkedIn", "Greenhouse", "Lever", "Indeed", "Company Website")
- salary: empty string if not mentioned
- location: city/remote if mentioned, else empty string

Job posting text:
${pageText}`;

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
        max_tokens: 500,
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
    const rawText: string = data.content
      .map((b: { type: string; text?: string }) => (b.type === 'text' ? b.text : ''))
      .join('');

    // Strip markdown fences and parse JSON
    const clean = rawText.replace(/```json|```/g, '').trim();
    let jobData: unknown;
    try {
      jobData = JSON.parse(clean);
    } catch {
      return res.status(502).json({ error: 'Could not parse job details from the page — try a different URL' });
    }

    return res.status(200).json(jobData);
  } catch (error) {
    console.error('Serverless Function Error:', error);
    return res.status(500).json({ error: 'An internal server error occurred' });
  }
}
