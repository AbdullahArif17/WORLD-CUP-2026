import { NextResponse } from "next/server";
import { fetchFootballData, hasApiKey } from "@/lib/football-data-server";
import type { TeamsResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!hasApiKey()) {
      return NextResponse.json(
        {
          error:
            "API key missing. Add FOOTBALL_DATA_API_KEY to .env.local and restart the dev server.",
        },
        { status: 500 }
      );
    }

    const data = await fetchFootballData<TeamsResponse>(
      "/competitions/WC/teams"
    );

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch teams";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
