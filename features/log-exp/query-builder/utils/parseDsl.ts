import { QueryState, QueryNode, ConditionNode, BoolNode, JoinOperator } from "../types";

const generateId = () => crypto.randomUUID();

export function parseDsl(dsl: any): QueryState {
    const nodes: Record<string, QueryNode> = {};
    const rootId = "root";

    const state: QueryState = {
        rootId,
        nodes: {},
    };

    if (!dsl || typeof dsl !== "object") {
        const initialConditionId = generateId();
        state.nodes[rootId] = { id: rootId, type: "bool", children: [{ id: initialConditionId }] };
        state.nodes[initialConditionId] = {
            id: initialConditionId,
            parentId: rootId,
            type: "condition",
            field: "message",
            operator: "is_one_of",
            values: [],
        };
        return state;
    }

    traverseDsl(dsl, undefined, rootId, nodes, false);

    state.nodes = nodes;
    return state;
}
function traverseDsl(
    item: any,
    parentId: string | undefined,
    forcedId: string | null,
    nodes: Record<string, QueryNode>,
    isInverted: boolean
): string {
    const currentId = forcedId || generateId();

    // 1. Check for standard Boolean Group arrays
    if (item && item.bool) {
        const boolBlock = item.bool;

        // --- SAFE FIX: Check length and verify elements exist safely ---
        if (
            Array.isArray(boolBlock.should) &&
            boolBlock.should.length > 0 && // Ensure array isn't empty
            boolBlock.should.every((sub: any) => sub && sub.match_phrase)
        ) {
            const firstChild = boolBlock.should[0];
            const firstField = firstChild && firstChild.match_phrase ? Object.keys(firstChild.match_phrase)[0] : null;

            if (firstField) {
                const allSameField = boolBlock.should.every(
                    (sub: any) => sub && sub.match_phrase && Object.keys(sub.match_phrase)[0] === firstField
                );

                if (allSameField) {
                    const combinedValues = boolBlock.should.map(
                        (sub: any) => sub.match_phrase[firstField]
                    );

                    const conditionNode: ConditionNode = {
                        id: currentId,
                        type: "condition",
                        parentId: parentId,
                        field: firstField,
                        operator: isInverted ? "is_not_one_of" : "is_one_of",
                        values: combinedValues,
                    };

                    nodes[currentId] = conditionNode;
                    return currentId;
                }
            }
        }

        // Standard bool block processing if it's a complex mix
        const groupNode: BoolNode = {
            id: currentId,
            type: "bool",
            children: [],
            parentId: parentId,
        };
        nodes[currentId] = groupNode;

        // Process inversion/negation groups (must_not arrays)
        if (Array.isArray(boolBlock.must_not) && boolBlock.must_not.length > 0) {
            boolBlock.must_not.forEach((subItem: any) => {
                const childId = traverseDsl(subItem, currentId, null, nodes, true);
                const relation: JoinOperator | undefined = groupNode.children.length === 0 ? undefined : "AND";
                groupNode.children.push({ id: childId, relation });
            });
        }

        // Process implicit intersections (filter & must arrays)
        ["filter", "must"].forEach((key) => {
            if (Array.isArray(boolBlock[key])) {
                boolBlock[key].forEach((subItem: any) => {
                    const childId = traverseDsl(subItem, currentId, null, nodes, isInverted);
                    const relation: JoinOperator | undefined = groupNode.children.length === 0 ? undefined : "AND";
                    groupNode.children.push({ id: childId, relation });
                });
            }
        });

        // Process explicit unions (should arrays)
        if (Array.isArray(boolBlock.should)) {
            boolBlock.should.forEach((subItem: any) => {
                const childId = traverseDsl(subItem, currentId, null, nodes, isInverted);
                const relation: JoinOperator | undefined = groupNode.children.length === 0 ? undefined : "OR";
                groupNode.children.push({ id: childId, relation });
            });
        }

        // Run sequential cleanup pass on siblings
        consolidateChildren(groupNode, nodes);

        return currentId;
    }

    // 2. Leaf Nodes: Check for standard Match Phrase selectors
    if (item && item.match_phrase) {
        const field = Object.keys(item.match_phrase)[0];
        const value = item.match_phrase[field];

        const conditionNode: ConditionNode = {
            id: currentId,
            type: "condition",
            parentId: parentId,
            field: field || "message",
            operator: isInverted ? "is_not_one_of" : "is_one_of",
            values: value ? [value] : [],
        };

        nodes[currentId] = conditionNode;
        return currentId;
    }

    // Fallback node generation
    const fallbackNode: ConditionNode = {
        id: currentId,
        type: "condition",
        parentId: parentId,
        field: "message",
        operator: isInverted ? "is_not_one_of" : "is_one_of",
        values: [],
    };
    nodes[currentId] = fallbackNode;
    return currentId;
}

function consolidateChildren(groupNode: BoolNode, nodes: Record<string, QueryNode>) {
    const uniqueChildren: Array<{ id: string; relation?: JoinOperator }> = [];
    const seenConditions: Record<string, ConditionNode> = {};

    groupNode.children.forEach((childRef) => {
        const childNode = nodes[childRef.id];

        if (childNode && childNode.type === "condition") {
            const key = `${childNode.field}_${childNode.operator}`;

            if (seenConditions[key]) {
                const primaryNode = seenConditions[key];
                primaryNode.values = [...primaryNode.values, ...childNode.values];
                delete nodes[childRef.id];
            } else {
                seenConditions[key] = childNode;
                uniqueChildren.push(childRef);
            }
        } else {
            uniqueChildren.push(childRef);
        }
    });

    if (uniqueChildren.length > 0) {
        uniqueChildren[0].relation = undefined;
    }

    groupNode.children = uniqueChildren;
}