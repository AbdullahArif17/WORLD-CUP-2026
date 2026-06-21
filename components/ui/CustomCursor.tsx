"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const hoveringRef = useRef(false);
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const rotate = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 500, damping: 28, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 500, damping: 28, mass: 0.5 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setEnabled(finePointer && !reducedMotion);

    if (!finePointer) return;

    const move = (e: MouseEvent) => {
      const offset = hoveringRef.current ? 24 : 16;
      rawX.set(e.clientX - offset);
      rawY.set(e.clientY - offset);
      rotate.set(e.clientX * 0.35);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const nextHovering = !!target.closest(
        "a, button, [role='button'], input, select"
      );
      hoveringRef.current = nextHovering;
      setHovering((current) => (current === nextHovering ? current : nextHovering));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [rawX, rawY, rotate]);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
      style={{ x, y, rotate, borderRadius: "50%" }}
      animate={{
        width: hovering ? 48 : 32,
        height: hovering ? 48 : 32,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      aria-hidden="true"
    >
      <div className="relative h-full w-full overflow-hidden rounded-full border border-goal-net/40 bg-floodlight shadow-[0_0_18px_rgba(248,255,244,0.35)]">
        <Image
          src="/images/ball-cursor.png"
          alt=""
          fill
          sizes="48px"
          className="scale-125 object-cover"
        />
      </div>
      <div className="absolute inset-0 rounded-full ring-2 ring-primary/20" />
    </motion.div>
  );
}
