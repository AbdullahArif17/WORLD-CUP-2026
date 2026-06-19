"use client";

import { useEffect, useState } from "react";
import ScrollLinkedBall from "./ScrollLinkedBall";
import LiveTicker from "./LiveTicker";
import type { Match } from "@/lib/types";
import { fetchAllMatches, isLiveStatus, isFinishedStatus } from "@/lib/api";

export default function HeroSection() {
  const [tickerMatches, setTickerMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetchAllMatches()
      .then((result) => {
        const matches = result.data.matches ?? [];
        const live = matches.filter((m) => isLiveStatus(m.status));
        const recent = matches
          .filter((m) => isFinishedStatus(m.status))
          .sort(
            (a, b) =>
              new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime()
          )
          .slice(0, 8);
        setTickerMatches(live.length > 0 ? live : recent);
      })
      .catch(() => setTickerMatches([]));
  }, []);

  return (
    <section className="relative -mx-4 mb-8 overflow-hidden md:-mx-0 md:rounded-sm">
      <div
        className="pointer-events-none absolute inset-0 bg-floodlight-radial"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-pitch-lines bg-[length:48px_48px] opacity-30"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(248,255,244,0.08)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 px-4 pb-2 pt-8 text-center md:pt-12">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.35em] text-turf-green">
          FIFA World Cup
        </p>
        <h1 className="font-display text-[clamp(3rem,12vw,8rem)] leading-[0.9] tracking-tight text-floodlight">
          WORLD CUP
          <br />
          <span className="text-turf-green">2026</span>
        </h1>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.4em] text-goal-net/60">
          USA · CANADA · MEXICO
        </p>
      </div>

      {/* 3D ball lives here — absolute, not fixed */}
      <div className="relative z-10 mx-auto h-[260px] w-full max-w-lg md:h-[320px]">
        <ScrollLinkedBall />
      </div>

      <LiveTicker matches={tickerMatches} />
    </section>
  );
}
