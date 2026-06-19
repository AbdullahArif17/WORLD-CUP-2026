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

  return (
    <article className={cardClass}>
      <Link href={`/matches/${match.id}`} className="block">
        <div className="relative p-5">
          <div className="mb-5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {isLive && <LiveBadge />}
              {match.group && (
                <span className="font-mono text-[10px] uppercase tracking-widest text-turf-green/70">
                  {formatGroupLabel(match.group)}
                </span>
              )}
              {isFinished && !isLive && (
                <span className="font-mono text-[10px] uppercase tracking-widest text-goal-net/35">
                  Full Time
                </span>
              )}
            </div>
            <div className="text-right font-mono text-[10px] uppercase tracking-wide text-goal-net/40">
              <div>{formatMatchDate(match.utcDate)}</div>
              {!isLive && <div>{formatMatchTime(match.utcDate)}</div>}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <TeamFlag tla={match.homeTeam.tla} size="lg" />
              <span
                className={`font-display text-xl tracking-wide ${
                  isFinished ? "text-goal-net/50" : "text-floodlight"
                }`}
              >
                {match.homeTeam.tla || match.homeTeam.shortName}
              </span>
              <span className="max-w-full truncate font-mono text-[10px] text-goal-net/35">
                {match.homeTeam.shortName || match.homeTeam.name}
              </span>
            </div>

            <div className="flex min-w-[100px] flex-col items-center rounded-sm border border-turf-green/20 bg-turf-green/5 px-5 py-4">
              {hasScore ? (
                <div className="flex items-baseline gap-1 font-display text-4xl font-bold tabular-nums leading-none text-floodlight md:text-5xl">
                  <AnimatedScore value={homeScore!} />
                  <span className="text-goal-net/30">:</span>
                  <AnimatedScore value={awayScore!} />
                </div>
              ) : (
                <span className="font-display text-2xl text-goal-net/30">VS</span>
              )}
              {isLive && match.minute !== null && (
                <span className="mt-2 font-mono text-sm font-bold text-live-red">
                  {match.minute}&apos;
                </span>
              )}
            </div>

            <div className="flex flex-col items-center gap-2 text-center">
              <TeamFlag tla={match.awayTeam.tla} size="lg" />
              <span
                className={`font-display text-xl tracking-wide ${
                  isFinished ? "text-goal-net/50" : "text-floodlight"
                }`}
              >
                {match.awayTeam.tla || match.awayTeam.shortName}
              </span>
              <span className="max-w-full truncate font-mono text-[10px] text-goal-net/35">
                {match.awayTeam.shortName || match.awayTeam.name}
              </span>
            </div>
          </div>

          {match.venue && (
            <p className="mt-4 truncate text-center font-mono text-[10px] uppercase tracking-widest text-goal-net/25">
              {match.venue}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
