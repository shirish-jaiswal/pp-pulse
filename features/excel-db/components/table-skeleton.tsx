export function SkeletonRows({ count = 3 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-muted/40 animate-pulse mx-1"
                >
                    {/* Mimic the Icon */}
                    <div className="h-4 w-4 rounded bg-muted-foreground/20 shrink-0" />

                    <div className="flex flex-col gap-2 w-full">
                        {/* Mimic the Table Name */}
                        <div className="h-3 w-24 rounded bg-muted-foreground/20" />

                        {/* Mimic the Stats (rows/cols) */}
                        <div className="h-2 w-16 rounded bg-muted-foreground/10 ml-2" />
                    </div>
                </div>
            ))}
        </>
    );
}