"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CacheBanner from "@/components/CacheBanner";
import ErrorBanner from "@/components/ErrorBanner";
import PageHeader from "@/components/PageHeader";
import { SkeletonGroupTable, SkeletonStats } from "@/components/SkeletonCard";
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tournament Stats"
        subtitle="Top scorers, goals and match totals"
        badge="Stats"
      />

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

      <section className="dashboard-card overflow-hidden">
        <div className="border-b border-white/[0.06] bg-surface-elevated/40 px-4 py-3">
          <h2 className="font-mono text-sm font-bold uppercase tracking-wide text-white">
            Top Scorers
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
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3"
              >
                <span className="font-mono text-sm font-bold text-white/30">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white/85">
                    {scorer.player.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-white/35">
                    <span aria-hidden="true">{getTeamFlag(scorer.team.tla)}</span>{" "}
                    {scorer.team.shortName || scorer.team.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xl font-bold text-gold">
                    {scorer.goals}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                    goals
                  </p>
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
