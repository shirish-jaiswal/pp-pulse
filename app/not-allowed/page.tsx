"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoveLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotAllowed() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col justify-center px-3 py-3">

      {/* TITLE */}
      <div className="mb-2">
        <h1 className="text-sm font-semibold">
          403 · Access denied
        </h1>
        <p className="text-xs text-muted-foreground">
          You don’t have permission to access this resource.
        </p>
      </div>

      {/* STATUS BLOCK */}
      <div className="mb-3 rounded-md border border-border bg-muted px-2 py-2 font-mono text-xs text-muted-foreground">
        ERROR_CODE: 403_FORBIDDEN <br />
        PATH: {pathname}
      </div>

      {/* SECURITY MESSAGE */}
      <div className="mb-3 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-2 py-2 text-xs text-red-600 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400">
        <ShieldAlert className="h-3.5 w-3.5 mt-0.5" />
        <span>
          Your role does not have access to this module. Contact admin if you believe this is a mistake.
        </span>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2">
        <Button asChild size="sm" variant="default">
          <Link href="/home" className="flex items-center gap-1.5">
            <MoveLeft className="h-3.5 w-3.5" />
            Go Home
          </Link>
        </Button>

        <Button asChild size="sm" variant="outline">
          <Link href={pathname} className="flex items-center gap-1.5">
            Retry
          </Link>
        </Button>
      </div>

      {/* DEBUG HINT */}
      <div className="mt-3 text-[10px] text-muted-foreground">
        RBAC validation failed at middleware level. Check role mapping or feature permissions.
      </div>
    </div>
  );
}