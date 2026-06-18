import "server-only";

const BASE_URL = "https://api.football-data.org/v4";

function getApiKey(): string {
  const key =
    process.env.FOOTBALL_DATA_API_KEY ??
    process.env.NEXT_PUBLIC_FOOTBALL_DATA_API_KEY ??
    "";
  return key.trim();
}

export function hasApiKey(): boolean {
  return getApiKey().length > 0;
}

export async function fetchFootballData<T>(endpoint: string): Promise<T> {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error(
      "API key missing. Add FOOTBALL_DATA_API_KEY to .env.local and restart the dev server."
    );
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "X-Auth-Token": apiKey,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    let message = `API error: ${res.status} ${res.statusText}`;

    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) {
        message = body.message;
      }
    } catch {
      // response body wasn't JSON
    }

    if (res.status === 400 && message.toLowerCase().includes("token")) {
      throw new Error(
        "Invalid API token. Get a free key at football-data.org and add it to .env.local as FOOTBALL_DATA_API_KEY."
      );
    }

    if (res.status === 403) {
      throw new Error(
        "Access denied. Your API plan may not include World Cup (WC) data."
      );
    }

    if (res.status === 429) {
      throw new Error("Rate limited. Free tier allows 10 requests per minute.");
    }

    throw new Error(message);
  }

  return res.json() as Promise<T>;
}
