"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "danger";

const styles: Record<Variant, string> = {
  primary:
    "bg-brand text-white border-brand shadow-[0_4px_0_0_var(--color-emerald-800)] hover:brightness-105 active:shadow-none active:translate-y-1",
  secondary:
    "bg-white text-ink border-line shadow-[0_3px_0_0_var(--color-slate-200)] hover:bg-ink/5 active:shadow-none active:translate-y-1",
  danger:
    "bg-coral text-white border-coral shadow-[0_4px_0_0_var(--color-red-700)] hover:brightness-105 active:shadow-none active:translate-y-1",
};

export default function NeonButton({
  variant = "primary",
  className,
  children,
  ...props
}: HTMLMotionProps<"button"> & { variant?: Variant }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "rounded-full border px-6 py-2.5 font-display font-semibold text-sm transition-all disabled:opacity-40 disabled:pointer-events-none",
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
