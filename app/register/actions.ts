"use server";

import { createClient } from "@/lib/supabase/server";

export interface RegisterState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function registerTeam(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("contest_settings")
    .select("registration_open")
    .eq("id", 1)
    .single();

  if (settings && settings.registration_open === false) {
    return { status: "error", message: "Registration is currently closed." };
  }

  const teamName = String(formData.get("teamName") ?? "");
  const handle1 = String(formData.get("handle1") ?? "");
  const handle2 = String(formData.get("handle2") ?? "");
  const follows1 = formData.get("follows1") === "on";
  const nonPro1 = formData.get("nonPro1") === "on";
  const played1 = formData.get("played1") === "on";
  const follows2 = formData.get("follows2") === "on";
  const nonPro2 = formData.get("nonPro2") === "on";
  const played2 = formData.get("played2") === "on";

  if (!follows1 || !nonPro1 || !follows2 || !nonPro2) {
    return {
      status: "error",
      message:
        "Both teammates must confirm the follower and non-pro requirements.",
    };
  }

  const { error } = await supabase.rpc("register_team", {
    p_team_name: teamName,
    p_member1_handle: handle1,
    p_member1_follows: follows1,
    p_member1_non_pro: nonPro1,
    p_member1_played: played1,
    p_member2_handle: handle2,
    p_member2_follows: follows2,
    p_member2_non_pro: nonPro2,
    p_member2_played: played2,
  });

  if (error) {
    const message = error.message.includes("duplicate key")
      ? "That team name is already taken — pick another one."
      : error.message;
    return { status: "error", message };
  }

  return { status: "success" };
}
