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

    // Pass false as the initial state for the inverted/negation tracking flag
    traverseDsl(dsl, undefined, rootId, nodes, false);

    state.nodes = nodes;
    return state;
}

function traverseDsl(
    item: any,
    parentId: string | undefined,
    forcedId: string | null,
    nodes: Record<string, QueryNode>,
    isInverted: boolean // Added flag to pass down negation context
): string {
    const currentId = forcedId || generateId();

    // 1. Check for standard Boolean Group arrays
    if (item && item.bool) {
        const boolBlock = item.bool;

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
                // Set isInverted to true for all nodes down this branch
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
            // Dynamically evaluate operator based on context flag
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