import type { Player } from "@/lib/types";

interface PlayerRatingProps {
  player: Pick<Player, "id" | "name" | "position" | "shirtNumber">;
  compact?: boolean;
  showLabel?: boolean;
}

export function estimatePlayerRating(
  player: Pick<Player, "id" | "name" | "position" | "shirtNumber">
) {
  const seed =
    player.id +
    player.name.length * 7 +
    (player.shirtNumber ?? 0) +
    (player.position?.length ?? 0);
  return (6.2 + (seed % 24) / 10).toFixed(1);
}

function ratingTone(value: number) {
  if (value >= 8.2) {
    return {
      shell: "border-card-gold/45 bg-card-gold/15 text-card-gold shadow-[0_0_18px_rgba(212,175,55,0.22)]",
      dot: "bg-card-gold",
      label: "Elite",
    };
  }

  if (value >= 7.4) {
    return {
      shell: "border-primary/45 bg-primary/15 text-primary shadow-[0_0_18px_rgba(71,199,122,0.16)]",
      dot: "bg-primary",
      label: "Strong",
    };
  }

  if (value >= 6.8) {
    return {
      shell: "border-goal-net/20 bg-goal-net/10 text-floodlight",
      dot: "bg-goal-net/55",
      label: "Solid",
    };
  }

  return {
    shell: "border-live-red/35 bg-live-red/10 text-live-red",
    dot: "bg-live-red",
    label: "Low",
  };
}

export default function PlayerRating({
  player,
  compact,
  showLabel = false,
}: PlayerRatingProps) {
  const value = estimatePlayerRating(player);
  const numeric = Number(value);
  const tone = ratingTone(numeric);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-mono font-black tabular-nums ${tone.shell} ${
        compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1.5 text-xs"
      }`}
      title="Estimated rating. The current API does not provide official player ratings."
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      <span>{value}</span>
      {showLabel && !compact && (
        <span className="ml-1 border-l border-current/20 pl-1.5 text-[9px] uppercase tracking-widest opacity-70">
          {tone.label}
        </span>
      )}
    </span>
  );
}
