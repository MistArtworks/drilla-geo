"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import clsx from "clsx";

export type Accent = "brand" | "coral" | "sky" | "gold";

export default function GlowCard({
  children,
  className,
  accent,
}: {
  children: ReactNode;
  className?: string;
  accent?: Accent;
}) {
  const border = accent
    ? {
        brand: "border-t-4 border-t-brand",
        coral: "border-t-4 border-t-coral",
        sky: "border-t-4 border-t-sky",
        gold: "border-t-4 border-t-gold",
      }[accent]
    : "";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={clsx(
        "panel rounded-2xl p-6 transition-shadow duration-300 hover:shadow-lg hover:shadow-ink/5",
        border,
        className
      )}
    >
      {children}
    </motion.div>
  );
}
