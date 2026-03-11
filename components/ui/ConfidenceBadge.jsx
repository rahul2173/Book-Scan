"use client";

const BADGE_STYLES = {
  High: "bg-emerald-400/10 text-emerald-400 border-emerald-400/30",
  Medium: "bg-amber-400/10 text-amber-400 border-amber-400/30",
  Low: "bg-red-400/10 text-red-400 border-red-400/30",
};

export default function ConfidenceBadge({ level }) {
  const style = BADGE_STYLES[level] || BADGE_STYLES.Medium;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${style}`}
    >
      {level} Confidence
    </span>
  );
}
