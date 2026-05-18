export type JoinOperator = "AND" | "OR";
export type ConditionOperator = "is_one_of" | "is_not_one_of";

export interface BaseNode {
  id: string;
  parentId?: string;
}

export interface GroupChild {
  id: string;
  relation?: JoinOperator;
}

export interface BoolNode extends BaseNode {
  type: "bool";
  children: GroupChild[];
}

export interface ConditionNode extends BaseNode {
  type: "condition";
  field: string;
  operator: ConditionOperator;
  values: string[];
}

export type QueryNode = BoolNode | ConditionNode;

export interface QueryState {
  rootId: string;
  nodes: Record<string, QueryNode>;
}

export type Action =
  | { type: "UPDATE_NODE"; node: QueryNode }
  | { type: "ADD_CONDITION"; parentId: string }
  | { type: "ADD_GROUP"; parentId: string }
  | { type: "DELETE_NODE"; nodeId: string }
  | { type: "UPDATE_RELATION"; parentId: string; childId: string; relation: JoinOperator };