import React, { useState } from "react";
import { useMultiFilters } from "../../context/QueryBuilderContext";
import DynamicFilterPopup from "./DynamicFilterPopup";
import { Eye, EyeOff, ShieldAlert, Trash2, XCircle, Ban } from "lucide-react";
import { stringifyTree } from "../../utils/treeStringifier";
import { QueryState } from "../../types";

// Enhanced to gracefully handle a clean fallback state when parent badge is disabled
function ColorizedFilterText({ text, disabled }: { text: string; disabled?: boolean }) {
    const tokens = text.split(/(\s*is_not\s*|\s*is\s*|\s*&\s*|\s*\|\s*|\(|\)|"[^"]*"|\[[^\]]*\])/g);

    if (disabled) {
        return (
            <span className="font-mono tracking-tight text-xs text-slate-400 select-none">
                {text}
            </span>
        );
    }

    return (
        <span className="font-mono tracking-tight text-xs">
            {tokens.map((token, index) => {
                const trimmed = token.trim();

                if (!trimmed) return token;

                // Logic Conjunctions (&, |)
                if (trimmed === "&" || trimmed === "|") {
                    return <span key={index} className="text-purple-600 font-bold mx-0.5">{trimmed}</span>;
                }
                // Operators (is, is_not)
                if (trimmed === "is") {
                    return <span key={index} className="text-emerald-600 font-semibold">{token}</span>;
                }
                if (trimmed === "is_not") {
                    return <span key={index} className="text-amber-600 font-semibold">{token}</span>;
                }
                // Array brackets or explicit String definitions
                if (trimmed.startsWith('"') || trimmed.startsWith("[")) {
                    return <span key={index} className="text-indigo-600 font-medium">{token}</span>;
                }
                // Structural brackets
                if (trimmed === "(" || trimmed === ")") {
                    return <span key={index} className="text-slate-400 font-light">{trimmed}</span>;
                }

                // Target fields/Keys
                return <span key={index} className="text-slate-700 font-medium">{token}</span>;
            })}
        </span>
    );
}

export function FilterManagerBar() {
    const { filters, updateSavedFilter, deleteFilter } = useMultiFilters();

    const [popupOpen, setPopupOpen] = useState(false);
    const [targetFilterId, setTargetFilterId] = useState<string | null>(null);

    const filterItems = Object.values(filters);
    const hasActiveFilters = filterItems.length > 0;

    // Derived States for Dynamic Button rendering
    const hasEnabledFilters = filterItems.some(f => f.isEnabled);
    const allFiltersDisabled = filterItems.every(f => !f.isEnabled);

    // CRITICAL FIX: If no filters are present, return null immediately to completely hide the component
    if (!hasActiveFilters) {
        return null;
    }

    const openEditingPopup = (id: string) => {
        setTargetFilterId(id);
        setPopupOpen(true);
    };

    // Global Action Handlers
    const handleDisableAll = () => {
        filterItems.forEach((filter) => {
            if (filter.isEnabled) {
                updateSavedFilter(filter.id, { isEnabled: false });
            }
        });
    };

    const handleEnableAll = () => {
        filterItems.forEach((filter) => {
            if (!filter.isEnabled) {
                updateSavedFilter(filter.id, { isEnabled: true });
            }
        });
    };

    const handleRemoveAll = () => {
        filterItems.forEach((filter) => {
            deleteFilter(filter.id);
        });
    };

    const toggleTreeOperators = (state: QueryState): QueryState => {
        const nextNodes = { ...state.nodes };

        Object.keys(nextNodes).forEach((id) => {
            const node = nextNodes[id];
            if (node && node.type === "condition") {
                let updatedOperator = node.operator;
                if (node.operator === "is_one_of") {
                    updatedOperator = "is_not_one_of";
                } else if (node.operator === "is_not_one_of") {
                    updatedOperator = "is_one_of";
                }

                nextNodes[id] = {
                    ...node,
                    operator: updatedOperator
                };
            }
        });

        return { ...state, nodes: nextNodes };
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-slate-50/50 p-1.5 rounded-xl shadow-sm">

            {/* Filter Badges Container */}
            <div className="flex flex-wrap items-center gap-2">
                {filterItems.map((filter) => {
                    const isEditingThisFilter = popupOpen && targetFilterId === filter.id;

                    // Generate compact tracking string state on-the-fly
                    const displayLabel = stringifyTree(filter.state);
                    const isTreeExcluded = displayLabel.includes("is_not");

                    return (
                        <DynamicFilterPopup
                            key={filter.id}
                            open={isEditingThisFilter}
                            onOpenChange={(isOpen) => {
                                setPopupOpen(isOpen);
                                if (!isOpen) setTargetFilterId(null);
                            }}
                            filterIdToEdit={filter.id}
                            triggerElement={
                                <div
                                    className={`flex items-center gap-1.5 border px-2.5 py-1 text-xs rounded-lg transition-all shadow-2xs ${
                                        !filter.isEnabled
                                            ? "bg-slate-100/80 text-slate-400 border-slate-200/80"
                                            : isTreeExcluded
                                                ? "bg-red-50/60 text-red-700 border-red-200 hover:bg-red-50"
                                                : "bg-blue-50/60 text-blue-700 border-blue-200 hover:bg-blue-50"
                                    }`}
                                >
                                    {/* Clickable Expression Definition Text to open dynamic popup */}
                                    <span
                                        onClick={() => filter.isEnabled && openEditingPopup(filter.id)}
                                        className={`pr-1 ${filter.isEnabled ? "cursor-pointer hover:underline" : "cursor-not-allowed"}`}
                                        title={filter.isEnabled ? "Click to Edit definition expression tree" : "Filter is disabled"}
                                    >
                                        <ColorizedFilterText text={displayLabel} disabled={!filter.isEnabled} />
                                    </span>

                                    <div className="flex items-center gap-1 border-l pl-1.5 border-slate-200/60 ml-0.5">
                                        <button
                                            type="button"
                                            disabled={!filter.isEnabled}
                                            title={isTreeExcluded ? "Change to INCLUDE operator" : "Change to EXCLUDE operator"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const updatedState = toggleTreeOperators(filter.state);
                                                updateSavedFilter(filter.id, { state: updatedState });
                                            }}
                                            className={`p-0.5 rounded-sm transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                                                isTreeExcluded ? "hover:bg-red-200 text-red-600" : "hover:bg-blue-100 text-slate-500"
                                            }`}
                                        >
                                            <ShieldAlert className="h-3.5 w-3.5" />
                                        </button>

                                        <button
                                            type="button"
                                            title={filter.isEnabled ? "Disable Filter" : "Enable Filter"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateSavedFilter(filter.id, { isEnabled: !filter.isEnabled });
                                            }}
                                            className="p-0.5 rounded-sm hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                                        >
                                            {filter.isEnabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteFilter(filter.id);
                                            }}
                                            className="p-0.5 rounded-sm hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors ml-0.5 cursor-pointer"
                                            title="Delete filter configuration record"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            }
                        />
                    );
                })}
            </div>

            {/* Global Actions Context-Aware Side */}
            <div className="flex items-center gap-1 border-l pl-2 border-slate-200">
                {allFiltersDisabled ? (
                    <button
                        type="button"
                        onClick={handleEnableAll}
                        title="Enable all hidden filters"
                        className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Enable all</span>
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleDisableAll}
                        disabled={!hasEnabledFilters}
                        title="Disable all active filters"
                        className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                    >
                        <Ban className="h-3.5 w-3.5" />
                        <span>Disable all</span>
                    </button>
                )}

                <button
                    type="button"
                    onClick={handleRemoveAll}
                    title="Remove all filter cards"
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Clear all</span>
                </button>
            </div>

        </div>
    );
}