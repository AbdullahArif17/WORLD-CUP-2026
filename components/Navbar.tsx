"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/",
    label: "Live",
    icon: "M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M8.464 15.536a5 5 0 010-7.072m7.072 0a5 5 0 010 7.072M12 12h.01",
  },
  {
    href: "/standings",
    label: "Tables",
    icon: "M3 10h18M3 14h18M10 3v18M14 3v18",
  },
  {
    href: "/fixtures",
    label: "Fixtures",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    href: "/teams",
    label: "Teams",
    icon: "M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8zm6 2a3 3 0 100-6",
  },
  {
    href: "/scorers",
    label: "Stats",
    icon: "M3 3v18h18M7 15l3-3 3 2 5-7M8 21v-6m5 6v-7m5 7V7",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/90 backdrop-blur-xl">
      <div className="mx-auto max-w-[640px] px-4">
        <div className="flex items-center justify-between gap-3 py-3">
          <Link
            href="/"
            className="group flex shrink-0 cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-[0_0_16px_rgba(220,38,38,0.3)]">
              <svg
                className="h-5 w-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <div>
              <span className="block text-sm font-bold leading-none tracking-tight text-white">
                WC 2026
              </span>
              <span className="mt-0.5 block font-mono text-[10px] font-medium text-white/35">
                USA CAN MEX
              </span>
            </div>
          </Link>

          <div className="flex max-w-[70vw] gap-1 overflow-x-auto rounded-2xl border border-white/[0.06] bg-surface/80 p-1">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-[0_0_12px_rgba(220,38,38,0.3)]"
                      : "text-white/45 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={link.icon}
                    />
                  </svg>
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
