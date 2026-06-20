"use client";

import Link from "next/link";
import type { Match } from "@/lib/types";
import {
  formatGroupLabel,
  formatMatchDate,
  formatMatchTime,
  isFinishedStatus,
  isLiveStatus,
} from "@/lib/api";
import LiveBadge from "./LiveBadge";
import TeamFlag from "@/components/ui/TeamFlag";
import AnimatedScore from "@/components/ui/AnimatedScore";

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const isLive = isLiveStatus(match.status);
  const isFinished = isFinishedStatus(match.status);

  const homeScore = match.score.fullTime.home;
  const awayScore = match.score.fullTime.away;
  const hasScore = homeScore !== null && awayScore !== null;

  const cardClass = `match-card-pitch ${isLive ? "match-card-live" : ""} ${
    isFinished ? "opacity-80" : ""
  }`;
  const homeName = match.homeTeam.shortName || match.homeTeam.name || "TBD";
  const awayName = match.awayTeam.shortName || match.awayTeam.name || "TBD";
  const statusLabel = isLive
    ? match.minute !== null
      ? `${match.minute}'`
      : "Live"
    : isFinished
      ? "FT"
      : formatMatchTime(match.utcDate);

  return (
    <article className={cardClass}>
      <Link
        href={`/matches/${match.id}`}
        className="block rounded-md"
        aria-label={`${match.homeTeam.name ?? homeName} versus ${
          match.awayTeam.name ?? awayName
        }`}
      >
        <div className="relative p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-3 border-b border-goal-net/10 pb-3">
            <div className="flex min-w-0 items-center gap-2">
              {isLive && <LiveBadge />}
              {match.group && (
                <span className="truncate font-mono text-[10px] uppercase tracking-widest text-primary/80">
                  {formatGroupLabel(match.group)}
                </span>
              )}
              {isFinished && !isLive && (
                <span className="font-mono text-[10px] uppercase tracking-widest text-goal-net/45">
                  Full Time
                </span>
              )}
            </div>
            <div className="shrink-0 text-right font-mono text-[10px] uppercase tracking-wide text-goal-net/45">
              <div>{formatMatchDate(match.utcDate)}</div>
              <div>{statusLabel}</div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div className="min-w-0 space-y-3">
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                <TeamFlag tla={match.homeTeam.tla} size="md" />
                <div className="min-w-0">
                  <p
                    className={`truncate text-sm font-bold ${
                      isFinished ? "text-goal-net/60" : "text-floodlight"
                    }`}
                  >
                    {homeName}
                  </p>
                  <p className="truncate font-mono text-[10px] uppercase tracking-widest text-goal-net/30">
                    {match.homeTeam.tla || "TBD"}
                  </p>
                </div>
                <span className="font-mono text-xl font-black tabular-nums text-floodlight">
                  {hasScore ? <AnimatedScore value={homeScore!} /> : "-"}
                </span>
              </div>

              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                <TeamFlag tla={match.awayTeam.tla} size="md" />
                <div className="min-w-0">
                  <p
                    className={`truncate text-sm font-bold ${
                      isFinished ? "text-goal-net/60" : "text-floodlight"
                    }`}
                  >
                    {awayName}
                  </p>
                  <p className="truncate font-mono text-[10px] uppercase tracking-widest text-goal-net/30">
                    {match.awayTeam.tla || "TBD"}
                  </p>
                </div>
                <span className="font-mono text-xl font-black tabular-nums text-floodlight">
                  {hasScore ? <AnimatedScore value={awayScore!} /> : "-"}
                </span>
              </div>
            </div>

            <div className="hidden min-w-[116px] flex-col gap-2 sm:flex">
              <span
                className={`rounded-sm px-3 py-2 text-center font-mono text-xs font-bold uppercase tracking-widest ${
                  isLive
                    ? "bg-live-red/15 text-live-red"
                    : isFinished
                      ? "bg-goal-net/10 text-goal-net/55"
                      : "bg-primary/15 text-primary"
                }`}
              >
                {statusLabel}
              </span>
              <span className="rounded-sm border border-goal-net/10 bg-pitch-black/45 px-3 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-goal-net/45">
                Match centre
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-goal-net/10 pt-3">
            {["Lineups", "Stats", "Timeline"].map((label) => (
              <span
                key={label}
                className="rounded-sm bg-goal-net/5 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-goal-net/35"
              >
                {label}
              </span>
            ))}
            {match.venue && (
              <span className="ml-auto max-w-full truncate font-mono text-[10px] uppercase tracking-widest text-goal-net/30">
                {match.venue}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
