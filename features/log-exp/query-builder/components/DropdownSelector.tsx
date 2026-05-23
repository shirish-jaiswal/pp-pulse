import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export interface DropdownItem {
    value: string;
    label: string;
}

interface DropdownSelectorProps {
    selectedValue: string;
    options: readonly DropdownItem[] | DropdownItem[];
    onSelect: (value: string) => void;
    placeholder?: string;
    minWidth?: number;
    className?: string;
    disabled?: boolean;
    name?: string;
}

export const DropdownSelector: React.FC<DropdownSelectorProps> = ({
    selectedValue,
    options,
    onSelect,
    placeholder = "Select...",
    minWidth = 176,
    className,
    disabled = false,
    name,
}) => {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const [activeIndex, setActiveIndex] = useState(-1);

    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listboxRef = useRef<HTMLDivElement>(null);

    const uniqueId = useMemo(() => name || `dropdown-${Math.random().toString(36).substr(2, 9)}`, [name]);

    const activeLabel = useMemo(() => {
        return options.find((opt) => opt.value === selectedValue)?.label || placeholder;
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
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();

        const dropdownHeight = 200;
        const spaceBelow = window.innerHeight - rect.bottom;
        const shouldRenderAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

        setCoords({
            top: shouldRenderAbove ? rect.top - 4 : rect.bottom + 4,
            left: rect.left,
            width: Math.max(rect.width, minWidth),
        });
    }, [minWidth]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setSearch("");
        setActiveIndex(-1);
        triggerRef.current?.focus();
    }, []);

    const handleItemClick = useCallback((value: string) => {
        onSelect(value);
        handleClose();
    }, [onSelect, handleClose]);

    useEffect(() => {
        if (!isOpen) return;

        updateDropdownPosition();

        function handleOutsideInteraction(event: MouseEvent) {
            const target = event.target as Node;
            if (!triggerRef.current?.contains(target) && !dropdownRef.current?.contains(target)) {
                handleClose();
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
    }, [isOpen, updateDropdownPosition, handleClose]);

    // Manage scroll tracking inside the layout listbox container
    useEffect(() => {
        if (activeIndex >= 0 && listboxRef.current) {
            const activeEl = listboxRef.current.children[activeIndex] as HTMLElement;
            if (activeEl) {
                activeEl.scrollIntoView({ block: "nearest" });
            }
        }
    }, [activeIndex]);

    // Robust Keyboard Navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;

        if (!isOpen) {
            if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsOpen(true);
                return;
            }
        }

        switch (e.key) {
            case "Escape":
                e.preventDefault();
                handleClose();
                break;
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
                break;
            case "Enter":
                e.preventDefault();
                if (activeIndex >= 0 && filteredOptions[activeIndex]) {
                    handleItemClick(filteredOptions[activeIndex].value);
                } else if (filteredOptions.length > 0) {
                    // Fallback to select first element if searching and pressing enter
                    handleItemClick(filteredOptions[0].value);
                }
                break;
            case "Tab":
                // Let natural tab order step out of the element smoothly
                setIsOpen(false);
                break;
            default:
                break;
        }
    };

    return (
        <div className="relative w-full">
            <button
                ref={triggerRef}
                id={`${uniqueId}-button`}
                type="button"
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={`${uniqueId}-listbox`}
                onClick={() => {
                    if (disabled) return;
                    setIsOpen((prev) => !prev);
                    setSearch("");
                }}
                onKeyDown={handleKeyDown}
                className={cn(
                    "flex h-9 w-full items-center justify-between rounded border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-700 shadow-sm outline-none transition-colors",
                    "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                    disabled && "cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200 shadow-none",
                    className
                )}
            >
                <span className="truncate">{activeLabel}</span>
                <span className="text-xs text-slate-400 ml-2" aria-hidden="true">▼</span>
            </button>

            {isOpen &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        style={{
                            position: "fixed",
                            top: `${coords.top}px`,
                            left: `${coords.left}px`,
                            width: `${coords.width}px`,
                            transform: coords.top < (triggerRef.current?.getBoundingClientRect().top ?? 0) ? "translateY(-100%)" : "none"
                        }}
                        className="z-[99999] rounded border border-slate-200 bg-white p-1 shadow-xl ring-1 ring-slate-300 ring-opacity-5"
                        onKeyDown={handleKeyDown}
                    >
                        <input
                            type="text"
                            autoFocus
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setActiveIndex(-1); // reset active index on search mutation
                            }}
                            placeholder="Search filters..."
                            className="mb-1 w-full rounded border border-slate-100 bg-slate-50 px-1.5 py-1 text-sm outline-none focus:bg-white focus:border-blue-500"
                            role="combobox"
                            aria-autocomplete="list"
                            aria-expanded="true"
                            aria-controls={`${uniqueId}-listbox`}
                        />
                        <div
                            ref={listboxRef}
                            id={`${uniqueId}-listbox`}
                            role="listbox"
                            aria-label={placeholder}
                            className="max-h-36 overflow-y-auto scrollbar-thin"
                        >
                            {filteredOptions.length === 0 ? (
                                <div className="px-1.5 py-2 text-xs text-slate-400" role="option" aria-selected="false">
                                    No matching results
                                </div>
                            ) : (
                                filteredOptions.map((opt, index) => {
                                    const isSelected = selectedValue === opt.value;
                                    const isActive = index === activeIndex;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            role="option"
                                            aria-selected={isSelected}
                                            onClick={() => handleItemClick(opt.value)}
                                            className={cn(
                                                "w-full rounded px-1.5 py-1.5 text-left text-sm transition-colors block outline-none",
                                                isSelected
                                                    ? "bg-blue-600 font-semibold text-white"
                                                    : isActive
                                                    ? "bg-slate-100 text-slate-900"
                                                    : "text-slate-700 hover:bg-slate-50"
                                            )}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};