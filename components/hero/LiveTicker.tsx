import type { Match } from "@/lib/types";
import { isLiveStatus, isFinishedStatus } from "@/lib/api";
import TeamCrest from "@/components/ui/TeamCrest";

interface LiveTickerProps {
  matches: Match[];
}

function TickerItem({ match }: { match: Match }) {
  const home = match.score.fullTime.home;
  const away = match.score.fullTime.away;
  const isLive = isLiveStatus(match.status);
  const isFinished = isFinishedStatus(match.status);
  const hasScore = home !== null && away !== null;

  return (
    <div className="flex shrink-0 items-center gap-3 border-r border-goal-net/10 px-6 py-2.5">
      {isLive && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live-red opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-live-red" />
        </span>
      )}
      <TeamCrest team={match.homeTeam} size="sm" />
      <span className="font-display text-sm tracking-wide text-floodlight">
        {match.homeTeam.tla}
      </span>
      <span className="font-display text-base tabular-nums text-floodlight">
        {hasScore ? `${home} - ${away}` : "vs"}
      </span>
      <span className="font-display text-sm tracking-wide text-floodlight">
        {match.awayTeam.tla}
      </span>
      <TeamCrest team={match.awayTeam} size="sm" />
      {isLive && match.minute !== null && (
        <span className="font-mono text-xs text-live-red">{match.minute}&apos;</span>
      )}
      {isFinished && (
        <span className="font-mono text-[10px] uppercase text-goal-net/40">FT</span>
      )}
    </div>
  );
}

export default function LiveTicker({ matches }: LiveTickerProps) {
  const tickerMatches =
    matches.length > 0
      ? matches
      : [];

  if (tickerMatches.length === 0) {
    return (
      <div className="border-t border-turf-green/20 bg-pitch-black/95 py-3 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-goal-net/40">
          No live scores - check back on matchday
        </p>
      </div>
    );
  }

  const doubled = [...tickerMatches, ...tickerMatches];

  return (
    <div className="group overflow-hidden border-t border-turf-green/30 bg-pitch-black/95">
      <div className="flex ticker-track w-max">
        {doubled.map((match, i) => (
          <TickerItem key={`${match.id}-${i}`} match={match} />
        ))}
      </div>
    </div>
  );
}
