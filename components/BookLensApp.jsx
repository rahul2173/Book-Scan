"use client";

import { useState } from "react";
import ScanScreen from "./ScanScreen";
import ReviewScreen from "./ReviewScreen";
import DashboardScreen from "./DashboardScreen";

const INITIAL_STATE = {
  screen: "scan",
  imageFile: null,
  imageBase64: null,
  bookDetails: null,
  activeTab: "summary",
  tabCache: { summary: null, chapters: null, characters: null, links: null },
  chatHistory: [],
};

export default function BookLensApp() {
  const [state, setState] = useState({ ...INITIAL_STATE });

  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleFullReset = () => {
    setState({
      screen: "scan",
      imageFile: null,
      imageBase64: null,
      bookDetails: null,
      activeTab: "summary",
      tabCache: { summary: null, chapters: null, characters: null, links: null },
      chatHistory: [],
    });
  };

  if (state.screen === "scan") {
    return (
      <ScanScreen
        imageFile={state.imageFile}
        imageBase64={state.imageBase64}
        onImageSelect={(file, base64) =>
          updateState({ imageFile: file, imageBase64: base64 })
        }
        onIdentified={(details) =>
          updateState({ bookDetails: details, screen: "review" })
        }
      />
    );
  }

  if (state.screen === "review") {
    return (
      <ReviewScreen
        imageBase64={state.imageBase64}
        bookDetails={state.bookDetails}
        onUpdateDetails={(details) => updateState({ bookDetails: details })}
        onConfirm={() => updateState({ screen: "dashboard", activeTab: "summary" })}
        onRescan={handleFullReset}
      />
    );
  }

  if (state.screen === "dashboard") {
    return (
      <DashboardScreen
        imageBase64={state.imageBase64}
        bookDetails={state.bookDetails}
        activeTab={state.activeTab}
        onTabChange={(tab) => updateState({ activeTab: tab })}
        tabCache={state.tabCache}
        onUpdateTabCache={(key, value) =>
          updateState({
            tabCache: { ...state.tabCache, [key]: value },
          })
        }
        chatHistory={state.chatHistory}
        onUpdateChatHistory={(history) => updateState({ chatHistory: history })}
        onDone={handleFullReset}
      />
    );
  }

  return null;
}
