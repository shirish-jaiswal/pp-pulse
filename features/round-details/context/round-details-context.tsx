"use client"

import React, { createContext, useContext, useState, useMemo } from "react"
import { RoundDetailsInputProps } from "@/features/round-details/types/round-details-input"

type RoundDetailsContextType = {
    roundDetailsInput: RoundDetailsInputProps | null
    setRoundDetailsInput: (v: RoundDetailsInputProps | null) => void

    resolutionEditorOpen: boolean
    setResolutionEditorOpen: (v: boolean) => void
}

const RoundDetailsContext = createContext<RoundDetailsContextType | null>(null)

export function RoundDetailsProvider({ children }: { children: React.ReactNode }) {
    const [roundDetailsInput, setRoundDetailsInput] = useState<RoundDetailsInputProps | null>(null)
    const [resolutionEditorOpen, setResolutionEditorOpen] = useState<boolean>(false)

    const value = useMemo(() => ({
        roundDetailsInput,
        setRoundDetailsInput,
        resolutionEditorOpen,
        setResolutionEditorOpen
    }), [roundDetailsInput, resolutionEditorOpen]);

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