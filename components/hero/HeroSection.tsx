"use client";

import { useEffect, useState } from "react";
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
    <section className="dashboard-card relative -mx-4 mb-6 overflow-hidden md:-mx-0">
      <div
        className="pointer-events-none absolute inset-0 bg-pitch-lines bg-[length:36px_36px] opacity-20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-live-red via-card-gold to-primary"
        aria-hidden="true"
      />

      <div className="relative z-10 grid gap-5 p-4 sm:p-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-sm bg-primary px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-pitch-black">
              World Cup 2026
            </span>
            <span className="rounded-sm border border-goal-net/10 bg-pitch-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-goal-net/45">
              Live scores
            </span>
          </div>
          <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-floodlight sm:text-4xl">
            Scores, fixtures, lineups and player stats in one match centre.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-goal-net/55">
            Built around the SofaScore/FotMob workflow: fast match rows, player
            leaders, lineups, event timelines, standings and detailed match
            pages.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
          {[
            ["Live", "Match status"],
            ["Lineups", "XI + bench"],
            ["Ratings", "Player form"],
            ["Tables", "Group stage"],
          ].map(([label, value]) => (
            <div key={label} className="stat-block">
              <p className="font-mono text-[10px] uppercase tracking-widest text-goal-net/35">
                {label}
              </p>
              <p className="mt-1 text-sm font-semibold text-floodlight">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <LiveTicker matches={tickerMatches} />
    </section>
  );
}
