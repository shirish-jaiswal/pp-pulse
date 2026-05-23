import React, { useState, useCallback, useMemo } from "react";
import { useQueryBuilder } from "../context/QueryBuilderContext";
import { useMultiFilters } from "../context/QueryBuilderContext";
import { BoolGroup } from "./BoolGroup";
import QuerySyntaxPreview from "./QuerySyntaxPreview";
import { buildDsl } from "../utils/dslBuilder";

interface QueryBuilderContentProps {
    onClose: () => void;
    filterIdToEdit?: string | null;
}

export default function QueryBuilderContent({ onClose, filterIdToEdit }: QueryBuilderContentProps): React.JSX.Element {
    const { state, actions } = useQueryBuilder();
    const { saveFilter, updateSavedFilter, filters } = useMultiFilters();

    // State to toggle the Kibana-style DSL code preview window
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    const existingFilter = filterIdToEdit ? filters[filterIdToEdit] : null;

    // Compile state tree dynamically whenever configuration elements mutate
    const dslOutput = useMemo(() => {
        if (!state || !state.rootId) return {};
        const compiledTree = buildDsl(state, state.rootId);
        return compiledTree ? { query: compiledTree } : {};
    }, [state]);

    const handleConfirmSave = useCallback(() => {
        if (existingFilter) {
            updateSavedFilter(existingFilter.id, {
                state: state
            });
        } else {
            saveFilter("", state);
        }
        onClose();
    }, [state, existingFilter, saveFilter, updateSavedFilter, onClose]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(JSON.stringify(dslOutput, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [dslOutput]);

    return (
        /* Dynamic container width: widens to max-w-7xl when displaying the code inspector */
        <div className={`w-full transition-all duration-300 border border-slate-200 bg-white p-4 shadow-xl rounded-xl ${
            showPreview ? "max-w-8xl" : "max-w-5xl"
        }`}>

            {/* Dynamic Grid Layout */}
            <div className={`grid grid-cols-1 gap-4 transition-all ${
                showPreview ? "md:grid-cols-5" : "md:grid-cols-1"
            }`}>

                {/* Left Side: Rule Builder Tree Canvas */}
                <div className={`transition-all ${showPreview ? "md:col-span-3 border-r border-slate-100 pr-4" : "w-full"}`}>
                    <div className="max-h-[45vh] overflow-y-auto pb-2 pr-1 pt-1">
                        <BoolGroup id={state.rootId} isRoot />
                    </div>
                </div>

                {/* Right Side: Conditional Code Sandbox (Kibana DSL Panel) */}
                {showPreview && (
                    <div className="md:col-span-2 flex flex-col h-[45vh] bg-slate-950 rounded-xl p-3 animate-in fade-in slide-in-from-right-4 duration-200">
                        <QuerySyntaxPreview
                            dsl={dslOutput}
                            copied={copied}
                            onCopy={handleCopy}
                        />
                    </div>
                )}
            </div>

            {/* Bottom Actions Bar Area */}
            <div className="flex justify-between items-center gap-2 mt-4 border-t pt-3">

                {/* Left aligned: Inspector Toggle Switch */}
                <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                        showPreview
                            ? "bg-slate-900 border-slate-900 text-white hover:bg-slate-800"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
                    }`}
                >
                    <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded text-inherit tracking-tight font-mono">{"{}"}</code>
                    {showPreview ? "Hide DSL Query" : "Show DSL Query"}
                </button>

                {/* Right aligned: Command Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={actions.resetTree}
                        className="bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Clear Slate
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirmSave}
                        className="bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm rounded-lg transition-colors"
                    >
                        {existingFilter ? "Save Changes" : "Create Filter"}
                    </button>
                </div>
            </div>
        </div>
    );
}