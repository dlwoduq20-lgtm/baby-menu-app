import { AgeStage } from "./babyAge";

/**
 * 스펙 14/15장: "하드코딩하지 말고 DB에서 관리"
 * → 이제 이 파일은 순수 판정 로직만 담당하고, 실제 규칙 데이터는
 *   `age_rules` 테이블(0004_age_rules.sql)에서 `fetchAgeRules()`로 가져와 주입한다.
 */
export type AgeRule = {
  stage: AgeStage;
  recommendedFoodGroups: string[];
  texture: string;
  foodSizeGuide: string;
  cookingMethod: string;
  avoidFoods: string[];
  cautionFoods: string[];
  allergyCaution: string | null;
  chokingHazardFoods: string[];
};

export type SafetyCheckResult = { safe: boolean; reason: string | null };

/** 특정 월령 구간에서 이 재료가 안전한지 1차 점검한다. rules는 반드시 DB에서 불러온 값을 넘겨야 한다. */
export function checkIngredientSafety(
  stage: AgeStage,
  ingredientName: string,
  rules: AgeRule[]
): SafetyCheckResult {
  if (stage === "0-5") {
    return { safe: false, reason: "이 서비스의 추천 대상 월령이 아닙니다." };
  }

  const rule = rules.find((r) => r.stage === stage);
  if (!rule) {
    // 규칙 데이터를 못 찾은 경우 "안전하다고 단정하지 않는다" — 검증 실패로 취급 (스펙 15장 원칙)
    return { safe: false, reason: `${stage} 구간에 대한 안전 규칙을 찾을 수 없습니다.` };
  }

  const hazard = rule.chokingHazardFoods.find((f) => ingredientName.includes(f));
  if (hazard) {
    return { safe: false, reason: `질식 위험: "${hazard}"는 이 월령에서 조리 형태를 반드시 확인해야 합니다.` };
  }

  const avoided = rule.avoidFoods.find((f) => ingredientName.includes(f));
  if (avoided) {
    return { safe: false, reason: `이 월령에서는 "${avoided}"를 피해야 합니다.` };
  }

  return { safe: true, reason: null };
}
