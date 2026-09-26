import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { TeamStatus } from "@/lib/types";

export async function POST(request: Request) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { teamId, status, notes } = (await request.json()) as {
    teamId: string;
    status: TeamStatus;
    notes?: string;
  };

  if (!["pending", "verified", "disqualified"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("teams")
    .update({ status, admin_notes: notes ?? null })
    .eq("id", teamId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
