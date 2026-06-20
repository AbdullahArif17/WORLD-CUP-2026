import type { Player } from "@/lib/types";

interface PlayerRatingProps {
  player: Pick<Player, "id" | "name" | "position" | "shirtNumber">;
  compact?: boolean;
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

export default function PlayerRating({ player, compact }: PlayerRatingProps) {
  const value = estimatePlayerRating(player);
  const numeric = Number(value);
  const tone =
    numeric >= 8
      ? "bg-card-gold text-pitch-black"
      : numeric >= 7
        ? "bg-primary text-pitch-black"
        : "bg-goal-net/10 text-goal-net";

  return (
    <span
      className={`inline-flex items-center rounded-sm px-2 py-1 font-mono font-bold tabular-nums ${tone} ${
        compact ? "text-[10px]" : "text-xs"
      }`}
      title="Estimated rating. The current API does not provide official player ratings."
    >
      {value}
    </span>
  );
}
