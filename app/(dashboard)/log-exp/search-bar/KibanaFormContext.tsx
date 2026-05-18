"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { BoolNode, ConditionNode, QueryState } from "../query-builder/types";
import { GameData } from "./utils/get-current-game-data";

// Update the type interface to include the template tracking
interface KibanaFormContextType {
    searchValue: string;
    setSearchValue: (value: string) => void;
    queryState: QueryState;
    setQueryState: React.Dispatch<React.SetStateAction<QueryState>>;
    selectedDataView: string;
    setSelectedDataView: (dataView: string) => void;
    timeRange: { from: string; to: string; label?: string };
    setTimeRange: (range: { from: string; to: string; label?: string }) => void;
    compiledDslQuery: any;
    gameData: GameData | null;
    setGameData: (data: GameData | null) => void;
    // New selected template state entries
    selectedTemplate: any | null;
    setSelectedTemplate: (template: any | null) => void;
}

const KibanaFormContext = createContext<KibanaFormContextType | undefined>(undefined);

const initialQueryState: QueryState = {
    rootId: "root",
    nodes: {
        root: {
            id: "root",
            type: "bool",
            children: [],
            parentId: undefined
        }
    }
};

// --- Elasticsearch DSL Compilation Logic ---
function buildDsl(state: QueryState, nodeId: string): any {
    const node = state.nodes[nodeId];
    if (!node) return null;

    if (node.type === "condition") {
        return buildCondition(node as ConditionNode);
    }
    return buildGroup(state, node as BoolNode);
}

function buildCondition(node: ConditionNode) {
    const values = node.values?.filter(Boolean) || [];
    if (!node.field || values.length === 0) return null;

    const isNegation = node.operator === "is_not_one_of";
    const matchClauses = values.map((value) => ({
        match_phrase: { [node.field]: value },
    }));

    const clause = {
        bool: {
            should: matchClauses,
            minimum_should_match: 1,
        },
    };

    if (isNegation) {
        return {
            bool: {
                must_not: [
                    {
                        bool: {
                            should: matchClauses,
                            minimum_should_match: 1,
                        },
                    },
                ],
            },
        };
    }

    return clause;
}

function buildGroup(state: QueryState, node: BoolNode) {
    const filters: any[] = [];
    const shoulds: any[] = [];

    node.children.forEach((child, index) => {
        const dsl = buildDsl(state, child.id);
        if (!dsl) return;

        if (index > 0 && child.relation === "OR") {
            shoulds.push(dsl);
        } else {
            filters.push(dsl);
        }
    });

    if (filters.length === 0 && shoulds.length === 0) return null;

    if (filters.length === 1 && shoulds.length === 0 && !node.parentId) {
        return transformToFullBoilerplate(filters[0]);
    }

    if (shoulds.length > 0) {
        return {
            bool: {
                should: [
                    ...filters.map((f) => transformToFullBoilerplate(f)),
                    ...shoulds.map((s) => transformToFullBoilerplate(s)),
                ],
                minimum_should_match: 1,
            },
        };
    }

    const boilerplate: any = {
        bool: { must: [], filter: [], should: [], must_not: [] },
    };

    filters.forEach((item) => {
        if (item && item.bool && item.bool.must_not) {
            boilerplate.bool.must_not.push(...item.bool.must_not);
        } else {
            boilerplate.bool.filter.push(transformToFullBoilerplate(item));
        }
    });

    return boilerplate;
}

function transformToFullBoilerplate(item: any): any {
    if (!item) return item;
    if (item.bool && "must" in item.bool && "filter" in item.bool) {
        return item;
    }

    const boilerplate: any = {
        bool: { must: [], filter: [], should: [], must_not: [] },
    };

    if (item.bool && item.bool.must_not) {
        boilerplate.bool.must_not = item.bool.must_not;
    } else {
        boilerplate.bool.filter.push(item);
    }

    return boilerplate;
}

// --- Context Provider Component ---
export const KibanaFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [queryState, setQueryState] = useState<QueryState>(initialQueryState);
    const [selectedDataView, setSelectedDataView] = useState<string>("");
    const [timeRange, setTimeRange] = useState<{ from: string; to: string; label?: string }>({
        from: "now-15m",
        to: "now",
        label: "Last 15 minutes",
    });
    const [gameData, setGameData] = useState<GameData | null>(null);

    // New Global Selected Template State
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

    const compiledDslQuery = useMemo(() => {
        if (!queryState.rootId) return null;
        try {
            return buildDsl(queryState, queryState.rootId);
        } catch (error) {
            console.error("DSL Compilation Engine Failure:", error);
            return null;
        }
    }, [queryState]);

    return (
        <KibanaFormContext.Provider
            value={{
                searchValue,
                setSearchValue,
                queryState,
                setQueryState,
                selectedDataView,
                setSelectedDataView,
                timeRange,
                setTimeRange,
                compiledDslQuery,
                gameData,
                setGameData,
                // Provide state parameters down
                selectedTemplate,
                setSelectedTemplate
            }}
        >
            {children}
        </KibanaFormContext.Provider>
    );
};

export const useKibanaFormStore = () => {
    const context = useContext(KibanaFormContext);
    if (!context) {
        throw new Error("useKibanaFormStore must be used within a KibanaFormProvider");
    }
    return context;
};