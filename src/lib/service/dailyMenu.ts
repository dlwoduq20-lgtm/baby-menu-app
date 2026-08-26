import { SupabaseClient } from "@supabase/supabase-js";
import { calcAgeInMonths, getAgeStage, AgeStage } from "@/lib/babyAge";
import { scoreRecipes, applySafetyFilter, toEngineRecipe, ScoredRecipe } from "@/lib/recommend";
import { fetchAllRecipesWithDetails } from "@/lib/data/recipes";
import { fetchAgeRules } from "@/lib/data/ageRules";
import { pickTodaysMenuWithAI } from "@/lib/ai/pickTodaysMenu";

export type DailyMenuResult = {
  baby: { id: string; name: string };
  ageMonths: number;
  ageStage: AgeStage;
  main: ScoredRecipe | undefined;
  quick: ScoredRecipe | undefined;
  mainReason: string | null;
  quickReason: string | null;
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * 스펙 9, 16, 18장의 전체 파이프라인을 한 곳에 모아둔 함수.
 * - `/home` (사용자 세션 클라이언트)
 * - 오후 4시 알림 크론 (서비스 롤 클라이언트, STEP 10)
 * 두 곳에서 동일한 로직을 그대로 재사용한다.
 */
export async function computeDailyMenu(supabase: SupabaseClient, userId: string): Promise<DailyMenuResult | null> {
  const { data: babies } = await supabase.from("babies").select("*").eq("user_id", userId).limit(1);
  const baby = babies?.[0];
  if (!baby) return null;

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const [{ data: allergyRows }, { data: ownedRows }, recipes, ageRules, { data: recentRows }, { data: feedbackRows }] =
    await Promise.all([
      supabase.from("baby_allergies").select("allergen").eq("baby_id", baby.id),
      supabase
        .from("user_ingredients")
        .select("ingredient_id, ingredient:ingredients(name)")
        .eq("user_id", userId)
        .eq("is_owned", true),
      fetchAllRecipesWithDetails(supabase),
      fetchAgeRules(supabase),
      // 스펙 8장: 최근 추천된 메뉴는 우선순위를 낮춘다
      supabase
        .from("recommendations")
        .select("recipe_id")
        .eq("baby_id", baby.id)
        .gte("recommended_date", threeDaysAgo.toISOString().slice(0, 10)),
      // 스펙 18장: 좋아요/만들어봤어요는 가중치 +, 별로예요는 -
      supabase.from("recommendation_feedback").select("recipe_id, feedback_type").eq("user_id", userId),
    ]);

  const ageMonths = calcAgeInMonths(baby.birth_date);
  const ageStage = getAgeStage(ageMonths);

  const ownedIngredientNames = (ownedRows ?? [])
    .map((r: any) => r.ingredient?.name as string | undefined)
    .filter((n): n is string => Boolean(n));

  const recentRecipeIds = (recentRows ?? []).map((r) => r.recipe_id);

  const preferenceWeights: Record<string, number> = {};
  for (const row of feedbackRows ?? []) {
    const delta = row.feedback_type === "like" ? 1 : row.feedback_type === "cooked" ? 0.5 : row.feedback_type === "dislike" ? -1.5 : 0;
    preferenceWeights[row.recipe_id] = (preferenceWeights[row.recipe_id] ?? 0) + delta;
  }

  const engineRecipes = recipes.map(toEngineRecipe);
  const scored = scoreRecipes(
    engineRecipes,
    { ageStage, allergies: (allergyRows ?? []).map((r) => r.allergen), dislikedFoods: [] },
    ownedIngredientNames,
    { recentRecipeIds, preferenceWeights }
  );
  const safeScored = applySafetyFilter(scored, ageStage, ageRules);

  const mainCandidates = safeScored.filter((r) => !r.isQuick);
  const quickCandidates = safeScored.filter((r) => r.isQuick);

  const aiPick = await pickTodaysMenuWithAI(mainCandidates, quickCandidates, {
    babyName: baby.name,
    ageMonths,
    ownedIngredients: ownedIngredientNames,
  });

  const aiMain = aiPick ? mainCandidates.find((r) => r.id === aiPick.mainRecipeId) : undefined;
  const aiQuick = aiPick ? quickCandidates.find((r) => r.id === aiPick.quickRecipeId) : undefined;

  const main = aiMain ?? mainCandidates[0];
  const quick = aiQuick ?? quickCandidates[0];

  // 오늘 무엇을 추천했는지 기록 (같은 날 다시 계산되면 upsert로 덮어쓴다).
  const today = todayISO();
  const rowsToLog = [
    main && { user_id: userId, baby_id: baby.id, recipe_id: main.id, recommendation_type: "main", recommended_date: today },
    quick && { user_id: userId, baby_id: baby.id, recipe_id: quick.id, recommendation_type: "quick", recommended_date: today },
  ].filter(Boolean);
  if (rowsToLog.length > 0) {
    await supabase.from("recommendations").upsert(rowsToLog, { onConflict: "baby_id,recommendation_type,recommended_date" });
  }

  return {
    baby: { id: baby.id, name: baby.name },
    ageMonths,
    ageStage,
    main,
    quick,
    mainReason: aiMain ? aiPick?.mainReason ?? null : null,
    quickReason: aiQuick ? aiPick?.quickReason ?? null : null,
  };
}
