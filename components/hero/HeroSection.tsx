"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import LiveTicker from "./LiveTicker";
import type { Match } from "@/lib/types";

const hostFlags = [
  { country: "United States", code: "USA", src: "/images/flag-us.png" },
  { country: "Canada", code: "CAN", src: "/images/flag-ca.png" },
  { country: "Mexico", code: "MEX", src: "/images/flag-mx.png" },
];

export default function HeroSection({ tickerMatches }: { tickerMatches: Match[] }) {
  return (
    <section className="dashboard-card relative -mx-4 mb-6 overflow-hidden md:-mx-0">
      <Image
        src="/images/hero-stadium.jpg"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 1120px, 100vw"
        className="object-cover opacity-45"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-pitch-black via-pitch-black/88 to-pitch-black/55"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pitch-black via-transparent to-pitch-black/40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-pitch-lines bg-[length:36px_36px] opacity-20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-live-red via-card-gold to-primary"
        aria-hidden="true"
      />

      <div className="relative z-10 grid min-h-[460px] gap-6 p-4 sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="self-center"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-md border border-primary/30 bg-pitch-black/70 shadow-turf">
              <div className="absolute inset-x-2 top-2 h-1 rounded-full bg-primary" />
              <span className="font-mono text-sm font-black text-primary">
                WC
              </span>
              <span className="absolute bottom-2 font-mono text-[8px] font-bold text-goal-net/45">
                26
              </span>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary">
                World Cup Hub
              </p>
              <p className="mt-1 text-sm font-semibold text-floodlight">
                2026 Match Centre
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-sm bg-primary px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-pitch-black">
              World Cup 2026
            </span>
            <span className="rounded-sm border border-goal-net/10 bg-pitch-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-goal-net/45">
              Live scores
            </span>
          </div>
          <h1 className="mt-4 max-w-2xl text-4xl font-black leading-[1.03] text-floodlight sm:text-5xl lg:text-6xl">
            Live scores with real team visuals, lineups and player stories.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-goal-net/70">
            Built around the SofaScore/FotMob workflow: fast match rows, player
            leaders, lineups, event timelines, standings and detailed match
            pages.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12, duration: 0.45 }}
          className="grid gap-3"
        >
          <div className="relative overflow-hidden rounded-md border border-goal-net/10 bg-pitch-black/72 p-4 shadow-bloom backdrop-blur-md">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-card-gold/12 via-transparent to-primary/10"
              aria-hidden="true"
            />
            <div className="relative grid grid-cols-[auto_1fr_auto] items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="relative h-20 w-20 overflow-hidden rounded-full border border-goal-net/20 bg-floodlight shadow-[0_0_32px_rgba(248,255,244,0.18)]"
              >
                <Image
                  src="/images/ball-hero.png"
                  alt="World Cup match ball"
                  fill
                  sizes="80px"
                  className="scale-125 object-cover"
                  priority
                />
              </motion.div>
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-widest text-card-gold">
                  Official matchday feel
                </p>
                <h2 className="mt-1 truncate text-lg font-black text-floodlight">
                  Ball, trophy, teams and live data
                </h2>
                <p className="mt-1 text-xs leading-5 text-goal-net/50">
                  Visual match centre with real images, crests and player
                  photos where available.
                </p>
              </div>
              <div className="relative hidden h-24 w-16 overflow-hidden rounded-sm border border-goal-net/10 bg-black/80 sm:block">
                <Image
                  src="/images/logo.png"
                  alt="World Cup trophy graphic"
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border border-goal-net/10 bg-pitch-black/72 p-3 shadow-bloom backdrop-blur-md">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-goal-net/40">
              Host nations
            </p>
            <div className="grid grid-cols-3 gap-2">
              {hostFlags.map((host, index) => (
                <motion.div
                  key={host.code}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.06 }}
                  className="overflow-hidden rounded-md border border-goal-net/10 bg-goal-net/5"
                >
                  <div className="relative h-16">
                    <Image
                      src={host.src}
                      alt={`${host.country} flag`}
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="font-mono text-xs font-black text-floodlight">
                      {host.code}
                    </p>
                    <p className="truncate text-[10px] text-goal-net/40">
                      {host.country}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              ["Live", "Match status"],
              ["Lineups", "XI + bench"],
              ["Ratings", "Player form"],
              ["Images", "Crests + photos"],
            ].map(([label, value], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.28 + index * 0.04 }}
                className="stat-block bg-pitch-black/72 backdrop-blur-md"
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary/70">
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold text-floodlight">
                  {value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <LiveTicker matches={tickerMatches} />
    </section>
  );
}
