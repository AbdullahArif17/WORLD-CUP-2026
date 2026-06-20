"use client";

import Image from "next/image";
import { getFlagUrl } from "@/lib/flags";

interface TeamFlagProps {
  tla?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { w: 24, h: 16, class: "h-4 w-6" },
  md: { w: 40, h: 28, class: "h-7 w-10" },
  lg: { w: 80, h: 56, class: "h-14 w-20" },
};

export default function TeamFlag({
  tla,
  size = "md",
  className = "",
}: TeamFlagProps) {
  const url = getFlagUrl(tla, size === "lg" ? "w80" : "w40");
  const dim = sizes[size];

  if (!url) {
    const label = tla?.slice(0, 3) || "TBD";

    return (
      <div
        className={`flex items-center justify-center rounded-sm bg-turf-green/20 font-display text-[10px] text-goal-net/60 ${dim.class} ${className}`}
      >
        {label}
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={`${tla ?? "Team"} flag`}
      width={dim.w}
      height={dim.h}
      className={`rounded-sm object-cover shadow-sm ${dim.class} ${className}`}
      unoptimized
    />
  );
}
