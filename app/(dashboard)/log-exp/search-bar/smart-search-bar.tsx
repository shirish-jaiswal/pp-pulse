"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { useSmartSearchApi } from "./use-smart-search-api";
import { useSmartSearchEditor } from "./utils/use-smart-search-editor";
import { SearchLoadingIcon } from "./utils/search-loading-icon";
import { GenerateQueryButton } from "./utils/generate-query-button";
import { ClearButton } from "./utils/clear-button";
import { getCurrentGameData } from "./utils/get-current-game-data";
import { useQueriesTemplate } from "./utils/useQueriesTemplate";
import { Eye, EyeClosed } from "lucide-react";
import { useKibanaFormStore } from "./KibanaFormContext";

interface SmartSearchBarProps {
    onSearch: () => void;
    placeholder?: string;
}

export const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
    onSearch,
    placeholder = "Search logs... e.g. @round-game-user timeout",
}) => {
    const cmRef = useRef<ReactCodeMirrorRef>(null);
    const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

    // Consume template states from unified workspace store
    const {
        searchValue: value,
        setSearchValue: onChange,
        gameData,
        setGameData,
        setSelectedTemplate
    } = useKibanaFormStore();

    const {
        hasApiToken,
        isRoundDetailsLoading,
        roundDetails,
        triggerApi,
        resetFetched,
    } = useSmartSearchApi({ value });

    const { extensions, basicSetup, isAutoCompleteLoading } = useSmartSearchEditor({
        onSearch,
        onTriggerApi: triggerApi,
    });

    useEffect(() => {
        if (!roundDetails) {
            setGameData(null);
            return;
        }

        try {
            const data = getCurrentGameData(roundDetails);
            setGameData(data);
        } catch (error) {
            console.error("Failed to parse game data structure:", error);
            setGameData(null);
        }
    }, [roundDetails, setGameData]);

    const targetGameType = gameData?.gameType;
    const { data: filteredTemplates, isLoading: isTemplatesLoading } = useQueriesTemplate(targetGameType);

    useEffect(() => {
        if (!isTemplatesLoading && filteredTemplates && filteredTemplates.length > 0) {
            setIsTemplatesOpen(true);
        }
    }, [isTemplatesLoading, filteredTemplates?.length]);

    const clearInput = useCallback(() => {
        onChange("");
        resetFetched();
        setIsTemplatesOpen(false);
        setGameData(null);
        setSelectedTemplate(null); // Reset the tracked template when clearing workspace search
        cmRef.current?.view?.focus();
    }, [onChange, resetFetched, setGameData, setSelectedTemplate]);

   const handleInjectTemplate = useCallback((templateObj: any) => {
    const rawTemplate = templateObj.query || templateObj.template || "";
    if (!rawTemplate) return;

    let processedTemplate = rawTemplate;

    if (gameData) {
        processedTemplate = rawTemplate.replace(/\{(\w+)\}/g, (match: string, key: string) => {
            if (key in gameData) {
                const replacedValue = gameData[key as keyof typeof gameData];
                return replacedValue ? String(replacedValue).trim() : "";
            }
            return match;
        });
    }

    onChange(processedTemplate.trim());
    setSelectedTemplate(templateObj);
    setIsTemplatesOpen(false);

    setTimeout(() => {
        if (cmRef.current?.view) {
            const view = cmRef.current.view;
            view.focus();
            view.dispatch({
                selection: { anchor: view.state.doc.length, head: view.state.doc.length }
            });
        }
    }, 0);
}, [gameData, onChange, setSelectedTemplate]);

    const isLoading = isAutoCompleteLoading || isRoundDetailsLoading || isTemplatesLoading;

    return (
        <div className="relative w-full space-y-2.5">
            <div className="relative flex items-center gap-2 min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-0 shadow-sm transition-all duration-200 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 focus-within:shadow-md">
                <SearchLoadingIcon isLoading={isLoading} />

                <div className="flex-1 min-w-0">
                    <CodeMirror
                        ref={cmRef}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        extensions={extensions}
                        basicSetup={basicSetup}
                    />
                </div>

                <div className="flex items-center gap-1.5 shrink-0 select-none">
                    {gameData && filteredTemplates && filteredTemplates.length > 0 && (
                        <button
                            type="button"
                            title={isTemplatesOpen ? "Hide queries templates" : "Show queries templates"}
                            onClick={() => setIsTemplatesOpen(!isTemplatesOpen)}
                            className={`p-1.5 rounded-lg transition duration-150 cursor-pointer flex items-center justify-center ${
                                isTemplatesOpen ? "text-blue-600 hover:bg-blue-50" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            }`}
                        >
                            {isTemplatesOpen ? <EyeClosed className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    )}

                    {hasApiToken && (
                        <GenerateQueryButton isLoading={isRoundDetailsLoading} onClick={triggerApi} />
                    )}

                    {value && <ClearButton onClick={clearInput} />}
                </div>
            </div>

            {gameData && isTemplatesOpen && filteredTemplates && filteredTemplates.length > 0 && (
                <div className="absolute left-0 right-0 z-50 px-0.5 mt-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-2 shadow-lg">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400/90 flex items-center justify-between">
                            <span>Kibana Templates Resolved for "{targetGameType}"</span>
                            <span className="normal-case font-normal italic text-slate-400">
                                Selecting a card config overrides your current workspace
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                            {filteredTemplates.map((template: any, idx: number) => {
                                const templateQuery = template.query || template.template || "";
                                const label = template.name || `Template #${idx + 1}`;

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        title={templateQuery}
                                        onClick={() => handleInjectTemplate(template)} // Passes full template reference
                                        className="bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200/80 text-slate-600 hover:text-slate-800 text-xs px-2.5 py-1.5 rounded-lg transition font-mono max-w-xs truncate shadow-3xs cursor-pointer"
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};