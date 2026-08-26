import { AgeStage } from "@/lib/babyAge";

export type RecipeRow = {
  id: string;
  name: string;
  min_age_stage: AgeStage;
  cook_minutes: number;
  difficulty: 1 | 2 | 3;
  is_quick: boolean;
  allergens: string[];
  choking_hazard_note: string | null;
  caution_note: string | null;
  created_at: string;
};

export type RecipeIngredientRow = {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  is_optional: boolean;
  // 조인해서 가져올 때 채워지는 필드 (스펙 12장: 재료명 표시용)
  ingredient?: { name: string; category: string };
};

export type RecipeStepRow = {
  id: string;
  recipe_id: string;
  step_number: number;
  instruction: string;
};

export type NutritionDataRow = {
  id: string;
  recipe_id: string;
  carbs_g: number | null;
  protein_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  key_micronutrients: string[];
  source: string; // 스펙 13장: 반드시 출처를 남긴다
};

// 화면/추천 로직에서 쓰기 편하도록 합쳐놓은 형태
export type RecipeWithDetails = RecipeRow & {
  ingredients: RecipeIngredientRow[];
  steps: RecipeStepRow[];
  nutrition: NutritionDataRow | null;
};
