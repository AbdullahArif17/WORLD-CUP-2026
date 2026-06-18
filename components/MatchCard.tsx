import Link from "next/link";
import type { Match } from "@/lib/types";
import {
  formatGroupLabel,
  formatMatchDate,
  formatMatchTime,
  getTeamFlag,
  isFinishedStatus,
  isLiveStatus,
} from "@/lib/api";
import LiveBadge from "./LiveBadge";

interface MatchCardProps {
  match: Match;
  variant?: "default" | "featured";
}

export default function MatchCard({
  match,
  variant = "default",
}: MatchCardProps) {
  const isLive = isLiveStatus(match.status);
  const isFinished = isFinishedStatus(match.status);
  const isFeatured = variant === "featured" || isLive;

  const homeScore = match.score.fullTime.home;
  const awayScore = match.score.fullTime.away;
  const hasScore = homeScore !== null && awayScore !== null;

  let cardStyle = "dashboard-card";
  if (isLive) {
    cardStyle +=
      " border-primary/40 shadow-live hover:border-primary/60";
  } else if (isFinished) {
    cardStyle += " opacity-75 hover:opacity-100";
  }

  const scoreSize = isFeatured ? "text-3xl" : "text-2xl";

  return (
    <Link
      href={`/matches/${match.id}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <article className={`${cardStyle} overflow-hidden`}>
      {isLive && (
        <div
          className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent"
          aria-hidden="true"
        />
      )}

      <div className="p-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isLive && <LiveBadge />}
            {match.group && (
              <span className="rounded-md border border-white/[0.08] bg-surface-elevated px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-white/50">
                {formatGroupLabel(match.group)}
              </span>
            )}
            {isFinished && !isLive && (
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wide text-white/30">
                FT
              </span>
            )}
          </div>
          <div className="text-right font-mono text-[10px] text-white/35">
            <div>{formatMatchDate(match.utcDate)}</div>
            {!isLive && <div>{formatMatchTime(match.utcDate)}</div>}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-3xl leading-none" aria-hidden="true">
              {getTeamFlag(match.homeTeam.tla)}
            </span>
            <span
              className={`max-w-full truncate text-xs font-bold uppercase tracking-wide ${
                isFinished ? "text-white/50" : "text-white"
              }`}
            >
              {match.homeTeam.tla || match.homeTeam.shortName}
            </span>
            <span className="max-w-full truncate text-[10px] text-white/35">
              {match.homeTeam.shortName || match.homeTeam.name}
            </span>
          </div>

          <div className="flex min-w-[88px] flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-pitch/80 px-4 py-3">
            {hasScore ? (
              <span
                className={`font-mono font-bold tabular-nums leading-none ${scoreSize} ${
                  isLive
                    ? "text-white"
                    : isFinished
                      ? "text-white/45"
                      : "text-white/80"
                }`}
              >
                {homeScore}
                <span className="mx-1 text-white/25">:</span>
                {awayScore}
              </span>
            ) : (
              <span className="font-mono text-sm font-semibold text-white/30">
                VS
              </span>
            )}
            {isLive && match.minute !== null && (
              <span className="mt-1.5 font-mono text-xs font-bold text-primary">
                {match.minute}&apos;
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-3xl leading-none" aria-hidden="true">
              {getTeamFlag(match.awayTeam.tla)}
            </span>
            <span
              className={`max-w-full truncate text-xs font-bold uppercase tracking-wide ${
                isFinished ? "text-white/50" : "text-white"
              }`}
            >
              {match.awayTeam.tla || match.awayTeam.shortName}
            </span>
            <span className="max-w-full truncate text-[10px] text-white/35">
              {match.awayTeam.shortName || match.awayTeam.name}
            </span>
          </div>
        </div>

        {match.venue && (
          <div className="mt-4 flex items-center justify-center gap-1.5 border-t border-white/[0.05] pt-3">
            <svg
              className="h-3 w-3 shrink-0 text-white/25"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="truncate text-[10px] text-white/30">{match.venue}</p>
          </div>
        )}
      </div>
      </article>
    </Link>
  );
}
