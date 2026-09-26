import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import type { ContestSettings, Match, Team } from "@/lib/types";
import DashboardClient from "./DashboardClient";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) redirect("/admin/login");

  const supabase = await createClient();
  const [{ data: teams }, { data: matches }, { data: settings }] =
    await Promise.all([
      supabase
        .from("teams")
        .select("*, team_members(*)")
        .order("created_at", { ascending: true }),
      supabase.from("matches").select("*").order("round"),
      supabase.from("contest_settings").select("*").eq("id", 1).single(),
    ]);

  return (
    <DashboardClient
      adminEmail={adminEmail}
      initialTeams={(teams ?? []) as Team[]}
      initialMatches={(matches ?? []) as Match[]}
      initialSettings={(settings ?? { id: 1, registration_open: true }) as ContestSettings}
    />
  );
}
