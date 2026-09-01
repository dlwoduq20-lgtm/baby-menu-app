import { SupabaseClient } from "@supabase/supabase-js";
import { calcAgeInMonths, getAgeStage, AgeStage } from "@/lib/babyAge";
import { scoreRecipes, applySafetyFilter, toEngineRecipe, ScoredRecipe } from "@/lib/recommend";
import { fetchAllRecipesWithDetails } from "@/lib/data/recipes";
import { fetchAgeRules } from "@/lib/data/ageRules";
import { fetchNutritionTargets, findTargetForStage, coveragePercent } from "@/lib/data/nutritionTargets";
import { RecipeWithDetails } from "@/lib/types/recipe";

export type WeeklyDayPlan = {
  dayOffset: number;
  date: string;
  main?: RecipeWithDetails;
  quick?: RecipeWithDetails;
};

export type ShoppingListItem = {
  ingredientId: string;
  name: string;
  category: string;
  totalQuantity: number;
  unit: string;
  owned: boolean;
};

export type WeeklyPlanResult = {
  weekStartDate: string;
  baby: { id: string; name: string };
  ageMonths: number;
  ageStage: AgeStage;
  days: WeeklyDayPlan[];
  nutritionCoverage: {
    carbs: number | null;
    protein: number | null;
    fat: number | null;
    fiber: number | null;
    source: string | null;
  };
  shoppingList: ShoppingListItem[];
};

const DAY_LABELS = ["토", "일", "월", "화", "수", "목", "금"];

