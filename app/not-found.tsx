"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoveLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col justify-center px-3 py-3">

      {/* TITLE */}
      <div className="mb-2">
        <h1 className="text-sm font-semibold">404 · Page not found</h1>
        <p className="text-xs text-muted-foreground">
          The requested route is unavailable or not configured.
        </p>
      </div>

      {/* STATUS BLOCK */}
      <div className="mb-3 rounded-md border border-border bg-muted px-2 py-2 font-mono text-xs text-muted-foreground">
        ERROR_CODE: 404_NOT_FOUND <br />
        PATH: {pathname}
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2">
        <Button asChild size="sm" variant="default">
          <Link href="/" className="flex items-center gap-1.5">
            <MoveLeft className="h-3.5 w-3.5" />
            Back
          </Link>
        </Button>

        <Button asChild size="sm" variant="outline">
          <Link href={pathname} className="flex items-center gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Link>
        </Button>
      </div>

      {/* DEBUG HINT */}
      <div className="mt-3 text-[10px] text-muted-foreground">
        Verify route configuration, permissions, or deployment state.
      </div>
    </div>
  );
}