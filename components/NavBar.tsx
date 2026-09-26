"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";
import LiveBadge from "./LiveBadge";
import { PinIcon } from "./icons";

const TWITCH_CHANNEL =
  process.env.NEXT_PUBLIC_TWITCH_CHANNEL ?? "mistartworks";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/register", label: "Register" },
  { href: "/entries", label: "Entries" },
  { href: "/bracket", label: "Bracket" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="relative z-20 border-b border-line bg-surface-2/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-white group-hover:scale-105 transition-transform">
            <PinIcon className="w-4.5 h-4.5" />
          </span>
          <span className="font-display font-bold text-lg text-ink">
            Mist <span className="text-brand">×</span> Monarch
          </span>
        </Link>

        <nav className="flex items-center gap-1 font-display text-sm font-semibold">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "relative px-3 py-2 rounded-full transition-colors",
                  active
                    ? "text-brand"
                    : "text-ink/60 hover:text-ink hover:bg-ink/5"
                )}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-3 right-3 -bottom-0.5 h-[3px] rounded-full bg-brand"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <a
          href={`https://twitch.tv/${TWITCH_CHANNEL}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 hover:border-twitch/40 hover:bg-twitch/5 transition-colors"
        >
          <LiveBadge />
          <span className="font-body text-sm text-ink/70">
            twitch.tv/{TWITCH_CHANNEL}
          </span>
        </a>
      </div>
    </header>
  );
}
