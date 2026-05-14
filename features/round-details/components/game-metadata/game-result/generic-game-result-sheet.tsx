"use client";

import React from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { cn } from "@/utils/cn";

type GenericGameResultSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

const GenericGameResultSheet = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: GenericGameResultSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} >
      <SheetContent
        side="right"
        className={cn(
          "p-0 flex flex-col min-w-[40vw] max-w-none",
          className
        )}
      >
        {(title || description) && (
          <div className="border-b">
            <SheetHeader className="space-y-1">
              {title && (
                <SheetTitle className="text-base font-semibold tracking-tight">
                  {title}
                </SheetTitle>
              )}

              {description && (
                <SheetDescription className="text-xs text-muted-foreground">
                  {description}
                </SheetDescription>
              )}
            </SheetHeader>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default GenericGameResultSheet;