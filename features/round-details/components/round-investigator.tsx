"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { RoundDetailsInputProps } from "@/features/round-details/types/round-details-input"
import { useRoundDetails } from "@/features/round-details/context/round-details-context"
import { RoundDetailsForm } from "@/features/round-details/components/round-details-form"

export function RoundInvestigator() {

    const { roundDetailsInput, setRoundDetailsInput } = useRoundDetails()

    const handleSubmit = (data: RoundDetailsInputProps) => {
        setRoundDetailsInput(data)
    }

    return (
        <Card className="shadow-sm border-slate-200 p-0">
            <CardContent className="p-2 pb-0">
                <div className="flex items-center gap-2 mb-1.5 text-slate-500">
                    <Activity className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase">
                        Round Investigator
                    </span>
                </div>
                <RoundDetailsForm onSubmit={handleSubmit} />
            </CardContent>
        </Card>
    )
}