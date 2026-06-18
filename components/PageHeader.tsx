interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export default function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <div className="dashboard-card relative overflow-hidden px-5 py-5">
      <div
        className="pointer-events-none absolute inset-0 bg-pitch-grid bg-[length:24px_24px] opacity-40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl"
        aria-hidden="true"
      />
      <div className="relative">
        {badge && (
          <span className="mb-2 inline-block rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-gold">
            {badge}
          </span>
        )}
        <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-white/45">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
