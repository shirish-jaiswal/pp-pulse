import { SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function ResolutionFooter({ form }: any) {
    return (
        <SheetFooter className="border-t px-2 py-2 flex flex-row gap-2">
            <Button
                variant="outline"
                className="flex-1"
                onClick={() => form.onOpenChange(false)}
                disabled={form.isPending}
            >
                Cancel
            </Button>

            <Button
                className="flex-1"
                onClick={form.handleSave}
                disabled={
                    form.isPending ||
                    !form.title ||
                    !form.content ||
                    !form.game ||
                    !form.subcategory
                }
            >
                {form.isPending ? "Saving..." : "Save Template"}
            </Button>
        </SheetFooter>
    );
}