"use client";

import { useCallback, useEffect, useState } from "react";
import CacheBanner from "@/components/CacheBanner";
import ErrorBanner from "@/components/ErrorBanner";
import GroupTable from "@/components/GroupTable";
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
        .filter((s) => s.type === "TOTAL" && s.table?.length > 0)
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
    <div className="space-y-8">
      <header className="jumbotron-panel px-6 py-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-turf-green">
          Group Stage
        </p>
        <h1 className="mt-2 font-display text-5xl tracking-wide text-floodlight">
          STANDINGS
        </h1>
        <p className="mt-2 font-mono text-xs text-goal-net/45">
          Top 2 teams in each group advance —{" "}
          {loading ? "…" : `${groups.length} groups`}
        </p>
      </header>

      {fromCache && lastUpdated && (
        <CacheBanner lastUpdated={lastUpdated} error={error} />
      )}
      {!loading && error && !fromCache && <ErrorBanner message={error} />}

      {loading ? (
        <div className="space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonGroupTable key={i} />
          ))}
        </div>
      ) : groups.length > 0 ? (
        <div className="space-y-5">
          {groups.map((group, i) => (
            <GroupTable key={group.group} group={group} index={i} />
          ))}
        </div>
      ) : (
        <div className="jumbotron-panel px-6 py-16 text-center">
          <p className="font-display text-xl text-goal-net/40">
            No standings available yet
          </p>
        </div>
      )}
    </div>
  );
}
