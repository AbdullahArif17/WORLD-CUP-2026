export function SkeletonMatchCard() {
  return (
    <div className="dashboard-card animate-pulse overflow-hidden p-4">
      <div className="mb-4 flex justify-between">
        <div className="h-5 w-20 rounded-full bg-white/10" />
        <div className="h-4 w-16 rounded bg-white/10" />
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-white/10" />
          <div className="h-3 w-12 rounded bg-white/10" />
        </div>
        <div className="h-14 w-20 rounded-xl bg-white/10" />
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-white/10" />
          <div className="h-3 w-12 rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGroupTable() {
  return (
    <div className="dashboard-card animate-pulse overflow-hidden">
      <div className="border-b border-white/[0.06] px-4 py-3">
        <div className="h-4 w-24 rounded bg-white/10" />
      </div>
      <div className="space-y-3 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="h-4 w-32 rounded bg-white/10" />
            <div className="h-4 w-8 rounded bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="dashboard-card animate-pulse p-1">
      <div className="flex gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="stat-block flex-1">
            <div className="mx-auto h-8 w-10 rounded bg-white/10" />
            <div className="mx-auto mt-2 h-2 w-12 rounded bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
