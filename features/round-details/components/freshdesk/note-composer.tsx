import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

export default function NoteComposer({
    loading,
    onSubmit,
}: {
    loading: boolean;
    onSubmit: () => void;
}) {
    return (
        <div className="p-3 border-t bg-white space-y-2">

            <div className="text-sm font-semibold">
                Add Resolution Note
            </div>

            <div className="h-32 border rounded-md bg-gray-50" />

            <div className="flex justify-end">
                <Button onClick={onSubmit} disabled={loading}>
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                    Submit
                </Button>
            </div>
        </div>
    );
}