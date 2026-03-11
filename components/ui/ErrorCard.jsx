"use client";

import { AlertCircle } from "lucide-react";

export default function ErrorCard({ message, onRetry }) {
  return (
    <div className="bg-stone-800 border border-red-400/30 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="text-red-400 w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-red-400 text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 border border-amber-400/50 hover:border-amber-400 text-amber-400 hover:text-amber-300 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
