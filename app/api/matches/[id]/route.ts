import { NextResponse } from "next/server";
import { fetchFootballData, hasApiKey } from "@/lib/football-data-server";
import type { MatchDetailsResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
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

    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid match id" }, { status: 400 });
    }

    const data = await fetchFootballData<MatchDetailsResponse>(
      `/matches/${id}`
    );

    return NextResponse.json(data);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch match details";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
