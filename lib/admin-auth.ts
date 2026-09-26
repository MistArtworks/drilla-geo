import "server-only";
import { createClient } from "@/lib/supabase/server";

function allowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Returns the signed-in admin's email, or null if there's no session
 * or the session's email isn't on the ADMIN_EMAILS allowlist.
 */
export async function getAdminEmail(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email?.toLowerCase();
  if (!email) return null;

  return allowlist().includes(email) ? email : null;
}
