import { SupabaseClient } from "@supabase/supabase-js";
import { AgeRule } from "@/lib/safetyRules";

export async function fetchAgeRules(supabase: SupabaseClient): Promise<AgeRule[]> {
  const { data, error } = await supabase.from("age_rules").select("*");

  if (error || !data) {
    throw new Error(`월령별 안전 규칙을 불러오지 못했어요: ${error?.message ?? "알 수 없는 오류"}`);
  }

  return data.map((row) => ({
    stage: row.stage,
    recommendedFoodGroups: row.recommended_food_groups ?? [],
    texture: row.texture,
    foodSizeGuide: row.food_size_guide,
    cookingMethod: row.cooking_method,
    avoidFoods: row.avoid_foods ?? [],
    cautionFoods: row.caution_foods ?? [],
    allergyCaution: row.allergy_caution,
    chokingHazardFoods: row.choking_hazard_foods ?? [],
  }));
}
