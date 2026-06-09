"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateRangeValue } from "@/features/log-exp/date-time-range-picker/types";

interface DatePresetDropdownProps {
  onPresetSelect: (range: DateRangeValue) => void;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function DatePresetDropdown({ onPresetSelect }: DatePresetDropdownProps) {
  
  // Dynamically generate individual dates based on current day of the month
  const dynamicAvailableDates = React.useMemo(() => {
    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth(); // 0 - 11
    const currentDayElement = now.getUTCDate(); // 1 - 31

    const datesList = [];

    // CASE 1: Today is the 1st of the month -> Show whole previous month + 1st of current month
    if (currentDayElement === 1) {
      // 1. Generate all days of the previous month
      const prevMonth = currentMonth - 1;
      const totalDaysInPrevMonth = new Date(Date.UTC(currentYear, currentMonth, 0)).getUTCDate();
      
      for (let day = 1; day <= totalDaysInPrevMonth; day++) {
        const fromDate = new Date(Date.UTC(currentYear, prevMonth, day, 0, 0, 0, 0));
        const toDate = new Date(fromDate.getTime() + ONE_DAY_MS);
        const label = fromDate.toLocaleDateString(undefined, {
          month: "short", day: "numeric", year: "numeric", timeZone: "UTC"
        });
        datesList.push({ label, range: { from: fromDate, to: toDate } });
      }

      const currentMonthFrom = new Date(Date.UTC(currentYear, currentMonth, 1, 0, 0, 0, 0));
      const currentMonthTo = new Date(currentMonthFrom.getTime() + ONE_DAY_MS);
      const currentMonthLabel = currentMonthFrom.toLocaleDateString(undefined, {
        month: "short", day: "numeric", year: "numeric", timeZone: "UTC"
      });
      datesList.push({ label: currentMonthLabel, range: { from: currentMonthFrom, to: currentMonthTo } });

    } else {
      for (let day = 1; day <= currentDayElement; day++) {
        const fromDate = new Date(Date.UTC(currentYear, currentMonth, day, 0, 0, 0, 0));
        const toDate = new Date(fromDate.getTime() + ONE_DAY_MS);
        const label = fromDate.toLocaleDateString(undefined, {
          month: "short", day: "numeric", year: "numeric", timeZone: "UTC"
        });
        datesList.push({ label, range: { from: fromDate, to: toDate } });
      }
    }

    return datesList.reverse();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" type="button" className="h-9 px-3 gap-2 shrink-0">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold px-2 py-1.5">
          Available Dates
        </DropdownMenuLabel>
        
        <ScrollArea className="h-64 pr-1">
          {dynamicAvailableDates.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={() => onPresetSelect(item.range)}
              className="cursor-pointer text-xs py-2"
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}