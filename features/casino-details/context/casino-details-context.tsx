"use client";

import { createContext, useContext, useState } from "react";

/* ✅ Context Type (minimal and clean) */
type CasinoDetailsContextType = {
  casinoId: string;
  setCasinoId: (value: string) => void;
};

/* ✅ Create Context */
const CasinoDetailsContext = createContext<CasinoDetailsContextType | null>(null);

/* ✅ Provider */
export function CasinoDetailsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [casinoId, setCasinoId] = useState("");

  return (
    <CasinoDetailsContext.Provider value={{ casinoId, setCasinoId }}>
      {children}
    </CasinoDetailsContext.Provider>
  );
}

/* ✅ Hook */
export function useCasinoDetails() {
  const context = useContext(CasinoDetailsContext);

  if (!context) {
    throw new Error(
      "useCasinoDetails must be used within CasinoDetailsProvider"
    );
  }

  return context;
}