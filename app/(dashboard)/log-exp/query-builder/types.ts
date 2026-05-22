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

export interface SavedFilter {
  id: string;
  name: string;
  state: QueryState;
  isEnabled: boolean;
  isExcluded: boolean; // false = INCLUDE (must), true = EXCLUDE (must_not)
}

export interface MultiFilterState {
  filters: Record<string, SavedFilter>;
  editingFilterId: string | null; // Tracks which filter is currently being edited in the popup
}

export type QueryAction =
  | { type: "UPDATE_NODE"; node: QueryNode }
  | { type: "ADD_CONDITION"; parentId: string; relation: JoinOperator; targetNodeId?: string }
  | { type: "ADD_GROUP"; parentId: string }
  | { type: "DELETE_NODE"; nodeId: string }
  | { type: "UPDATE_RELATION"; parentId: string; childId: string; relation: JoinOperator }
  | { type: "RESET_TREE" }
  | { type: "CREATE_FILTER"; name: string; initialState?: QueryState }
  | { type: "SWITCH_FILTER"; filterId: string }
  | { type: "RENAME_FILTER"; filterId: string; newName: string }
  | { type: "DELETE_FILTER"; filterId: string };