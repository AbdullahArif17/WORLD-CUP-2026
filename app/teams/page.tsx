"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import CacheBanner from "@/components/CacheBanner";
import ErrorBanner from "@/components/ErrorBanner";
import PageHeader from "@/components/PageHeader";
import { SkeletonGroupTable } from "@/components/SkeletonCard";
import CountryFlag from "@/components/ui/CountryFlag";
import PlayerAvatar from "@/components/ui/PlayerAvatar";
import PlayerRating from "@/components/ui/PlayerRating";
import TeamCrest from "@/components/ui/TeamCrest";
import { fetchTeams } from "@/lib/api";
import type { Player, Team } from "@/lib/types";

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: Math.min(index * 0.04, 0.3), duration: 0.32 },
  }),
};

const playerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: Math.min(index * 0.015, 0.22), duration: 0.22 },
  }),
};

function positionGroup(position?: string | null) {
  const value = (position ?? "").toLowerCase();
  if (value.includes("goalkeeper")) return "Goalkeepers";
  if (value.includes("defence") || value.includes("defender")) return "Defenders";
  if (value.includes("midfield")) return "Midfielders";
  if (value.includes("offence") || value.includes("forward") || value.includes("winger")) {
    return "Forwards";
  }
  return "Squad";
}

function groupSquad(players: Player[]) {
  const order = ["Goalkeepers", "Defenders", "Midfielders", "Forwards", "Squad"];
  const groups = players.reduce<Record<string, Player[]>>((acc, player) => {
    const group = positionGroup(player.position);
    acc[group] = [...(acc[group] ?? []), player];
    return acc;
  }, {});

  return order
    .map((label) => ({ label, players: groups[label] ?? [] }))
    .filter((group) => group.players.length > 0);
}

function PlayerRow({ player, index }: { player: Player; index: number }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
      variants={playerVariants}
      whileHover={{ y: -2, scale: 1.01 }}
      className="group flex items-center gap-3 rounded-md border border-white/[0.06] bg-white/[0.03] px-3 py-2 transition-colors hover:border-primary/25 hover:bg-primary/[0.04]"
    >
      <PlayerAvatar player={player} size="md" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white/80 group-hover:text-floodlight">
          {player.name}
        </p>
        <p className="truncate text-[10px] text-white/35">
          {player.position ?? player.nationality ?? "Player"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {player.shirtNumber && (
          <span className="hidden rounded-sm bg-goal-net/5 px-2 py-1 font-mono text-[10px] font-bold text-goal-net/45 sm:inline-flex">
            #{player.shirtNumber}
          </span>
        )}
        <PlayerRating player={player} compact />
      </div>
    </motion.div>
  );
}

function TeamCard({ team, index }: { team: Team; index: number }) {
  const squad = team.squad ?? [];
  const groupedSquad = groupSquad(squad);

  return (
    <motion.article
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={cardVariants}
      className="dashboard-card overflow-hidden"
    >
      <div className="relative flex items-start gap-3 border-b border-white/[0.06] bg-surface-elevated/40 p-4">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/0 via-primary/60 to-card-gold/0"
          aria-hidden="true"
        />
        <motion.div whileHover={{ rotate: -3, scale: 1.04 }}>
          <TeamCrest team={team} size="lg" />
        </motion.div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <CountryFlag countryName={team.area?.name || team.name} />
            <h2 className="truncate text-base font-bold text-white">
              {team.name}
            </h2>
          </div>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/35">
            {team.tla || team.shortName}
            {team.area?.name ? ` | ${team.area.name}` : ""}
          </p>
        </div>
        <span className="rounded-sm border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
          {squad.length ? `${squad.length} players` : "Roster TBA"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4 text-xs md:grid-cols-4">
        <div className="rounded-lg border border-white/[0.06] bg-surface-elevated/40 p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
            Coach
          </p>
          <p className="mt-1 truncate font-semibold text-white/80">
            {team.coach?.name ?? "TBA"}
          </p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-surface-elevated/40 p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
            Founded
          </p>
          <p className="mt-1 truncate font-mono font-bold text-white/80">
            {team.founded ?? "TBA"}
          </p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-surface-elevated/40 p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
            Venue
          </p>
          <p className="mt-1 truncate font-semibold text-white/80">
            {team.venue ?? "TBA"}
          </p>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-surface-elevated/40 p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">
            Squad
          </p>
          <p className="mt-1 font-mono font-bold text-gold">
            {squad.length || "TBA"}
          </p>
        </div>
      </div>

      <div className="border-t border-white/[0.05] px-4 pb-4 pt-3">
        {squad.length > 0 ? (
          <div className="space-y-4">
            {groupedSquad.map((group) => (
              <div key={group.label}>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                    {group.label}
                  </h3>
                  <span className="font-mono text-[10px] text-goal-net/35">
                    {group.players.length}
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {group.players.map((player, playerIndex) => (
                    <PlayerRow
                      key={player.id}
                      player={player}
                      index={playerIndex}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/35">
            Squad list has not been published by the API yet.
          </p>
        )}
      </div>
    </motion.article>
  );
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTeams = useCallback(async () => {
    try {
      const result = await fetchTeams();
      setTeams(
        (result.data.teams ?? []).sort((a, b) => a.name.localeCompare(b.name))
      );
      setFromCache(result.fromCache);
      setLastUpdated(result.timestamp);
      setError(result.error ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load teams");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const squadCount = useMemo(
    () => teams.reduce((total, team) => total + (team.squad?.length ?? 0), 0),
    [teams]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teams and Squads"
        subtitle={
          loading
            ? "Loading qualified teams..."
            : `${teams.length} teams | ${squadCount || "No"} players listed`
        }
        badge="Teams"
      />

      {fromCache && lastUpdated && (
        <CacheBanner lastUpdated={lastUpdated} error={error} />
      )}

      {!loading && error && !fromCache && <ErrorBanner message={error} />}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonGroupTable key={i} />
          ))}
        </div>
      ) : teams.length > 0 ? (
        <div className="space-y-4">
          {teams.map((team, index) => (
            <TeamCard key={team.id} team={team} index={index} />
          ))}
        </div>
      ) : (
        <div className="dashboard-card px-4 py-12 text-center">
          <p className="text-sm font-medium text-white/40">
            No teams available yet
          </p>
          {error && (
            <p className="mt-2 text-xs text-primary/80">
              {error}. Check your API key in .env.local
            </p>
          )}
        </div>
      )}
    </div>
  );
}
