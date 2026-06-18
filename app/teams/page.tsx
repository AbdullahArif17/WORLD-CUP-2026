"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CacheBanner from "@/components/CacheBanner";
import ErrorBanner from "@/components/ErrorBanner";
import PageHeader from "@/components/PageHeader";
import { SkeletonGroupTable } from "@/components/SkeletonCard";
import { fetchTeams, getTeamFlag } from "@/lib/api";
import type { Team } from "@/lib/types";

function TeamCard({ team }: { team: Team }) {
  const squad = team.squad ?? [];

  return (
    <article className="dashboard-card overflow-hidden">
      <div className="flex items-start gap-3 border-b border-white/[0.06] bg-surface-elevated/40 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-pitch text-2xl">
          {team.crest ? (
            <img
              src={team.crest}
              alt=""
              className="h-8 w-8 object-contain"
              loading="lazy"
            />
          ) : (
            <span aria-hidden="true">{getTeamFlag(team.tla)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none" aria-hidden="true">
              {getTeamFlag(team.tla)}
            </span>
            <h2 className="truncate text-base font-bold text-white">
              {team.name}
            </h2>
          </div>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/35">
            {team.tla || team.shortName}
            {team.area?.name ? ` | ${team.area.name}` : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4 text-xs">
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
            Squad
          </p>
          <p className="mt-1 font-mono font-bold text-gold">
            {squad.length || "TBA"}
          </p>
        </div>
      </div>

      <div className="border-t border-white/[0.05] px-4 pb-4 pt-3">
        {squad.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {squad.slice(0, 12).map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.03] px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white/75">
                    {player.name}
                  </p>
                  <p className="truncate text-[10px] text-white/30">
                    {player.position ?? player.nationality ?? "Player"}
                  </p>
                </div>
                {player.shirtNumber && (
                  <span className="font-mono text-xs font-bold text-white/35">
                    {player.shirtNumber}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/35">
            Squad list has not been published by the API yet.
          </p>
        )}
      </div>
    </article>
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
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
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
