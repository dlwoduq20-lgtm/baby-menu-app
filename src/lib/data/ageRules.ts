import { SupabaseClient } from "@supabase/supabase-js";
import { AgeRule } from "@/lib/safetyRules";

export const DEFAULT_AGE_RULES: AgeRule[] = [
  {
    stage: "0-5",
    recommendedFoodGroups: [],
    texture: "이유식 대상 아님",
    foodSizeGuide: "해당 없음",
    cookingMethod: "해당 없음",
    avoidFoods: [],
    cautionFoods: [],
    allergyCaution: "이 서비스는 만 6개월 이상을 기준으로 추천합니다. 그 이전 시기의 수유·이유식 시작은 소아과 상담을 먼저 받아보세요.",
    chokingHazardFoods: [],
  },
  {
    stage: "6-8",
    recommendedFoodGroups: ["곡류(쌀미음)", "으깬 채소", "으깬 과일", "살코기 소량"],
    texture: "완전히 으깬 형태 (퓨레/미음 수준)",
    foodSizeGuide: "입자 없이 곱게 으깬 상태",
    cookingMethod: "푹 삶아서 곱게 으깨거나 갈아서 조리",
    avoidFoods: ["꿀", "날계란", "덜 익힌 육류/생선", "간이 강한 음식", "우유(음료 대체용)"],
    cautionFoods: ["새로운 알레르기 유발 식품은 한 번에 하나씩만 시도"],
    allergyCaution: "계란, 우유, 밀, 대두, 견과류, 갑각류 등은 소량씩 단독으로 먼저 시도하고 반응을 관찰하세요.",
    chokingHazardFoods: ["통포도", "견과류(통알)", "팝콘", "생당근"],
  },
  {
    stage: "9-11",
    recommendedFoodGroups: ["곡류", "잘게 다진 채소", "잘게 다진 육류/생선", "두부/달걀"],
    texture: "잘게 다진 형태",
    foodSizeGuide: "3~5mm 크기로 다짐",
    cookingMethod: "푹 삶거나 쪄서 잘게 다지기",
    avoidFoods: ["꿀", "날계란", "덜 익힌 육류/생선", "과도한 나트륨/당류"],
    cautionFoods: ["질식 위험 재료는 반드시 다진 형태로만 제공"],
    allergyCaution: "이미 확인된 알레르기 식품은 완전히 제외. 새로운 식품은 여전히 소량부터 시작하세요.",
    chokingHazardFoods: ["통포도", "견과류(통알)", "팝콘", "큰 고기 덩어리"],
  },
  {
    stage: "12-17",
    recommendedFoodGroups: ["일반 곡류", "채소", "육류/생선/두부", "유제품(소량)"],
    texture: "잘게 썬 진밥 수준",
    foodSizeGuide: "5~8mm 크기로 썰기",
    cookingMethod: "부드럽게 조리, 간은 최소화",
    avoidFoods: ["과도한 나트륨/당류", "날계란"],
    cautionFoods: ["질식 위험 식품은 잘게 썰어서만 제공"],
    allergyCaution: "반응이 확인된 알레르기 식품 외에는 다양한 식품군을 조금씩 넓혀가도 좋습니다.",
    chokingHazardFoods: ["통포도", "견과류(통알)", "팝콘"],
  },
  {
    stage: "18-23",
    recommendedFoodGroups: ["가족식과 유사한 일반 식품군 전반"],
    texture: "부드러운 일반식에 가까운 형태",
    foodSizeGuide: "한 입 크기(1~1.5cm)로 자르기",
    cookingMethod: "일반 조리, 다만 간은 성인보다 약하게",
    avoidFoods: ["과도한 나트륨/당류"],
    cautionFoods: ["통포도, 방울토마토 등은 4등분 이상으로 잘라서 제공"],
    allergyCaution: "확인된 알레르기 식품은 계속 제외하세요.",
    chokingHazardFoods: ["통포도(자르지 않은 경우)", "단단한 생채소", "견과류(통알)"],
  },
  {
    stage: "24+",
    recommendedFoodGroups: ["가족식 응용 가능"],
    texture: "가족식과 거의 동일, 크기만 조절",
    foodSizeGuide: "아기 한 입 크기 유지",
    cookingMethod: "가족식 조리법을 그대로 응용 가능",
    avoidFoods: [],
    cautionFoods: ["단단한 생채소나 견과류는 잘게 잘라서 제공"],
    allergyCaution: "확인된 알레르기 식품은 계속 제외하세요.",
    chokingHazardFoods: ["단단한 생채소(큼직하게 썬 경우)", "견과류(통알)"],
  },
];

export async function fetchAgeRules(supabase: SupabaseClient): Promise<AgeRule[]> {
  try {
    const { data, error } = await supabase.from("age_rules").select("*");

    if (error || !data || data.length === 0) {
      return DEFAULT_AGE_RULES;
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
  } catch {
    return DEFAULT_AGE_RULES;
  }
}
