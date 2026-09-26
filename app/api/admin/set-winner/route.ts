import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { applyWinner } from "@/lib/bracket";
import type { Match } from "@/lib/types";

export async function POST(request: Request) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { matchId, winnerId } = (await request.json()) as {
    matchId: string;
    winnerId: string;
  };

  const supabase = createAdminClient();
  const { data: matches, error: fetchError } = await supabase
    .from("matches")
    .select("*");

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  let changed;
  try {
    changed = applyWinner(matches as Match[], matchId, winnerId);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to set winner." },
      { status: 400 }
    );
  }

  for (const m of changed) {
    const { error } = await supabase
      .from("matches")
      .update({
        team_a_id: m.team_a_id,
        team_b_id: m.team_b_id,
        winner_id: m.winner_id,
      })
      .eq("id", m.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
