import { getCached, setCache } from "./cache";
import type {
  FetchResult,
  MatchDetailsResponse,
  MatchesResponse,
  ScorersResponse,
  StandingsResponse,
  TeamsResponse,
} from "./types";

async function fetchWithCache<T>(
  key: string,
  endpoint: string
): Promise<FetchResult<T>> {
  try {
    const res = await fetch(endpoint, { cache: "no-store" });

    const body = (await res.json()) as T & { error?: string };

    if (!res.ok) {
      throw new Error(body.error ?? `API error: ${res.status} ${res.statusText}`);
    }

    setCache(key, body);

    return {
      data: body,
      fromCache: false,
      timestamp: Date.now(),
    };
  } catch (err) {
    const cached = getCached<T>(key);
    if (cached) {
      return {
        data: cached.data,
        fromCache: true,
        timestamp: cached.timestamp,
        error: err instanceof Error ? err.message : String(err),
      };
    }
    throw err;
  }
}

export async function fetchAllMatches(): Promise<FetchResult<MatchesResponse>> {
  return fetchWithCache<MatchesResponse>("matches", "/api/matches");
}

export async function fetchLiveMatches(): Promise<FetchResult<MatchesResponse>> {
  return fetchWithCache<MatchesResponse>(
    "matches_live",
    "/api/matches?status=LIVE"
  );
}

export async function fetchScheduledMatches(): Promise<
  FetchResult<MatchesResponse>
> {
  return fetchWithCache<MatchesResponse>(
    "matches_scheduled",
    "/api/matches?status=SCHEDULED"
  );
}

export async function fetchFinishedMatches(): Promise<
  FetchResult<MatchesResponse>
> {
  return fetchWithCache<MatchesResponse>(
    "matches_finished",
    "/api/matches?status=FINISHED"
  );
}

export async function fetchStandings(): Promise<FetchResult<StandingsResponse>> {
  return fetchWithCache<StandingsResponse>("standings", "/api/standings");
}

export async function fetchTeams(): Promise<FetchResult<TeamsResponse>> {
  return fetchWithCache<TeamsResponse>("teams", "/api/teams");
}

export async function fetchScorers(): Promise<FetchResult<ScorersResponse>> {
  return fetchWithCache<ScorersResponse>("scorers", "/api/scorers");
}

export async function fetchMatchDetails(
  id: number
): Promise<FetchResult<MatchDetailsResponse>> {
  return fetchWithCache<MatchDetailsResponse>(
    `match_${id}`,
    `/api/matches/${id}`
  );
}

export const LIVE_STATUSES = ["LIVE", "IN_PLAY", "PAUSED"];

export function isLiveStatus(status: string): boolean {
  return LIVE_STATUSES.includes(status);
}

export function isFinishedStatus(status: string): boolean {
  return status === "FINISHED";
}

export function isUpcomingStatus(status: string): boolean {
  return status === "SCHEDULED" || status === "TIMED";
}

export function formatGroupLabel(group: string | null): string {
  if (!group) return "";
  const letter = group.replace("GROUP_", "");
  return `Group ${letter}`;
}

export function formatMatchDate(utcDate: string): string {
  return new Date(utcDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatMatchTime(utcDate: string): string {
  return new Date(utcDate).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function isToday(utcDate: string): boolean {
  const matchDate = new Date(utcDate);
  const today = new Date();
  return (
    matchDate.getFullYear() === today.getFullYear() &&
    matchDate.getMonth() === today.getMonth() &&
    matchDate.getDate() === today.getDate()
  );
}

export function formatTimestamp(timestamp: number | null): string {
  if (!timestamp) return "Unknown";
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

const TEAM_COUNTRY_CODES: Record<string, string> = {
  ALG: "DZ",
  ARG: "AR",
  AUS: "AU",
  AUT: "AT",
  BEL: "BE",
  BFA: "BF",
  BOL: "BO",
  BRA: "BR",
  CAN: "CA",
  CHI: "CL",
  CHN: "CN",
  CIV: "CI",
  CMR: "CM",
  COL: "CO",
  CRC: "CR",
  CRO: "HR",
  CZE: "CZ",
  DEN: "DK",
  ECU: "EC",
  EGY: "EG",
  ENG: "GB",
  ESP: "ES",
  FIN: "FI",
  FRA: "FR",
  GER: "DE",
  GHA: "GH",
  GRE: "GR",
  HON: "HN",
  HUN: "HU",
  IDN: "ID",
  IRL: "IE",
  IRN: "IR",
  IRQ: "IQ",
  ISL: "IS",
  ITA: "IT",
  JAM: "JM",
  JOR: "JO",
  JPN: "JP",
  KEN: "KE",
  KOR: "KR",
  KUW: "KW",
  MAR: "MA",
  MEX: "MX",
  MLI: "ML",
  NED: "NL",
  NGA: "NG",
  NOR: "NO",
  NZL: "NZ",
  OMA: "OM",
  PAN: "PA",
  PAR: "PY",
  PER: "PE",
  POL: "PL",
  POR: "PT",
  QAT: "QA",
  ROU: "RO",
  RSA: "ZA",
  SAU: "SA",
  SCO: "GB",
  SEN: "SN",
  SRB: "RS",
  SUI: "CH",
  SWE: "SE",
  THA: "TH",
  TUN: "TN",
  TUR: "TR",
  UAE: "AE",
  UKR: "UA",
  URU: "UY",
  USA: "US",
  UZB: "UZ",
  VEN: "VE",
  VIE: "VN",
  WAL: "GB",
  ZAM: "ZM",
  ZIM: "ZW",
};

export function getTeamFlag(tla: string): string {
  const countryCode = TEAM_COUNTRY_CODES[tla.toUpperCase()];
  if (!countryCode) return String.fromCodePoint(0x26bd);

  return countryCode
    .split("")
    .map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65)
    .map((codePoint) => String.fromCodePoint(codePoint))
    .join("");
}
