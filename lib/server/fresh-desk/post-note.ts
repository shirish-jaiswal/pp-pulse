import { getSessionData } from "@/utils/storage/local/session-operations";

export async function c_postPrivateNote(ticketId: string, noteContent: string) {
    const session = getSessionData();
    
    // We pass the ticketId as a query parameter to match your Next.js GET logic
    const params = new URLSearchParams({
        ticketId: ticketId.toString(),
    });

    const response = await fetch(`/api/fresh-desk/post-note?${params.toString()}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        // Freshdesk requires the note content to be in a 'body' field
        body: JSON.stringify({
            body: noteContent, 
            private: true // Ensures this is a internal-only note
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Freshdesk Note Error:", errorData);
        throw new Error(errorData.error || "Failed to post private note");
    }

    return response.json();
}