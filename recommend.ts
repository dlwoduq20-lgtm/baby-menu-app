import { AgeStage } from "./babyAge";
import { AgeRule, checkIngredientSafety } from "./safetyRules";
import { RecipeWithDetails } from "./types/recipe";

export type Recipe = {
  id: string;
  name: string;
  minAgeStage: AgeStage; // 이 이상부터 추천 가능
  cookMinutes: number;
  difficulty: 1 | 2 | 3;
  requiredIngredients: string[]; // 재료 이름 목록
  allergens: string[]; // 이 레시피가 포함하는 알레르기 유발 식품
  isQuick: boolean; // 초간편 메뉴 여부 (스펙 9장: 메뉴 2)
};

export type Baby = {
  ageStage: AgeStage;
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
  return {
    id: row.id,
    name: row.name,
    minAgeStage: row.min_age_stage,
    cookMinutes: row.cook_minutes,
    difficulty: row.difficulty,
    requiredIngredients: row.ingredients.map((i) => i.ingredient?.name ?? "").filter(Boolean),
    allergens: row.allergens,
    isQuick: row.is_quick,
  };
}

const AGE_ORDER: AgeStage[] = ["0-5", "6-8", "9-11", "12-17", "18-23", "24+"];

export type ScoreOptions = {
  /** 최근 며칠 내 이미 추천된 레시피 id (스펙 8장: "최근 추천되지 않은 메뉴 우선") */
  recentRecipeIds?: string[];
  /** recipe_id → 가중치 (좋아요/만들어봤어요는 +, 별로예요는 -, 스펙 18장) */
  preferenceWeights?: Record<string, number>;
};

/**
 * 스펙 16장의 순서를 그대로 코드로 옮긴 "검증 레이어".
 * AI는 이 함수가 걸러낸 candidates 중에서만 최종 2개를 고른다 (스펙 16, 17장).
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

      const score =
        matchRatio * 100 -
        missing.length * 15 -
        r.cookMinutes * 0.3 -
        r.difficulty * 3 +
        (weights[r.id] ?? 0) * 5 - // 6. 부모가 과거 좋아했던 메뉴 (스펙 8장)
        (recentSet.has(r.id) ? 25 : 0); // 5. 최근 추천되지 않은 메뉴 우선 (스펙 8장)

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

/** 오늘의 추천 1개 + 초간편 추천 1개를 뽑는다 (스펙 9장) */
export function pickTodaysTwo(scored: ScoredRecipe[]) {
  const main = scored.find((r) => !r.isQuick);
  const quick = scored.find((r) => r.isQuick);
  return { main, quick };
}
