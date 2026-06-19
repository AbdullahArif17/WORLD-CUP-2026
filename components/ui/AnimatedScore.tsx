"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";

interface AnimatedScoreProps {
  value: number;
  className?: string;
}

export default function AnimatedScore({ value, className = "" }: AnimatedScoreProps) {
  const motionValue = useMotionValue(value);
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useMotionValueEvent(motionValue, "change", (v) => setDisplay(Math.round(v)));

  useEffect(() => {
    if (prev.current !== value) {
      animate(motionValue, value, { duration: 0.45, ease: "easeOut" });
      prev.current = value;
    }
  }, [value, motionValue]);

  return <span className={`tabular-nums ${className}`}>{display}</span>;
}
