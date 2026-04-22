"use client";

export function BetHistoryResults({ data }: { data: any[] }) {
    if (!data?.length) {
        return <div className="text-sm text-gray-500">No data</div>;
    }

    return (
        <div className="space-y-2 will-change-scroll">
            <div className="text-sm font-semibold mb-2 ">
                Total Records: {data.length}
            </div>

            <div className="w-full flex flex-col overflow-x-scroll">
                {data.map((item, i) => (
                <div key={item.TransactionId || i} className="border p-2 rounded text-xs wrap-break-word">
                    {JSON.stringify(item)}
                </div>
            ))}
            </div>
        </div>
    );
}