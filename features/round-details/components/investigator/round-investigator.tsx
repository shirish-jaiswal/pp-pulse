"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { RoundDetailsInputProps } from "@/features/round-details/types/round-details-input"
import { useRoundDetails } from "@/features/round-details/context/round-details-context"
import { RoundDetailsForm } from "@/features/round-details/components/investigator/round-details-form"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MultiRoundDetailsForm } from "@/features/round-details/components/investigator/round-details-from-bulk"

export function RoundInvestigator() {
    const router = useRouter();
    const { roundDetailsInput, setRoundDetailsInput, isBulkMode, setBulkMode } = useRoundDetails()

    useEffect(() => {
        if (roundDetailsInput?.round_id || (roundDetailsInput?.game_id && roundDetailsInput?.user_id)) {
            setRoundDetailsInput(roundDetailsInput)
            // Be careful with auto-submitting here as it triggers a router push on every mount
            handleSubmit(roundDetailsInput)
        }
    }, [roundDetailsInput?.round_id])

    const handleSubmit = (data: RoundDetailsInputProps) => {
        if (data?.round_id) {
            router.push("/round-activity/?roundId=" + data.round_id)
        } else if (data?.game_id && data?.user_id) {
            router.push("/round-activity/?gameId=" + data.game_id + "&userId=" + data.user_id)
        }
        else router.push("/round-activity")
    }

    return (
        <Card className="shadow-sm border-slate-200 p-0">
            <CardContent className="p-2 pb-0">
                <div className="flex items-center gap-4 mb-1.5">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Activity className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase">
                            Round Investigator
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Label htmlFor="bulk-mode" className="text-[10px] font-medium text-slate-400 uppercase">
                            Bulk
                        </Label>
                        <Switch
                            id="bulk-mode"
                            checked={isBulkMode}
                            onCheckedChange={setBulkMode}
                            className="scale-75"
                        />
                    </div>
                </div>
                {
                    isBulkMode ? (
                        <MultiRoundDetailsForm
                        />
                    ) : (
                        <RoundDetailsForm
                            onSubmit={handleSubmit}
                        />
                    )
                }
            </CardContent>
        </Card>
    )
}