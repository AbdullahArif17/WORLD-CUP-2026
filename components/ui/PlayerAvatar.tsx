"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Player } from "@/lib/types";

interface PlayerAvatarProps {
  player: Pick<Player, "name" | "shirtNumber" | "position">;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showInitials?: boolean;
}

const imageCache = new Map<string, string>();

const sizeClasses = {
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
};

const imageSizes = {
  sm: 36,
  md: 48,
  lg: 64,
  xl: 96,
};

const headClasses = {
  sm: "top-2 h-3.5 w-3.5",
  md: "top-2.5 h-5 w-5",
  lg: "top-3 h-7 w-7",
  xl: "top-5 h-10 w-10",
};

const bodyClasses = {
  sm: "-bottom-2 h-6 w-7",
  md: "-bottom-2.5 h-8 w-9",
  lg: "-bottom-3 h-11 w-12",
  xl: "-bottom-4 h-16 w-20",
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function toneForPlayer(player: Pick<Player, "name" | "position">) {
  const seed = Array.from(`${player.name}${player.position ?? ""}`).reduce(
    (total, char) => total + char.charCodeAt(0),
    0
  );
  const tones = [
    "from-turf-green to-primary",
    "from-card-gold to-turf-green",
    "from-live-red to-card-gold",
    "from-surface-elevated to-turf-green",
  ];
  return tones[seed % tones.length];
}

export default function PlayerAvatar({
  player,
  size = "md",
  className = "",
  showInitials = false,
}: PlayerAvatarProps) {
  const [photoUrl, setPhotoUrl] = useState(() => imageCache.get(player.name) ?? "");

  useEffect(() => {
    let cancelled = false;
    const cached = imageCache.get(player.name);

    if (cached !== undefined) {
      setPhotoUrl(cached);
      return;
    }

    fetch(`/api/player-image?name=${encodeURIComponent(player.name)}`)
      .then((res) => (res.ok ? res.json() : { photoUrl: "" }))
      .then((data: { photoUrl?: string }) => {
        if (cancelled) return;
        const nextPhotoUrl = data.photoUrl ?? "";
        imageCache.set(player.name, nextPhotoUrl);
        setPhotoUrl(nextPhotoUrl);
      })
      .catch(() => {
        if (cancelled) return;
        imageCache.set(player.name, "");
        setPhotoUrl("");
      });

    return () => {
      cancelled = true;
    };
  }, [player.name]);

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-goal-net/15 bg-gradient-to-br shadow-sm ${toneForPlayer(
        player
      )} ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    >
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt=""
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="h-full w-full object-cover"
          unoptimized
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(248,255,244,0.45),transparent_35%)]" />
          <div
            className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-[#F0C9A8] shadow-[inset_0_-8px_16px_rgba(88,48,22,0.18)] ${headClasses[size]}`}
          />
          <div
            className={`absolute left-1/2 -translate-x-1/2 rounded-t-full bg-pitch-black/75 ${bodyClasses[size]}`}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-pitch-black/45 to-transparent" />
          {showInitials && (
            <span className="relative mt-auto pb-1 font-mono font-bold text-floodlight drop-shadow">
              {initials(player.name)}
            </span>
          )}
        </>
      )}
      {player.shirtNumber && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border border-pitch-black bg-floodlight px-1 font-mono text-[9px] font-bold text-pitch-black">
          {player.shirtNumber}
        </span>
      )}
    </div>
  );
}
