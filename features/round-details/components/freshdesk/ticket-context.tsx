"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { FetchTicketResponse } from "./types"; 

interface TicketContextType {
  ticketData: FetchTicketResponse | null;
  setTicketData: (data: FetchTicketResponse | null) => void;
  ticketId: string | null;
  setTicketId: (id: string | null) => void;
  clearTicketContext: () => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: { children: ReactNode }) {
  const [ticketData, setTicketData] = useState<FetchTicketResponse | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const clearTicketContext = () => {
    setTicketData(null);
    setTicketId(null);
  };

  return (
    <TicketContext.Provider
      value={{
        ticketData,
        setTicketData,
        ticketId,
        setTicketId,
        clearTicketContext,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTicketContext() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTicketContext must be executed within an active TicketProvider wrap boundary.");
  }
  return context;
}