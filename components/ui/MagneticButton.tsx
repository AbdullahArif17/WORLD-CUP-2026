"use client";

import { useRef, useState } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  active?: boolean;
}

export default function MagneticButton({
  children,
  active = false,
  className = "",
  onMouseMove,
  onMouseLeave,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      type="button"
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setOffset({
          x: (e.clientX - rect.left - rect.width / 2) * 0.12,
          y: (e.clientY - rect.top - rect.height / 2) * 0.12,
        });
        onMouseMove?.(e);
      }}
      onMouseLeave={(e) => {
        setOffset({ x: 0, y: 0 });
        onMouseLeave?.(e);
      }}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`magnetic-btn rounded-sm px-5 py-2 font-mono text-xs font-semibold uppercase tracking-widest transition-colors ${
        active
          ? "bg-turf-green text-floodlight shadow-turf"
          : "border border-goal-net/15 bg-pitch-black/60 text-goal-net/60 hover:border-turf-green/40 hover:text-floodlight"
      } ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
