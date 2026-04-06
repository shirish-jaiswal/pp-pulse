export default function ResolutionTableSkeleton() {
  return (
    <div className="animate-pulse p-4 space-y-4">
      {[...Array(5)].map((_, idx) => (
        <div key={idx} className="h-10 bg-muted rounded-md w-full"></div>
      ))}
    </div>
  );
}