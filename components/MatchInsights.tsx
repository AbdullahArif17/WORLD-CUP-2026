"use client";

import PlayerAvatar from "@/components/ui/PlayerAvatar";
import PlayerRating, { estimatePlayerRating } from "@/components/ui/PlayerRating";
import type { MatchDetails, MatchTeamDetails, Player } from "@/lib/types";

function splitFormation(formation: string | null | undefined, count: number) {
  if (!formation) return [1, 4, 3, 3].filter((_, i) => i === 0 || count > 1);
  const rows = formation
    .split("-")
    .map((part) => Number(part))
    .filter((value) => Number.isFinite(value) && value > 0);
  const total = rows.reduce((sum, value) => sum + value, 0);
  return total === count - 1 ? [1, ...rows] : [1, 4, 3, 3];
}

function groupLineup(players: Player[], formation: string | null | undefined) {
  const rows = splitFormation(formation, players.length);
  let cursor = 0;
  return rows.map((rowSize) => {
    const row = players.slice(cursor, cursor + rowSize);
    cursor += rowSize;
    return row;
  });
}

function PlayerChip({ player }: { player: Player }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1">
      <div className="relative">
        <PlayerAvatar player={player} size="sm" />
        <div className="absolute -right-2 -top-2">
          <PlayerRating player={player} compact />
        </div>
      </div>
      <span className="max-w-20 truncate rounded-sm bg-pitch-black/75 px-1.5 py-0.5 text-center text-[10px] font-semibold text-floodlight">
        {player.name}
      </span>
    </div>
  );
}

