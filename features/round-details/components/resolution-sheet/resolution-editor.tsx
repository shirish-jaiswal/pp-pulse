import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@base-ui/react";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { ResolutionSummary } from "@/features/round-details/components/resolution-sheet/resolution-summary";
import { OperatorResponse } from "@/features/round-details/components/resolution-sheet/operator-response";

export function ResolutionEditor() {
    const { resolutionEditorOpen, setResolutionEditorOpen } = useRoundDetails();

    const handleSave = () => {
        setResolutionEditorOpen(false);
    };

    return (
        <Sheet open={resolutionEditorOpen} onOpenChange={setResolutionEditorOpen}>
            <SheetContent className="min-w-4xl flex flex-col gap-0 p-2">
                <SheetHeader className="p-0">
                    <SheetTitle className="font-bold text-lg">Resolution</SheetTitle>
                    <Separator className="my-2 border" />
                </SheetHeader>

                <Tabs defaultValue="details" className="w-full flex-1 p-0">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details">Resolution Summary</TabsTrigger>
                        <TabsTrigger value="response">Operator Response</TabsTrigger>
                    </TabsList>
                    <ResolutionSummary />
                    <OperatorResponse />
                </Tabs>

                <SheetFooter className="mt-auto border-t p-0 pt-2">
                    <Button type="button" onClick={handleSave}>
                        Copy
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}