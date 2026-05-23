import { QueryNode, BoolNode, JoinOperator } from "../types";

export function createConditionNode(id: string, parentId: string): QueryNode {
    return {
        id,
        parentId,
        type: "condition",
        field: "message",
        operator: "is_one_of",
        values: [],
    };
}

export function wrapInSubgroup(
    nodes: Record<string, QueryNode>,
    newGroupId: string,
    parent: BoolNode,
    targetChildId: string,
    newConditionId: string
): void {
    if (nodes[targetChildId]) {
        nodes[targetChildId] = { ...nodes[targetChildId], parentId: newGroupId };
    }

    nodes[newGroupId] = {
        id: newGroupId,
        parentId: parent.id,
        type: "bool",
        children: [
            { id: targetChildId },
            { id: newConditionId, relation: "AND" }
        ]
    };
}

export function bypassMiddleGroupLayer(
    nodes: Record<string, QueryNode>,
    nestedSubGroup: BoolNode,
    grandParentId: string,
    inheritedRelation?: JoinOperator
): void {
    nestedSubGroup.children.forEach((grandChildRef, idx) => {
        if (nodes[grandChildRef.id]) {
            nodes[grandChildRef.id] = { ...nodes[grandChildRef.id], parentId: grandParentId };
        }
        if (idx === 0) {
            nestedSubGroup.children[idx] = { ...grandChildRef, relation: inheritedRelation };
        }
    });
}