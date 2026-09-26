import Reveal from "@/components/Reveal";
import GlowCard from "@/components/GlowCard";
import NeonLinkButton from "@/components/NeonLinkButton";
import LiveBadge from "@/components/LiveBadge";
import { PinIcon, ShieldIcon, DuelIcon, TrophyIcon } from "@/components/icons";

const TWITCH_CHANNEL =
  process.env.NEXT_PUBLIC_TWITCH_CHANNEL ?? "mistartworks";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="pt-20 pb-16 text-center">
        <Reveal>
          <p className="inline-flex items-center gap-2 font-display font-semibold text-sm text-brand bg-brand-soft rounded-full px-4 py-1.5 mb-6">
            <PinIcon className="w-4 h-4" />
            Followers-only duo tournament
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl leading-tight text-ink">
            The GeoGuessr
            <br />
            <span className="text-brand">Showdown</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl mx-auto font-body text-lg text-ink/60">
            Hosted by <span className="text-brand font-semibold">Mist</span>{" "}
            and{" "}
            <span className="text-brand font-semibold">Monarch</span>. Team
            up, register your duo, and battle across a randomized
            single-elimination bracket for a shot at the win.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <NeonLinkButton href="/register">Register your team</NeonLinkButton>
            <NeonLinkButton href="/bracket" variant="secondary">
              View the bracket
            </NeonLinkButton>
          </div>
        </Reveal>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pb-16">
        <Reveal>
          <GlowCard accent="brand">
            <ShieldIcon className="w-7 h-7 text-brand mb-3" />
            <div className="font-display font-bold text-ink mb-1">
              Requirement 01
            </div>
            <p className="font-body text-ink/60 text-sm">
              Follow{" "}
              <span className="text-brand font-semibold">@MistArtworks</span>{" "}
              or <span className="text-brand font-semibold">@masterrhaterr</span>{" "}
              on X. Both teammates must follow at least one of us to be
              eligible.
            </p>
          </GlowCard>
        </Reveal>
        <Reveal delay={0.05}>
          <GlowCard accent="coral">
            <ShieldIcon className="w-7 h-7 text-coral mb-3" />
            <div className="font-display font-bold text-ink mb-1">
              Requirement 02
            </div>
            <p className="font-body text-ink/60 text-sm">
              No GeoGuessr Pro players. This contest is about giving everyone
              an equal shot at winning.
            </p>
          </GlowCard>
        </Reveal>
        <Reveal delay={0.1}>
          <GlowCard accent="sky">
            <DuelIcon className="w-7 h-7 text-sky mb-3" />
            <div className="font-display font-bold text-ink mb-1">Format</div>
            <p className="font-body text-ink/60 text-sm">
              Duo teams (2 players). Random single-elimination bracket. Odd
              team counts get a random bye into round two.
            </p>
          </GlowCard>
        </Reveal>
        <Reveal delay={0.15}>
          <GlowCard accent="gold">
            <TrophyIcon className="w-7 h-7 text-gold mb-3" />
            <div className="font-display font-bold text-ink mb-1">Prize</div>
            <p className="font-body text-ink/60 text-sm">
              $50 USD / ₹3000 for the winning team — split between the two
              teammates, not per player.
            </p>
          </GlowCard>
        </Reveal>
      </section>

      <section className="pb-24">
        <Reveal>
          <a
            href={`https://twitch.tv/${TWITCH_CHANNEL}`}
            target="_blank"
            rel="noreferrer"
            className="panel flex flex-wrap items-center justify-between gap-4 rounded-2xl px-6 py-5 hover:border-twitch/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LiveBadge />
              <span className="font-body text-ink/70">
                Matches are streamed live — watch every duel unfold.
              </span>
            </div>
            <span className="font-display font-semibold text-sm text-twitch">
              twitch.tv/{TWITCH_CHANNEL} ↗
            </span>
          </a>
        </Reveal>
      </section>
    </div>
  );
}
