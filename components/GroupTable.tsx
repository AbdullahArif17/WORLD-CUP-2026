import type { GroupStanding } from "@/lib/types";
import { formatGroupLabel, getTeamFlag } from "@/lib/api";

interface GroupTableProps {
  group: GroupStanding;
}

export default function GroupTable({ group }: GroupTableProps) {
  return (
    <div className="dashboard-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-surface-elevated/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="section-accent" aria-hidden="true" />
          <h3 className="font-mono text-sm font-bold uppercase tracking-wide text-white">
            {formatGroupLabel(group.group)}
          </h3>
        </div>
        <span className="rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-gold">
          Top 2 advance
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] text-left text-xs">
          <thead>
            <tr className="border-b border-white/[0.05] font-mono text-[10px] uppercase tracking-wider text-white/30">
              <th className="px-4 py-2.5 font-semibold">#</th>
              <th className="px-2 py-2.5 font-semibold">Team</th>
              <th className="px-2 py-2.5 text-center font-semibold">P</th>
              <th className="px-2 py-2.5 text-center font-semibold">W</th>
              <th className="px-2 py-2.5 text-center font-semibold">D</th>
              <th className="px-2 py-2.5 text-center font-semibold">L</th>
              <th className="px-2 py-2.5 text-center font-semibold">GD</th>
              <th className="px-4 py-2.5 text-center font-semibold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {group.table.map((row) => {
              const advances = row.position <= 2;
              return (
                <tr
                  key={row.team.id}
                  className={`border-b border-white/[0.04] last:border-0 transition-colors duration-150 ${
                    advances
                      ? "bg-gold/[0.06] hover:bg-gold/[0.09]"
                      : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td className="px-4 py-3">
                    <span
                      className={`font-mono text-xs font-bold tabular-nums ${
                        advances ? "text-gold" : "text-white/30"
                      }`}
                    >
                      {row.position}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none" aria-hidden="true">
                        {getTeamFlag(row.team.tla)}
                      </span>
                      <span
                        className={`truncate font-semibold ${
                          advances ? "text-gold" : "text-white/85"
                        }`}
                      >
                        {row.team.shortName || row.team.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center font-mono tabular-nums text-white/55">
                    {row.playedGames}
                  </td>
                  <td className="px-2 py-3 text-center font-mono tabular-nums text-white/55">
                    {row.won}
                  </td>
                  <td className="px-2 py-3 text-center font-mono tabular-nums text-white/55">
                    {row.draw}
                  </td>
                  <td className="px-2 py-3 text-center font-mono tabular-nums text-white/55">
                    {row.lost}
                  </td>
                  <td className="px-2 py-3 text-center font-mono tabular-nums text-white/55">
                    {row.goalDifference > 0
                      ? `+${row.goalDifference}`
                      : row.goalDifference}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex min-w-[28px] justify-center rounded-md px-1.5 py-0.5 font-mono text-sm font-bold tabular-nums ${
                        advances
                          ? "bg-gold/15 text-gold"
                          : "text-white"
                      }`}
                    >
                      {row.points}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
