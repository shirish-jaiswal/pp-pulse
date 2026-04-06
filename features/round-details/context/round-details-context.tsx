"use client"

import React, { createContext, useContext, useState, useMemo, Dispatch, SetStateAction, useCallback } from "react"
import { RoundDetailsInputProps } from "@/features/round-details/types/round-details-input"

type RoundDetailsContextType = {
    roundDetailsInput: RoundDetailsInputProps | null
    setRoundDetailsInput: Dispatch<SetStateAction<RoundDetailsInputProps | null>>

    multiRoundIds: string[];
    setMultiRoundIds: Dispatch<SetStateAction<string[]>>;

    isBulkMode: boolean;
    setBulkMode: Dispatch<SetStateAction<boolean>>;

    resolutionEditorOpen: boolean
    setResolutionEditorOpen: Dispatch<SetStateAction<boolean>>
}

const RoundDetailsContext = createContext<RoundDetailsContextType | null>(null)

export function RoundDetailsProvider({ children }: { children: React.ReactNode }) {
    const [roundDetailsInput, setRoundDetailsInput] = useState<RoundDetailsInputProps | null>(null)
    const [resolutionEditorOpen, setResolutionEditorOpen] = useState<boolean>(false)
    const [multiRoundIdsState, setMultiRoundIdsState] = useState<string[]>([]);
    const [isBulkMode, setBulkMode] = useState<boolean>(false);

    const setMultiRoundIds = useCallback((val: string[] | ((prev: string[]) => string[])) => {
        setMultiRoundIdsState((prev) => {
            const nextValue = typeof val === "function" ? val(prev) : val;
            return nextValue.slice(0, 10);
        });
    }, []);

    const value = useMemo(() => ({
        roundDetailsInput,
        setRoundDetailsInput,
        multiRoundIds: multiRoundIdsState,
        setMultiRoundIds,
        isBulkMode,
        setBulkMode,
        resolutionEditorOpen,
        setResolutionEditorOpen
    }), [
        roundDetailsInput, 
        resolutionEditorOpen, 
        multiRoundIdsState, 
        isBulkMode, 
        setMultiRoundIds,
        setBulkMode,
        setResolutionEditorOpen,
        setRoundDetailsInput
    ]);

    return (
        <RoundDetailsContext.Provider value={value}>
            {children}
        </RoundDetailsContext.Provider>
    )
}

export function useRoundDetails() {
    const ctx = useContext(RoundDetailsContext)
    if (!ctx) {
        throw new Error("useRoundDetails must be used inside RoundDetailsProvider")
    }
    return ctx
}