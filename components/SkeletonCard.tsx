export function SkeletonMatchCard() {
  return (
    <div className="jumbotron-panel animate-pulse p-5">
      <div className="mb-5 flex justify-between">
        <div className="h-4 w-20 bg-turf-green/20" />
        <div className="h-4 w-16 bg-goal-net/10" />
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="mx-auto h-14 w-20 bg-goal-net/10" />
        <div className="h-16 w-24 bg-turf-green/15" />
        <div className="mx-auto h-14 w-20 bg-goal-net/10" />
      </div>
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="jumbotron-panel animate-pulse p-1">
      <div className="flex gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex-1 rounded-sm bg-turf-green/10 p-4">
            <div className="mx-auto h-8 w-10 bg-goal-net/10" />
            <div className="mx-auto mt-2 h-2 w-12 bg-goal-net/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonGroupTable() {
  return (
    <div className="jumbotron-panel animate-pulse">
      <div className="border-b border-turf-green/20 px-5 py-4">
        <div className="h-6 w-28 bg-goal-net/10" />
      </div>
      <div className="space-y-3 p-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-36 bg-goal-net/10" />
            <div className="h-4 w-8 bg-turf-green/15" />
          </div>
        ))}
      </div>
    </div>
  );
}
