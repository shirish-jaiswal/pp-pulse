import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { ResolutionSummary } from "@/features/round-details/components/resolution-sheet/resolution-summary";
import { OperatorResponse } from "@/features/round-details/components/resolution-sheet/operator-response";
import { CategoryType } from "@/features/resolution-template/types/types";
import { useState } from "react";

type ResolutionEditorProps = {
    gameName: string;
};

export function ResolutionEditor({ gameName }: ResolutionEditorProps) {
    const { resolutionEditorOpen, setResolutionEditorOpen } = useRoundDetails();
    const [tabSelected, setTabSelected] = useState<CategoryType>("Resolution Summary");
    const handleSave = () => {
        setResolutionEditorOpen(false);
    };

    return (
        <Sheet open={resolutionEditorOpen} onOpenChange={setResolutionEditorOpen}>
            <SheetContent className="min-w-4xl flex flex-col gap-0 p-1">
                <SheetHeader className="p-1 border-b border-border mb-1">
                    <SheetTitle className="font-bold text-lg">Resolution</SheetTitle>
                    <SheetDescription className="text-muted-foreground">
                        View resolution summaries and operator responses for this round.
                    </SheetDescription>
                </SheetHeader>

                <Tabs defaultValue="details" className="w-full gap-0 flex-1 p-0">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details" onClick={() => setTabSelected("Resolution Summary")}>Resolution Summary</TabsTrigger>
                        <TabsTrigger value="response" onClick={() => setTabSelected("Operator Response")}>Operator Response</TabsTrigger>
                    </TabsList>
                    <ResolutionSummary gameName={gameName} tabSelected={tabSelected} />
                    <OperatorResponse gameName={gameName} tabSelected={tabSelected} />
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}