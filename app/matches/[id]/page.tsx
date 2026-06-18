"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CacheBanner from "@/components/CacheBanner";
import ErrorBanner from "@/components/ErrorBanner";
import PageHeader from "@/components/PageHeader";
import { SkeletonGroupTable } from "@/components/SkeletonCard";
import {
  fetchMatchDetails,
  formatGroupLabel,
  formatMatchDate,
  formatMatchTime,
  getTeamFlag,
} from "@/lib/api";
import type { MatchDetails, MatchTeamDetails, Player } from "@/lib/types";

function PlayerRow({ player }: { player: Player }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.03] px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-white/75">
          {player.name}
        </p>
        <p className="truncate text-[10px] text-white/30">
          {player.position ?? "Player"}
        </p>
      </div>
      {player.shirtNumber && (
        <span className="font-mono text-xs font-bold text-white/35">
          {player.shirtNumber}
        </span>
      )}
    </div>
  );
}

function TeamSheet({ team, side }: { team: MatchTeamDetails; side: string }) {
  const lineup = team.lineup ?? [];
  const bench = team.bench ?? [];

  return (
    <section className="dashboard-card overflow-hidden">
      <div className="border-b border-white/[0.06] bg-surface-elevated/40 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="truncate font-mono text-sm font-bold uppercase tracking-wide text-white">
            {side} Lineup
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-widest text-gold">
            {team.formation ?? "TBA"}
          </span>
        </div>
        <p className="mt-1 truncate text-xs text-white/35">
          {getTeamFlag(team.tla)} {team.shortName || team.name}
          {team.coach?.name ? ` | Coach: ${team.coach.name}` : ""}
        </p>
      </div>
      <div className="space-y-4 p-4">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/30">
            Starting XI
          </p>
          {lineup.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {lineup.map((player) => (
                <PlayerRow key={player.id} player={player} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/35">Lineup not published yet.</p>
          )}
        </div>
        {bench.length > 0 && (
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/30">
              Bench
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {bench.map((player) => (
                <PlayerRow key={player.id} player={player} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="dashboard-card px-4 py-8 text-center">
      <p className="text-sm text-white/40">{message}</p>
    </div>
  );
}

export default function MatchDetailsPage() {
  const params = useParams<{ id: string }>();
  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadMatch = useCallback(async () => {
    const id = Number(params.id);
    if (!Number.isInteger(id)) {
      setError("Invalid match id");
      setLoading(false);
      return;
    }

    try {
      const result = await fetchMatchDetails(id);
      setMatch(result.data);
      setFromCache(result.fromCache);
      setLastUpdated(result.timestamp);
      setError(result.error ?? null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load match details"
      );
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadMatch();
  }, [loadMatch]);

  const goals = match?.goals ?? [];
  const bookings = match?.bookings ?? [];
  const substitutions = match?.substitutions ?? [];
  const referees = match?.referees ?? [];

  return (
    <div className="space-y-6">
      <Link
        href="/fixtures"
        className="inline-flex items-center text-sm font-semibold text-white/45 hover:text-white"
      >
        Back to fixtures
      </Link>

      {loading ? (
        <SkeletonGroupTable />
      ) : match ? (
        <>
          <PageHeader
            title={`${match.homeTeam.shortName || match.homeTeam.name} vs ${
              match.awayTeam.shortName || match.awayTeam.name
            }`}
            subtitle={`${formatMatchDate(match.utcDate)} at ${formatMatchTime(
              match.utcDate
            )}${match.venue ? ` | ${match.venue}` : ""}`}
            badge={match.group ? formatGroupLabel(match.group) : match.stage}
          />

          {fromCache && lastUpdated && (
            <CacheBanner lastUpdated={lastUpdated} error={error} />
          )}

          <section className="dashboard-card p-4">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
              <div className="min-w-0">
                <p className="text-4xl leading-none" aria-hidden="true">
                  {getTeamFlag(match.homeTeam.tla)}
                </p>
                <p className="mt-2 truncate text-sm font-bold text-white">
                  {match.homeTeam.shortName || match.homeTeam.name}
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-pitch px-5 py-4">
                <p className="font-mono text-3xl font-bold text-white">
                  {match.score.fullTime.home ?? "-"}
                  <span className="mx-2 text-white/25">:</span>
                  {match.score.fullTime.away ?? "-"}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/35">
                  {match.status}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-4xl leading-none" aria-hidden="true">
                  {getTeamFlag(match.awayTeam.tla)}
                </p>
                <p className="mt-2 truncate text-sm font-bold text-white">
                  {match.awayTeam.shortName || match.awayTeam.name}
                </p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="stat-block text-center">
              <p className="font-mono text-lg font-bold text-white">
                {match.minute ?? "-"}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-white/35">
                Minute
              </p>
            </div>
            <div className="stat-block text-center">
              <p className="font-mono text-lg font-bold text-white">
                {match.score.halfTime.home ?? "-"}:{match.score.halfTime.away ?? "-"}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-white/35">
                Half
              </p>
            </div>
            <div className="stat-block text-center">
              <p className="font-mono text-lg font-bold text-white">
                {match.attendance?.toLocaleString() ?? "-"}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-white/35">
                Attendance
              </p>
            </div>
            <div className="stat-block text-center">
              <p className="font-mono text-lg font-bold text-white">
                {match.injuryTime ?? "-"}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-white/35">
                Added
              </p>
            </div>
          </div>

          <TeamSheet team={match.homeTeam} side="Home" />
          <TeamSheet team={match.awayTeam} side="Away" />

          <section className="dashboard-card overflow-hidden">
            <div className="border-b border-white/[0.06] bg-surface-elevated/40 px-4 py-3">
              <h2 className="font-mono text-sm font-bold uppercase tracking-wide text-white">
                Match Events
              </h2>
            </div>
            {goals.length || bookings.length || substitutions.length ? (
              <div className="divide-y divide-white/[0.05]">
                {goals.map((goal, index) => (
                  <div key={`goal-${index}`} className="px-4 py-3 text-sm">
                    <span className="font-mono text-gold">
                      {goal.minute}&apos;
                    </span>{" "}
                    <span className="text-white/80">
                      Goal - {goal.scorer?.name ?? "Unknown"}
                    </span>
                    {goal.team?.tla && (
                      <span className="text-white/35"> ({goal.team.tla})</span>
                    )}
                  </div>
                ))}
                {bookings.map((booking, index) => (
                  <div key={`booking-${index}`} className="px-4 py-3 text-sm">
                    <span className="font-mono text-gold">
                      {booking.minute}&apos;
                    </span>{" "}
                    <span className="text-white/80">
                      {booking.card ?? "Booking"} -{" "}
                      {booking.player?.name ?? "Unknown"}
                    </span>
                  </div>
                ))}
                {substitutions.map((sub, index) => (
                  <div key={`sub-${index}`} className="px-4 py-3 text-sm">
                    <span className="font-mono text-gold">
                      {sub.minute}&apos;
                    </span>{" "}
                    <span className="text-white/80">
                      Substitution - {sub.playerIn?.name ?? "In"} for{" "}
                      {sub.playerOut?.name ?? "Out"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-white/40">
                  Goals, cards and substitutions are not published yet.
                </p>
              </div>
            )}
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="dashboard-card p-4">
              <h2 className="font-mono text-sm font-bold uppercase tracking-wide text-white">
                Referees
              </h2>
              {referees.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {referees.map((referee) => (
                    <div key={referee.id} className="text-sm">
                      <p className="font-semibold text-white/80">
                        {referee.name}
                      </p>
                      <p className="text-xs text-white/30">
                        {referee.type}
                        {referee.nationality ? ` | ${referee.nationality}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-white/35">
                  Officials not assigned yet.
                </p>
              )}
            </div>
            <div className="dashboard-card p-4">
              <h2 className="font-mono text-sm font-bold uppercase tracking-wide text-white">
                Odds
              </h2>
              {match.odds ? (
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-white/[0.03] p-3">
                    <p className="font-mono text-sm font-bold text-white">
                      {match.odds.homeWin ?? "-"}
                    </p>
                    <p className="text-[10px] text-white/30">Home</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-3">
                    <p className="font-mono text-sm font-bold text-white">
                      {match.odds.draw ?? "-"}
                    </p>
                    <p className="text-[10px] text-white/30">Draw</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-3">
                    <p className="font-mono text-sm font-bold text-white">
                      {match.odds.awayWin ?? "-"}
                    </p>
                    <p className="text-[10px] text-white/30">Away</p>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-white/35">
                  Odds are not available for this match.
                </p>
              )}
            </div>
          </section>
        </>
      ) : (
        <>
          {!fromCache && error && <ErrorBanner message={error} />}
          <EmptyPanel message="Match details could not be loaded." />
        </>
      )}
    </div>
  );
}
