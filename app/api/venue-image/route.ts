import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = "https://en.wikipedia.org/api/rest_v1/page/summary";
const CACHE_TTL = 1000 * 60 * 60 * 24;
const venueCache = new Map<string, { imageUrl: string; timestamp: number }>();

interface WikipediaSummary {
  thumbnail?: { source?: string | null } | null;
}

function normalizeName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function placeholderSvg(name: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#102217"/><stop offset="1" stop-color="#0A0E0A"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/><path d="M72 244c60-88 436-88 496 0" fill="none" stroke="#ECF5E8" stroke-opacity=".18" stroke-width="24"/><rect x="170" y="118" width="300" height="126" rx="20" fill="#1B5E3F" opacity=".35"/><text x="320" y="202" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#F8FFF4">${name || "Venue"}</text></svg>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();

  if (!name) {
    return new NextResponse(placeholderSvg("Venue"), {
      status: 200,
      headers: { "Content-Type": "image/svg+xml" },
    });
  }

  const key = normalizeName(name);
  const cached = venueCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    if (cached.imageUrl) return NextResponse.redirect(cached.imageUrl);
  }

  try {
    const res = await fetch(`${BASE_URL}/${encodeURIComponent(name)}`, {
      headers: {
        "User-Agent": "WorldCup2026Hub/1.0 (local development)",
      },
      next: { revalidate: 60 * 60 * 24 },
    });

    if (res.ok) {
      const data = (await res.json()) as WikipediaSummary;
      const imageUrl = data.thumbnail?.source ?? "";

      venueCache.set(key, { imageUrl, timestamp: Date.now() });
      if (imageUrl) return NextResponse.redirect(imageUrl);
    }
  } catch {
    // Fall through to placeholder.
  }

  venueCache.set(key, { imageUrl: "", timestamp: Date.now() });
  return new NextResponse(placeholderSvg(name), {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=86400",
      "Content-Type": "image/svg+xml",
    },
  });
}
