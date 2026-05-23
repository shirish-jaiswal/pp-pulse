import { QueryState, BoolNode } from "../types";
import { ROOT_ID, removeNodeRecursively, validateTree, createInitialState } from "./treeCore";
import { bypassMiddleGroupLayer } from "./treeMutators";

export function handleDeleteNode(state: QueryState, nodeId: string): QueryState {
    const node = state.nodes[nodeId];
    if (!node?.parentId) return state;

    const currentNodes = { ...state.nodes };
    const { parentId } = node;
    const parentNode = currentNodes[parentId] as BoolNode;

    // 1. Core structural node scrubbing
    removeNodeRecursively(currentNodes, nodeId);

    if (parentNode) {
        currentNodes[parentId] = {
            ...parentNode,
            children: parentNode.children.filter((child) => child.id !== nodeId),
        };
    }

    // --- COMPRESSION ENGINE ---
    let updatedParent = currentNodes[parentId] as BoolNode;

    if (updatedParent && parentId !== ROOT_ID && updatedParent.children.length === 1) {
        const grandParentId = updatedParent.parentId;
        const remainingChildRef = updatedParent.children[0];

        if (grandParentId) {
            const grandParentNode = currentNodes[grandParentId] as BoolNode;
            const groupIndex = grandParentNode?.children.findIndex((c) => c.id === parentId);

            if (grandParentNode && groupIndex !== -1 && groupIndex !== undefined) {
                const originalGroupRef = grandParentNode.children[groupIndex];
                const targetChildNode = currentNodes[remainingChildRef.id];

                let newGrandParentChildren = [...grandParentNode.children];

                if (targetChildNode && targetChildNode.type === "bool") {
                    bypassMiddleGroupLayer(currentNodes, targetChildNode as BoolNode, grandParentId, originalGroupRef.relation);
                    newGrandParentChildren = grandParentNode.children.toSpliced(groupIndex, 1, ...(targetChildNode as BoolNode).children);
                    delete currentNodes[remainingChildRef.id];
                } else {
                    if (currentNodes[remainingChildRef.id]) {
                        currentNodes[remainingChildRef.id] = { ...currentNodes[remainingChildRef.id], parentId: grandParentId };
                    }
                    newGrandParentChildren[groupIndex] = {
                        id: remainingChildRef.id,
                        relation: groupIndex === 0 ? undefined : originalGroupRef.relation
                    };
                }

                currentNodes[grandParentId] = { ...grandParentNode, children: newGrandParentChildren };
                delete currentNodes[parentId];
            }
        }
    }

    // --- FALLBACK SKELETON CLEANUP ---
    const subsequentParentCheck = currentNodes[parentId] as BoolNode;
    if (subsequentParentCheck && parentId !== ROOT_ID && subsequentParentCheck.children.length === 0) {
        const grandParentId = subsequentParentCheck.parentId;
        if (grandParentId && currentNodes[grandParentId]) {
            const gp = currentNodes[grandParentId] as BoolNode;
            const updatedGpChildren = gp.children.filter((c) => c.id !== parentId);

            if (updatedGpChildren.length > 0 && gp.children[0].id === parentId) {
                updatedGpChildren[0] = { ...updatedGpChildren[0], relation: undefined };
            }
            currentNodes[grandParentId] = { ...gp, children: updatedGpChildren };
        }
        delete currentNodes[parentId];
    }

    // --- GLOBAL ROOT EMPTY GUARD SYSTEM ---
    // If deletion steps have completely cleared out children references under root node,
    // we short-circuit out and re-initialize a unified condition layout tracking segment.
    const rootNode = currentNodes[ROOT_ID] as BoolNode;
    if (!rootNode || !rootNode.children || rootNode.children.length === 0) {
        return createInitialState();
    }

    return validateTree({ ...state, nodes: currentNodes });
}