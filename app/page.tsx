"use client";

import { useCallback, useEffect, useState } from "react";
import CacheBanner from "@/components/CacheBanner";
import DashboardStats from "@/components/DashboardStats";
import ErrorBanner from "@/components/ErrorBanner";
import MatchCard from "@/components/MatchCard";
import PageHeader from "@/components/PageHeader";
import SectionHeader from "@/components/SectionHeader";
import { SkeletonMatchCard, SkeletonStats } from "@/components/SkeletonCard";
import {
  fetchAllMatches,
  isLiveStatus,
  isToday,
  isUpcomingStatus,
} from "@/lib/api";
import type { Match } from "@/lib/types";

const REFRESH_INTERVAL = 60_000;

export default function HomePage() {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [todayMatches, setTodayMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = useCallback(async () => {
    try {
      const result = await fetchAllMatches();
      const matches = result.data.matches ?? [];

      const live = matches.filter((m) => isLiveStatus(m.status));
      const today = matches
        .filter((m) => isToday(m.utcDate) && !isLiveStatus(m.status))
        .sort(
          (a, b) =>
            new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
        );
      const upcoming = matches
        .filter((m) => isUpcomingStatus(m.status) && !isToday(m.utcDate))
        .sort(
          (a, b) =>
            new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
        )
        .slice(0, 5);

      setLiveMatches(live);
      setTodayMatches(today);
      setUpcomingMatches(upcoming);
      setFromCache(result.fromCache);
      setLastUpdated(result.timestamp);
      setError(result.error ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load matches");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
    const interval = setInterval(loadMatches, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadMatches]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Match Center"
        subtitle="Live scores and updates - refreshes every 60s"
        badge="FIFA World Cup"
      />

      {loading ? (
        <SkeletonStats />
      ) : (
        <DashboardStats
          liveCount={liveMatches.length}
          todayCount={todayMatches.length}
          upcomingCount={upcomingMatches.length}
        />
      )}

      {fromCache && lastUpdated && (
        <CacheBanner lastUpdated={lastUpdated} error={error} />
      )}

      {!loading && error && !fromCache && <ErrorBanner message={error} />}

      <section>
        <SectionHeader
          title="Live Now"
          subtitle="Matches in progress"
          count={liveMatches.length}
          accent="red"
        />
        {loading ? (
          <div className="space-y-3">
            <SkeletonMatchCard />
          </div>
        ) : liveMatches.length > 0 ? (
          <div className="space-y-3">
            {liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} variant="featured" />
            ))}
          </div>
        ) : (
          <div className="dashboard-card px-4 py-10 text-center">
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
                  d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-white/40">
              No matches live right now
            </p>
            <p className="mt-1 text-xs text-white/25">
              Check back during match windows
            </p>
          </div>
        )}
      </section>

      <section>
        <SectionHeader
          title="Today"
          subtitle="Scheduled for today"
          count={todayMatches.length}
          accent="neutral"
        />
        {loading ? (
          <SkeletonMatchCard />
        ) : todayMatches.length > 0 ? (
          <div className="space-y-3">
            {todayMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="dashboard-card px-4 py-8 text-center">
            <p className="text-sm text-white/40">No matches scheduled today</p>
          </div>
        )}
      </section>

      <section>
        <SectionHeader
          title="Upcoming"
          subtitle="Next 5 fixtures"
          count={upcomingMatches.length}
          accent="gold"
        />
        {loading ? (
          <div className="space-y-3">
            <SkeletonMatchCard />
            <SkeletonMatchCard />
          </div>
        ) : upcomingMatches.length > 0 ? (
          <div className="space-y-3">
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="dashboard-card px-4 py-8 text-center">
            <p className="text-sm text-white/40">No upcoming matches</p>
          </div>
        )}
      </section>

    </div>
  );
}
