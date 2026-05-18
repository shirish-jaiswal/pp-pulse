import { QueryState, BoolNode, JoinOperator } from "../types";
import { ROOT_ID, validateTree } from "./treeCore";
import { createConditionNode, wrapInSubgroup } from "./treeMutators";

export function handleAddCondition(
    state: QueryState,
    action: { parentId: string; relation: JoinOperator; targetNodeId?: string }
): QueryState {
    const parent = state.nodes[action.parentId] as BoolNode;
    if (!parent) return state;

    const currentNodes = { ...state.nodes };
    const newConditionId = crypto.randomUUID();
    const { targetNodeId, relation } = action;

    const targetIndex = targetNodeId ? parent.children.findIndex((c) => c.id === targetNodeId) : -1;

    // 1. DOWNWARD SYSTEM: (A OR (B AND C))
    if (relation === "AND" && targetIndex !== -1) {
        const targetChild = parent.children[targetIndex];
        const newGroupId = crypto.randomUUID();

        wrapInSubgroup(currentNodes, newGroupId, parent, targetChild.id, newConditionId);
        currentNodes[newConditionId] = createConditionNode(newConditionId, newGroupId);

        const updatedChildren = [...parent.children];
        updatedChildren[targetIndex] = { id: newGroupId, relation: targetChild.relation };

        return validateTree({
            ...state,
            nodes: { ...currentNodes, [parent.id]: { ...parent, children: updatedChildren } }
        });
    }

    // 2. UPWARD SYSTEM: ((A AND B) OR C)
    if (relation === "OR" && targetIndex !== -1 && parent.children.length > 1) {
        const updatedChildrenOfParent = [...parent.children];
        const childrenToMigrate = updatedChildrenOfParent.slice(0, targetIndex + 1);
        const remainingChildren = updatedChildrenOfParent.slice(targetIndex + 1);

        if (remainingChildren.length === 0 && parent.id !== ROOT_ID) {
            if (!parent.parentId) return state;
            currentNodes[newConditionId] = createConditionNode(newConditionId, parent.parentId);
            const grandParent = currentNodes[parent.parentId] as BoolNode;

            if (grandParent) {
                const parentIndexInGP = grandParent.children.findIndex((c) => c.id === parent.id);
                if (parentIndexInGP !== -1) {
                    const updatedGPChildren = grandParent.children.toSpliced(parentIndexInGP + 1, 0, {
                        id: newConditionId,
                        relation: "OR"
                    });
                    currentNodes[grandParent.id] = { ...grandParent, children: updatedGPChildren };
                }
            }
            return validateTree({ ...state, nodes: currentNodes });
        }

        const newGroupId = crypto.randomUUID();

        // Explicitly cloning shifted children nodes to prevent mutation leaks
        childrenToMigrate.forEach((c) => {
            if (currentNodes[c.id]) {
                currentNodes[c.id] = { ...currentNodes[c.id], parentId: newGroupId };
            }
        });

        const adjustedMigrationHead = childrenToMigrate[0]
            ? [{ ...childrenToMigrate[0], relation: undefined }, ...childrenToMigrate.slice(1)]
            : childrenToMigrate;

        currentNodes[newGroupId] = { id: newGroupId, parentId: parent.id, type: "bool", children: adjustedMigrationHead };
        currentNodes[newConditionId] = createConditionNode(newConditionId, parent.id);

        return validateTree({
            ...state,
            nodes: {
                ...currentNodes,
                [parent.id]: {
                    ...parent,
                    children: [{ id: newGroupId }, { id: newConditionId, relation: "OR" }, ...remainingChildren]
                }
            }
        });
    }

    // 3. STANDARD APPEND CONTROLS
    currentNodes[newConditionId] = createConditionNode(newConditionId, parent.id);
    const insertIndex = targetIndex !== -1 ? targetIndex + 1 : parent.children.length;

    const updatedChildren = parent.children.toSpliced(insertIndex, 0, {
        id: newConditionId,
        relation: parent.children.length === 0 ? undefined : relation
    });

    return validateTree({
        ...state,
        nodes: { ...currentNodes, [parent.id]: { ...parent, children: updatedChildren } }
    });
}

// Extracted from messy reducer switch statement block to maintain architectural clarity
export function handleAddGroup(state: QueryState, parentId: string): QueryState {
    const parent = state.nodes[parentId] as BoolNode;
    if (!parent) return state;

    const groupId = crypto.randomUUID();
    const initialConditionId = crypto.randomUUID();

    return validateTree({
        ...state,
        nodes: {
            ...state.nodes,
            [groupId]: {
                id: groupId,
                parentId: parent.id,
                type: "bool",
                children: [{ id: initialConditionId }],
            },
            [initialConditionId]: createConditionNode(initialConditionId, groupId),
            [parent.id]: {
                ...parent,
                children: [
                    ...parent.children,
                    { id: groupId, relation: parent.children.length === 0 ? undefined : "AND" },
                ],
            },
        },
    });
}