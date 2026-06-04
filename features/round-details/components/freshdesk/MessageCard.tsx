export default function MessageCard({
    type,
    body,
    time,
    email,
}: {
    type: "customer" | "internal";
    body: string;
    time: string;
    email?: string;
}) {
    return (
        <div
            className={`rounded-md border p-3 text-sm ${
                type === "customer"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-yellow-50 border-yellow-200"
            }`}
        >

            {/* HEADER */}
            <div className="flex items-center justify-between text-xs mb-2">

                <div className="font-semibold">
                    {type === "customer"
                        ? "Customer Message"
                        : "Internal Note"}
                </div>

                <div className="text-muted-foreground">
                    {new Date(time).toLocaleString()}
                </div>
            </div>

            {/* EMAIL (only for customer) */}
            {type === "customer" && email && (
                <div className="text-xs text-muted-foreground mb-2">
                    From: {email}
                </div>
            )}

            {/* BODY */}
            <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: body }}
            />
        </div>
    );
}