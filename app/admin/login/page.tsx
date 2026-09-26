"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import GlowCard from "@/components/GlowCard";
import NeonButton from "@/components/NeonButton";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setPending(false);
    if (error) {
      setStatus("error");
      setError(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <Reveal>
        <h1 className="font-display font-extrabold text-2xl text-ink text-center mb-8">
          Admin Access
        </h1>
        <GlowCard>
          {status === "sent" ? (
            <p className="font-body text-center text-brand">
              Check your inbox for a magic link.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="block text-sm text-ink/60 mb-1">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-surface border border-line px-3 py-2 font-body text-ink focus:border-brand focus:outline-none"
                  placeholder="you@example.com"
                />
              </label>
              {status === "error" && (
                <p className="text-sm text-coral">{error}</p>
              )}
              <div className="flex justify-center">
                <NeonButton type="submit" disabled={pending}>
                  {pending ? "Sending…" : "Send magic link"}
                </NeonButton>
              </div>
            </form>
          )}
        </GlowCard>
      </Reveal>
    </div>
  );
}
