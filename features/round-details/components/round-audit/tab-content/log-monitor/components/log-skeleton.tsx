"use client";

export function LogSkeleton() {
  return (
    <div className="h-fit w-full flex flex-col text-[13px] animate-pulse">

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b">
        {/* Tabs */}
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-6 w-20 bg-gray-200 rounded-md"
            />
          ))}
        </div>

        {/* Search */}
        <div className="h-7 w-56 bg-gray-200 rounded-md" />
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <div className="w-52 border-r p-2 space-y-2">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="h-4 w-full bg-gray-200 rounded"
            />
          ))}
        </div>

        {/* Table */}
        <main className="flex-1 p-2 space-y-2 overflow-hidden">

          {/* Table header */}
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-5 w-32 bg-gray-200 rounded"
              />
            ))}
          </div>

          {/* Rows */}
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex gap-2">
              {[...Array(5)].map((_, j) => (
                <div
                  key={j}
                  className="h-4 w-32 bg-gray-200 rounded"
                />
              ))}
            </div>
          ))}
        </main>
      </div>

      {/* Footer */}
      <div className="border-t px-3 py-2 flex justify-between">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
}