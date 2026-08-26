import { SupabaseClient } from "@supabase/supabase-js";
import { RecipeWithDetails } from "@/lib/types/recipe";

/**
 * recipes + recipe_ingredients(+ingredients 이름) + recipe_steps + nutrition_data 를
 * 한 번에 조합해서 가져온다. STEP 8에서 이 결과를 recommend.ts 의 scoreRecipes 입력으로 변환해 쓴다.
 */
/** 레시피 상세 화면(STEP 8, 스펙 12장)에서 사용 — 레시피 하나만 조인해서 가져온다. */
export async function fetchRecipeById(
  supabase: SupabaseClient,
  recipeId: string
): Promise<RecipeWithDetails | null> {
  const [{ data: recipe, error: recipeError }, { data: ingredients }, { data: steps }, { data: nutrition }] =
    await Promise.all([
      supabase.from("recipes").select("*").eq("id", recipeId).single(),
      supabase.from("recipe_ingredients").select("*, ingredient:ingredients(name, category)").eq("recipe_id", recipeId),
      supabase.from("recipe_steps").select("*").eq("recipe_id", recipeId).order("step_number"),
      supabase.from("nutrition_data").select("*").eq("recipe_id", recipeId).maybeSingle(),
    ]);

  if (recipeError || !recipe) return null;

  return {
    ...recipe,
    ingredients: ingredients ?? [],
    steps: steps ?? [],
    nutrition: nutrition ?? null,
  };
}

export async function fetchAllRecipesWithDetails(supabase: SupabaseClient): Promise<RecipeWithDetails[]> {
  const [{ data: recipes, error: recipesError }, { data: ingredients }, { data: steps }, { data: nutrition }] =
    await Promise.all([
      supabase.from("recipes").select("*"),
      supabase.from("recipe_ingredients").select("*, ingredient:ingredients(name, category)"),
      supabase.from("recipe_steps").select("*").order("step_number"),
      supabase.from("nutrition_data").select("*"),
    ]);

  if (recipesError || !recipes) {
    throw new Error(`레시피를 불러오지 못했어요: ${recipesError?.message ?? "알 수 없는 오류"}`);
  }

  return recipes.map((recipe) => ({
    ...recipe,
    ingredients: (ingredients ?? []).filter((i) => i.recipe_id === recipe.id),
    steps: (steps ?? []).filter((s) => s.recipe_id === recipe.id),
    nutrition: (nutrition ?? []).find((n) => n.recipe_id === recipe.id) ?? null,
  }));
}
