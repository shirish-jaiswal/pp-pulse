"use client";

export default function RoundDetailsSkeleton() {
    return (
        <div className="flex flex-col gap-4 animate-pulse">

            {/* Game Metadata */}
            <div className="bg-gray-200 rounded-2xl h-20 w-full" />

            {/* Round Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-xl h-24 w-full" />
                ))}
            </div>

            {/* Audit Section */}
            <div className="bg-gray-200 rounded-2xl h-40 w-full" />

            {/* Resolution Editor */}
            <div className="bg-gray-200 rounded-2xl h-32 w-full" />
        </div>
    );
}