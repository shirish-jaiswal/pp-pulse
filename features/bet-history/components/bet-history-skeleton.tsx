"use client";

export default function BetHistorySkeleton() {
    return (
        <div className="flex flex-col gap-4 animate-pulse">
            {/* Form Skeleton */}
            <div className="flex gap-2 items-end">
                <div className="h-10 w-full bg-gray-200 rounded-md" />
                <div className="h-10 w-40 bg-gray-200 rounded-md" />
                <div className="h-10 w-40 bg-gray-200 rounded-md" />
                <div className="h-10 w-24 bg-gray-200 rounded-md" />
            </div>

            {/* Table/List Skeleton */}
            <div className="flex flex-col gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-16 w-full bg-gray-200 rounded-md"
                    />
                ))}
            </div>
        </div>
    );
}