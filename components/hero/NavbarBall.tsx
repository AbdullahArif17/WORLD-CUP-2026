"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import StaticFootball from "./StaticFootball";

export default function NavbarBall() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [120, 220], [0, 1]);
  const rotate = useTransform(scrollY, (v) => v * 0.4);

  return (
    <motion.div
      style={{ opacity, rotate }}
      className="h-9 w-9 shrink-0"
      aria-hidden="true"
    >
      <StaticFootball className="h-full w-full" />
    </motion.div>
  );
}
