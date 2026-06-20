"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";

const links = [
  { href: "/", label: "Live" },
  { href: "/standings", label: "Tables" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/teams", label: "Teams" },
  { href: "/scorers", label: "Stats" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 120], [8, 20]);
  const bgOpacity = useTransform(scrollY, [0, 120], [0.55, 0.92]);
  const backdropFilter = useTransform(blur, (v) => `blur(${v}px)`);
  const backgroundColor = useTransform(
    bgOpacity,
    (v) => `rgba(10, 14, 10, ${v})`
  );

  return (
    <motion.nav
      style={{ backdropFilter, backgroundColor }}
      className="sticky top-0 z-50 border-b border-goal-net/10"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="flex min-h-11 shrink-0 cursor-pointer items-center gap-3 rounded-sm transition-opacity hover:opacity-90"
          aria-label="World Cup 2026 live tracker home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-primary/30 bg-primary/15 font-mono text-xs font-black text-primary">
            WC
          </div>
          <div>
            <span className="font-display text-lg leading-none tracking-wide text-floodlight">
              WC 2026
            </span>
            <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.25em] text-goal-net/45">
              USA / CAN / MEX
            </span>
          </div>
        </Link>

        <div className="flex gap-1 overflow-x-auto rounded-sm border border-goal-net/10 bg-pitch-black/50 p-1">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`magnetic-btn shrink-0 rounded-sm px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-widest transition-all duration-200 ${
                  isActive
                    ? "bg-turf-green text-floodlight shadow-turf"
                    : "text-goal-net/45 hover:bg-turf-green/10 hover:text-floodlight"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