/** 이번 "식단 주"의 시작일(토요일)을 구한다. 매주 토요일 오전 10시에 새 주간 식단이 만들어진다는 스펙 기준. */
export function getWeekStartDate(today: Date = new Date()): Date {
  const d = new Date(today);
  const day = d.getDay(); // 0=일 ... 6=토
  const diffToSaturday = (day - 6 + 7) % 7; // 오늘이 토요일이면 0, 아니면 지난 토요일까지 며칠 전인지
  d.setDate(d.getDate() - diffToSaturday);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

/**
 * 이번 주 식단을 계산한다. 이미 이번 주 식단이 저장되어 있으면 그대로 재사용하고(같은 주는 안정적으로 유지),
 * 없으면 새로 생성해서 저장한다. AI 개별 호출 없이 결정론적 스코어링만 사용한다 (한 번에 14개 슬롯을 채우는 배치 작업).
 */
export async function computeWeeklyPlan(supabase: SupabaseClient, userId: string): Promise<WeeklyPlanResult | null> {
  const { data: babies } = await supabase.from("babies").select("*").eq("user_id", userId).limit(1);
  const baby = babies?.[0];
  if (!baby) return null;

  const weekStart = getWeekStartDate();
  const weekStartISO = toISODate(weekStart);

  const ageMonths = calcAgeInMonths(baby.birth_date);
  const ageStage = getAgeStage(ageMonths);

  const [recipes, ageRules, nutritionTargets, { data: allergyRows }, { data: ownedRows }] = await Promise.all([
    fetchAllRecipesWithDetails(supabase),
    fetchAgeRules(supabase),
    fetchNutritionTargets(supabase),
    supabase.from("baby_allergies").select("allergen").eq("baby_id", baby.id),
    supabase
      .from("user_ingredients")
      .select("ingredient_id, ingredient:ingredients(name)")
      .eq("user_id", userId)
      .eq("is_owned", true),
  ]);

  const recipeById = new Map(recipes.map((r) => [r.id, r]));
  const ownedIngredientIds = new Set((ownedRows ?? []).map((r: any) => r.ingredient_id as string));
  const ownedIngredientNames = (ownedRows ?? [])
    .map((r: any) => r.ingredient?.name as string | undefined)
    .filter((n): n is string => Boolean(n));

  // 이미 이번 주 식단이 있으면 재사용
  const { data: existingPlan } = await supabase
    .from("weekly_meal_plans")
    .select("id")
    .eq("baby_id", baby.id)
    .eq("week_start_date", weekStartISO)
    .maybeSingle();

  let dayRecipeIds: { dayOffset: number; mealType: "main" | "quick"; recipeId: string }[];

  if (existingPlan) {
    const { data: items } = await supabase
      .from("weekly_meal_plan_items")
      .select("day_offset, meal_type, recipe_id")
      .eq("plan_id", existingPlan.id);
    dayRecipeIds = (items ?? []).map((i) => ({ dayOffset: i.day_offset, mealType: i.meal_type, recipeId: i.recipe_id }));
  } else {
    const engineRecipes = recipes.map(toEngineRecipe);
    const babyForEngine = { ageStage, allergies: (allergyRows ?? []).map((r) => r.allergen), dislikedFoods: [] };
    const usedThisWeek = new Set<string>();
    dayRecipeIds = [];

    for (let day = 0; day < 7; day++) {
      const scored = scoreRecipes(engineRecipes, babyForEngine, ownedIngredientNames, { recentRecipeIds: [...usedThisWeek] });
      const safe = applySafetyFilter(scored, ageStage, ageRules);

      const pick = (candidates: ScoredRecipe[]) => {
        const fresh = candidates.filter((r) => !usedThisWeek.has(r.id));
        return fresh[0] ?? candidates[0]; // 후보가 다 소진되면 그냥 최상위로 반복 허용
      };

      const main = pick(safe.filter((r) => !r.isQuick));
      const quick = pick(safe.filter((r) => r.isQuick));
      if (main) {
        usedThisWeek.add(main.id);
        dayRecipeIds.push({ dayOffset: day, mealType: "main", recipeId: main.id });
      }
      if (quick) {
        usedThisWeek.add(quick.id);
        dayRecipeIds.push({ dayOffset: day, mealType: "quick", recipeId: quick.id });
      }
    }

    const { data: planRow } = await supabase
      .from("weekly_meal_plans")
      .upsert({ user_id: userId, baby_id: baby.id, week_start_date: weekStartISO }, { onConflict: "baby_id,week_start_date" })
      .select("id")
      .single();

    if (planRow) {
      await supabase.from("weekly_meal_plan_items").delete().eq("plan_id", planRow.id);
      if (dayRecipeIds.length > 0) {
        await supabase.from("weekly_meal_plan_items").insert(
          dayRecipeIds.map((d) => ({ plan_id: planRow.id, day_offset: d.dayOffset, meal_type: d.mealType, recipe_id: d.recipeId }))
        );
      }
    }
  }

  // 화면/알림에서 쓸 구조로 조립
  const days: WeeklyDayPlan[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    return { dayOffset: i, date: toISODate(date) };
  });
  for (const item of dayRecipeIds) {
    const recipe = recipeById.get(item.recipeId);
    if (!recipe) continue;
    if (item.mealType === "main") days[item.dayOffset].main = recipe;
    else days[item.dayOffset].quick = recipe;
  }

  // 영양 커버리지: 이번 주 선택된 모든 메뉴(14개, 중복 포함)의 영양성분 합계 vs 주간 목표(일 목표 × 7)
  const target = findTargetForStage(nutritionTargets, ageStage);
  const totals = { carbs: 0, protein: 0, fat: 0, fiber: 0 };
  for (const item of dayRecipeIds) {
    const n = recipeById.get(item.recipeId)?.nutrition;
    if (!n) continue;
    totals.carbs += n.carbs_g ?? 0;
    totals.protein += n.protein_g ?? 0;
    totals.fat += n.fat_g ?? 0;
    totals.fiber += n.fiber_g ?? 0;
  }

  const nutritionCoverage = {
    carbs: coveragePercent(totals.carbs, target?.dailyCarbsG ? target.dailyCarbsG * 7 : null),
    protein: coveragePercent(totals.protein, target?.dailyProteinG ? target.dailyProteinG * 7 : null),
    fat: coveragePercent(totals.fat, target?.dailyFatG ? target.dailyFatG * 7 : null),
    fiber: coveragePercent(totals.fiber, target?.dailyFiberG ? target.dailyFiberG * 7 : null),
    source: target?.source ?? null,
  };

  // 장보기 리스트: 14개 슬롯(중복 포함)의 재료를 합산, 보유하지 않은 것만 "구매 필요"로
  const shoppingMap = new Map<string, ShoppingListItem>();
  for (const item of dayRecipeIds) {
    const recipe = recipeById.get(item.recipeId);
    if (!recipe) continue;
    for (const ri of recipe.ingredients) {
      const owned = ownedIngredientIds.has(ri.ingredient_id);
      const key = `${ri.ingredient_id}_${ri.unit}`;
      const existing = shoppingMap.get(key);
      if (existing) {
        existing.totalQuantity += ri.quantity;
      } else {
        shoppingMap.set(key, {
          ingredientId: ri.ingredient_id,
          name: ri.ingredient?.name ?? "재료",
          category: ri.ingredient?.category ?? "기타",
          totalQuantity: ri.quantity,
          unit: ri.unit,
          owned,
        });
      }
    }
  }

  return {
    weekStartDate: weekStartISO,
    baby: { id: baby.id, name: baby.name },
    ageMonths,
    ageStage,
    days,
    nutritionCoverage,
    shoppingList: Array.from(shoppingMap.values()).sort((a, b) => Number(a.owned) - Number(b.owned)),
  };
}

export { DAY_LABELS };
