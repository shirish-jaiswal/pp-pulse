"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { Eye, EyeClosed, Loader2 } from "lucide-react";

import { useLoadRoundDetails } from "../hooks/use-load-round-details";
import { useSearchEditorConfig } from "../hooks/use-search-editor-config";
import { SearchLoadingIcon } from "./search-loading-icon";
import { ClearInputFieldButton } from "./clear-input-field";
import { mapRoundToGameData } from "../utils/map-round-to-game-data";

import { useKibanaFormStore } from "../../context/kibana-form-context";
import { useTemplateProcessor } from "../hooks/use-template-processor";
import { SmartSearchTemplatesDropdown } from "./smart-search-templates-dropdown";
import { FetchDataAndLoadTemplates } from "./fetch-data-n-load-templates";
import { useFilteredQueriesTemplates } from "../hooks/use-filtered-queries-templates";

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
    const isGeneratingRef = useRef(false);

    // 1. Extract values from global store
    const {
        searchValue: globalValue,
        setSearchValue: setGlobalValue,
        gameData,
        setGameData,
        setSelectedTemplate,
        setTimeRange,
        setDateRange,
    } = useKibanaFormStore();

    // 2. Local state for zero-latency typewriter responsiveness
    const [localValue, setLocalValue] = useState(globalValue);

    // Keep state aligned when external components change the code string values
    useEffect(() => {
        setLocalValue(globalValue);
    }, [globalValue]);

    // 3. Debounce handler updates back out to global store
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localValue !== globalValue) {
                setGlobalValue(localValue);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [localValue, globalValue, setGlobalValue]);

    // 4. Pass the global stable value downstream
    const {
        isRoundDetailsLoading,
        roundDetails,
        triggerApi,
        resetFetched,
    } = useLoadRoundDetails({ value: globalValue });

    const {
        extensions,
        basicSetup,
        isAutoCompleteLoading,
    } = useSearchEditorConfig({ onSearch, onTriggerApi: triggerApi });

    // Captures the active snapshot layout rather than waiting for global state sync
    const handleGenerate = useCallback(() => {
        isGeneratingRef.current = true;
console.log("Triggering API with value:", localValue);
        triggerApi(localValue);
    }, [localValue, triggerApi]);

    useEffect(() => {
        if (!roundDetails) {
            setGameData(null);
            return;
        }

        try {
            const data = mapRoundToGameData(roundDetails);
            setGameData(data);
            setDateRange({
                from: data.game_started_at,
                to: data.game_ended_at,
            });
            setTimeRange({
                from: data.game_started_at,
                to: data.game_ended_at,
            });
        } catch (error) {
            setGameData(null);
            isGeneratingRef.current = false;
        }
    }, [roundDetails, setGameData, setDateRange, setTimeRange]);

    const derivedGameData = roundDetails ? mapRoundToGameData(roundDetails) : null;
    const targetGameType = gameData?.game_type || derivedGameData?.game_type || "";
    const { data: filteredTemplates, isLoading: isTemplatesLoading } = useFilteredQueriesTemplates(targetGameType);

    useEffect(() => {
        if (isGeneratingRef.current && !isTemplatesLoading && filteredTemplates) {
            if (filteredTemplates.length > 0) {
                setIsTemplatesOpen(true);
            }
            isGeneratingRef.current = false;
        }
    }, [isTemplatesLoading, filteredTemplates]);

    const handleInjectTemplate = useTemplateProcessor({
        gameData: gameData || derivedGameData,
        onChange: setGlobalValue,
        setSelectedTemplate,
        setIsTemplatesOpen,
        cmRef,
    });

    const clearInput = useCallback(() => {
        setLocalValue("");
        setGlobalValue("");
        resetFetched();
        setIsTemplatesOpen(false);
        setGameData(null);
        setSelectedTemplate(null);
        isGeneratingRef.current = false;
        cmRef.current?.view?.focus();
    }, [setGlobalValue, resetFetched, setGameData, setSelectedTemplate]);

    const isLoading = isAutoCompleteLoading || isRoundDetailsLoading || isTemplatesLoading;
    const hasValidTemplates = !!(filteredTemplates && filteredTemplates.length > 0);
    const hasActiveGameData = !!(gameData || derivedGameData);
    const showEyeIcon = hasActiveGameData && (hasValidTemplates || isTemplatesLoading);
    const showTemplates = showEyeIcon && isTemplatesOpen && !isTemplatesLoading;

    // Local snapshot visibility flag checking if an annotation token exists
    const operationalHasToken = localValue.includes("@");

    return (
        <div className="w-full">
            <div className="relative flex items-center gap-2 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-0 shadow-sm transition-all duration-200 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 focus-within:shadow-md">
                <SearchLoadingIcon isLoading={isLoading} />
                <div className="flex-1 min-w-0">
                    <CodeMirror
                        ref={cmRef}
                        value={localValue}
                        onChange={setLocalValue}
                        placeholder={placeholder}
                        extensions={extensions}
                        basicSetup={basicSetup}
                    />
                </div>

                <div className="flex items-center gap-1.5 shrink-0 select-none">
                    {showEyeIcon && (
                        <button
                            type="button"
                            disabled={isTemplatesLoading}
                            aria-label={isTemplatesOpen ? "Hide query templates" : "Show query templates"}
                            title={isTemplatesOpen ? "Hide query templates" : "Show query templates"}
                            onClick={() => setIsTemplatesOpen((prev) => !prev)}
                            className={`p-1.5 rounded-lg transition duration-150 flex items-center justify-center ${
                                isTemplatesLoading
                                    ? "text-slate-400 bg-slate-50 cursor-not-allowed"
                                    : isTemplatesOpen
                                        ? "text-blue-600 bg-blue-50 cursor-pointer"
                                        : "text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                            }`}
                        >
                            {isTemplatesLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isTemplatesOpen ? (
                                <EyeClosed className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    )}

                    {operationalHasToken && (
                        <FetchDataAndLoadTemplates

                            isGenerating={isRoundDetailsLoading}
                            onGenerate={handleGenerate}
                        />
                    )}

                    {localValue && <ClearInputFieldButton onClick={clearInput} />}
                </div>

                {showTemplates && (
                    <SmartSearchTemplatesDropdown
                        targetGameType={targetGameType}
                        filteredTemplates={filteredTemplates}
                        onSelectTemplate={handleInjectTemplate}
                        onClose={() => setIsTemplatesOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};