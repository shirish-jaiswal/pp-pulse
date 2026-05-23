import React, {
    useMemo,
    useEffect,
    useRef,
    useState,
    useCallback,
} from "react";
import { X, Search, FileText, Sparkles, Layers } from "lucide-react";

import { QUERIES_TEMPLATE_TYPE } from "@/lib/excel-engine/kibana/queries/get-all";

interface SmartSearchTemplatesDropdownProps {
    targetGameType: string;
    filteredTemplates: QUERIES_TEMPLATE_TYPE[] | undefined;
    onSelectTemplate: (template: QUERIES_TEMPLATE_TYPE) => void;
    onClose: () => void;
}

export const SmartSearchTemplatesDropdown: React.FC<
    SmartSearchTemplatesDropdownProps
> = ({
    targetGameType,
    filteredTemplates,
    onSelectTemplate,
    onClose,
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [search, setSearch] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);

    // Track whether the last selection update came from the keyboard to avoid mouse hover fights
    const isKeyboardMovingRef = useRef(false);

    /**
     * Search filtering
     */
    const templates = useMemo(() => {
        if (!filteredTemplates?.length) return [];

        const normalized = search.toLowerCase();

        return filteredTemplates.filter((template) => {
            const name = template.name?.toLowerCase() || "";
            const query = template.query?.toLowerCase() || "";

            return (
                name.includes(normalized) ||
                query.includes(normalized)
            );
        });
    }, [filteredTemplates, search]);

    /**
     * Automatically scroll active items into view
     */
    useEffect(() => {
        if (!scrollContainerRef.current) return;

        // Find the active element inside our scrolling container
        const activeEl = scrollContainerRef.current.querySelector(
            '[aria-selected="true"]'
        ) as HTMLElement;

        if (activeEl) {
            activeEl.scrollIntoView({
                block: "nearest",
                behavior: "smooth",
            });
        }
    }, [activeIndex]);

    /**
     * Close on outside click
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            if (!dropdownRef.current) return;
            if (dropdownRef.current.contains(target)) return;
            if (target.closest('button[aria-label*="query templates"]')) return;

            onClose();
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    /**
     * ESC close + keyboard navigation
     */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!templates.length) return;

            switch (e.key) {
                case "Escape":
                    onClose();
                    break;

                case "ArrowDown":
                    e.preventDefault();
                    isKeyboardMovingRef.current = true;
                    setActiveIndex((prev) =>
                        prev === templates.length - 1 ? 0 : prev + 1
                    );
                    break;

                case "ArrowUp":
                    e.preventDefault();
                    isKeyboardMovingRef.current = true;
                    setActiveIndex((prev) =>
                        prev === 0 ? templates.length - 1 : prev - 1
                    );
                    break;

                case "Enter":
                    e.preventDefault();
                    if (templates[activeIndex]) {
                        onSelectTemplate(templates[activeIndex]);
                    }
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [templates, activeIndex, onClose, onSelectTemplate]);

    /**
     * Reset active item on filter change
     */
    useEffect(() => {
        setActiveIndex(0);
    }, [search]);

    const handleSelect = useCallback(
        (template: QUERIES_TEMPLATE_TYPE) => {
            onSelectTemplate(template);
        },
        [onSelectTemplate]
    );

    if (!filteredTemplates?.length) return null;

    return (
        <div
            ref={dropdownRef}
            className="
                absolute left-0 right-0 top-full z-50 mt-2
                animate-in fade-in slide-in-from-top-2 duration-150
            "
        >
            <div
                className="
                    overflow-hidden rounded-2xl border border-slate-200
                    bg-white shadow-2xl backdrop-blur
                "
            >
                {/* HEADER */}
                <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 backdrop-blur">
                    <div className="flex items-start justify-between gap-4 p-4 pb-3">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-violet-500" />
                                <h3 className="text-sm font-semibold text-slate-800">
                                    Query Templates
                                </h3>
                                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500 font-mono">
                                    <Layers className="h-3 w-3" />
                                    {templates.length} available
                                </span>
                            </div>

                            <p className="mt-1 text-xs text-slate-500">
                                Templates resolved for{" "}
                                <span className="font-medium text-slate-700">
                                    {targetGameType}
                                </span>
                            </p>
                        </div>

                        <button
                            type="button"
                            aria-label="Close templates panel"
                            onClick={onClose}
                            className="
                                rounded-lg p-1.5 text-slate-400
                                transition hover:bg-slate-100 hover:text-slate-700
                            "
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* SEARCH */}
                    <div className="px-4 pb-4">
                        <div
                            className="
                                flex items-center gap-2 rounded-xl
                                border border-slate-200 bg-slate-50
                                px-3 py-2
                                focus-within:border-violet-300
                                focus-within:bg-white
                                focus-within:ring-4
                                focus-within:ring-violet-100
                            "
                        >
                            <Search className="h-4 w-4 text-slate-400" />
                            <input
                                autoFocus
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search templates by name or query..."
                                className="
                                    w-full bg-transparent text-sm
                                    text-slate-700 outline-none
                                    placeholder:text-slate-400
                                "
                            />
                        </div>
                    </div>
                </div>

                {/* CONTENT CONTAINER WITH ATTACHED REF */}
                <div
                    ref={scrollContainerRef}
                    role="listbox"
                    aria-label="Available query templates"
                    onMouseMove={() => {
                        // Allow mouse selections to matter only if the user is actively shifting the mouse
                        isKeyboardMovingRef.current = false;
                    }}
                    className="max-h-[40vh] overflow-y-auto p-4"
                >
                    {!templates.length ? (
                        <div className="flex flex-col items-center justify-center py-14 text-center">
                            <FileText className="mb-3 h-8 w-8 text-slate-300" />
                            <p className="text-sm font-medium text-slate-600">
                                No templates found
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Try a different search keyword
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {templates.map((template, idx) => {
                                const label = template.name || `Template #${idx + 1}`;
                                const query = template.query || "";
                                const active = idx === activeIndex;

                                return (
                                    <button
                                        key={template.id ?? idx}
                                        type="button"
                                        role="option"
                                        aria-selected={active}
                                        title={query}
                                        onClick={() => handleSelect(template)}
                                        onMouseEnter={() => {
                                            // Only register hover index swaps if the keyboard isn't taking authority
                                            if (!isKeyboardMovingRef.current) {
                                                setActiveIndex(idx);
                                            }
                                        }}
                                        className={`
                                            group flex flex-col justify-between rounded-xl border
                                            p-3.5 text-left transition-all duration-150 h-full
                                            ${
                                                active
                                                    ? "border-violet-400 bg-violet-50/70 shadow-sm ring-1 ring-violet-400"
                                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                            }
                                        `}
                                    >
                                        <div className="flex items-start gap-3 w-full">
                                            <div
                                                className={`
                                                    mt-0.5 rounded-lg p-2 transition-colors
                                                    ${
                                                        active
                                                            ? "bg-violet-100 text-violet-700"
                                                            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                                                    }
                                                `}
                                            >
                                                <FileText className="h-4 w-4" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="truncate text-sm font-semibold text-slate-800">
                                                        {label}
                                                    </p>
                                                    {active && (
                                                        <span className="shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-700">
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1.5 line-clamp-3 font-mono text-xs text-slate-500 leading-relaxed break-all">
                                                    {query}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-2.5 text-[11px] text-slate-500 flex justify-between items-center">
                    <span>💡 Applying a template replaces your current workspace</span>
                    <span className="hidden sm:inline font-medium text-slate-400">↑↓ to navigate • Enter to select</span>
                </div>
            </div>
        </div>
    );
};