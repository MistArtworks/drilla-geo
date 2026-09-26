import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Secret-key client for admin mutations (verifying teams, generating
 * the bracket, recording match winners). Bypasses RLS entirely, so it
 * must never be imported into client components and every caller is
 * responsible for checking `getAdminEmail()` first.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } }
  );
}
