"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CacheBanner from "@/components/CacheBanner";
import ErrorBanner from "@/components/ErrorBanner";
import MatchCard from "@/components/MatchCard";
import MagneticButton from "@/components/ui/MagneticButton";
import { SkeletonMatchCard } from "@/components/SkeletonCard";
import {
  fetchAllMatches,
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

  return (
    <div className="space-y-8">
      <header className="jumbotron-panel px-6 py-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-turf-green">
          Full Schedule
        </p>
        <h1 className="mt-2 font-display text-5xl tracking-wide text-floodlight">
          FIXTURES
        </h1>
        <p className="mt-2 font-mono text-xs text-goal-net/45">
          {loading
            ? "Loading match schedule…"
            : `${filteredMatches.length} of ${matches.length} matches`}
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
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
      ) : filteredMatches.length > 0 ? (
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
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
