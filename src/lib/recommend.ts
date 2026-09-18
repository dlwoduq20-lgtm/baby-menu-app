import { AgeStage } from "./babyAge";
import { AgeRule, checkIngredientSafety } from "./safetyRules";
import { RecipeWithDetails } from "./types/recipe";
import { IngredientSafetyRule } from "./data/ingredientSafety";

export type Recipe = {
  id: string;
  name: string;
  minAgeStage: AgeStage; // 이 이상부터 추천 가능
  cookMinutes: number;
  difficulty: 1 | 2 | 3;
  requiredIngredients: string[]; // 재료 이름 목록
  allergens: string[]; // 이 레시피가 포함하는 알레르기 유발 식품
  isQuick: boolean; // 초간편 메뉴 여부 (스펙 9장: 메뉴 2)
  imageUrl: string | null; // 관리자가 업로드한 실제 사진 (없으면 화면에서 일러스트로 대체)
  menuType?: string | null; // 메뉴 타입 (다양성 점수용 — 덮밥만 반복되는 것 방지)
  foodGroups?: string[]; // 식품군 집합 (WHO 최소 식이 다양성 기준용)
};

export type Baby = {
  ageStage: AgeStage;
  ageMonths?: number;
  allergies: string[];
  dislikedFoods: string[];
};

export type ScoredRecipe = Recipe & {
  ownedCount: number;
  missingIngredients: string[];
  score: number;
  passedSafetyCheck: boolean;
};

/** DB에서 조인해 가져온 레시피 상세를 추천 엔진이 쓰는 Recipe 형태로 변환한다. */
export function toEngineRecipe(row: RecipeWithDetails): Recipe {
  const foodGroups = Array.from(
    new Set(row.ingredients.flatMap((i) => i.ingredient?.food_groups ?? []))
  );

  return {
    id: row.id,
    name: row.name,
    minAgeStage: row.min_age_stage,
    cookMinutes: row.cook_minutes,
    difficulty: row.difficulty,
    requiredIngredients: row.ingredients.map((i) => i.ingredient?.name ?? "").filter(Boolean),
    allergens: row.allergens,
    isQuick: row.is_quick,
    imageUrl: row.image_url,
    menuType: row.menu_type ?? null,
    foodGroups,
  };
}

const AGE_ORDER: AgeStage[] = ["0-5", "6-8", "9-11", "12-17", "18-23", "24+"];

export type ScoreOptions = {
  /** 최근 며칠 내 이미 추천된 레시피 id (스펙 8장: "최근 추천되지 않은 메뉴 우선") */
  recentRecipeIds?: string[];
  /** recipe_id → 가중치 (좋아요/만들어봤어요는 +, 별로예요는 -, 스펙 18장) */
  preferenceWeights?: Record<string, number>;
  /** 1) 월령 정밀 매칭 레시피 id 집합 (recipe_age_variants에 매칭) -> +20점 가산 */
  ageVariantMatchedRecipeIds?: Set<string>;
  /** 2) 최근 3일간 추천된 레시피들의 menu_type 감점 매핑 (어제 -20, 2일전 -15, 3일전 -10 등) */
  recentMenuTypePenalties?: Record<string, number>;
  /** 3) 최근 3일간 등장한 식품군 집합 (후보 레시피의 미등장 식품군마다 개수 × 8점 가산) */
  recentFoodGroups?: Set<string>;
};

/**
 * 스펙 16장의 순서를 그대로 코드로 옮긴 "검증 레이어" + 대규모 재설계 2단계 추천 점수식.
 * AI는 이 함수가 걸러낸 candidates 중에서만 최종 2개를 고른다.
 * 1) 월령 적합성 → 2) 알레르기/금기 → 3) 보유 재료 매칭 → 4) 추가구매 최소화 → ...
 */
