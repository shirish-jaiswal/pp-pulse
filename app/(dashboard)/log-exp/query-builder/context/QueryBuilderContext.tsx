import React, { createContext, useContext, useReducer, useMemo, useCallback } from "react";
import { QueryState, QueryNode, BoolNode, JoinOperator } from "../types";
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

// Define type safe props to accept an optional pre-existing query state
interface QueryBuilderProviderProps {
    children: React.ReactNode;
    initialState?: QueryState;
}

export const QueryBuilderProvider: React.FC<QueryBuilderProviderProps> = ({ children, initialState }) => {

    // Lazy initializer checks for the prop. If found, runs it through your validation logic.
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