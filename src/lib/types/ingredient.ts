export const INGREDIENT_CATEGORIES = [
  "곡류",
  "육류",
  "생선",
  "달걀",
  "두부/콩",
  "채소",
  "과일",
  "유제품",
  "해조류",
  "조미료",
  "냉동식품",
  "기타",
] as const;

export type IngredientCategory = (typeof INGREDIENT_CATEGORIES)[number];

export type Ingredient = {
  id: string;
  name: string;
  category: IngredientCategory;
  primary_nutrients?: string[];
  food_groups?: string[];
  created_at: string;
};

export type IngredientSafetyRuleRow = {
  id: string;
  ingredient_id: string;
  age_from_month: number;
  age_to_month: number | null;
  safety_level: "SAFE" | "SAFE_AFTER_MODIFICATION" | "UNSAFE";
  hazard_type: string | null;
  modification_note: string | null;
  created_at: string;
};

export type UserIngredient = {
  id: string;
  user_id: string;
  ingredient_id: string;
  is_owned: boolean;
  expiry_date: string | null;
  usage_count: number;
  registered_at: string;
  updated_at: string;
};
