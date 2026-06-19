interface StaticFootballProps {
  className?: string;
}

/** CSS fallback — faceted black & white football */
export default function StaticFootball({ className = "" }: StaticFootballProps) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <div className="relative aspect-square w-full max-w-[160px]">
        <div
          className="absolute inset-0"
          style={{
            background: "#F5F5F0",
            clipPath:
              "polygon(50% 0%, 80% 10%, 100% 35%, 90% 70%, 50% 100%, 10% 70%, 0% 35%, 20% 10%)",
            filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.35))",
          }}
        />
        <div
          className="absolute inset-[18%]"
          style={{
            background: "#161616",
            clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
          }}
        />
        <div className="absolute -bottom-[6%] left-1/2 h-[8%] w-[50%] -translate-x-1/2 rounded-full bg-black/25 blur-md" />
      </div>
    </div>
  );
}
