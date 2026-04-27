"use client";

import { createContext, useContext, useState } from "react";
import { CasinoData } from "@/lib/api/casino-details/casino-details";

type CasinoDetailsContextType = {
    casinoId: string;
    setCasinoId: (v: string) => void;

    data: CasinoData | null;
    setData: (v: CasinoData | null) => void;

    loading: boolean;
    setLoading: (v: boolean) => void;

    error: boolean;
    setError: (v: boolean) => void;

    submitted: boolean;
    setSubmitted: (v: boolean) => void;
};

const CasinoDetailsContext = createContext<CasinoDetailsContextType | null>(null);

export function CasinoDetailsProvider({ children }: { children: React.ReactNode }) {
    const [casinoId, setCasinoId] = useState("");
    const [data, setData] = useState<CasinoData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    return (
        <CasinoDetailsContext.Provider
            value={{ casinoId, setCasinoId, data, setData, loading, setLoading, error, setError, submitted, setSubmitted }}
        >
            {children}
        </CasinoDetailsContext.Provider>
    );
}

export const useCasinoDetails = () => {
    const ctx = useContext(CasinoDetailsContext);
    if (!ctx) throw new Error("useCasinoDetails must be used inside CasinoDetailsProvider");
    return ctx;
};
