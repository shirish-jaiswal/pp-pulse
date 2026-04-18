export const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse rounded bg-muted ${className}`}
  />
);

export default function Loading() {
  return (
    <main className="w-full h-full p-2 space-y-3">

      {/* HEADER */}
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-5 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-6 w-28" />
      </div>

      <div className="border border-border rounded-md overflow-hidden">
        <div className="grid grid-cols-6 gap-2 px-2 py-1 border-b border-border bg-muted">
          {["col1", "col2", "col3", "col4", "col5", "col6"].map((_, i) => (
            <Skeleton key={i} className="h-3 w-16" />
          ))}
        </div>

        <div className="divide-y divide-border">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-2 px-2 py-1.5 items-center"
            >
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12 ml-auto" />
              <Skeleton className="h-3 w-12 ml-auto" />
              <Skeleton className="h-5 w-5 ml-auto rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}