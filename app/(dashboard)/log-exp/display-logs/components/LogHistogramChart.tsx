// components/LogHistogramChart.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
import { useKibanaFormStore } from "../../context/kibana-form-context";

interface HistogramBucket {
  key?: number | string;
  key_as_string: string;
  doc_count: number;
}

interface LogHistogramChartProps {
  data: HistogramBucket[] | null | undefined;
  isVisible: boolean;
}

export function LogHistogramChart({ data, isVisible }: LogHistogramChartProps) {
  const { setDateRange } = useKibanaFormStore();
  const [activeBucket, setActiveBucket] = useState<HistogramBucket | null>(null);

  // Drag-and-Select Time Bounding Brush States
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartIdx, setDragStartIdx] = useState<number | null>(null);
  const [dragCurrentIdx, setDragCurrentIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="text-xs italic text-slate-400 text-center py-8 bg-white rounded border border-dashed border-slate-200">
        No aggregated timeline distribution analytics available for this snapshot range.
      </div>
    );
  }

  const maxDocCount = Math.max(...data.map((b) => b.doc_count || 0));
  const totalPeriodHits = data.reduce((acc, curr) => acc + (curr.doc_count || 0), 0);

  // Dynamic millisecond duration calculation for individual buckets
  const stepDelta = (() => {
    if (data.length < 2) return 0;
    return Math.abs(new Date(data[1].key_as_string).getTime() - new Date(data[0].key_as_string).getTime());
  })();

  const calculateIntervalLabel = (): string => {
    if (stepDelta === 0) return "Auto";
    const seconds = Math.floor(stepDelta / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    return `${seconds} second${seconds > 1 ? "s" : ""}`;
  };

  const intervalLabel = calculateIntervalLabel();

  // Explicit Kibana style full timestamp formatting: "May 20, 2026 @ 00:00:00.000"
  const formatFullKibanaTime = (dateObj: Date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[dateObj.getMonth()];
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();

    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");
    const ms = String(dateObj.getMilliseconds()).padStart(3, "0");

    return `${month} ${day}, ${year} @ ${hours}:${minutes}:${seconds}.${ms}`;
  };

  const chartStartTimestamp = formatFullKibanaTime(new Date(data[0].key_as_string));
  const chartEndTimestamp = formatFullKibanaTime(
    new Date(new Date(data[data.length - 1].key_as_string).getTime() + stepDelta)
  );

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const getEndWindowTime = (isoString: string) => {
    return new Date(new Date(isoString).getTime() + stepDelta).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  const formatYAxisNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1).replace(/\.0$/, "")}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
    return String(num);
  };

  /* -------------------------------------------------------------------------- */
  /*                        BRUSH SELECTION LOGIC                               */
  /* -------------------------------------------------------------------------- */

  const getIndexFromX = (clientX: number): number => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentX = Math.max(0, Math.min(1, relativeX / rect.width));
    const rawIdx = Math.floor(percentX * data.length);
    return Math.min(rawIdx, data.length - 1);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Allow left click only
    const idx = getIndexFromX(e.clientX);
    setIsDragging(true);
    setDragStartIdx(idx);
    setDragCurrentIdx(idx);
    setActiveBucket(data[idx]);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const idx = getIndexFromX(e.clientX);
      setDragCurrentIdx(idx);
      setActiveBucket(data[idx]);
    };

    const handleMouseUp = () => {
      if (dragStartIdx !== null && dragCurrentIdx !== null) {
        const minIdx = Math.min(dragStartIdx, dragCurrentIdx);
        const maxIdx = Math.max(dragStartIdx, dragCurrentIdx);

        const fromDate = new Date(data[minIdx].key_as_string);
        const toDate = new Date(new Date(data[maxIdx].key_as_string).getTime() + stepDelta);

        if (fromDate.getTime() !== toDate.getTime()) {
          setDateRange({ from: fromDate, to: toDate });
        }
      }
      setIsDragging(false);
      setDragStartIdx(null);
      setDragCurrentIdx(null);
      setActiveBucket(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStartIdx, dragCurrentIdx, data, stepDelta]);

  const selectionOverlayStyle = (() => {
    if (dragStartIdx === null || dragCurrentIdx === null) return null;
    const minIdx = Math.min(dragStartIdx, dragCurrentIdx);
    const maxIdx = Math.max(dragStartIdx, dragCurrentIdx);

    const leftPercent = (minIdx / data.length) * 100;
    const widthPercent = ((maxIdx - minIdx + 1) / data.length) * 100;

    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`,
    };
  })();

  const renderContextReadout = () => {
    if (dragStartIdx !== null && dragCurrentIdx !== null && dragStartIdx !== dragCurrentIdx) {
      const minIdx = Math.min(dragStartIdx, dragCurrentIdx);
      const maxIdx = Math.max(dragStartIdx, dragCurrentIdx);
      const activeWindowMs = (maxIdx - minIdx + 1) * stepDelta;

      const sec = Math.floor(activeWindowMs / 1000);
      const min = Math.floor(sec / 60);
      const selectionLabel = min > 0 ? `${min}m` : `${sec}s`;

      return (
        <div className="flex items-center gap-2 text-xs bg-[#00bfb3] text-white px-2.5 py-1 rounded-md shadow-xs font-medium animate-in fade-in duration-700">
          <span className="font-mono">
            Selection: {formatTime(data[minIdx].key_as_string)} → {getEndWindowTime(data[maxIdx].key_as_string)}
          </span>
          <span className="text-[10px] bg-black/20 text-white px-1.5 py-0.5 rounded font-mono">
            {selectionLabel} selected
          </span>
        </div>
      );
    }

    if (activeBucket) {
      return (
        <div className="flex items-center gap-2 text-xs bg-slate-900 text-slate-100 px-2.5 py-1 rounded-md shadow-xs animate-in fade-in duration-100">
          <span className="text-slate-400 font-mono">
            {formatTime(activeBucket.key_as_string)} → {getEndWindowTime(activeBucket.key_as_string)}
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono font-normal">
            {intervalLabel} bucket
          </span>
          <div className="w-px h-3 bg-slate-700" />
          <span className="font-bold text-[#00bfb3] font-mono">
            {activeBucket.doc_count.toLocaleString()} hits
          </span>
        </div>
      );
    }

    return (
      <span className="text-[11px] text-slate-400 italic">
        Click and drag across timeline chart to zoom into range
      </span>
    );
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-2 shadow-sm flex flex-col gap-1 select-none">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <Info className="h-3.5 w-3.5 text-slate-400" />
          <span>Interval Volume Analysis</span>
          <span className="mx-1 text-slate-300">•</span>
          <span className="font-semibold text-slate-700 font-mono">
            {totalPeriodHits.toLocaleString()} total snapshot events
          </span>
        </div>

        <div className="h-6 flex items-center">
          {renderContextReadout()}
        </div>
      </div>

      {/* Main Grid Wrapper */}
      <div className="flex gap-3 w-full items-stretch">

        {/* Left Volume Y-Axis Panel */}
        <div className="flex flex-col justify-between items-end font-mono text-[10px] font-medium text-slate-400 text-right select-none w-12 pb-[2px] pt-[2px] shrink-0 border-r border-slate-100 pr-2.5">
          <span>{formatYAxisNumber(maxDocCount)}</span>
          <span>{formatYAxisNumber(Math.floor(maxDocCount / 2))}</span>
          <span>0</span>
        </div>

        {/* Chart Canvas Viewport (Height reduced from h-36 to h-24) */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          className="relative flex-1 h-24 flex flex-col justify-end cursor-crosshair group select-none"
        >
          {/* Background Horizontal Gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="w-full border-t border-slate-100" />
            <div className="w-full border-t border-slate-100" />
            <div className="w-full border-t border-slate-300" />
          </div>

          {/* Selection Mask Box Overlay */}
          {selectionOverlayStyle && (
            <div
              style={selectionOverlayStyle}
              className="absolute top-0 bottom-0 bg-[#00bfb3]/15 border-x-2 border-[#00bfb3] pointer-events-none z-20"
            />
          )}

          {/* Bars Wrapper */}
          <div className="flex items-end gap-0.75 sm:gap-1 w-full h-full relative z-10">
            {data.map((bucket, idx) => {
              const percentage = maxDocCount > 0 ? (bucket.doc_count / maxDocCount) * 100 : 0;
              const isHovered = activeBucket?.key_as_string === bucket.key_as_string;
              const staggerDelay = `${Math.min(idx * 15, 150)}ms`;

              const isHighlightedInDrag = dragStartIdx !== null && dragCurrentIdx !== null && (
                idx >= Math.min(dragStartIdx, dragCurrentIdx) && idx <= Math.max(dragStartIdx, dragCurrentIdx)
              );

              return (
                <div
                  key={bucket.key || idx}
                  onMouseEnter={() => !isDragging && setActiveBucket(bucket)}
                  onMouseLeave={() => !isDragging && setActiveBucket(null)}
                  className="flex-1 h-full flex items-end"
                >
                  <div
                    style={{
                      height: isVisible ? `${Math.max(percentage, 4)}%` : "0%",
                      transitionDelay: isVisible ? staggerDelay : "0ms"
                    }}
                    className={`w-full rounded-t-sm origin-bottom transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
                      bucket.doc_count > 0
                        ? isHighlightedInDrag || isHovered
                          ? "bg-[#009b91] scale-x-105 shadow-xs"
                          : "bg-[#00bfb3]/85"
                        : isHighlightedInDrag || isHovered
                          ? "bg-slate-400"
                          : "bg-slate-200/50"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Axis Labels Timeline Footer */}
      <div className="flex justify-between w-full pl-16 pr-1 font-mono text-[10px] text-slate-400 font-medium tracking-tight select-none border-b border-slate-100 pb-1.5">
        <div className="flex flex-col">
          <span>{new Date(data[0].key_as_string).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <div className="flex-col items-center sm:flex">
          <span>{new Date(data[Math.floor(data.length / 2)].key_as_string).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <div className="flex flex-col items-end">
          <span>{new Date(data[data.length - 1].key_as_string).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>

      {/* Kibana Absolute Range & Interval Legend Summary */}
      <div className="text-center w-full font-mono text-[11px] text-slate-500 font-medium tracking-tight select-none pt-0.5">
        <span className="text-slate-700">{chartStartTimestamp}</span>
        <span className="mx-2 text-slate-300">—</span>
        <span className="text-slate-700">{chartEndTimestamp}</span>
        <span className="mx-2 text-slate-400">(interval: Auto - {intervalLabel})</span>
      </div>

    </div>
  );
}