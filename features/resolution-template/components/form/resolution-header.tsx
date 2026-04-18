import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ResolutionTemplate } from "@/lib/excel-engine/resolution-template/get-all";

export function ResolutionHeader({ initialData }: { initialData: ResolutionTemplate | null }) {
    return (
        <SheetHeader className="gap-0 p-2 border-b mb-2">
            <SheetTitle>
                {initialData ? "Edit Template" : "Create Resolution Template"}
            </SheetTitle>
        </SheetHeader>
    );
}