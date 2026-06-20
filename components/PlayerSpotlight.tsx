import PlayerAvatar from "@/components/ui/PlayerAvatar";
import PlayerRating from "@/components/ui/PlayerRating";
import { getTeamFlag } from "@/lib/api";
import type { Scorer } from "@/lib/types";

interface PlayerSpotlightProps {
  scorers: Scorer[];
  loading?: boolean;
}

export default function PlayerSpotlight({
  scorers,
  loading,
}: PlayerSpotlightProps) {
  const leaders = scorers.slice(0, 4);

  return (
    <section className="dashboard-card p-4">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
            Player tracker
          </p>
          <h2 className="text-lg font-bold text-floodlight">
            Tournament leaders
          </h2>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-goal-net/35">
          Goals / assists / form
        </span>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-md bg-goal-net/10"
            />
          ))}
        </div>
      ) : leaders.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {leaders.map((scorer, index) => (
            <article
              key={`${scorer.player.id}-${scorer.team.id}`}
              className="relative overflow-hidden rounded-md border border-goal-net/10 bg-pitch-black/55 p-4"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-primary/15 to-transparent"
                aria-hidden="true"
              />
              <div className="relative flex items-start justify-between gap-3">
                <PlayerAvatar player={scorer.player} size="lg" />
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-goal-net/35">
                    #{index + 1}
                  </span>
                  <div className="mt-2">
                    <PlayerRating player={scorer.player} />
                  </div>
                </div>
              </div>
              <h3 className="mt-4 truncate text-sm font-bold text-floodlight">
                {scorer.player.name}
              </h3>
              <p className="mt-1 truncate text-xs text-goal-net/40">
                <span aria-hidden="true">{getTeamFlag(scorer.team.tla)}</span>{" "}
                {scorer.team.shortName || scorer.team.name}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-sm bg-goal-net/5 p-2">
                  <p className="font-mono text-lg font-bold text-card-gold">
                    {scorer.goals}
                  </p>
                  <p className="text-[9px] uppercase tracking-widest text-goal-net/35">
                    Goals
                  </p>
                </div>
                <div className="rounded-sm bg-goal-net/5 p-2">
                  <p className="font-mono text-lg font-bold text-floodlight">
                    {scorer.assists ?? "-"}
                  </p>
                  <p className="text-[9px] uppercase tracking-widest text-goal-net/35">
                    Ast
                  </p>
                </div>
                <div className="rounded-sm bg-goal-net/5 p-2">
                  <p className="font-mono text-lg font-bold text-floodlight">
                    {scorer.penalties ?? "-"}
                  </p>
                  <p className="text-[9px] uppercase tracking-widest text-goal-net/35">
                    Pen
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-goal-net/40">
          Player leaders will appear once scorer data is available.
        </p>
      )}
    </section>
  );
}
