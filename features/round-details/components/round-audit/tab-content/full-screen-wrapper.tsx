"use client";

import { useState, useEffect, useCallback, ReactNode } from "react";
import { Maximize2, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface FullScreenWrapperProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function FullScreenWrapper({
  children,
  title,
  description,
}: FullScreenWrapperProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const close = useCallback(() => setIsFullScreen(false), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    if (isFullScreen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullScreen, close]);

  return (
    <>
      {/* NORMAL MODE */}
      <div className="relative group border border-border/50 rounded-md bg-background/40 flex flex-col">

        {/* Expand Button */}
        <button
          onClick={() => setIsFullScreen(true)}
          className={cn(
            "absolute right-0 top-0 z-10 p-1 rounded-md",
            "border border-border bg-background/80 backdrop-blur-sm",
            "text-muted-foreground hover:text-foreground hover:bg-accent",
            "opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out", // Smooth reveal
            "shadow-sm"
          )}
          title="Expand"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        <div className="overflow-auto">
          {children}
        </div>
      </div>

      {/* FULLSCREEN MODE */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in fade-in duration-150">

          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-background/80 backdrop-blur">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {title}
              </span>
              {description && (
                <span className="text-xs text-muted-foreground">
                  {description}
                </span>
              )}
            </div>

            <button
              onClick={close}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/40"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto scroll-smooth">
            {children}
          </div>
        </div>
      )}
    </>
  );
}