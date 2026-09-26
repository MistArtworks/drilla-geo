-- Mist x Monarch GeoGuessr Contest schema
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------

create table teams (
  id uuid primary key default gen_random_uuid(),
  team_name text not null unique,
  status text not null default 'pending' check (status in ('pending', 'verified', 'disqualified')),
  admin_notes text,
  created_at timestamptz not null default now()
);

create table team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  x_handle text not null,
  follows_confirmed boolean not null default false,
  non_pro_confirmed boolean not null default false,
  has_played_geoguessr boolean,
  created_at timestamptz not null default now(),
  constraint follows_required check (follows_confirmed = true),
  constraint non_pro_required check (non_pro_confirmed = true)
);

create table matches (
  id uuid primary key default gen_random_uuid(),
  round int not null,
  slot int not null,
  team_a_id uuid references teams(id),
  team_b_id uuid references teams(id),
  winner_id uuid references teams(id),
  is_bye boolean not null default false,
  created_at timestamptz not null default now(),
  unique (round, slot)
);

create table contest_settings (
  id int primary key default 1,
  registration_open boolean not null default true,
  constraint single_row check (id = 1)
);
insert into contest_settings (id, registration_open) values (1, true);

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
-- Public can read everything (entries page, stats, bracket). All writes
-- go through the security-definer RPC below or the service-role key
-- from admin-only server routes, so there are no public insert/update
-- policies on these tables.

alter table teams enable row level security;
alter table team_members enable row level security;
alter table matches enable row level security;
alter table contest_settings enable row level security;

create policy "public read teams" on teams for select using (true);
create policy "public read team_members" on team_members for select using (true);
create policy "public read matches" on matches for select using (true);
create policy "public read contest_settings" on contest_settings for select using (true);

-- Explicit grants so these tables are queryable via the Data API
-- regardless of a project's default privilege settings. RLS above is
-- still what actually restricts rows/columns — this only controls
-- whether the roles can reach the table at all.
grant usage on schema public to anon, authenticated;
grant select on teams, team_members, matches, contest_settings to anon, authenticated;

-- ---------------------------------------------------------------------
-- Registration RPC
-- ---------------------------------------------------------------------
-- Atomically creates a team + its two members. Runs as security definer
-- so it can bypass RLS for the insert, but it only ever inserts a brand
-- new 'pending' team and validates both confirmation checkboxes itself,
-- so it can't be used to smuggle in unverified data another way.

create or replace function register_team(
  p_team_name text,
  p_member1_handle text,
  p_member1_follows boolean,
  p_member1_non_pro boolean,
  p_member1_played boolean,
  p_member2_handle text,
  p_member2_follows boolean,
  p_member2_non_pro boolean,
  p_member2_played boolean
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team_id uuid;
  v_team_name text := trim(p_team_name);
  v_handle1 text := trim(leading '@' from trim(p_member1_handle));
  v_handle2 text := trim(leading '@' from trim(p_member2_handle));
begin
  if v_team_name = '' then
    raise exception 'Team name is required.';
  end if;
  if v_handle1 = '' or v_handle2 = '' then
    raise exception 'Both players'' X handles are required.';
  end if;
  if not (p_member1_follows and p_member1_non_pro and p_member2_follows and p_member2_non_pro) then
    raise exception 'Both players must confirm they follow @MistArtworks or @masterrhaterr on X and are not GeoGuessr Pro users.';
  end if;

  insert into teams (team_name) values (v_team_name) returning id into v_team_id;

  insert into team_members
    (team_id, x_handle, follows_confirmed, non_pro_confirmed, has_played_geoguessr)
  values
    (v_team_id, v_handle1, true, true, p_member1_played),
    (v_team_id, v_handle2, true, true, p_member2_played);

  return v_team_id;
end;
$$;

grant execute on function register_team to anon, authenticated;
