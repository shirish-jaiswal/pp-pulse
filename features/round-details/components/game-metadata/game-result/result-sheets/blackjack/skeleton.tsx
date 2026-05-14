export default function LoadingSkeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            {/* Dealer Skeleton */}
            <div className="rounded-lg border bg-background p-3 space-y-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <div className="h-4 w-20 rounded bg-muted" />
                        <div className="h-3 w-24 rounded bg-muted/70" />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="h-5 w-16 rounded bg-muted" />
                        <div className="h-6 w-8 rounded bg-muted" />
                    </div>
                </div>

                <div className="flex gap-2">
                    {Array.from({ length: 3 }).map(
                        (_, index) => (
                            <div
                                key={index}
                                className="h-[68px] w-[48px] rounded-md border bg-muted"
                            />
                        )
                    )}
                </div>
            </div>

            {/* Players Skeleton */}
            <div className="grid gap-3 xl:grid-cols-2">
                {Array.from({ length: 4 }).map(
                    (_, playerIndex) => (
                        <div
                            key={playerIndex}
                            className="rounded-lg border bg-background p-3 space-y-3"
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <div className="h-4 w-16 rounded bg-muted" />
                                    <div className="h-3 w-20 rounded bg-muted/70" />
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-12 rounded bg-muted" />
                                    <div className="h-6 w-8 rounded bg-muted" />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {Array.from({ length: 2 }).map(
                                    (_, cardIndex) => (
                                        <div
                                            key={cardIndex}
                                            className="h-[68px] w-[48px] rounded-md border bg-muted"
                                        />
                                    )
                                )}
                            </div>

                            <div className="flex gap-2">
                                <div className="h-5 w-14 rounded bg-muted" />
                                <div className="h-5 w-16 rounded bg-muted" />
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}