export function SkeletonRows({ count = 3 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-2 px-2 py-1 rounded-sm mx-0.5 animate-pulse"
                >
                    <div className="h-3.5 w-3.5 rounded bg-muted/40 shrink-0" />
                    <div className="flex flex-col gap-1 w-full min-w-0">
                        <div className="h-2.5 w-28 bg-muted/40 rounded-sm" />
                        <div className="h-2 w-14 bg-muted/20 rounded-sm ml-1" />
                    </div>

                </div>
            ))}
        </>
    );
}