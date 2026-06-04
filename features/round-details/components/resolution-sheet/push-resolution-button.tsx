"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { processEditorHtml } from "@/components/custom/text-editor/toolbar/copy-html/process-editor-html";
import { c_addFreshdeskNote } from "@/lib/api/freshdesk/c_addFreshdeskNote";
import { toast } from "sonner";
import { useProfile } from "@/context/use-profile";

type Props = {
    /** Pass down the actively loaded ticket ID from your Freshdesk workspace */
    activeTicketId?: string | null; 
};

export default function PushResolutionButton({ activeTicketId }: Props) {
    const [loading, setLoading] = useState(false);
    const { user } = useProfile();

    const handleQuickPush = async () => {
        // 1. Guard check: Ensure a ticket is loaded
        if (!activeTicketId) {
            toast.error("No active ticket is loaded. Please select or fetch a ticket first.");
            return;
        }

        // 2. Guard check: Integration verification
        if (!user?.isFreshDesk) {
            toast.warning("Freshdesk integration not configured. Redirecting to profile...");
            window.open("/portal/profile", "_blank", "noopener,noreferrer");
            return;
        }

        try {
            setLoading(true);

            // 3. Extract the HTML directly from the active text editor state
            const cleanHtmlContent = processEditorHtml();

            if (!cleanHtmlContent) {
                toast.error("Could not extract text. Make sure your editor contains content.");
                return;
            }

            // 4. Send directly via your Freshdesk core API call
            await c_addFreshdeskNote(
                activeTicketId.trim(),
                cleanHtmlContent,
            );

            toast.success(`Resolution instantly pushed to ticket #${activeTicketId}!`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to push resolution to the active ticket.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button 
            variant="default" 
            className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            onClick={handleQuickPush}
            disabled={loading || !activeTicketId}
        >
            {loading ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Pushing to Freshdesk...
                </>
            ) : (
                <>
                    <Send className="h-4 w-4" />
                    Push to Ticket #{activeTicketId || ""}
                </>
            )}
        </Button>
    );
}