"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CacheBanner from "@/components/CacheBanner";
import ErrorBanner from "@/components/ErrorBanner";
import MatchCard from "@/components/MatchCard";
import PageHeader from "@/components/PageHeader";
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
    <div className="space-y-6">
      <PageHeader
        title="All Fixtures"
        subtitle={
          loading
            ? "Loading match schedule..."
            : `${filteredMatches.length} of ${matches.length} matches`
        }
        badge="Schedule"
      />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`filter-pill ${
              filter === f.key ? "filter-pill-active" : "filter-pill-inactive"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {fromCache && lastUpdated && (
        <CacheBanner lastUpdated={lastUpdated} error={error} />
      )}

      {!loading && error && !fromCache && <ErrorBanner message={error} />}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonMatchCard key={i} />
          ))}
        </div>
      ) : filteredMatches.length > 0 ? (
        <div className="space-y-3">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="dashboard-card px-4 py-12 text-center">
          <p className="text-sm font-medium text-white/40">No matches found</p>
          {error && (
            <p className="mt-2 text-xs text-primary/80">
              {error}. Check your API key in .env.local
            </p>
          )}
        </div>
      )}
    </div>
  );
}
