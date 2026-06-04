import { ExternalLink } from "lucide-react";
import { TicketDetails } from "./types";

export default function TicketHeader({ ticket }: { ticket: TicketDetails }) {
    return (
        <div className="border-b px-4 py-3 bg-white">
            <div className="flex items-center justify-between">
                <div>
                    <div className="font-semibold">
                        #{ticket.id} {ticket.subject}
                    </div>

                    <div className="text-xs text-muted-foreground">
                        Product: {ticket.custom_fields?.cf_product_type || "N/A"}
                    </div>
                </div>

                <a
                    href={`https://pragmaticplay.freshdesk.com/a/tickets/${ticket.id}`}
                    target="_blank"
                >
                    <ExternalLink className="h-4 w-4" />
                </a>
            </div>
        </div>
    );
}