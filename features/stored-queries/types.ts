export interface FilterRuleItem {
  id: string;
  field: string;
  type: "phrases" | "exists";
  negate: boolean;
  value: string;
}