interface ErrorBannerProps {
  message: string;
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div
      className="rounded-sm border border-live-red/30 bg-live-red/10 px-4 py-3"
      role="alert"
    >
      <p className="font-mono text-xs text-live-red/90">{message}</p>
    </div>
  );
}
