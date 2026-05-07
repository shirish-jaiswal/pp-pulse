import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function LogLoadingSkeleton() {
  return (
    <div className="flex flex-col h-full w-full gap-4 p-1 animate-in fade-in duration-500">
      <div className="flex-1 bg-white border rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <div className="relative flex-1 p-4 space-y-4 overflow-hidden">
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[1px]">
             <Loader2 className="h-10 w-10 animate-spin text-primary/60" />
             <p className="mt-4 text-sm font-medium text-slate-500">
                Parsing ElasticSearch indices...
             </p>
          </div>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex gap-4 items-start border-b border-slate-50 pb-3">
              <Skeleton className="h-5 w-32 shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}