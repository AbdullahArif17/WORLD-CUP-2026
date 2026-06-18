interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  accent?: "red" | "gold" | "neutral";
}

export default function SectionHeader({
  title,
  subtitle,
  count,
  accent = "red",
}: SectionHeaderProps) {
  const accentClass =
    accent === "gold"
      ? "from-gold to-gold-dark"
      : accent === "neutral"
        ? "from-white/30 to-white/10"
        : "from-primary to-gold";

  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div className="flex items-center gap-3">
        <div
          className={`section-accent bg-gradient-to-b ${accentClass}`}
          aria-hidden="true"
        />
        <div>
          <h2 className="text-base font-bold tracking-tight text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-white/40">{subtitle}</p>
          )}
        </div>
      </div>
      {count !== undefined && (
        <span className="font-mono text-xs font-semibold tabular-nums text-white/30">
          {count}
        </span>
      )}
    </div>
  );
}
