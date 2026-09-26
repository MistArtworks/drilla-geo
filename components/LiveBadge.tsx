import clsx from "clsx";

export default function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-display font-semibold tracking-wide text-red-500",
        className
      )}
    >
      <span className="live-dot w-2 h-2 rounded-full bg-red-500" />
      LIVE
    </span>
  );
}
