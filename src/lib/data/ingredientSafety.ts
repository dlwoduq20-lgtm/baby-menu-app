import { SupabaseClient } from "@supabase/supabase-js";

export type IngredientSafetyRule = {
  ingredientId: string;
  ingredientName: string;
  ageFromMonth: number;
  ageToMonth: number | null;
  safetyLevel: "SAFE" | "SAFE_AFTER_MODIFICATION" | "UNSAFE";
  hazardType: string | null;
  modificationNote: string | null;
};

export async function fetchIngredientSafetyRules(
  supabase: SupabaseClient
): Promise<IngredientSafetyRule[]> {
  try {
    const { data, error } = await supabase
      .from("ingredient_safety_rules")
      .select("ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note, ingredient:ingredients(name)");

    if (error || !data) return [];

    return (data as any[]).map((r) => ({
      ingredientId: r.ingredient_id,
      ingredientName: r.ingredient?.name ?? "",
      ageFromMonth: r.age_from_month,
      ageToMonth: r.age_to_month,
      safetyLevel: r.safety_level,
      hazardType: r.hazard_type,
      modificationNote: r.modification_note,
    }));
  } catch {
    return [];
  }
}
