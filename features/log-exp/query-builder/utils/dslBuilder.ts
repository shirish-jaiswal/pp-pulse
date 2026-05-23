import { QueryState, QueryNode, ConditionNode, BoolNode } from "../types";

export function buildDsl(state: QueryState, nodeId: string): any {
  const node = state.nodes[nodeId];
  if (!node) return null;

  if (node.type === "condition") {
    return buildCondition(node);
  }
  return buildGroup(state, node);
}

function buildCondition(node: ConditionNode) {
  const values = node.values.filter(Boolean);
  if (!node.field || values.length === 0) return null;

  const isNegation = node.operator === "is_not_one_of";

  const matchClauses = values.map((value) => ({
    match_phrase: { [node.field]: value },
   }));

  // Standard condition match representation
  const clause = {
    bool: {
      should: matchClauses,
      minimum_should_match: 1,
    },
  };

  // If this condition is inverted, wrap it in a nested boolean block matching
  // exactly what your context parser expects to see inside a 'must_not' array.
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

  // 1. Compile and separate child nodes by relation status
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

  // 2. Clear out flat roots if it's a completely lone criteria block
  if (filters.length === 1 && shoulds.length === 0 && !node.parentId) {
    return transformToFullBoilerplate(filters[0]);
  }

  // 3. Handle OR branch merging
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

  // 4. Default standard AND/Filter layout group
  const boilerplate: any = {
    bool: {
      must: [],
      filter: [],
      should: [],
      must_not: [],
    },
  };

  filters.forEach((item) => {
    if (item && item.isNegation) {
      // Clean up our operational flag before saving to output
      const cleanItem = { bool: item.bool };

      // Wrap it cleanly inside a separate block to preserve your structural parser context
      boilerplate.bool.must_not.push({
        bool: {
          should: cleanItem.bool.should,
          minimum_should_match: cleanItem.bool.minimum_should_match
        }
      });
    } else {
      // Remove flag if present on positive item
      if (item && 'isNegation' in item) delete item.isNegation;
      boilerplate.bool.filter.push(transformToFullBoilerplate(item));
    }
  });

  return boilerplate;
}

function transformToFullBoilerplate(item: any): any {
  if (!item) return item;

  // Clean flag up if necessary
  const isNegation = item.isNegation;
  if ('isNegation' in item) delete item.isNegation;

  // If it's already an explicit boilerplate block, leave it be
  if (item.bool && "must" in item.bool && "filter" in item.bool) {
    return item;
  }

  const boilerplate: any = {
    bool: {
      must: [],
      filter: [],
      should: [],
      must_not: [],
    },
  };

  if (isNegation) {
    boilerplate.bool.must_not.push({
      bool: {
        should: item.bool.should,
        minimum_should_match: item.bool.minimum_should_match
      }
    });
  } else {
    boilerplate.bool.filter.push(item);
  }

  return boilerplate;
}
