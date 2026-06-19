"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import FootballCanvas from "./FootballCanvas";

export default function ScrollLinkedBall() {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 200], [1, 0.35]);
  const opacity = useTransform(scrollY, [0, 150, 220], [1, 0.6, 0]);

  return (
    <motion.div
      style={{ scale, opacity }}
      className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 md:h-[280px] md:w-[280px]"
    >
      <FootballCanvas className="h-full w-full [&_canvas]:pointer-events-auto" />
    </motion.div>
  );
}
