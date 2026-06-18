export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest?: string;
  address?: string;
  website?: string;
  founded?: number;
  clubColors?: string;
  venue?: string;
  area?: Area;
  coach?: Coach | null;
  squad?: Player[];
  lastUpdated?: string;
}

export interface Area {
  id: number;
  name: string;
  code: string;
  flag?: string | null;
}

export interface Coach {
  id: number | null;
  name: string | null;
  nationality: string | null;
}

export interface Player {
  id: number;
  name: string;
  position?: string | null;
  dateOfBirth?: string | null;
  nationality?: string | null;
  shirtNumber?: number | null;
}

export interface Score {
  winner: string | null;
  duration: string;
  fullTime: { home: number | null; away: number | null };
  halfTime: { home: number | null; away: number | null };
}

export interface Match {
  id: number;
  utcDate: string;
  status: string;
  minute: number | null;
  matchday: number | null;
  stage: string;
  group: string | null;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  venue: string | null;
  attendance?: number | null;
  injuryTime?: number | null;
  lastUpdated?: string;
  goals?: MatchGoal[];
  penalties?: MatchPenalty[];
  bookings?: MatchBooking[];
  substitutions?: MatchSubstitution[];
  odds?: MatchOdds;
  referees?: MatchReferee[];
}

export interface MatchesResponse {
  matches: Match[];
}

export interface MatchTeamDetails extends Team {
  formation?: string | null;
  leagueRank?: number | null;
  lineup?: Player[];
  bench?: Player[];
}

export interface MatchDetails extends Omit<Match, "homeTeam" | "awayTeam"> {
  homeTeam: MatchTeamDetails;
  awayTeam: MatchTeamDetails;
}

export interface MatchDetailsResponse extends MatchDetails {}

export interface MatchGoal {
  minute: number | null;
  injuryTime?: number | null;
  type?: string;
  team?: Team;
  scorer?: Player;
  assist?: Player | null;
  score?: { home: number | null; away: number | null };
}

export interface MatchPenalty {
  player?: Player;
  team?: Team;
  scored?: boolean;
}

export interface MatchBooking {
  minute: number | null;
  team?: Team;
  player?: Player;
  card?: string;
}

export interface MatchSubstitution {
  minute: number | null;
  team?: Team;
  playerOut?: Player;
  playerIn?: Player;
}

export interface MatchOdds {
  homeWin?: number | null;
  draw?: number | null;
  awayWin?: number | null;
}

export interface MatchReferee {
  id: number;
  name: string;
  type: string;
  nationality?: string | null;
}

export interface StandingRow {
  position: number;
  team: Team;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface GroupStanding {
  type: string;
  group: string;
  table: StandingRow[];
}

export interface StandingsResponse {
  standings: GroupStanding[];
}

export interface TeamsResponse {
  teams: Team[];
}

export interface Scorer {
  player: Player;
  team: Team;
  goals: number;
  assists?: number | null;
  penalties?: number | null;
}

export interface ScorersResponse {
  scorers: Scorer[];
}

export type MatchFilter = "all" | "today" | "upcoming" | "finished";

export interface FetchResult<T> {
  data: T;
  fromCache: boolean;
  timestamp: number | null;
  error?: string;
}
