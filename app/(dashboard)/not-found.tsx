"use client";

import Link from "next/link";
import { MoveLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-full w-full flex-col justify-center px-3 py-4 text-left">

      {/* TITLE */}
      <div className="mb-2">
        <h1 className="text-sm font-semibold">Page not found</h1>
        <p className="text-xs text-muted-foreground">
          The requested route does not exist or is not available.
        </p>
      </div>

      {/* STATUS BLOCK */}
      <div className="border border-border rounded-md bg-muted px-2 py-2 text-xs font-mono text-muted-foreground mb-3">
        404_NOT_FOUND · ROUTE_UNAVAILABLE
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
          <Link href="" className="flex items-center gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Link>
        </Button>
      </div>

      {/* OPTIONAL CONTEXT */}
      <div className="mt-4 text-[10px] text-muted-foreground">
        If this issue persists, verify route configuration or permissions.
      </div>
    </div>
  );
}