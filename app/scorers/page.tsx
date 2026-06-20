"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CacheBanner from "@/components/CacheBanner";
import ErrorBanner from "@/components/ErrorBanner";
import PageHeader from "@/components/PageHeader";
import { SkeletonGroupTable, SkeletonStats } from "@/components/SkeletonCard";
import PlayerAvatar from "@/components/ui/PlayerAvatar";
import PlayerRating from "@/components/ui/PlayerRating";
import { fetchAllMatches, fetchScorers, getTeamFlag } from "@/lib/api";
import type { Match, Scorer } from "@/lib/types";

function StatTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="stat-block flex-1 text-center">
      <p className="font-mono text-2xl font-bold tabular-nums text-white">
        {value}
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/40">
        {label}
      </p>
    </div>
  );
}

function scoreValue(value: number | null | undefined) {
  return typeof value === "number" ? value : 0;
}

function ScorerHero({ scorer }: { scorer: Scorer }) {
  return (
    <section className="dashboard-card relative overflow-hidden p-5">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-card-gold via-primary to-live-red"
        aria-hidden="true"
      />
      <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center">
        <PlayerAvatar player={scorer.player} size="xl" />
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-card-gold">
            Golden boot leader
          </p>
          <h2 className="mt-1 truncate text-3xl font-black text-floodlight">
            {scorer.player.name}
          </h2>
          <p className="mt-2 truncate text-sm text-goal-net/45">
            <span aria-hidden="true">{getTeamFlag(scorer.team.tla)}</span>{" "}
            {scorer.team.shortName || scorer.team.name}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center md:min-w-64">
          <div className="rounded-md bg-card-gold/15 p-3">
            <p className="font-mono text-3xl font-black text-card-gold">
              {scorer.goals}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-goal-net/40">
              Goals
            </p>
          </div>
          <div className="rounded-md bg-goal-net/5 p-3">
            <p className="font-mono text-3xl font-black text-floodlight">
              {scorer.assists ?? "-"}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-goal-net/40">
              Assists
            </p>
          </div>
          <div className="rounded-md bg-goal-net/5 p-3">
            <div className="flex h-9 items-center justify-center">
              <PlayerRating player={scorer.player} />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-goal-net/40">
              Rating
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PodiumCard({ scorer, rank }: { scorer: Scorer; rank: number }) {
  return (
    <article className="relative overflow-hidden rounded-md border border-goal-net/10 bg-pitch-black/55 p-4">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/15 to-transparent"
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between">
        <PlayerAvatar player={scorer.player} size="lg" />
        <span className="rounded-sm bg-goal-net/10 px-2 py-1 font-mono text-xs font-black text-goal-net/55">
          #{rank}
        </span>
      </div>
      <h3 className="mt-4 truncate text-sm font-bold text-floodlight">
        {scorer.player.name}
      </h3>
      <p className="mt-1 truncate text-xs text-goal-net/40">
        <span aria-hidden="true">{getTeamFlag(scorer.team.tla)}</span>{" "}
        {scorer.team.shortName || scorer.team.name}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-2xl font-black text-card-gold">
            {scorer.goals}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-widest text-goal-net/35">
            Goals
          </p>
        </div>
        <PlayerRating player={scorer.player} />
      </div>
    </article>
  );
}

export default function ScorersPage() {
  const [scorers, setScorers] = useState<Scorer[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const [scorerResult, matchResult] = await Promise.all([
        fetchScorers(),
        fetchAllMatches(),
      ]);

      setScorers(scorerResult.data.scorers ?? []);
      setMatches(matchResult.data.matches ?? []);
      setFromCache(scorerResult.fromCache || matchResult.fromCache);
      setLastUpdated(Math.max(scorerResult.timestamp ?? 0, matchResult.timestamp ?? 0));
      setError(scorerResult.error ?? matchResult.error ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const matchStats = useMemo(() => {
    const finished = matches.filter((match) => match.status === "FINISHED");
    const goals = finished.reduce(
      (total, match) =>
        total +
        scoreValue(match.score.fullTime.home) +
        scoreValue(match.score.fullTime.away),
      0
    );
    const live = matches.filter((match) =>
      ["LIVE", "IN_PLAY", "PAUSED"].includes(match.status)
    ).length;

    return {
      matches: matches.length,
      finished: finished.length,
      goals,
      live,
    };
  }, [matches]);

  const leader = scorers[0];
  const podium = scorers.slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tournament Stats"
        subtitle="Top scorers, goals and match totals"
        badge="Stats"
      />

      {!loading && leader && <ScorerHero scorer={leader} />}

      {loading ? (
        <SkeletonStats />
      ) : (
        <div className="dashboard-card p-1">
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
            <StatTile label="Matches" value={matchStats.matches} />
            <StatTile label="Finished" value={matchStats.finished} />
            <StatTile label="Live" value={matchStats.live} />
            <StatTile label="Goals" value={matchStats.goals} />
          </div>
        </div>
      )}

      {fromCache && lastUpdated && (
        <CacheBanner lastUpdated={lastUpdated} error={error} />
      )}

      {!loading && error && !fromCache && <ErrorBanner message={error} />}

      {!loading && podium.length > 0 && (
        <section className="grid gap-3 md:grid-cols-3">
          {podium.map((scorer, index) => (
            <PodiumCard
              key={`${scorer.player.id}-${scorer.team.id}-podium`}
              scorer={scorer}
              rank={index + 1}
            />
          ))}
        </section>
      )}

      <section className="dashboard-card overflow-hidden">
        <div className="border-b border-white/[0.06] bg-surface-elevated/40 px-4 py-3">
          <h2 className="font-mono text-sm font-bold uppercase tracking-wide text-white">
            Full scorer leaderboard
          </h2>
        </div>

        {loading ? (
          <div className="p-4">
            <SkeletonGroupTable />
          </div>
        ) : scorers.length > 0 ? (
          <div className="divide-y divide-white/[0.05]">
            {scorers.map((scorer, index) => (
              <div
                key={`${scorer.player.id}-${scorer.team.id}`}
                className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-goal-net/[0.03]"
              >
                <span className="font-mono text-sm font-bold text-white/30">
                  {index + 1}
                </span>
                <PlayerAvatar player={scorer.player} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white/85">
                    {scorer.player.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-white/35">
                    <span aria-hidden="true">{getTeamFlag(scorer.team.tla)}</span>{" "}
                    {scorer.team.shortName || scorer.team.name}
                  </p>
                  <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-widest text-white/25">
                    {scorer.player.position ?? scorer.player.nationality ?? "Player"}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <PlayerRating player={scorer.player} compact />
                  <div>
                    <p className="font-mono text-xl font-bold text-gold">
                      {scorer.goals}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                      goals
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-10 text-center">
            <p className="text-sm text-white/40">
              Scorer data will appear once goals are recorded.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
