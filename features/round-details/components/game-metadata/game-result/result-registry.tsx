"use client";

import React from "react";
import SweetBonanzaResult from "./result-sheets/sweet-bonanza/sweet-bonanza";
import DefaultNoPopup from "./result-sheets/default-result";
import BaccaratHandReport from "./result-sheets/baccarat/baccarat";
import BlackjackHandReport from "./result-sheets/blackjack/black-jack-hand-report";
import CrashGameResult from "./result-sheets/crash-games/CrashGameResult";
import HighflyerGameResult from "./result-sheets/crash-games/highflyer-game-result";


export const resultRegistry: Record<
  string,
  {
    title: string;
    component: React.ComponentType<any>;
  }
> = {
  "sweet-bonanza": {
    title: "Sweet Bonanza Result",
    component: SweetBonanzaResult,
  },
  "baccarat": {
    title: "Baccarat Result",
    component: BaccaratHandReport,
  },
  "blackjack": {
    title: "Blackjack Result",
    component: BlackjackHandReport,
  },
  "spaceman": {
    title: "Spaceman / Big Bass Result",
    component: CrashGameResult,
  },
  "big-bass": {
    title: "Big Bass Result",
    component: CrashGameResult,
  },
  "highflyer": {
    title: "Highflyer Result",
    component: HighflyerGameResult,
  },
  default: {
    title: "Default",
    component: DefaultNoPopup,
  },
};