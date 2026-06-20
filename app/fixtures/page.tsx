"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CacheBanner from "@/components/CacheBanner";
import ErrorBanner from "@/components/ErrorBanner";
import MatchCard from "@/components/MatchCard";
import MagneticButton from "@/components/ui/MagneticButton";
import { SkeletonMatchCard } from "@/components/SkeletonCard";
import {
  fetchAllMatches,
  formatMatchDate,
  isFinishedStatus,
  isToday,
  isUpcomingStatus,
} from "@/lib/api";
import type { Match, MatchFilter } from "@/lib/types";

const FILTERS: { key: MatchFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "today", label: "Today" },
  { key: "upcoming", label: "Upcoming" },
  { key: "finished", label: "Finished" },
];

export default function FixturesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filter, setFilter] = useState<MatchFilter>("all");
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = useCallback(async () => {
    try {
      const result = await fetchAllMatches();
      const sorted = (result.data.matches ?? []).sort(
        (a, b) =>
          new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
      );
      setMatches(sorted);
      setFromCache(result.fromCache);
      setLastUpdated(result.timestamp);
      setError(result.error ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load fixtures");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const filteredMatches = useMemo(() => {
    switch (filter) {
      case "today":
        return matches.filter((m) => isToday(m.utcDate));
      case "upcoming":
        return matches.filter((m) => isUpcomingStatus(m.status));
      case "finished":
        return matches.filter((m) => isFinishedStatus(m.status));
      default:
        return matches;
    }
  }, [matches, filter]);

  const groupedMatches = useMemo(() => {
    return filteredMatches.reduce<Array<{ label: string; matches: Match[] }>>(
      (groups, match) => {
        const label = formatMatchDate(match.utcDate);
        const existing = groups.find((group) => group.label === label);
        if (existing) {
          existing.matches.push(match);
        } else {
          groups.push({ label, matches: [match] });
        }
        return groups;
      },
      []
    );
  }, [filteredMatches]);

  return (
    <div className="space-y-5">
      <header className="dashboard-card overflow-hidden">
        <div className="border-b border-goal-net/10 p-4 sm:p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
            Match calendar
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-floodlight sm:text-3xl">
                Fixtures
              </h1>
              <p className="mt-1 text-sm text-goal-net/45">
                {loading
                  ? "Loading match schedule..."
                  : `${filteredMatches.length} of ${matches.length} matches`}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-sm bg-goal-net/5 px-3 py-2">
                <p className="font-mono text-lg font-bold text-live-red">
                  {matches.filter((match) => match.status === "LIVE").length}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-widest text-goal-net/35">
                  Live
                </p>
              </div>
              <div className="rounded-sm bg-goal-net/5 px-3 py-2">
                <p className="font-mono text-lg font-bold text-primary">
                  {matches.filter((match) => isToday(match.utcDate)).length}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-widest text-goal-net/35">
                  Today
                </p>
              </div>
              <div className="rounded-sm bg-goal-net/5 px-3 py-2">
                <p className="font-mono text-lg font-bold text-card-gold">
                  {matches.filter((match) => isUpcomingStatus(match.status)).length}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-widest text-goal-net/35">
                  Next
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="sticky top-[73px] z-20 -mx-4 border-y border-goal-net/10 bg-pitch-black/90 px-4 py-3 backdrop-blur-xl md:mx-0 md:rounded-md md:border">
        <div className="flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <MagneticButton
            key={f.key}
            active={filter === f.key}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </MagneticButton>
        ))}
        </div>
      </div>

      {fromCache && lastUpdated && (
        <CacheBanner lastUpdated={lastUpdated} error={error} />
      )}
      {!loading && error && !fromCache && <ErrorBanner message={error} />}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonMatchCard key={i} />
          ))}
        </div>
      ) : groupedMatches.length > 0 ? (
        <div className="space-y-5">
          {groupedMatches.map((group) => (
            <section key={group.label} className="space-y-2">
              <div className="flex items-center justify-between rounded-md border border-goal-net/10 bg-surface-elevated/65 px-4 py-3">
                <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-floodlight">
                  {group.label}
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-widest text-goal-net/35">
                  {group.matches.length} matches
                </span>
              </div>
              <div className="space-y-2">
                {group.matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="jumbotron-panel px-6 py-16 text-center">
          <p className="font-display text-xl text-goal-net/40">
            No matches found
          </p>
        </div>
      )}
    </div>
  );
}
