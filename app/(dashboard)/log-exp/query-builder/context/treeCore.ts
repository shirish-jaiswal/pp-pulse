import { QueryState, QueryNode } from "../types";

export const ROOT_ID = "root";

export const createInitialState = (): QueryState => {
    const initialConditionId = crypto.randomUUID();
    return {
        rootId: ROOT_ID,
        nodes: {
            [ROOT_ID]: { id: ROOT_ID, type: "bool", children: [{ id: initialConditionId }] },
            [initialConditionId]: { id: initialConditionId, parentId: ROOT_ID, type: "condition", field: "message", operator: "is_one_of", values: [] },
        },
    };
};

export function removeNodeRecursively(nodes: Record<string, QueryNode>, nodeId: string): void {
    const node = nodes[nodeId];
    if (!node) return;
    if (node.type === "bool") {
        node.children.forEach((child) => removeNodeRecursively(nodes, child.id));
    }
    delete nodes[nodeId];
}

export function validateTree(state: QueryState): QueryState {
    const nextNodes = { ...state.nodes };
    Object.keys(nextNodes).forEach((id) => {
        const node = nextNodes[id];
        if (node?.type === "bool") {
            nextNodes[id] = { ...node, children: node.children.filter((child) => !!nextNodes[child.id]) };
        }
    });
    return { ...state, nodes: nextNodes };
}