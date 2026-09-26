"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import type { Accent } from "./GlowCard";

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration: 1.1, ease: "easeOut" });
    return controls.stop;
  }, [inView, value, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function StatTile({
  label,
  value,
  accent = "brand",
}: {
  label: string;
  value: number;
  accent?: Accent;
}) {
  const color = {
    brand: "text-brand",
    coral: "text-coral",
    sky: "text-sky",
    gold: "text-gold",
  }[accent];

  return (
    <div className="panel rounded-2xl px-6 py-5 text-center">
      <div className={`font-display font-bold text-4xl ${color}`}>
        <Counter value={value} />
      </div>
      <div className="mt-2 font-body text-xs uppercase tracking-widest text-ink/50">
        {label}
      </div>
    </div>
  );
}
