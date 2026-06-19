"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import StaticFootball from "./StaticFootball";

const FootballScene = dynamic(
  () => import("@/components/three/FootballScene"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-goal-net/20 to-turf-green/30" />
      </div>
    ),
  }
);

interface FootballCanvasProps {
  className?: string;
}

export default function FootballCanvas({ className }: FootballCanvasProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <StaticFootball className={className} />;
  }

  return <FootballScene className={className} />;
}
