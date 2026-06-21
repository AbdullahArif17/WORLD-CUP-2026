import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";
const CACHE_TTL = 1000 * 60 * 60 * 24;
const badgeCache = new Map<string, { imageUrl: string; timestamp: number }>();

interface SportsDbTeam {
  strTeam?: string | null;
  strSport?: string | null;
  strBadge?: string | null;
  strLogo?: string | null;
}

interface SportsDbTeamResponse {
  teams?: SportsDbTeam[] | null;
}

function normalizeName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function bestBadge(team: SportsDbTeam) {
  return team.strBadge || team.strLogo || "";
}

function placeholderSvg(name: string) {
  const label = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="32" fill="#102217"/><circle cx="80" cy="80" r="54" fill="#1B5E3F" opacity=".45"/><text x="80" y="91" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" font-weight="700" fill="#F8FFF4">${label || "FC"}</text></svg>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();

  if (!name) {
    return new NextResponse(placeholderSvg("Team"), {
      status: 200,
      headers: { "Content-Type": "image/svg+xml" },
    });
  }

  const key = normalizeName(name);
  const cached = badgeCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    if (cached.imageUrl) return NextResponse.redirect(cached.imageUrl);
  }

  try {
    const res = await fetch(
      `${BASE_URL}/searchteams.php?t=${encodeURIComponent(name)}`,
      { next: { revalidate: 60 * 60 * 24 } }
    );

    if (res.ok) {
      const data = (await res.json()) as SportsDbTeamResponse;
      const teams = (data.teams ?? []).filter(
        (team) => team.strSport === "Soccer"
      );
      const exact =
        teams.find((team) => normalizeName(team.strTeam ?? "") === key) ??
        teams[0];
      const imageUrl = exact ? bestBadge(exact) : "";

      badgeCache.set(key, { imageUrl, timestamp: Date.now() });
      if (imageUrl) return NextResponse.redirect(imageUrl);
    }
  } catch {
    // Fall through to placeholder.
  }

  badgeCache.set(key, { imageUrl: "", timestamp: Date.now() });
  return new NextResponse(placeholderSvg(name), {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=86400",
      "Content-Type": "image/svg+xml",
    },
  });
}
