"use client";

import ConfidenceBadge from "./ui/ConfidenceBadge";

export default function ReviewScreen({
  imageBase64,
  bookDetails,
  onUpdateDetails,
  onConfirm,
  onRescan,
}) {
  const handleFieldChange = (field, value) => {
    onUpdateDetails({ ...bookDetails, [field]: value });
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      {/* Top Row */}
      <div className="flex gap-4 items-start">
        {/* Book Cover Thumbnail */}
        <div className="flex-shrink-0">
          {imageBase64 && (
            <img
              src={imageBase64}
              alt="Book cover"
              className="w-20 h-28 object-cover rounded-lg ring-2 ring-amber-400/50 shadow-md"
            />
          )}
        </div>

        {/* Confidence + Model Info */}
        <div className="flex-1 flex flex-col gap-2">
          <ConfidenceBadge level={bookDetails?.confidence} />
          {bookDetails?.confidence_reason && (
            <p className="text-xs text-stone-400 leading-relaxed">
              {bookDetails.confidence_reason}
            </p>
          )}
          {bookDetails?.identifiedByModel && (
            <p className="text-xs font-mono text-stone-500 mt-1">
              Identified by {bookDetails.identifiedByModel}
            </p>
          )}
        </div>
      </div>

      {/* Editable Fields */}
      <div className="flex flex-col gap-4 mt-6">
        {/* Book Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">
            Book Title
          </label>
          <input
            type="text"
            value={bookDetails?.title || ""}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 text-lg placeholder-stone-500 focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none transition-all w-full"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">
            Author
          </label>
          <input
            type="text"
            value={bookDetails?.author || ""}
            onChange={(e) => handleFieldChange("author", e.target.value)}
            className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 placeholder-stone-500 focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none transition-all w-full"
          />
        </div>

        {/* Publisher */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">
            Publisher
          </label>
          <input
            type="text"
            value={bookDetails?.publisher || ""}
            onChange={(e) => handleFieldChange("publisher", e.target.value)}
            className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 placeholder-stone-500 focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none transition-all w-full"
          />
        </div>

        {/* Published Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">
            Published Date
          </label>
          <input
            type="text"
            value={bookDetails?.published_date || ""}
            onChange={(e) =>
              handleFieldChange("published_date", e.target.value)
            }
            placeholder="e.g. 2003"
            className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 placeholder-stone-500 focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none transition-all w-full"
          />
        </div>

        {/* Format */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">
            Format
          </label>
          <select
            value={bookDetails?.format || "Unknown"}
            onChange={(e) => handleFieldChange("format", e.target.value)}
            className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-stone-100 focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 outline-none transition-all w-full appearance-none cursor-pointer"
          >
            <option value="Hardcover">Hardcover</option>
            <option value="Softcover">Softcover</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={onRescan}
          className="border border-stone-600 hover:border-stone-400 text-stone-300 hover:text-stone-100 rounded-lg px-4 py-2.5 transition-all cursor-pointer"
        >
          ← Re-scan
        </button>
        <button
          onClick={onConfirm}
          className="bg-amber-400 hover:bg-amber-500 text-stone-950 font-semibold rounded-lg px-4 py-2.5 transition-all active:scale-95 cursor-pointer"
        >
          Confirm & Explore →
        </button>
      </div>
    </div>
  );
}
