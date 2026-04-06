import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Resolution } from "@/features/resolution-template/types/types";

export function ResolutionHeader({ initialData }: { initialData: Resolution | null }) {
    return (
        <SheetHeader className="gap-0 p-2 border-b mb-2">
            <SheetTitle>
                {initialData ? "Edit Template" : "Create Resolution Template"}
            </SheetTitle>
        </SheetHeader>
    );
}