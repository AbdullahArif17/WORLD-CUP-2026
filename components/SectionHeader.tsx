interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  accent?: "live" | "gold" | "neutral";
}

export default function SectionHeader({
  title,
  subtitle,
  count,
  accent = "neutral",
}: SectionHeaderProps) {
  const accentClass =
    accent === "live"
      ? "bg-live-red"
      : accent === "gold"
        ? "bg-card-gold"
        : "bg-turf-green";

  return (
    <div className="mb-5 flex items-end justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className={`h-6 w-1 ${accentClass}`} aria-hidden="true" />
        <div>
          <h2 className="font-display text-2xl tracking-wide text-floodlight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-goal-net/40">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {count !== undefined && (
        <span className="font-display text-xl tabular-nums text-goal-net/25">
          {count}
        </span>
      )}
    </div>
  );
}
