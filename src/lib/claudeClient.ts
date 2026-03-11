const API_TOKEN = import.meta.env.VITE_API_TOKEN as string | undefined;

export class ClaudeAPIError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ClaudeAPIError";
  }
}

export async function callClaude(prompt: string, maxTokens = 2000): Promise<string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (API_TOKEN) {
    headers["x-api-token"] = API_TOKEN;
  }

  let response: Response;
  try {
    response = await fetch("/api/claude", {
      method: "POST",
      headers,
      body: JSON.stringify({ prompt, max_tokens: maxTokens }),
    });
  } catch (err) {
    throw new ClaudeAPIError(
      "Network error — check your connection and try again.",
      0
    );
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new ClaudeAPIError(
        "Too many requests — please wait a moment and try again.",
        429
      );
    }
    const errorData = await response.json().catch(() => null);
    throw new ClaudeAPIError(
      errorData?.error || `API error: ${response.status}`,
      response.status
    );
  }

  const data = await response.json();
  return data.content
    .map((b: { type: string; text?: string }) => (b.type === "text" ? b.text : ""))
    .join("");
}

export function parseClaudeJSON<T>(raw: string): T {
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as T;
}
