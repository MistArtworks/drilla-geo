export type TeamStatus = "pending" | "verified" | "disqualified";

export interface TeamMember {
  id: string;
  team_id: string;
  x_handle: string;
  follows_confirmed: boolean;
  non_pro_confirmed: boolean;
  has_played_geoguessr: boolean | null;
  created_at: string;
}

export interface Team {
  id: string;
  team_name: string;
  status: TeamStatus;
  admin_notes: string | null;
  created_at: string;
  team_members?: TeamMember[];
}

export interface Match {
  id: string;
  round: number;
  slot: number;
  team_a_id: string | null;
  team_b_id: string | null;
  winner_id: string | null;
  is_bye: boolean;
  created_at: string;
}

export interface ContestSettings {
  id: number;
  registration_open: boolean;
}
