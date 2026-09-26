"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";

type Variant = "primary" | "secondary";

const styles: Record<Variant, string> = {
  primary:
    "bg-brand text-white border-brand shadow-[0_4px_0_0_var(--color-emerald-800)] hover:brightness-105 active:shadow-none active:translate-y-1",
  secondary:
    "bg-white text-ink border-line shadow-[0_3px_0_0_var(--color-slate-200)] hover:bg-ink/5 active:shadow-none active:translate-y-1",
};

const MotionLink = motion.create(Link);

export default function NeonLinkButton({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <MotionLink
      href={href}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "inline-block rounded-full border px-6 py-2.5 font-display font-semibold text-sm transition-all",
        styles[variant],
        className
      )}
    >
      {children}
    </MotionLink>
  );
}
