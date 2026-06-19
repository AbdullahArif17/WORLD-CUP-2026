interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export default function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <header className="jumbotron-panel relative overflow-hidden px-6 py-8">
      <div
        className="pointer-events-none absolute inset-0 bg-pitch-lines bg-[length:32px_32px] opacity-20"
        aria-hidden="true"
      />
      <div className="relative">
        {badge && (
          <span className="mb-2 inline-block font-mono text-[10px] uppercase tracking-[0.35em] text-turf-green">
            {badge}
          </span>
        )}
        <h1 className="font-display text-5xl tracking-wide text-floodlight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 font-mono text-xs text-goal-net/45">{subtitle}</p>
        )}
      </div>
    </header>
  );
}
