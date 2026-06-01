import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoundDetails } from "@/features/round-details/context/round-details-context";
import { useEffect, useState } from "react";
import { useCategories } from "@/hooks/excel-db/use-categories";
import { ResolutionEditorContent } from "@/features/round-details/components/resolution-sheet/resolution-editor-content";

type ResolutionEditorProps = {
    gameName: string;
};

export function ResolutionEditor({ gameName }: ResolutionEditorProps) {
    const { resolutionEditorOpen, setResolutionEditorOpen } = useRoundDetails();
    const { data: categories = [], isLoading } = useCategories();
    const [tabSelected, setTabSelected] = useState<string>();
    useEffect(() => {
        if (categories.length > 0 && !tabSelected) {
            setTabSelected(categories[0].title);
        }
    }, [categories, tabSelected]);

    if (isLoading) return null;

    return (
        <Sheet open={resolutionEditorOpen} onOpenChange={setResolutionEditorOpen}>
            <SheetContent className="p-1 flex flex-col min-w-[60vw] max-w-none gap-0">
                <SheetHeader className="p-1 border-b border-border">
                    <SheetTitle className="font-bold text-lg">Resolution</SheetTitle>
                    <SheetDescription className="text-muted-foreground">
                        View resolution summaries and operator responses for this round.
                    </SheetDescription>
                </SheetHeader>

                <Tabs value={tabSelected} onValueChange={setTabSelected} className="flex-1 flex flex-col min-h-0">
                    <TabsList className="flex w-full border-b justify-start overflow-x-auto overflow-y-hidden p-4 whitespace-nowrap gap-1 bg-transparent border-muted unique-scrollbar">
                        {categories.map((cat) => (
                            <TabsTrigger
                                key={cat.id}
                                value={cat.title}
                                className="shrink-0 text-sm font-medium data-[state=active]:border-b-2 p-3 data-[state=active]:border-primary"
                            >
                                {cat.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Ensure your contents grow nicely below */}
                    {categories.map((cat) => (
                        <ResolutionEditorContent
                            key={cat.id}
                            gameName={gameName}
                            category={cat.title}
                            tabsValue={cat.title}
                        />
                    ))}
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}