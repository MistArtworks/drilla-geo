"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Reveal from "@/components/Reveal";
import GlowCard from "@/components/GlowCard";
import NeonButton from "@/components/NeonButton";
import BracketTree from "@/components/BracketTree";
import { createClient } from "@/lib/supabase/client";
import type { ContestSettings, Match, Team, TeamStatus } from "@/lib/types";

const STATUS_STYLES: Record<TeamStatus, string> = {
  pending: "text-gold border-gold/40 bg-gold-soft",
  verified: "text-brand border-brand/40 bg-brand-soft",
  disqualified: "text-ink/40 border-line bg-ink/5",
};

export default function DashboardClient({
  adminEmail,
  initialTeams,
  initialMatches,
  initialSettings,
}: {
  adminEmail: string;
  initialTeams: Team[];
  initialMatches: Match[];
  initialSettings: ContestSettings;
}) {
  const router = useRouter();
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [bracketBusy, setBracketBusy] = useState(false);

  const verifiedCount = initialTeams.filter(
    (t) => t.status === "verified"
  ).length;
  const teamMap = useMemo(
    () => Object.fromEntries(initialTeams.map((t) => [t.id, t])),
    [initialTeams]
  );
  const totalRounds =
    initialMatches.length > 0
      ? Math.max(...initialMatches.map((m) => m.round))
      : 0;

  function withLoading(id: string, fn: () => Promise<void>) {
    setLoadingIds((s) => new Set(s).add(id));
    setError(null);
    fn()
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => {
        setLoadingIds((s) => {
          const next = new Set(s);
          next.delete(id);
          return next;
        });
        router.refresh();
      });
  }

  async function postJSON(url: string, body: unknown) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Request failed");
  }

  function setStatus(teamId: string, status: TeamStatus) {
    withLoading(teamId, () => postJSON("/api/admin/verify", { teamId, status }));
  }

  function generateBracket() {
    if (
      !confirm(
        "This randomizes the field from currently verified teams and replaces any existing bracket. Continue?"
      )
    )
      return;
    setBracketBusy(true);
    setError(null);
    postJSON("/api/admin/generate-bracket", {})
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => {
        setBracketBusy(false);
        router.refresh();
      });
  }

  function setWinner(matchId: string, winnerId: string) {
    withLoading(matchId, () =>
      postJSON("/api/admin/set-winner", { matchId, winnerId })
    );
  }

  function toggleRegistration() {
    withLoading("registration", () =>
      postJSON("/api/admin/registration-toggle", {
        open: !initialSettings.registration_open,
      })
    );
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display font-extrabold text-3xl text-ink">Admin</h1>
        <div className="flex items-center gap-4">
          <span className="font-body text-sm text-ink/60">
            {adminEmail}
          </span>
          <NeonButton variant="secondary" onClick={signOut}>
            Sign out
          </NeonButton>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-coral/40 bg-coral-soft px-4 py-3 text-sm text-coral">
          {error}
        </div>
      )}

      <Reveal>
        <GlowCard className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-display text-sm text-ink/80 uppercase tracking-widest mb-1">
              Registration
            </div>
            <p className="font-body text-ink/60 text-sm">
              {initialSettings.registration_open
                ? "Open — teams can submit entries."
                : "Closed — the register page shows a closed message."}
            </p>
          </div>
          <NeonButton
            variant={initialSettings.registration_open ? "danger" : "primary"}
            disabled={loadingIds.has("registration")}
            onClick={toggleRegistration}
          >
            {initialSettings.registration_open ? "Close registration" : "Open registration"}
          </NeonButton>
        </GlowCard>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="space-y-3">
          {initialTeams.map((team) => (
            <GlowCard
              key={team.id}
              className="flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <div className="font-display font-bold text-ink">
                  {team.team_name}
                </div>
                <div className="font-body text-sm text-ink/60">
                  {(team.team_members ?? [])
                    .map((m) => `@${m.x_handle}`)
                    .join(" & ")}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-display font-semibold uppercase tracking-widest ${STATUS_STYLES[team.status]}`}
                >
                  {team.status}
                </span>
                <NeonButton
                  variant="primary"
                  disabled={loadingIds.has(team.id) || team.status === "verified"}
                  onClick={() => setStatus(team.id, "verified")}
                >
                  Verify
                </NeonButton>
                <NeonButton
                  variant="danger"
                  disabled={loadingIds.has(team.id) || team.status === "disqualified"}
                  onClick={() => setStatus(team.id, "disqualified")}
                >
                  Disqualify
                </NeonButton>
              </div>
            </GlowCard>
          ))}
          {initialTeams.length === 0 && (
            <p className="text-center font-body text-ink/50 py-8">
              No entries yet.
            </p>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <GlowCard className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-display text-sm text-ink/80 uppercase tracking-widest mb-1">
              Bracket
            </div>
            <p className="font-body text-ink/60 text-sm">
              {verifiedCount} verified team{verifiedCount === 1 ? "" : "s"} ready.
            </p>
          </div>
          <NeonButton
            disabled={bracketBusy || verifiedCount < 2}
            onClick={generateBracket}
          >
            {bracketBusy ? "Generating…" : "Generate bracket"}
          </NeonButton>
        </GlowCard>
      </Reveal>

      {initialMatches.length > 0 && (
        <Reveal delay={0.15}>
          <BracketTree
            matches={initialMatches}
            teams={teamMap}
            totalRounds={totalRounds}
            onPick={setWinner}
            pendingMatchId={[...loadingIds][0] ?? null}
          />
        </Reveal>
      )}
    </div>
  );
}
