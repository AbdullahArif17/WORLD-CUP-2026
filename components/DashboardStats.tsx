interface DashboardStatsProps {
  liveCount: number;
  todayCount: number;
  upcomingCount: number;
  loading?: boolean;
}

function StatItem({
  label,
  value,
  highlight,
  loading,
}: {
  label: string;
  value: number;
  highlight?: "live" | "gold";
  loading?: boolean;
}) {
  const valueClass =
    highlight === "live"
      ? "text-primary"
      : highlight === "gold"
        ? "text-gold"
        : "text-floodlight";

  return (
    <div className="stat-block flex flex-1 flex-col items-center gap-1 text-center">
      {loading ? (
        <div className="h-8 w-10 animate-pulse rounded bg-white/10" />
      ) : (
        <span
          className={`font-mono text-2xl font-bold tabular-nums ${valueClass}`}
        >
          {value}
        </span>
      )}
      <span className="text-[10px] font-semibold uppercase tracking-widest text-goal-net/40">
        {label}
      </span>
    </div>
  );
}

export default function DashboardStats({
  liveCount,
  todayCount,
  upcomingCount,
  loading,
}: DashboardStatsProps) {
  return (
    <div className="dashboard-card overflow-hidden p-1">
      <div className="flex gap-1">
        <StatItem
          label="Live"
          value={liveCount}
          highlight="live"
          loading={loading}
        />
        <StatItem label="Today" value={todayCount} loading={loading} />
        <StatItem
          label="Next"
          value={upcomingCount}
          highlight="gold"
          loading={loading}
        />
      </div>
    </div>
  );
}
