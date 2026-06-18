import { NextResponse } from "next/server";
import { fetchFootballData, hasApiKey } from "@/lib/football-data-server";
import type { MatchesResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const query = status ? `?status=${encodeURIComponent(status)}` : "";

    const data = await fetchFootballData<MatchesResponse>(
      `/competitions/WC/matches${query}`
    );

    return NextResponse.json(data);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch matches";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