export function scoreRecipes(
  recipes: Recipe[],
  baby: Baby,
  ownedIngredients: string[],
  options: ScoreOptions = {}
): ScoredRecipe[] {
  const ownedSet = new Set(ownedIngredients);
  const babyStageIdx = AGE_ORDER.indexOf(baby.ageStage);
  const recentSet = new Set(options.recentRecipeIds ?? []);
  const weights = options.preferenceWeights ?? {};

  return recipes
    .filter((r) => AGE_ORDER.indexOf(r.minAgeStage) <= babyStageIdx) // 1. 월령 적합성
    .filter((r) => !r.allergens.some((a) => baby.allergies.includes(a))) // 2. 알레르기/금기 필터
    .map((r) => {
      const missing = r.requiredIngredients.filter((i) => !ownedSet.has(i));
      const ownedCount = r.requiredIngredients.length - missing.length;
      const matchRatio = ownedCount / r.requiredIngredients.length;

      const stageDistance = babyStageIdx - AGE_ORDER.indexOf(r.minAgeStage); // 0 이상 (필터를 이미 통과했으므로)

      let score =
        matchRatio * 100 -
        missing.length * 15 -
        r.cookMinutes * 0.3 -
        r.difficulty * 3 +
        (weights[r.id] ?? 0) * 5 - // 6. 부모가 과거 좋아했던 메뉴 (스펙 8장)
        (recentSet.has(r.id) ? 25 : 0) - // 5. 최근 추천되지 않은 메뉴 우선 (스펙 8장)
        stageDistance * 6; // 월령이 멀수록 감점

      // -------------------------------------------------------------
      // 대규모 재설계 2단계 신규 점수식
      // -------------------------------------------------------------
      // 1) 월령 정밀 매칭 가산점 (+20점)
      if (options.ageVariantMatchedRecipeIds?.has(r.id)) {
        score += 20;
      }

      // 2) 메뉴 타입 다양성 감점 (최근 3일 안에 이미 나온 menu_type 감점)
      if (r.menuType && options.recentMenuTypePenalties && options.recentMenuTypePenalties[r.menuType]) {
        score -= options.recentMenuTypePenalties[r.menuType];
      }

      // 3) 식품군 균형 가산점 (최근 3일간 미등장한 식품군 개수 × 8점 가산)
      if (options.recentFoodGroups && r.foodGroups && r.foodGroups.length > 0) {
        const unrepresentedGroups = r.foodGroups.filter((g) => !options.recentFoodGroups!.has(g));
        score += unrepresentedGroups.length * 8;
      }

      return {
        ...r,
        ownedCount,
        missingIngredients: missing,
        score,
        passedSafetyCheck: true, // applySafetyFilter에서 실제 값으로 갱신됨
      };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * 스펙 16장: "영양/월령/안전성 검증" 단계.
 * age_rules 테이블에서 가져온 실제 규칙으로 각 후보 레시피의 재료를 다시 한 번 점검하고,
 * 하나라도 안전 기준을 통과하지 못하면 후보에서 제외한다.
 */
export function applySafetyFilter(scored: ScoredRecipe[], stage: AgeStage, rules: AgeRule[]): ScoredRecipe[] {
  return scored
    .map((r) => {
      const allSafe = r.requiredIngredients.every((ing) => checkIngredientSafety(stage, ing, rules).safe);
      return { ...r, passedSafetyCheck: allSafe };
    })
    .filter((r) => r.passedSafetyCheck);
}

/**
 * 대규모 재설계 2단계: 안전 3단계 반영 (하드 필터)
 * 후보 레시피의 재료 중 하나라도 ingredient_safety_rules에서
 * age_from_month <= ageMonths and (age_to_month is null or age_to_month >= ageMonths)
 * 조건에 맞는 행이 있고 safety_level = 'UNSAFE'인 경우, 해당 레시피는 후보에서 완전히 제외한다.
 * SAFE_AFTER_MODIFICATION인 경우는 제외하지 않고 그대로 후보에 남긴다.
 */
export function applyIngredientSafetyFilter(
  scored: ScoredRecipe[],
  ageMonths: number,
  safetyRules: IngredientSafetyRule[]
): ScoredRecipe[] {
  const unsafeIngredients = new Set(
    safetyRules
      .filter((rule) => {
        if (rule.safetyLevel !== "UNSAFE") return false;
        if (rule.ageFromMonth > ageMonths) return false;
        if (rule.ageToMonth !== null && rule.ageToMonth < ageMonths) return false;
        return true;
      })
      .map((rule) => rule.ingredientName)
  );

  if (unsafeIngredients.size === 0) return scored;

  return scored.filter((recipe) => {
    const hasUnsafe = recipe.requiredIngredients.some((ing) => unsafeIngredients.has(ing));
    return !hasUnsafe;
  });
}

/** 오늘의 추천 1개 + 초간편 추천 1개를 뽑는다 (스펙 9장) */
export function pickTodaysTwo(scored: ScoredRecipe[]) {
  const main = scored.find((r) => !r.isQuick);
  const quick = scored.find((r) => r.isQuick);
  return { main, quick };
}
