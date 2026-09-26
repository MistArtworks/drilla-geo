import { createClient } from "@/lib/supabase/server";
import Reveal from "@/components/Reveal";
import GlowCard from "@/components/GlowCard";
import StatTile from "@/components/StatTile";
import type { Team } from "@/lib/types";

export const revalidate = 0;

const STATUS_STYLES: Record<string, string> = {
  pending: "text-gold border-gold/40 bg-gold-soft",
  verified: "text-brand border-brand/40 bg-brand-soft",
  disqualified: "text-ink/40 border-line bg-ink/5",
};

export default async function EntriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("teams")
    .select("*, team_members(*)")
    .neq("status", "disqualified")
    .order("created_at", { ascending: true });

  const teams = (data ?? []) as Team[];
  const allMembers = teams.flatMap((t) => t.team_members ?? []);
  const playedCount = allMembers.filter(
    (m) => m.has_played_geoguessr === true
  ).length;
  const verifiedCount = teams.filter((t) => t.status === "verified").length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <Reveal>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink text-center mb-10">
          Entries
        </h1>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <StatTile label="Teams" value={teams.length} accent="brand" />
          <StatTile label="Players" value={allMembers.length} accent="sky" />
          <StatTile label="Verified" value={verifiedCount} accent="brand" />
          <StatTile
            label="Have played GeoGuessr"
            value={playedCount}
            accent="coral"
          />
        </div>
      </Reveal>

      <div className="space-y-4">
        {teams.map((team, i) => (
          <Reveal key={team.id} delay={Math.min(i * 0.03, 0.3)}>
            <GlowCard className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="font-display font-bold text-lg text-ink">
                  {team.team_name}
                </div>
                <div className="font-body text-sm text-ink/60 mt-1">
                  {(team.team_members ?? [])
                    .map((m) => `@${m.x_handle}`)
                    .join(" & ")}
                </div>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-display font-semibold uppercase tracking-widest ${
                  STATUS_STYLES[team.status]
                }`}
              >
                {team.status}
              </span>
            </GlowCard>
          </Reveal>
        ))}

        {teams.length === 0 && (
          <p className="text-center font-body text-ink/50 py-12">
            No teams have registered yet — be the first.
          </p>
        )}
      </div>
    </div>
  );
}
