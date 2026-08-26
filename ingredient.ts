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
