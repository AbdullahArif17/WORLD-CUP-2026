import { formatTimestamp } from "@/lib/api";

interface CacheBannerProps {
  lastUpdated: number;
  error?: string | null;
}

export default function CacheBanner({ lastUpdated, error }: CacheBannerProps) {
  return (
    <div
      className="flex items-start gap-2 rounded-xl border border-gold/20 bg-gold/5 px-3 py-2.5"
      role="status"
    >
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 text-gold"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
      <p className="text-xs text-gold/90">
        Cached data — last updated at {formatTimestamp(lastUpdated)}
        {error && <span className="text-gold/60"> ({error})</span>}
      </p>
    </div>
  );
}
