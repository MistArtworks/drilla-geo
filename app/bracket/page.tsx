import { createClient } from "@/lib/supabase/server";
import Reveal from "@/components/Reveal";
import GlowCard from "@/components/GlowCard";
import BracketTree from "@/components/BracketTree";
import TwitchEmbed from "@/components/TwitchEmbed";
import type { Match, Team } from "@/lib/types";

export const revalidate = 0;

export default async function BracketPage() {
  const supabase = await createClient();
  const [{ data: matches }, { data: teams }] = await Promise.all([
    supabase.from("matches").select("*").order("round"),
    supabase.from("teams").select("*"),
  ]);

  const matchList = (matches ?? []) as Match[];
  const teamMap: Record<string, Team> = Object.fromEntries(
    ((teams ?? []) as Team[]).map((t) => [t.id, t])
  );
  const totalRounds =
    matchList.length > 0 ? Math.max(...matchList.map((m) => m.round)) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <Reveal>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink text-center mb-10">
          The Bracket
        </h1>
      </Reveal>

      <Reveal delay={0.05} className="mb-10 max-w-2xl mx-auto">
        <TwitchEmbed />
      </Reveal>

      {matchList.length === 0 ? (
        <Reveal delay={0.1}>
          <GlowCard className="text-center max-w-xl mx-auto">
            <p className="font-display font-bold text-xl text-brand mb-2">
              Bracket not generated yet
            </p>
            <p className="font-body text-ink/70">
              Once registration closes, Mist and Monarch will randomize the
              field and the bracket will appear here.
            </p>
          </GlowCard>
        </Reveal>
      ) : (
        <Reveal delay={0.1}>
          <BracketTree
            matches={matchList}
            teams={teamMap}
            totalRounds={totalRounds}
          />
        </Reveal>
      )}
    </div>
  );
}
