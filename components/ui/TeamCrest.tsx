import Image from "next/image";
import { getTeamCrest } from "@/lib/images";
import type { Team } from "@/lib/types";

interface TeamCrestProps {
  team: Pick<Team, "name" | "shortName" | "tla" | "crest" | "area">;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { px: 28, className: "h-7 w-7" },
  md: { px: 40, className: "h-10 w-10" },
  lg: { px: 56, className: "h-14 w-14" },
};

export default function TeamCrest({
  team,
  size = "md",
  className = "",
}: TeamCrestProps) {
  const dim = sizes[size];
  const src = getTeamCrest(team);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-goal-net/10 bg-pitch p-1 ${dim.className} ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={`${team.name || team.shortName || team.tla || "Team"} crest`}
          width={dim.px}
          height={dim.px}
          className="h-full w-full object-contain"
          unoptimized
        />
      ) : (
        <span className="font-mono text-[10px] font-bold text-goal-net/45">
          {team.tla || "TBD"}
        </span>
      )}
    </div>
  );
}
