"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isSessionDataPresent } from "@/utils/storage/local/session-operations";

export default function SessionValidation({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const hasSession = isSessionDataPresent();
    const isRootRoute = pathname === "/";

    if (!hasSession && !isRootRoute) {
      router.push("/"); 
    } 
    
    else if (hasSession && isRootRoute) {
      router.push("/casino-details");
    } 

    else {
      const timer = setTimeout(() => setIsChecking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-muted-foreground animate-pulse">Verifying session...</p>
      </div>
    );
  }

  return <>{children}</>;
}