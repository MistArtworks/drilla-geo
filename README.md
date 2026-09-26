# Mist x Monarch — GeoGuessr Contest

Registration + bracket site for the followers-only GeoGuessr duo contest.
Next.js (App Router) + Supabase.

## How it works

- **Registration** (`/register`) — duo teams submit a team name, two X
  handles, and confirm (checkboxes) that both players follow @MistArtworks or
  @masterrhaterr and aren't GeoGuessr Pro. Registration can be toggled
  open/closed from the admin dashboard.
- **Entries** (`/entries`) — public list of registered teams and basic stats
  (teams, players, verified count, how many have played GeoGuessr before).
- **Bracket** (`/bracket`) — public single-elimination bracket with a live
  Twitch embed. Empty until the admin generates it.
- **Admin** (`/admin/login` → `/admin/dashboard`) — verify or disqualify
  teams, open/close registration, generate the randomized bracket (odd team
  counts get a random bye into round two), and click through match winners
  as the contest progresses.

Follower/non-pro checks are honor-system: registrants self-certify via
checkboxes, and the admin dashboard is where you spot-check and disqualify
anyone found lying.

## One-time setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com).
2. **Run the migration**: open the SQL Editor in your Supabase project and
   run the contents of [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
   This creates the tables, row-level security policies, and the
   `register_team` RPC that registration uses.
3. **Copy env vars**: `cp .env.example .env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` —
     from Supabase → Project Settings → API Keys (the "Connect" panel gives
     you these two directly, ready to paste).
   - `SUPABASE_SECRET_KEY` — same page, the **secret** key. Never expose this
     to the client; it's only used in server routes under `app/api/admin/*`.
   - `ADMIN_EMAILS` — comma-separated emails allowed into `/admin/dashboard`
     (yours and Monarch's).
   - `NEXT_PUBLIC_TWITCH_CHANNEL` — defaults to `mistartworks`.
4. **Enable email auth**: in Supabase → Authentication → Providers, make
   sure Email is enabled. Admin login uses passwordless magic links, so no
   password setup is needed — just make sure the two admin emails can
   receive Supabase's auth emails (check spam folder on first login).
5. **Add your site URL** in Supabase → Authentication → URL Configuration →
   Redirect URLs, add `<your-deployed-url>/auth/callback` (and
   `http://localhost:3000/auth/callback` for local dev).

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Running the contest

1. Registrations come in via `/register` and show up as **pending** in
   `/admin/dashboard`.
2. Spot-check entries (follower status, Pro status), then **Verify** or
   **Disqualify** each team.
3. When registration's done, hit **Close registration**, then **Generate
   bracket** — this randomizes all verified teams into a single-elimination
   bracket (odd counts get a random bye).
4. As matches finish, click the winning team in each matchup on the admin
   dashboard to advance them. The public `/bracket` page updates to match.
# drilla-geo
