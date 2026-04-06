export type GameType =
  | "All"
  | "Black Jack"
  | "Roulette"
  | "Baccarat"
  | "Crash Games";

export type CategoryType = "Resolution Summary" | "Operator Response";

export type SubCategoryType = 
  | "General Round Check"
  | "BET Canceled"
  | "BET Declined"
  | "HIT/STAND"
  | "DECISION";

export interface Resolution {
  id: number;
  title: string;
  game: GameType;
  category: CategoryType;
  subcategory: SubCategoryType;
  content: string;
  created_at?: string;
}