import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface ConditionTagInputProps {
    values: string[];
    onChange: (nextValues: string[]) => void;
    suggestions: string[];
    datalistId: string; // Retained to protect your parent configuration signature
}

export const ConditionTagInput: React.FC<ConditionTagInputProps> = ({
    values,
    onChange,
    suggestions,
}) => {
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    // Coordinates to position our portal dropdown precisely under the input
    const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0, width: 0 });

    const containerRef = useRef<HTMLDivElement>(null);

    // Dynamic positioning engine for the portal dropdown
    const updateDropdownPosition = useCallback(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setDropdownCoords({
                // window.scrollY handles page scrolling so the dropdown sticks to the input
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    }, []);

    // Track position when opening or when the window resizes/scrolls
    useEffect(() => {
        if (isOpen) {
            updateDropdownPosition();
            window.addEventListener("resize", updateDropdownPosition);
            window.addEventListener("scroll", updateDropdownPosition, { capture: true });
        }
        return () => {
            window.removeEventListener("resize", updateDropdownPosition);
            window.removeEventListener("scroll", updateDropdownPosition, { capture: true });
        };
    }, [isOpen, updateDropdownPosition]);

    // Close the dropdown cleanly if clicking completely outside the component panel
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                // If using a portal, we also check if the click was inside the portal container
                const portalNode = document.getElementById("tag-input-portal-root");
                if (portalNode && portalNode.contains(event.target as Node)) {
                    return; // Don't close if they clicked a suggestion inside the portal
                }
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const appendTags = useCallback((text: string) => {
        const tokens = text
            .split(",")
            .map((v) => v.trim())
            .filter((v) => v !== "");

        if (tokens.length > 0) {
            const mergedUnique = Array.from(new Set([...values, ...tokens]));
            onChange(mergedUnique);
        }
        setInputValue("");
        setIsOpen(false);
        setFocusedIndex(-1);
    }, [values, onChange]);

    const removeTag = useCallback((indexToRemove: number) => {
        onChange(values.filter((_, idx) => idx !== indexToRemove));
    }, [values, onChange]);

    const filteredSuggestions = useMemo(() => {
        const query = inputValue.trim().toLowerCase();
        const unselected = suggestions.filter((s) => !values.includes(s));

        if (!query) return unselected;
        return unselected.filter((s) => s.toLowerCase().includes(query));
    }, [inputValue, suggestions, values]);

    useEffect(() => {
        setFocusedIndex(-1);
    }, [filteredSuggestions.length]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val.endsWith(",")) {
            appendTags(val);
        } else {
            setInputValue(val);
            setIsOpen(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (isOpen && focusedIndex >= 0 && focusedIndex < filteredSuggestions.length) {
                appendTags(filteredSuggestions[focusedIndex]);
            } else if (inputValue.trim()) {
                appendTags(inputValue);
            }
        }

        if (isOpen && filteredSuggestions.length > 0) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setFocusedIndex((prev) => (prev + 1) % filteredSuggestions.length);
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setFocusedIndex((prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
            }
        }

        if (e.key === "Backspace" && inputValue === "" && values.length > 0) {
            removeTag(values.length - 1);
        }
        if (e.key === "Escape") {
            setIsOpen(false);
            setFocusedIndex(-1);
        }
    };

    return (
        <div ref={containerRef} className="relative flex-1 min-w-50">
            {/* Tag input container wrapper panel */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 focus-within:border-blue-500 min-h-[32px]">
                {values.map((val, index) => (
                    <span
                        key={`${val}-${index}`}
                        className="flex items-center gap-1 rounded bg-slate-100 pl-2 pr-1 py-0.5 text-sm font-medium text-slate-600"
                    >
                        <span className="max-w-30 truncate">{val}</span>
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 focus:outline-none"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </span>
                ))}

                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => {
                        setTimeout(() => {
                            if (inputValue.trim() && containerRef.current && !containerRef.current.contains(document.activeElement)) {
                                appendTags(inputValue);
                            }
                        }, 180);
                    }}
                    placeholder={values.length === 0 ? "e.g. error, 500" : ""}
                    className="min-w-15 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
            </div>

            {/* Custom Dropdown Layer Rendered via React Portal */}
            {isOpen && filteredSuggestions.length > 0 && typeof window !== "undefined" &&
                createPortal(
                    <div
                        id="tag-input-portal-root"
                        style={{
                            position: "absolute",
                            top: `${dropdownCoords.top}px`,
                            left: `${dropdownCoords.left}px`,
                            width: `${dropdownCoords.width}px`,
                        }}
                        className="z-[9999] mt-1 max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg animate-in fade-in slide-in-from-top-1 duration-100"
                    >
                        {filteredSuggestions.map((suggestionValue, index) => (
                            <button
                                key={suggestionValue}
                                type="button"
                                onClick={() => appendTags(suggestionValue)}
                                className={`flex w-full items-center px-3 py-1.5 text-left text-sm transition-colors ${
                                    index === focusedIndex
                                        ? "bg-slate-100 text-slate-900 font-medium"
                                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                            >
                                <span className="truncate">{suggestionValue}</span>
                            </button>
                        ))}
                    </div>,
                    document.body
                )
            }
        </div>
    );
};