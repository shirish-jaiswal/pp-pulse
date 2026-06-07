"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type Props = {
  fromDate?: Date;
  toDate?: Date;
  setFromDate: (d?: Date) => void;
  setToDate: (d?: Date) => void;
};

export default function FilterPopover({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}: Props) {
  const [open, setOpen] = useState(false);
  const [rangeType, setRangeType] = useState("all");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="text-sm min-w-[260px]">
          {fromDate && toDate
            ? `${fromDate.toLocaleString()} → ${toDate.toLocaleString()}`
            : "Select Time Range"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[380px] p-4 space-y-4">

        {/* ✅ QUICK FILTERS */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Quick Select</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "15m", value: 15 * 60 * 1000 },
              { label: "30m", value: 30 * 60 * 1000 },
              { label: "1h", value: 60 * 60 * 1000 },
              { label: "24h", value: 24 * 60 * 60 * 1000 },
              { label: "7d", value: 7 * 24 * 60 * 60 * 1000 },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  const now = new Date();
                  setFromDate(new Date(now.getTime() - item.value));
                  setToDate(now);
                  setRangeType(item.label);
                }}
                className={`px-2 py-1 text-xs rounded-md ${
                  rangeType === item.label
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Last {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* ✅ CALENDAR */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Custom Range</p>
          <Calendar
            mode="range"
            selected={{
              from: fromDate,
              to: toDate,
            }}
            onSelect={(range: any) => {
              setFromDate(range?.from);
              setToDate(range?.to);
              setRangeType("custom");
            }}
          />
        </div>

        {/* ✅ ACTIONS */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFromDate(undefined);
              setToDate(undefined);
              setRangeType("all");
              setOpen(false);
            }}
          >
            Reset
          </Button>

          <Button size="sm" onClick={() => setOpen(false)}>
            Apply
          </Button>
        </div>

      </PopoverContent>
    </Popover>
  );
}