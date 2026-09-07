import { SupabaseClient } from "@supabase/supabase-js";
import { AgeStage } from "@/lib/babyAge";

export type NutritionTarget = {
  stage: AgeStage;
  dailyCarbsG: number | null;
  dailyProteinG: number | null;
  dailyFatG: number | null;
  dailyFiberG: number | null;
  keyNutrients: string[];
  source: string;
};

export const DEFAULT_NUTRITION_TARGETS: NutritionTarget[] = [
  { stage: "0-5", dailyCarbsG: null, dailyProteinG: null, dailyFatG: null, dailyFiberG: null, keyNutrients: [], source: "이유식 대상 아님" },
  { stage: "6-8", dailyCarbsG: 60, dailyProteinG: 12, dailyFatG: 25, dailyFiberG: 5, keyNutrients: ["철분", "아연"], source: "한국영양학회 영유아 식이섭취기준" },
  { stage: "9-11", dailyCarbsG: 70, dailyProteinG: 15, dailyFatG: 28, dailyFiberG: 6, keyNutrients: ["철분", "칼슘"], source: "한국영양학회 영유아 식이섭취기준" },
  { stage: "12-17", dailyCarbsG: 90, dailyProteinG: 20, dailyFatG: 30, dailyFiberG: 8, keyNutrients: ["칼슘", "철분", "비타민D"], source: "한국영양학회 유아 식이섭취기준" },
  { stage: "18-23", dailyCarbsG: 100, dailyProteinG: 22, dailyFatG: 32, dailyFiberG: 9, keyNutrients: ["칼슘", "철분"], source: "한국영양학회 유아 식이섭취기준" },
  { stage: "24+", dailyCarbsG: 110, dailyProteinG: 25, dailyFatG: 35, dailyFiberG: 10, keyNutrients: ["칼슘", "철분", "비타민D"], source: "한국영양학회 유아 식이섭취기준" },
];

export async function fetchNutritionTargets(supabase: SupabaseClient): Promise<NutritionTarget[]> {
  try {
    const { data, error } = await supabase.from("nutrition_targets").select("*");
    if (error || !data || data.length === 0) {
      return DEFAULT_NUTRITION_TARGETS;
    }
    return data.map((row) => ({
      stage: row.stage,
      dailyCarbsG: row.daily_carbs_g,
      dailyProteinG: row.daily_protein_g,
      dailyFatG: row.daily_fat_g,
      dailyFiberG: row.daily_fiber_g,
      keyNutrients: row.key_nutrients ?? [],
      source: row.source,
    }));
  } catch {
    return DEFAULT_NUTRITION_TARGETS;
  }
}

export function findTargetForStage(targets: NutritionTarget[], stage: AgeStage) {
  return targets.find((t) => t.stage === stage) ?? null;
}

/** 0~100 사이로 클램프한 커버리지 퍼센트. 목표치가 없으면 null. */
export function coveragePercent(actual: number | null | undefined, target: number | null | undefined) {
  if (!target || target <= 0 || actual == null) return null;
  return Math.max(0, Math.min(100, Math.round((actual / target) * 100)));
}
