import { formatTimestamp } from "@/lib/api";

interface CacheBannerProps {
  lastUpdated: number;
  error?: string | null;
}

export default function CacheBanner({ lastUpdated, error }: CacheBannerProps) {
  return (
    <div
      className="flex items-start gap-2 rounded-sm border border-card-gold/20 bg-card-gold/5 px-4 py-3"
      role="status"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-card-gold/80">
        Cached · {formatTimestamp(lastUpdated)}
        {error && <span className="text-card-gold/50"> — {error}</span>}
      </p>
    </div>
  );
}
