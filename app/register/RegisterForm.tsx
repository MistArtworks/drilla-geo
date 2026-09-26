"use client";

import { useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/Reveal";
import GlowCard from "@/components/GlowCard";
import NeonButton from "@/components/NeonButton";
import { registerTeam, type RegisterState } from "./actions";

const initialState: RegisterState = { status: "idle" };

function PlayerFields({ index }: { index: 1 | 2 }) {
  return (
    <div className="space-y-3">
      <div className="font-display font-bold text-xs tracking-widest text-brand/80 uppercase">
        Player {index}
      </div>
      <label className="block">
        <span className="block text-sm text-ink/60 mb-1">X handle</span>
        <input
          name={`handle${index}`}
          required
          placeholder="@yourhandle"
          className="w-full rounded-lg bg-surface border border-line px-3 py-2 font-body text-ink focus:border-brand focus:outline-none"
        />
      </label>
      <label className="flex items-start gap-2 text-sm text-ink/70">
        <input
          type="checkbox"
          name={`follows${index}`}
          required
          className="mt-1 accent-brand"
        />
        I follow @MistArtworks or @masterrhaterr on X
      </label>
      <label className="flex items-start gap-2 text-sm text-ink/70">
        <input
          type="checkbox"
          name={`nonPro${index}`}
          required
          className="mt-1 accent-brand"
        />
        I am not a GeoGuessr Pro player
      </label>
      <label className="flex items-start gap-2 text-sm text-ink/70">
        <input
          type="checkbox"
          name={`played${index}`}
          className="mt-1 accent-sky"
        />
        I've played GeoGuessr before (just for our stats)
      </label>
    </div>
  );
}

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerTeam,
    initialState
  );

  if (state.status === "success") {
    return (
      <Reveal>
        <GlowCard accent="brand" className="text-center">
          <p className="font-display font-bold text-2xl text-brand mb-2">
            You&apos;re in!
          </p>
          <p className="font-body text-ink/70">
            Your team is registered and pending review. Check the{" "}
            <a href="/entries" className="text-brand underline">
              entries page
            </a>{" "}
            to see your team listed.
          </p>
        </GlowCard>
      </Reveal>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <Reveal>
        <GlowCard>
          <label className="block">
            <span className="block text-sm text-ink/60 mb-1">Team name</span>
            <input
              name="teamName"
              required
              placeholder="The Antipode Assassins"
              className="w-full rounded-lg bg-surface border border-line px-3 py-2 font-body text-lg text-ink focus:border-brand focus:outline-none"
            />
          </label>
        </GlowCard>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2">
        <Reveal delay={0.05}>
          <GlowCard>
            <PlayerFields index={1} />
          </GlowCard>
        </Reveal>
        <Reveal delay={0.1}>
          <GlowCard>
            <PlayerFields index={2} />
          </GlowCard>
        </Reveal>
      </div>

      <AnimatePresence>
        {state.status === "error" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg border border-coral/40 bg-coral-soft px-4 py-3 text-sm text-coral"
          >
            {state.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center">
        <NeonButton type="submit" disabled={pending}>
          {pending ? "Submitting…" : "Submit entry"}
        </NeonButton>
      </div>
    </form>
  );
}
