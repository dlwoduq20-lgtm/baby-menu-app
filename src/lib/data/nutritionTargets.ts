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

export async function fetchNutritionTargets(supabase: SupabaseClient): Promise<NutritionTarget[]> {
  const { data, error } = await supabase.from("nutrition_targets").select("*");
  if (error || !data) {
    throw new Error(`영양 목표치를 불러오지 못했어요: ${error?.message ?? "알 수 없는 오류"}`);
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
}

export function findTargetForStage(targets: NutritionTarget[], stage: AgeStage) {
  return targets.find((t) => t.stage === stage) ?? null;
}

/** 0~100 사이로 클램프한 커버리지 퍼센트. 목표치가 없으면 null. */
export function coveragePercent(actual: number | null | undefined, target: number | null | undefined) {
  if (!target || target <= 0 || actual == null) return null;
  return Math.max(0, Math.min(100, Math.round((actual / target) * 100)));
}
