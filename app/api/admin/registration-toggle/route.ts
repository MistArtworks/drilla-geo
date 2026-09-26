import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { open } = (await request.json()) as { open: boolean };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("contest_settings")
    .update({ registration_open: open })
    .eq("id", 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
