export async function c_getTicketById(ticketId : string) {
    const params = new URLSearchParams({
        ticketId: ticketId.toString(),
    });

    const response = await fetch(`/api/fresh-desk/get-ticket?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData)
        throw new Error(errorData.error || "Failed to fetch transaction info");
    }

    return response.json();
}