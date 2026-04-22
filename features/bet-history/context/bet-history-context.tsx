"use client";

import { createContext, useContext, useState } from "react";
import { BetHistoryInputProps } from "../types/bet-history-input";

type BetHistoryContextType = {
  input: BetHistoryInputProps;
  setInput: (v: BetHistoryInputProps) => void;

  loading: boolean;
  setLoading: (v: boolean) => void;

  error: boolean;
  setError: (v: boolean) => void;

  data: any[];
  setData: (v: any[]) => void;
};

const BetHistoryContext = createContext<BetHistoryContextType | null>(null);

export function BetHistoryProvider({
  children,
  initialInput = {},
}: {
  children: React.ReactNode;
  initialInput?: Partial<BetHistoryInputProps>;
}) {
  const [input, setInput] = useState<BetHistoryInputProps>({
    playerId: initialInput.playerId || "",
    from: initialInput.from,
    to: initialInput.to,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState<any[]>([]);

  return (
    <BetHistoryContext.Provider
      value={{
        input,
        setInput,
        loading,
        setLoading,
        error,
        setError,
        data,
        setData,
      }}
    >
      {children}
    </BetHistoryContext.Provider>
  );
}

export const useBetHistory = () => {
  const ctx = useContext(BetHistoryContext);
  if (!ctx) throw new Error("useBetHistory must be used inside provider");
  return ctx;
};