function LineupPitch({
  team,
  reverse,
}: {
  team: MatchTeamDetails;
  reverse?: boolean;
}) {
  const lineup = team.lineup ?? [];
  const rows = groupLineup(lineup, team.formation);

  if (lineup.length === 0) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-md border border-goal-net/10 bg-pitch text-center">
        <p className="max-w-52 text-sm text-goal-net/45">
          Lineup is not published yet. It will appear here as soon as the API
          returns starting XI data.
        </p>
      </div>
    );
  }

  const visibleRows = reverse ? [...rows].reverse() : rows;

  return (
    <div className="relative overflow-hidden rounded-md border border-turf-green/25 bg-pitch p-4">
      <div
        className="pointer-events-none absolute inset-0 bg-pitch-lines bg-[length:42px_42px] opacity-35"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-8 top-1/2 h-px bg-goal-net/15"
        aria-hidden="true"
      />
      <div className="relative flex min-h-[360px] flex-col justify-between gap-5">
        {visibleRows.map((row, index) => (
          <div
            key={`${team.id}-${index}`}
            className="flex items-center justify-around gap-2"
          >
            {row.map((player) => (
              <PlayerChip key={player.id} player={player} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function BenchList({ players }: { players: Player[] }) {
  if (players.length === 0) {
    return <p className="text-sm text-goal-net/40">Bench not available.</p>;
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {players.map((player) => (
        <div
          key={player.id}
          className="flex items-center gap-3 rounded-md border border-goal-net/10 bg-pitch-black/45 p-3"
        >
          <PlayerAvatar player={player} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-floodlight">
              {player.name}
            </p>
            <p className="truncate text-xs text-goal-net/35">
              {player.position ?? player.nationality ?? "Player"}
            </p>
          </div>
          <PlayerRating player={player} compact />
        </div>
      ))}
    </div>
  );
}

function TeamLineupPanel({
  team,
  label,
  reverse,
}: {
  team: MatchTeamDetails;
  label: string;
  reverse?: boolean;
}) {
  return (
    <section className="dashboard-card p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
            {label}
          </p>
          <h2 className="truncate text-lg font-bold text-floodlight">
            {team.shortName || team.name}
          </h2>
          <p className="mt-1 truncate text-xs text-goal-net/40">
            Coach: {team.coach?.name ?? "TBA"}
          </p>
        </div>
        <span className="rounded-sm border border-card-gold/25 bg-card-gold/10 px-3 py-1 font-mono text-xs font-bold text-card-gold">
          {team.formation ?? "TBA"}
        </span>
      </div>

      <LineupPitch team={team} reverse={reverse} />

      <div className="mt-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-goal-net/35">
          Substitutes
        </p>
        <BenchList players={team.bench ?? []} />
      </div>
    </section>
  );
}

function StatBar({
  label,
  home,
  away,
}: {
  label: string;
  home: number;
  away: number;
}) {
  const total = Math.max(home + away, 1);
  const homePct = (home / total) * 100;
  const awayPct = (away / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between font-mono text-xs text-goal-net/55">
        <span className="tabular-nums text-floodlight">{home}</span>
        <span className="uppercase tracking-widest">{label}</span>
        <span className="tabular-nums text-floodlight">{away}</span>
      </div>
      <div className="grid h-2 grid-cols-2 overflow-hidden rounded-full bg-goal-net/10">
        <div className="flex justify-end">
          <div
            className="h-full rounded-l-full bg-primary"
            style={{ width: `${homePct}%` }}
          />
        </div>
        <div>
          <div
            className="h-full rounded-r-full bg-card-gold"
            style={{ width: `${awayPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function countForTeam<T extends { team?: { id: number } }>(
  items: T[] | undefined,
  teamId: number
) {
  return (items ?? []).filter((item) => item.team?.id === teamId).length;
}

export function MatchStatsPanel({ match }: { match: MatchDetails }) {
  const homeId = match.homeTeam.id;
  const awayId = match.awayTeam.id;
  const homeGoals = match.score.fullTime.home ?? countForTeam(match.goals, homeId);
  const awayGoals = match.score.fullTime.away ?? countForTeam(match.goals, awayId);
  const homeBookings = countForTeam(match.bookings, homeId);
  const awayBookings = countForTeam(match.bookings, awayId);
  const homeSubs = countForTeam(match.substitutions, homeId);
  const awaySubs = countForTeam(match.substitutions, awayId);

  return (
    <section className="dashboard-card p-4">
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
          Match stats
        </p>
        <h2 className="text-lg font-bold text-floodlight">Team comparison</h2>
      </div>
      <div className="space-y-4">
        <StatBar label="Goals" home={homeGoals} away={awayGoals} />
        <StatBar label="Cards" home={homeBookings} away={awayBookings} />
        <StatBar label="Subs" home={homeSubs} away={awaySubs} />
        <StatBar
          label="Lineup"
          home={match.homeTeam.lineup?.length ?? 0}
          away={match.awayTeam.lineup?.length ?? 0}
        />
      </div>
      <p className="mt-4 text-xs text-goal-net/35">
        Possession, shots, xG and official player ratings require a provider
        that exposes those fields. This panel uses the live event data available
        in the current API.
      </p>
    </section>
  );
}

export function KeyPlayersPanel({ match }: { match: MatchDetails }) {
  const players = [
    ...(match.homeTeam.lineup ?? []),
    ...(match.awayTeam.lineup ?? []),
    ...(match.homeTeam.bench ?? []),
    ...(match.awayTeam.bench ?? []),
  ]
    .slice()
    .sort(
      (a, b) => Number(estimatePlayerRating(b)) - Number(estimatePlayerRating(a))
    )
    .slice(0, 5);

  return (
    <section className="dashboard-card p-4">
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
          Player ratings
        </p>
        <h2 className="text-lg font-bold text-floodlight">Top performers</h2>
      </div>
      {players.length > 0 ? (
        <div className="space-y-2">
          {players.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center gap-3 rounded-md border border-goal-net/10 bg-pitch-black/45 p-3"
            >
              <span className="w-5 font-mono text-xs font-bold text-goal-net/35">
                {index + 1}
              </span>
              <PlayerAvatar player={player} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-floodlight">
                  {player.name}
                </p>
                <p className="truncate text-xs text-goal-net/35">
                  {player.position ?? "Player"}
                </p>
              </div>
              <PlayerRating player={player} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-goal-net/40">
          Ratings appear after lineups are available.
        </p>
      )}
    </section>
  );
}

export function LineupsPanel({ match }: { match: MatchDetails }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <TeamLineupPanel team={match.homeTeam} label="Home XI" />
      <TeamLineupPanel team={match.awayTeam} label="Away XI" reverse />
    </div>
  );
}
