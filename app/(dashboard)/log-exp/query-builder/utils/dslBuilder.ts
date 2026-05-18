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
  // Fix: Instead of discarding other items in filters, we create a full base skeleton
  // and intelligently map your conditions into either 'filter' or 'must_not' branches.
  const boilerplate: any = {
    bool: {
      must: [],
      filter: [],
      should: [],
      must_not: [],
    },
  };

  filters.forEach((item) => {
    if (item && item.bool && item.bool.must_not) {
      // Safely spread nested items down into the parent's must_not block
      boilerplate.bool.must_not.push(...item.bool.must_not);
    } else {
      // Standard positive criteria belong inside the filter array
      boilerplate.bool.filter.push(transformToFullBoilerplate(item));
    }
  });

  return boilerplate;
}

function transformToFullBoilerplate(item: any): any {
  if (!item) return item;

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

  if (item.bool && item.bool.must_not) {
    boilerplate.bool.must_not = item.bool.must_not;
  } else {
    boilerplate.bool.filter.push(item);
  }

  return boilerplate;
}