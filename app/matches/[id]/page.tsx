"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CacheBanner from "@/components/CacheBanner";
import ErrorBanner from "@/components/ErrorBanner";
import {
  KeyPlayersPanel,
  LineupsPanel,
  MatchStatsPanel,
} from "@/components/MatchInsights";
import PageHeader from "@/components/PageHeader";
import { SkeletonGroupTable } from "@/components/SkeletonCard";
import PlayerAvatar from "@/components/ui/PlayerAvatar";
import PlayerRating from "@/components/ui/PlayerRating";
import {
  fetchMatchDetails,
  formatGroupLabel,
  formatMatchDate,
  formatMatchTime,
  getTeamFlag,
} from "@/lib/api";
import type { MatchDetails } from "@/lib/types";

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="dashboard-card px-4 py-8 text-center">
      <p className="text-sm text-white/40">{message}</p>
    </div>
  );
}

function MatchPageTabs() {
  const tabs = [
    ["#summary", "Summary"],
    ["#lineups", "Lineups"],
    ["#stats", "Stats"],
    ["#timeline", "Timeline"],
    ["#info", "Info"],
  ];

  return (
    <nav className="sticky top-[73px] z-20 -mx-4 border-y border-goal-net/10 bg-pitch-black/90 px-4 py-2 backdrop-blur-xl md:mx-0 md:rounded-md md:border">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="inline-flex min-h-10 shrink-0 items-center rounded-sm px-3 font-mono text-[10px] font-bold uppercase tracking-widest text-goal-net/55 hover:bg-goal-net/10 hover:text-floodlight"
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function MatchScorersPanel({ match }: { match: MatchDetails }) {
  const goals = match.goals ?? [];

  return (
    <section className="dashboard-card overflow-hidden">
      <div className="border-b border-goal-net/10 bg-surface-elevated/40 px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
          Goalscorers
        </p>
        <h2 className="mt-1 text-lg font-bold text-floodlight">
          Scoring summary
        </h2>
      </div>
      {goals.length > 0 ? (
        <div className="grid gap-2 p-4 md:grid-cols-2">
          {goals.map((goal, index) => {
            const player = goal.scorer;
            return (
              <div
                key={`${goal.minute}-${player?.id ?? index}`}
                className="flex items-center gap-3 rounded-md border border-goal-net/10 bg-pitch-black/45 p-3"
              >
                {player ? (
                  <PlayerAvatar player={player} size="md" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-goal-net/10" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-floodlight">
                    {player?.name ?? "Unknown scorer"}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-goal-net/35">
                    {goal.team?.shortName || goal.team?.name || "Team"}{" "}
                    {goal.assist?.name ? `- Assist: ${goal.assist.name}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg font-black text-card-gold">
                    {goal.minute ?? "-"}&apos;
                  </p>
                  {player && <PlayerRating player={player} compact />}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-goal-net/40">
            Scorers will appear here when goals are published.
          </p>
        </div>
      )}
    </section>
  );
}

function MatchTimelinePanel({ match }: { match: MatchDetails }) {
  const events = [
    ...(match.goals ?? []).map((goal, index) => ({
      id: `goal-${index}`,
      minute: goal.minute,
      teamId: goal.team?.id,
      title: `Goal - ${goal.scorer?.name ?? "Unknown"}`,
      detail: goal.assist?.name ? `Assist: ${goal.assist.name}` : goal.type,
      tone: "text-card-gold",
    })),
    ...(match.bookings ?? []).map((booking, index) => ({
      id: `booking-${index}`,
      minute: booking.minute,
      teamId: booking.team?.id,
      title: `${booking.card ?? "Card"} - ${booking.player?.name ?? "Unknown"}`,
      detail: booking.team?.shortName || booking.team?.name,
      tone: "text-live-red",
    })),
    ...(match.substitutions ?? []).map((sub, index) => ({
      id: `sub-${index}`,
      minute: sub.minute,
      teamId: sub.team?.id,
      title: `Substitution - ${sub.playerIn?.name ?? "In"}`,
      detail: sub.playerOut?.name ? `for ${sub.playerOut.name}` : undefined,
      tone: "text-primary",
    })),
  ].sort((a, b) => (a.minute ?? 999) - (b.minute ?? 999));

  return (
    <section className="dashboard-card overflow-hidden">
      <div className="border-b border-goal-net/10 bg-surface-elevated/40 px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
          Timeline
        </p>
        <h2 className="mt-1 text-lg font-bold text-floodlight">
          Match events
        </h2>
      </div>
      {events.length > 0 ? (
        <div className="p-4">
          <div className="relative space-y-3 before:absolute before:bottom-2 before:left-[27px] before:top-2 before:w-px before:bg-goal-net/10">
            {events.map((event) => {
              const isHome = event.teamId === match.homeTeam.id;
              return (
                <div
                  key={event.id}
                  className="relative grid grid-cols-[56px_1fr] gap-3"
                >
                  <div className="relative z-10 flex h-10 w-14 items-center justify-center rounded-sm border border-goal-net/10 bg-pitch-black font-mono text-xs font-bold text-floodlight">
                    {event.minute ?? "-"}&apos;
                  </div>
                  <div className="rounded-md border border-goal-net/10 bg-pitch-black/45 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className={`text-sm font-bold ${event.tone}`}>
                        {event.title}
                      </p>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-goal-net/35">
                        {isHome
                          ? match.homeTeam.tla || "Home"
                          : match.awayTeam.tla || "Away"}
                      </span>
                    </div>
                    {event.detail && (
                      <p className="mt-1 text-xs text-goal-net/40">
                        {event.detail}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-goal-net/40">
            Timeline events are not published yet.
          </p>
        </div>
      )}
    </section>
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

  const referees = match?.referees ?? [];

  return (
    <div className="space-y-6">
      <Link
        href="/fixtures"
        className="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-goal-net/55 hover:text-floodlight"
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

          <MatchPageTabs />

          <section id="summary" className="dashboard-card relative scroll-mt-28 overflow-hidden p-5">
            <div
              className="pointer-events-none absolute inset-0 bg-pitch-lines bg-[length:44px_44px] opacity-20"
              aria-hidden="true"
            />
            <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
              <div className="min-w-0">
                <p className="text-5xl leading-none" aria-hidden="true">
                  {getTeamFlag(match.homeTeam.tla)}
                </p>
                <p className="mt-3 truncate text-base font-bold text-floodlight">
                  {match.homeTeam.shortName || match.homeTeam.name}
                </p>
                <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-widest text-goal-net/35">
                  {match.homeTeam.formation ?? "Formation TBA"}
                </p>
              </div>
              <div className="rounded-md border border-goal-net/10 bg-pitch-black/75 px-5 py-4 shadow-bloom">
                <p className="font-mono text-4xl font-bold text-floodlight">
                  {match.score.fullTime.home ?? "-"}
                  <span className="mx-2 text-white/25">:</span>
                  {match.score.fullTime.away ?? "-"}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/35">
                  {match.status}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-5xl leading-none" aria-hidden="true">
                  {getTeamFlag(match.awayTeam.tla)}
                </p>
                <p className="mt-3 truncate text-base font-bold text-floodlight">
                  {match.awayTeam.shortName || match.awayTeam.name}
                </p>
                <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-widest text-goal-net/35">
                  {match.awayTeam.formation ?? "Formation TBA"}
                </p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="stat-block text-center">
              <p className="font-mono text-lg font-bold text-floodlight">
                {match.minute ?? "-"}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-goal-net/35">
                Minute
              </p>
            </div>
            <div className="stat-block text-center">
              <p className="font-mono text-lg font-bold text-floodlight">
                {match.score.halfTime.home ?? "-"}:{match.score.halfTime.away ?? "-"}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-goal-net/35">
                Half
              </p>
            </div>
            <div className="stat-block text-center">
              <p className="font-mono text-lg font-bold text-floodlight">
                {match.attendance?.toLocaleString() ?? "-"}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-goal-net/35">
                Attendance
              </p>
            </div>
            <div className="stat-block text-center">
              <p className="font-mono text-lg font-bold text-floodlight">
                {match.injuryTime ?? "-"}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-goal-net/35">
                Added
              </p>
            </div>
          </div>

          <MatchScorersPanel match={match} />

          <div id="lineups" className="grid scroll-mt-28 gap-4 lg:grid-cols-[1fr_360px]">
            <LineupsPanel match={match} />
            <div id="stats" className="scroll-mt-28 space-y-4">
              <MatchStatsPanel match={match} />
              <KeyPlayersPanel match={match} />
            </div>
          </div>

          <div id="timeline" className="scroll-mt-28">
            <MatchTimelinePanel match={match} />
          </div>

          <section id="info" className="grid scroll-mt-28 gap-4 sm:grid-cols-2">
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
