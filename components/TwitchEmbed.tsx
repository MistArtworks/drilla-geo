"use client";

import { useEffect, useState } from "react";
import LiveBadge from "./LiveBadge";

const TWITCH_CHANNEL =
  process.env.NEXT_PUBLIC_TWITCH_CHANNEL ?? "mistartworks";

export default function TwitchEmbed() {
  const [hostname, setHostname] = useState<string | null>(null);

  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);

  return (
    <div className="panel rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line">
        <div className="flex items-center gap-2">
          <LiveBadge />
          <span className="font-display font-semibold text-sm text-ink/80">
            Watching the bracket
          </span>
        </div>
        <a
          href={`https://twitch.tv/${TWITCH_CHANNEL}`}
          target="_blank"
          rel="noreferrer"
          className="font-body text-sm text-twitch hover:underline"
        >
          twitch.tv/{TWITCH_CHANNEL} ↗
        </a>
      </div>

      {hostname ? (
        <iframe
          src={`https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${hostname}&muted=true`}
          height="360"
          width="100%"
          allowFullScreen
          className="block bg-ink/5"
        />
      ) : (
        <div className="h-[360px] flex items-center justify-center bg-ink/5 text-ink/40 font-body text-sm">
          Loading stream…
        </div>
      )}
    </div>
  );
}
