"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";

const links = [
  { href: "/", label: "Live" },
  { href: "/standings", label: "Tables" },
  { href: "/fixtures", label: "Fixtures" },
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
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border border-primary/35 bg-black shadow-turf">
            <Image
              src="/images/logo.png"
              alt="World Cup trophy logo"
              fill
              sizes="48px"
              className="object-contain p-1"
              priority
            />
          </div>
          <div>
            <span className="font-display text-lg leading-none tracking-wide text-floodlight">
              WC 2026
            </span>
            <span className="mt-1 flex items-center gap-1">
              {[
                ["/images/flag-us.png", "USA"],
                ["/images/flag-ca.png", "Canada"],
                ["/images/flag-mx.png", "Mexico"],
              ].map(([src, alt]) => (
                <Image
                  key={src}
                  src={src}
                  alt={`${alt} flag`}
                  width={18}
                  height={12}
                  className="h-3 w-[18px] rounded-[2px] object-cover"
                />
              ))}
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
