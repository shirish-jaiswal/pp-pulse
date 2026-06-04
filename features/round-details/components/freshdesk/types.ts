export interface Conversation {
    id: number;
    body: string;
    incoming: boolean;
    private: boolean;
    created_at: string;
    from_email?: string;
}

export interface TicketDetails {
    id: number;
    subject: string;
    description: string;
    status: number;
    priority: number;
    custom_fields?: {
        cf_product_type?: string;
        cf_severity?: string;
        cf_casino_name?: string;
        cf_reason_for_pending?: string;
    };
}

export interface FetchTicketResponse {
    success: boolean;
    ticket: TicketDetails | null | undefined; 
    conversations?: any[]; 
    userEmail?: string | null;
}