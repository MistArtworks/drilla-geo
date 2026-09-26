"use client";

import { useLayoutEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { Match, Team } from "@/lib/types";
import { roundName } from "@/lib/bracket";

interface Props {
  matches: Match[];
  teams: Record<string, Team>;
  totalRounds: number;
  onPick?: (matchId: string, winnerId: string) => void;
  pendingMatchId?: string | null;
}

interface Line {
  id: string;
  d: string;
}

function teamLabel(teams: Record<string, Team>, id: string | null) {
  if (!id) return null;
  return teams[id]?.team_name ?? "Unknown team";
}

function MatchCard({
  match,
  teams,
  onPick,
  pending,
  cardRef,
}: {
  match: Match;
  teams: Record<string, Team>;
  onPick?: (matchId: string, winnerId: string) => void;
  pending?: boolean;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  const nameA = teamLabel(teams, match.team_a_id);
  const nameB = teamLabel(teams, match.team_b_id);
  const clickable =
    !!onPick && !match.is_bye && !!match.team_a_id && !!match.team_b_id;

  function row(side: "a" | "b") {
    const id = side === "a" ? match.team_a_id : match.team_b_id;
    const name = side === "a" ? nameA : nameB;
    const isWinner = !!id && match.winner_id === id;
    const isBye = match.is_bye && side === "a";

    return (
      <button
        type="button"
        disabled={!clickable || !id}
        onClick={() => id && onPick?.(match.id, id)}
        className={clsx(
          "w-full text-left px-3 py-1.5 rounded-md font-body text-sm transition-colors",
          !id && "text-ink/30 italic",
          id && !isWinner && "text-ink/80",
          isWinner && "text-brand font-semibold",
          clickable && "hover:bg-brand/10 cursor-pointer",
          !clickable && "cursor-default"
        )}
      >
        {name ?? "TBD"}
        {isBye && (
          <span className="ml-2 text-[10px] uppercase tracking-widest text-gold">
            bye
          </span>
        )}
        {isWinner && <span className="ml-2 text-brand">✓</span>}
      </button>
    );
  }

  return (
    <div
      ref={cardRef}
      className={clsx(
        "panel relative rounded-xl w-56 shrink-0",
        pending && "opacity-50 pointer-events-none"
      )}
    >
      <div className="border-b border-line">{row("a")}</div>
      <div>{row("b")}</div>
    </div>
  );
}

export default function BracketTree({
  matches,
  teams,
  totalRounds,
  onPick,
  pendingMatchId,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const [lines, setLines] = useState<Line[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const rounds: Match[][] = [];
  for (let r = 1; r <= totalRounds; r++) {
    rounds.push(
      matches.filter((m) => m.round === r).sort((a, b) => a.slot - b.slot)
    );
  }

  const setCardRef = useCallback(
    (key: string) => (el: HTMLDivElement | null) => {
      if (el) cardRefs.current.set(key, el);
      else cardRefs.current.delete(key);
    },
    []
  );

  const recompute = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerBox = container.getBoundingClientRect();
    const nextLines: Line[] = [];

    for (const m of matches) {
      if (m.round >= totalRounds) continue;
      const fromEl = cardRefs.current.get(`${m.round}:${m.slot}`);
      const nextRound = m.round + 1;
      const nextSlot = Math.floor(m.slot / 2);
      const toEl = cardRefs.current.get(`${nextRound}:${nextSlot}`);
      if (!fromEl || !toEl) continue;

      const fromBox = fromEl.getBoundingClientRect();
      const toBox = toEl.getBoundingClientRect();

      const x1 = fromBox.right - containerBox.left;
      const y1 = fromBox.top + fromBox.height / 2 - containerBox.top;
      const x2 = toBox.left - containerBox.left;
      const y2 = toBox.top + toBox.height / 2 - containerBox.top;
      const midX = (x1 + x2) / 2;

      nextLines.push({
        id: `${m.round}:${m.slot}`,
        d: `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`,
      });
    }

    setLines(nextLines);
    setSize({ width: container.scrollWidth, height: container.scrollHeight });
  }, [matches, totalRounds]);

  useLayoutEffect(() => {
    recompute();
    const ro = new ResizeObserver(() => recompute());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [recompute]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-stretch gap-16 overflow-x-auto pb-8 pt-2"
    >
      <svg
        className="absolute inset-0 pointer-events-none z-0"
        width={size.width}
        height={size.height}
      >
        {lines.map((line, i) => (
          <motion.path
            key={line.id}
            d={line.d}
            fill="none"
            stroke="#1f9d63"
            strokeOpacity={0.35}
            strokeWidth={2}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.03, ease: "easeOut" }}
          />
        ))}
      </svg>

      {rounds.map((roundMatches, i) => (
        <div key={i} className="relative z-10 flex flex-col justify-around gap-6">
          <div className="text-center font-display font-semibold text-[11px] tracking-widest text-brand/70 uppercase mb-2">
            {roundName(i + 1, totalRounds)}
          </div>
          <div className="flex flex-col justify-around gap-6 flex-1">
            {roundMatches.map((m, idx) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <MatchCard
                  match={m}
                  teams={teams}
                  onPick={onPick}
                  pending={pendingMatchId === m.id}
                  cardRef={setCardRef(`${m.round}:${m.slot}`)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
