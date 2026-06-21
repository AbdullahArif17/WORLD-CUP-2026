import type { Team } from "@/lib/types";

type ImageTeam = Pick<Team, "name" | "shortName" | "tla" | "crest"> & {
  area?: { name?: string | null; code?: string | null } | null;
};

const COUNTRY_NAME_CODES: Record<string, string> = {
  afghanistan: "af",
  albania: "al",
  algeria: "dz",
  argentina: "ar",
  australia: "au",
  austria: "at",
  belgium: "be",
  bolivia: "bo",
  brazil: "br",
  burkinafaso: "bf",
  cameroon: "cm",
  canada: "ca",
  chile: "cl",
  china: "cn",
  colombia: "co",
  costarica: "cr",
  croatia: "hr",
  czechia: "cz",
  czechrepublic: "cz",
  denmark: "dk",
  ecuador: "ec",
  egypt: "eg",
  england: "gb-eng",
  finland: "fi",
  france: "fr",
  germany: "de",
  ghana: "gh",
  greece: "gr",
  honduras: "hn",
  hungary: "hu",
  indonesia: "id",
  iran: "ir",
  iraq: "iq",
  ireland: "ie",
  italy: "it",
  ivorycoast: "ci",
  jamaica: "jm",
  japan: "jp",
  jordan: "jo",
  kuwait: "kw",
  mexico: "mx",
  morocco: "ma",
  netherlands: "nl",
  newzealand: "nz",
  nigeria: "ng",
  norway: "no",
  oman: "om",
  panama: "pa",
  paraguay: "py",
  peru: "pe",
  poland: "pl",
  portugal: "pt",
  qatar: "qa",
  romania: "ro",
  saudiarabia: "sa",
  scotland: "gb-sct",
  senegal: "sn",
  serbia: "rs",
  southafrica: "za",
  southkorea: "kr",
  spain: "es",
  sweden: "se",
  switzerland: "ch",
  thailand: "th",
  tunisia: "tn",
  turkey: "tr",
  ukraine: "ua",
  unitedarabemirates: "ae",
  unitedstates: "us",
  unitedstatesofamerica: "us",
  uruguay: "uy",
  uzbekistan: "uz",
  venezuela: "ve",
  vietnam: "vn",
  wales: "gb-wls",
};

function normalizeLookup(value?: string | null) {
  return (value ?? "").toLowerCase().replace(/[^a-z]/g, "");
}

function imageRoute(path: string, param: string, value?: string | null) {
  const name = value?.trim();
  if (!name) return "";
  return `${path}?${param}=${encodeURIComponent(name)}`;
}

export function getTeamCrest(team?: ImageTeam | null): string {
  if (!team) return "";
  if (team.crest) return team.crest;

  const lookupName = team.name || team.shortName || team.area?.name || team.tla;
  return imageRoute("/api/team-image", "name", lookupName);
}

export function getCountryFlag(countryName?: string | null): string {
  const key = normalizeLookup(countryName);
  const code = COUNTRY_NAME_CODES[key];

  if (!code) return "";
  return `https://flagcdn.com/w320/${code}.png`;
}

export function getVenueImage(venueName?: string | null): string {
  return imageRoute("/api/venue-image", "name", venueName || "Venue");
}
