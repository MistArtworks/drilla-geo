import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateBracket } from "@/lib/bracket";
import type { Team } from "@/lib/types";

export async function POST() {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const supabase = createAdminClient();
  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select("*")
    .eq("status", "verified");

  if (teamsError) {
    return NextResponse.json({ error: teamsError.message }, { status: 500 });
  }
  if (!teams || teams.length < 2) {
    return NextResponse.json(
      { error: "Need at least 2 verified teams to generate a bracket." },
      { status: 400 }
    );
  }

  let generated;
  try {
    generated = generateBracket(teams as Team[]);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to generate bracket." },
      { status: 400 }
    );
  }

  const { error: deleteError } = await supabase
    .from("matches")
    .delete()
    .gte("round", 0);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  const { error: insertError } = await supabase
    .from("matches")
    .insert(generated);
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
