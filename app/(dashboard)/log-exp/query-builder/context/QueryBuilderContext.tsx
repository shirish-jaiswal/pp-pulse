import React, { createContext, useContext, useReducer, useMemo, useCallback, useState } from "react";
import { QueryState, QueryNode, BoolNode, JoinOperator, SavedFilter } from "../types";
import { createInitialState, validateTree } from "./treeCore";
import { handleAddCondition, handleAddGroup } from "./conditionMutations";
import { handleDeleteNode } from "./deletionEngines";

type QueryAction =
    | { type: "UPDATE_NODE"; node: QueryNode }
    | { type: "ADD_CONDITION"; parentId: string; relation: JoinOperator; targetNodeId?: string }
    | { type: "ADD_GROUP"; parentId: string }
    | { type: "DELETE_NODE"; nodeId: string }
    | { type: "UPDATE_RELATION"; parentId: string; childId: string; relation: JoinOperator }
    | { type: "RESET_TREE" };

function queryReducer(state: QueryState, action: QueryAction): QueryState {
    switch (action.type) {
        case "UPDATE_NODE": {
            const updatedNodes = {
                ...state.nodes,
                [action.node.id]: { ...action.node },
            };
            return validateTree({ ...state, nodes: updatedNodes });
        }
        case "ADD_CONDITION":
            return handleAddCondition(state, action);
        case "ADD_GROUP":
            return handleAddGroup(state, action.parentId);
        case "DELETE_NODE":
            return handleDeleteNode(state, action.nodeId);
        case "UPDATE_RELATION": {
            const parent = state.nodes[action.parentId] as BoolNode;
            if (!parent) return state;

            return validateTree({
                ...state,
                nodes: {
                    ...state.nodes,
                    [parent.id]: {
                        ...parent,
                        children: parent.children.map((child) =>
                            child.id === action.childId ? { ...child, relation: action.relation } : child
                        ),
                    },
                },
            });
        }
        case "RESET_TREE":
            return createInitialState();
        default:
            return state;
    }
}

interface QueryBuilderContextType {
    state: QueryState;
    actions: {
        updateNode: (node: QueryNode) => void;
        deleteNode: (nodeId: string) => void;
        addCondition: (parentId: string, relation: JoinOperator, targetNodeId?: string) => void;
        addGroup: (parentId: string) => void;
        updateRelation: (parentId: string, childId: string, relation: JoinOperator) => void;
        resetTree: () => void;
    };
}

const QueryBuilderContext = createContext<QueryBuilderContextType | undefined>(undefined);

interface QueryBuilderProviderProps {
    children: React.ReactNode;
    initialState?: QueryState;
}

export const QueryBuilderProvider: React.FC<QueryBuilderProviderProps> = ({ children, initialState }) => {
    const [state, dispatch] = useReducer(queryReducer, initialState, (passedState) => {
        if (passedState) {
            return validateTree(passedState);
        }
        return createInitialState();
    });

    const updateNode = useCallback((node: QueryNode) => dispatch({ type: "UPDATE_NODE", node }), []);
    const deleteNode = useCallback((nodeId: string) => dispatch({ type: "DELETE_NODE", nodeId }), []);
    const addCondition = useCallback((parentId: string, relation: JoinOperator, targetNodeId?: string) => {
        dispatch({ type: "ADD_CONDITION", parentId, relation, targetNodeId });
    }, []);
    const addGroup = useCallback((parentId: string) => dispatch({ type: "ADD_GROUP", parentId }), []);
    const updateRelation = useCallback((parentId: string, childId: string, relation: JoinOperator) => {
        dispatch({ type: "UPDATE_RELATION", parentId, childId, relation });
    }, []);
    const resetTree = useCallback(() => dispatch({ type: "RESET_TREE" }), []);

    const contextValue = useMemo(() => ({
        state,
        actions: { updateNode, deleteNode, addCondition, addGroup, updateRelation, resetTree }
    }), [state, updateNode, deleteNode, addCondition, addGroup, updateRelation, resetTree]);

    return (
        <QueryBuilderContext.Provider value={contextValue}>
            {children}
        </QueryBuilderContext.Provider>
    );
};

export function useQueryBuilder() {
    const context = useContext(QueryBuilderContext);
    if (!context) {
        throw new Error("useQueryBuilder must be utilized inside a <QueryBuilderProvider />");
    }
    return context;
}

interface MultiFilterContextType {
    filters: Record<string, SavedFilter>;
    editingFilterId: string | null;
    saveFilter: (name: string, treeState: QueryState) => void;
    updateSavedFilter: (id: string, updatedFields: Partial<SavedFilter>) => void;
    deleteFilter: (id: string) => void;
    setEditingFilterId: (id: string | null) => void;
}

const MultiFilterContext = createContext<MultiFilterContextType | undefined>(undefined);

export const MultiFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [filters, setFilters] = useState<Record<string, SavedFilter>>({});
    const [editingFilterId, setEditingFilterId] = useState<string | null>(null);

    const saveFilter = useCallback((name: string, treeState: QueryState) => {
        const id = crypto.randomUUID();
        setFilters((prev) => ({
            ...prev,
            [id]: {
                id,
                name: "",
                state: treeState,
                isEnabled: true,
                isExcluded: false,
            },
        }));
    }, []);

    const updateSavedFilter = useCallback((id: string, updatedFields: Partial<SavedFilter>) => {
        setFilters((prev) => {
            if (!prev[id]) return prev;
            return {
                ...prev,
                [id]: { ...prev[id], ...updatedFields },
            };
        });
    }, []);

    const deleteFilter = useCallback((id: string) => {
        setFilters((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
        setEditingFilterId((currentId) => (currentId === id ? null : currentId));
    }, []);

    const contextValue = useMemo(() => ({
        filters,
        editingFilterId,
        saveFilter,
        updateSavedFilter,
        deleteFilter,
        setEditingFilterId,
    }), [filters, editingFilterId, saveFilter, updateSavedFilter, deleteFilter]);

    return (
        <MultiFilterContext.Provider value={contextValue}>
            {children}
        </MultiFilterContext.Provider>
    );
};

export function useMultiFilters() {
    const context = useContext(MultiFilterContext);
    if (!context) {
        throw new Error("useMultiFilters must be used inside a <MultiFilterProvider />");
    }
    return context;
}