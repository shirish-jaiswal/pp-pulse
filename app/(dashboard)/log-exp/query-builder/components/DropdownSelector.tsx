import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility helper to safely merge Tailwind classes
const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

interface DropdownItem {
    value: string;
    label: string;
}

interface DropdownSelectorProps {
    selectedValue: string;
    options: readonly DropdownItem[] | DropdownItem[];
    onSelect: (value: string) => void;
    placeholder?: string;
    minWidth?: number;
    className?: string; // <-- Added className prop
}

export const DropdownSelector: React.FC<DropdownSelectorProps> = ({
    selectedValue,
    options,
    onSelect,
    placeholder = "Select...",
    minWidth = 176,
    className, // <-- Destructured here
}) => {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeLabel = useMemo(() => {
        return options.find((opt) => opt.value === selectedValue)?.label || selectedValue || placeholder;
    }, [selectedValue, options, placeholder]);

    const filteredOptions = useMemo(() => {
        const query = search.toLowerCase().trim();
        if (!query) return options;
        return options.filter(
            (opt) =>
                opt.label.toLowerCase().includes(query) || opt.value.toLowerCase().includes(query)
        );
    }, [search, options]);

    const updateDropdownPosition = useCallback(() => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
                width: Math.max(rect.width * 1.5, minWidth),
            });
        }
    }, [minWidth]);

    useEffect(() => {
        if (!isOpen) return;

        updateDropdownPosition();

        function handleOutsideInteraction(event: MouseEvent) {
            const target = event.target as Node;
            const clickedTrigger = triggerRef.current?.contains(target);
            const clickedDropdown = dropdownRef.current?.contains(target);

            if (!clickedTrigger && !clickedDropdown) {
                setIsOpen(false);
            }
        }

        window.addEventListener("resize", updateDropdownPosition);
        window.addEventListener("scroll", updateDropdownPosition, { capture: true });
        document.addEventListener("mousedown", handleOutsideInteraction);

        return () => {
            window.removeEventListener("resize", updateDropdownPosition);
            window.removeEventListener("scroll", updateDropdownPosition, { capture: true });
            document.removeEventListener("mousedown", handleOutsideInteraction);
        };
    }, [isOpen, updateDropdownPosition]);

    const handleItemClick = useCallback((value: string) => {
        onSelect(value);
        setIsOpen(false);
    }, [onSelect]);

    return (
        <div className="relative w-full">
            <button
                ref={triggerRef}
                type="button"
                onClick={() => {
                    setIsOpen((prev) => !prev);
                    setSearch("");
                }}
                className={cn(
                    "flex h-9 w-full items-center justify-between rounded border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-700 shadow-sm outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                    className
                )}
            >
                <span className="truncate">{isOpen ? (search || "Type...") : activeLabel}</span>
                <span className="text-xs text-slate-400 ml-2">▼</span>
            </button>

            {isOpen &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        style={{
                            position: "absolute",
                            top: `${coords.top}px`,
                            left: `${coords.left}px`,
                            width: `${coords.width}px`,
                        }}
                        className="z-[99999] rounded border border-slate-200 bg-white p-1 shadow-xl ring-1 ring-slate-300 ring-opacity-5"
                    >
                        <input
                            type="text"
                            autoFocus
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search filters..."
                            className="mb-1 w-full rounded border border-slate-100 bg-slate-50 px-1.5 py-0.5 text-sm outline-none focus:bg-white focus:border-blue-500"
                        />
                        <div className="max-h-36 overflow-y-auto scrollbar-thin">
                            {filteredOptions.length === 0 ? (
                                <div className="px-1.5 py-1 text-[11px] text-slate-400">No matching results</div>
                            ) : (
                                filteredOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleItemClick(opt.value)}
                                        className={cn(
                                            "w-full rounded px-1.5 py-1 text-left text-sm transition-colors",
                                            selectedValue === opt.value
                                                ? "bg-blue-500 font-semibold text-white"
                                                : "text-slate-700 hover:bg-slate-100"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};