"use client";

export default function SkeletonLoader({ type = "text", count = 4 }) {
  if (type === "text") {
    const widths = ["w-full", "w-[90%]", "w-[85%]", "w-[70%]"];
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`animate-pulse bg-stone-800 h-4 rounded ${widths[i % widths.length]}`}
          />
        ))}
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="animate-pulse bg-stone-800 rounded-xl h-32" />
        ))}
      </div>
    );
  }

  if (type === "row") {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="animate-pulse bg-stone-800 rounded-lg h-12" />
        ))}
      </div>
    );
  }

  return null;
}
