"use client";

import { useCallback, useEffect, useState } from "react";
import CacheBanner from "@/components/CacheBanner";
import ErrorBanner from "@/components/ErrorBanner";
import GroupTable from "@/components/GroupTable";
import PageHeader from "@/components/PageHeader";
import { SkeletonGroupTable } from "@/components/SkeletonCard";
import { fetchStandings } from "@/lib/api";
import type { GroupStanding } from "@/lib/types";

export default function StandingsPage() {
  const [groups, setGroups] = useState<GroupStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStandings = useCallback(async () => {
    try {
      const result = await fetchStandings();
      const groupStandings = (result.data.standings ?? [])
        .filter((s) => s.type === "TOTAL" && s.group?.startsWith("GROUP_"))
        .sort((a, b) => a.group.localeCompare(b.group));

      setGroups(groupStandings);
      setFromCache(result.fromCache);
      setLastUpdated(result.timestamp);
      setError(result.error ?? null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load standings"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStandings();
  }, [loadStandings]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Group Standings"
        subtitle="Top 2 teams in each group advance to the knockout stage"
        badge={`${loading ? "..." : groups.length} Groups`}
      />

      {fromCache && lastUpdated && (
        <CacheBanner lastUpdated={lastUpdated} error={error} />
      )}

      {!loading && error && !fromCache && <ErrorBanner message={error} />}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonGroupTable key={i} />
          ))}
        </div>
      ) : groups.length > 0 ? (
        <div className="space-y-4">
          {groups.map((group) => (
            <GroupTable key={group.group} group={group} />
          ))}
        </div>
      ) : (
        <div className="dashboard-card px-4 py-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-surface-elevated">
            <svg
              className="h-6 w-6 text-white/20"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h18M3 14h18M10 3v18M14 3v18"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-white/40">
            No standings available yet
          </p>
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
