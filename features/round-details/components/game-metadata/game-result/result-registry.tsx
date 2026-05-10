"use client";

import React from "react";
import SweetBonanzaResult from "./result-sheets/sweet-bonanza/sweet-bonanza";
import DefaultNoPopup from "./result-sheets/default-result";
import BaccaratHandReport from "../../round-audit/tab-content/card-details/baccarat/baccarat";


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
    default: {
      title: "Default",
      component: DefaultNoPopup,
    },
};