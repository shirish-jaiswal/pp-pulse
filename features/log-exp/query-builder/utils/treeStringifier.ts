import { BoolNode, QueryState } from "../types";

export function stringifyTree(state: QueryState): string {
    const nodes = state.nodes;

    function parseNode(nodeId: string): string {
        const node = nodes[nodeId];
        if (!node) return "";

        if (node.type === "condition") {
            // Use a separate string variable to avoid mutation type errors with ConditionOperator
            let displayOp: string = node.operator;
            if (node.operator === "is_one_of") displayOp = "is";
            if (node.operator === "is_not_one_of") displayOp = "is_not";

            const formattedValues = node.values && node.values.length > 0
                ? `[${node.values.map(v => `"${v}"`).join(", ")}]`
                : '""';
            return `${node.field} ${displayOp} ${formattedValues}`;
        }

        if (node.type === "bool") {
            const boolNode = node as BoolNode;
            if (!boolNode.children || boolNode.children.length === 0) return "";

            const compiledParts = boolNode.children.map((childRef, idx) => {
                const childStr = parseNode(childRef.id);
                if (!childStr) return "";

                // Add compact layout prefixing operator if it's not the first child
                if (idx > 0 && childRef.relation) {
                    let rel: string = childRef.relation;
                    if (rel === "AND") rel = "&";
                    if (rel === "OR") rel = "|";

                    return ` ${rel} ${childStr}`;
                }
                return childStr;
            }).filter(Boolean);

            if (compiledParts.length === 0) return "";

            // Wrap structural subgroups in braces to keep expressions logical
            return boolNode.id === state.rootId ? compiledParts.join("") : `(${compiledParts.join("")})`;
        }

        return "";
    }

    return parseNode(state.rootId) || "Empty Filter";
}