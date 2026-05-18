import React, { useState, useMemo, useCallback } from "react";
import { useQueryBuilder } from "../context/QueryBuilderContext";
import { BoolGroup } from "./BoolGroup";
import { buildDsl } from "../utils/dslBuilder";
import QuerySyntaxPreview from "./QuerySyntaxPreview";
import { ChartArea, Code2Icon } from "lucide-react";

interface QueryBuilderContentProps {
    onClose?: () => void;
}

export default function QueryBuilderContent({ onClose }: QueryBuilderContentProps): React.JSX.Element {
    const { state, actions } = useQueryBuilder();
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    const dsl = useMemo(() => buildDsl(state, state.rootId), [state]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(JSON.stringify(dsl, null, 2))
            .then(() => {
                setCopied(true);

                if (onClose) onClose();

                const timer = setTimeout(() => setCopied(false), 1500);
                return () => clearTimeout(timer);
            })
            .catch((err) => console.error("Could not copy syntax payload:", err));
    }, [dsl, onClose]);

    const togglePreviewMode = useCallback(() => {
        setShowPreview((prev) => !prev);
    }, []);

    return (
        <div className="w-full max-w-5xl border border-slate-200 bg-white p-2 shadow-lg transition-all rounded-xl">
            <div className="mb-1 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800">Filters</h3>
                <button
                    type="button"
                    onClick={togglePreviewMode}
                    className="flex h-8 w-8 items-center justify-center transition-colors rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300"
                    title={showPreview ? "Show builder" : "Show query preview"}
                >
                    {showPreview ? <ChartArea className="w-5 h-5" /> : <Code2Icon className="w-5 h-5" />}
                </button>
            </div>

            {!showPreview ? (
                <>
                    <div className="max-h-[50vh] overflow-y-auto overflow-x-auto pb-2 pr-1 scrollbar-thin">
                        <div className="min-w-150 w-full">
                            <BoolGroup id={state.rootId} isRoot />
                        </div>
                    </div>

                    <div className=" flex justify-end border-slate-100">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={actions.resetTree}
                                className="bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 active:bg-slate-300 transition-colors rounded-lg"
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-colors rounded-lg"
                            >
                                {copied ? "Added!" : "Add Filter"}
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <QuerySyntaxPreview
                    dsl={dsl}
                    copied={copied}
                    onCopy={handleCopy}
                />
            )}
        </div>
    );
}