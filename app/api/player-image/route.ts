import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";
const photoCache = new Map<string, { photoUrl: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24;

interface SportsDbPlayer {
  strPlayer?: string | null;
  strSport?: string | null;
  strThumb?: string | null;
  strCutout?: string | null;
  strRender?: string | null;
}

interface SportsDbPlayerResponse {
  player?: SportsDbPlayer[] | null;
}

function normalizeName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function bestPhoto(player: SportsDbPlayer) {
  return player.strCutout || player.strRender || player.strThumb || "";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();

  if (!name) {
    return NextResponse.json({ photoUrl: "" }, { status: 400 });
  }

  const key = normalizeName(name);
  const cached = photoCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ photoUrl: cached.photoUrl });
  }

  try {
    const res = await fetch(
      `${BASE_URL}/searchplayers.php?p=${encodeURIComponent(name)}`,
      { next: { revalidate: 60 * 60 * 24 } }
    );

    if (!res.ok) {
      return NextResponse.json({ photoUrl: "" }, { status: 200 });
    }

    const data = (await res.json()) as SportsDbPlayerResponse;
    const players = (data.player ?? []).filter(
      (player) => player.strSport === "Soccer"
    );
    const exact =
      players.find(
        (player) => normalizeName(player.strPlayer ?? "") === key
      ) ?? players[0];

    const photoUrl = exact ? bestPhoto(exact) : "";
    photoCache.set(key, { photoUrl, timestamp: Date.now() });

    return NextResponse.json({ photoUrl });
  } catch {
    return NextResponse.json({ photoUrl: "" }, { status: 200 });
  }
}
