"use client";

import { motion } from "framer-motion";
import type { GroupStanding } from "@/lib/types";
import { formatGroupLabel } from "@/lib/api";
import TeamCrest from "@/components/ui/TeamCrest";

interface GroupTableProps {
  group: GroupStanding;
  index?: number;
}

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

export default function GroupTable({ group, index = 0 }: GroupTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="jumbotron-panel"
    >
      <div className="flex items-center justify-between border-b border-turf-green/20 px-5 py-4">
        <h3 className="font-display text-2xl tracking-wide text-floodlight">
          {formatGroupLabel(group.group)}
        </h3>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-card-gold/70">
          Top 2 advance
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[340px]">
          <thead>
            <tr className="border-b border-turf-green/15 font-mono text-[9px] uppercase tracking-[0.2em] text-goal-net/35">
              <th className="px-5 py-3 text-left">#</th>
              <th className="px-2 py-3 text-left">Team</th>
              <th className="px-2 py-3 text-center">P</th>
              <th className="px-2 py-3 text-center">W</th>
              <th className="px-2 py-3 text-center">D</th>
              <th className="px-2 py-3 text-center">L</th>
              <th className="px-2 py-3 text-center">GD</th>
              <th className="px-5 py-3 text-center">Pts</th>
            </tr>
          </thead>
          <tbody>
            {group.table.map((row, i) => {
              const advances = row.position <= 2;
              return (
                <motion.tr
                  key={row.team.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={rowVariants}
                  className={`border-b border-turf-green/10 last:border-0 ${
                    advances ? "border-l-2 border-l-card-gold bg-card-gold/[0.04]" : ""
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <span
                      className={`font-display text-lg tabular-nums ${
                        advances ? "text-card-gold" : "text-goal-net/30"
                      }`}
                    >
                      {row.position}
                    </span>
                  </td>
                  <td className="px-2 py-3.5">
                    <div className="flex items-center gap-3">
                      <TeamCrest team={row.team} size="sm" />
                      <span
                        className={`font-display text-base tracking-wide ${
                          advances ? "text-card-gold" : "text-floodlight"
                        }`}
                      >
                        {row.team.shortName || row.team.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-3.5 text-center font-mono text-sm tabular-nums text-goal-net/55">
                    {row.playedGames}
                  </td>
                  <td className="px-2 py-3.5 text-center font-mono text-sm tabular-nums text-goal-net/55">
                    {row.won}
                  </td>
                  <td className="px-2 py-3.5 text-center font-mono text-sm tabular-nums text-goal-net/55">
                    {row.draw}
                  </td>
                  <td className="px-2 py-3.5 text-center font-mono text-sm tabular-nums text-goal-net/55">
                    {row.lost}
                  </td>
                  <td className="px-2 py-3.5 text-center font-mono text-sm tabular-nums text-goal-net/55">
                    {row.goalDifference > 0
                      ? `+${row.goalDifference}`
                      : row.goalDifference}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span
                      className={`inline-flex min-w-[32px] justify-center font-display text-xl tabular-nums ${
                        advances ? "text-card-gold" : "text-floodlight"
                      }`}
                    >
                      {row.points}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
