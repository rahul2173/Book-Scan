"use client";

import SummaryTab from "./tabs/SummaryTab";
import ChaptersTab from "./tabs/ChaptersTab";
import CharactersTab from "./tabs/CharactersTab";
import AskAITab from "./tabs/AskAITab";
import FindBookTab from "./tabs/FindBookTab";

const TABS = [
  { key: "summary", label: "Summary" },
  { key: "chapters", label: "Chapters" },
  { key: "characters", label: "Characters" },
  { key: "chat", label: "Ask AI" },
  { key: "links", label: "Find Book" },
];

export default function DashboardScreen({
  imageBase64,
  bookDetails,
  activeTab,
  onTabChange,
  tabCache,
  onUpdateTabCache,
  chatHistory,
  onUpdateChatHistory,
  onDone,
}) {
  const renderTab = () => {
    switch (activeTab) {
      case "summary":
        return (
          <SummaryTab
            bookDetails={bookDetails}
            cached={tabCache.summary}
            onCache={(data) => onUpdateTabCache("summary", data)}
          />
        );
      case "chapters":
        return (
          <ChaptersTab
            bookDetails={bookDetails}
            cached={tabCache.chapters}
            onCache={(data) => onUpdateTabCache("chapters", data)}
          />
        );
      case "characters":
        return (
          <CharactersTab
            bookDetails={bookDetails}
            cached={tabCache.characters}
            onCache={(data) => onUpdateTabCache("characters", data)}
          />
        );
      case "chat":
        return (
          <AskAITab
            bookDetails={bookDetails}
            chatHistory={chatHistory}
            onUpdateChatHistory={onUpdateChatHistory}
          />
        );
      case "links":
        return (
          <FindBookTab
            bookDetails={bookDetails}
            cached={tabCache.links}
            onCache={(data) => onUpdateTabCache("links", data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 z-20 bg-stone-900 border-b border-stone-700 shadow-lg px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {imageBase64 && (
            <img
              src={imageBase64}
              alt="Book cover"
              className="w-10 h-14 object-cover rounded-md ring-1 ring-amber-400/40 flex-shrink-0"
            />
          )}
          <div className="min-w-0">
            <h2 className="font-serif font-bold text-stone-100 text-lg max-w-[160px] md:max-w-xs truncate">
              {bookDetails?.title}
            </h2>
            <p className="text-sm text-stone-400">{bookDetails?.author}</p>
          </div>
        </div>
        <button
          onClick={onDone}
          className="border border-stone-600 hover:border-stone-400 text-stone-300 hover:text-stone-100 rounded-lg px-3 py-1.5 text-sm transition-all flex-shrink-0 cursor-pointer"
        >
          Done
        </button>
      </div>

      {/* Fixed Tab Bar */}
      <div className="sticky top-[73px] z-10 bg-stone-950 border-b border-stone-700 flex overflow-x-auto scrollbar-hide px-4 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-4 py-3 text-sm whitespace-nowrap font-medium transition-colors shrink-0 cursor-pointer ${
              activeTab === tab.key
                ? "text-amber-400 border-b-2 border-amber-400"
                : "text-stone-400 hover:text-stone-200 border-b-2 border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-16 max-w-2xl mx-auto w-full">
        {renderTab()}
      </div>
    </div>
  );
}
