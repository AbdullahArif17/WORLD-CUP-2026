"use client";

import { useCallback, useEffect, useState } from "react";
import HeroSection from "@/components/hero/HeroSection";
import CacheBanner from "@/components/CacheBanner";
import ErrorBanner from "@/components/ErrorBanner";
import MatchCard from "@/components/MatchCard";
import SectionHeader from "@/components/SectionHeader";
import { SkeletonMatchCard } from "@/components/SkeletonCard";
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
    <div className="space-y-10">
      <HeroSection />

      {fromCache && lastUpdated && (
        <CacheBanner lastUpdated={lastUpdated} error={error} />
      )}
      {!loading && error && !fromCache && <ErrorBanner message={error} />}

      <section>
          <SectionHeader
            title="Live Now"
            subtitle="Matches in progress"
            count={liveMatches.length}
            accent="live"
          />
          {loading ? (
            <SkeletonMatchCard />
          ) : liveMatches.length > 0 ? (
            <div className="space-y-4">
              {liveMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="jumbotron-panel px-6 py-12 text-center">
              <p className="font-display text-2xl text-goal-net/40">
                No matches live right now
              </p>
            </div>
          )}
        </section>

        <section>
          <SectionHeader
            title="Today"
            count={todayMatches.length}
            accent="neutral"
          />
          {loading ? (
            <SkeletonMatchCard />
          ) : todayMatches.length > 0 ? (
            <div className="space-y-4">
              {todayMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="jumbotron-panel px-6 py-10 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-goal-net/35">
                No matches scheduled today
              </p>
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
            <div className="space-y-4">
              <SkeletonMatchCard />
              <SkeletonMatchCard />
            </div>
          ) : upcomingMatches.length > 0 ? (
            <div className="space-y-4">
              {upcomingMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="jumbotron-panel px-6 py-10 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-goal-net/35">
                No upcoming matches
              </p>
            </div>
          )}
        </section>
    </div>
  );
}
