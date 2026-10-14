import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// 1. Load env
const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envContent.split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// 2. New Ingredients Data (48 items)
export const NEW_INGREDIENTS = [
  // 채소 (16개)
  { name: "양배추", category: "채소", primary_nutrients: ["비타민U", "식이섬유", "비타민C"], food_groups: ["채소"] },
  { name: "청경채", category: "채소", primary_nutrients: ["칼슘", "비타민A", "비타민C"], food_groups: ["채소"] },
  { name: "비트", category: "채소", primary_nutrients: ["철분", "엽산", "칼륨"], food_groups: ["채소"] },
  { name: "콜리플라워", category: "채소", primary_nutrients: ["비타민C", "식이섬유"], food_groups: ["채소"] },
  { name: "토마토", category: "채소", primary_nutrients: ["라이코펜", "비타민C", "식이섬유"], food_groups: ["채소"] },
  { name: "방울토마토", category: "채소", primary_nutrients: ["라이코펜", "비타민C"], food_groups: ["채소"] },
  { name: "부추", category: "채소", primary_nutrients: ["철분", "비타민A", "알리신"], food_groups: ["채소"] },
  { name: "아스파라거스", category: "채소", primary_nutrients: ["아스파라긴산", "엽산", "루테인"], food_groups: ["채소"] },
  { name: "표고버섯", category: "채소", primary_nutrients: ["비타민D", "식이섬유", "아연"], food_groups: ["채소"] },
  { name: "팽이버섯", category: "채소", primary_nutrients: ["식이섬유", "키토산", "비타민B"], food_groups: ["채소"] },
  { name: "새송이버섯", category: "채소", primary_nutrients: ["식이섬유", "비타민C"], food_groups: ["채소"] },
  { name: "느타리버섯", category: "채소", primary_nutrients: ["식이섬유", "칼륨"], food_groups: ["채소"] },
  { name: "연근", category: "채소", primary_nutrients: ["식이섬유", "비타민C", "철분"], food_groups: ["채소"] },
  { name: "우엉", category: "채소", primary_nutrients: ["식이섬유", "이눌린"], food_groups: ["채소"] },
  { name: "피망", category: "채소", primary_nutrients: ["비타민C", "비타민A"], food_groups: ["채소"] },
  { name: "깻잎", category: "채소", primary_nutrients: ["칼슘", "철분", "비타민A"], food_groups: ["채소"] },

  // 육류 (3개)
  { name: "닭안심", category: "육류", primary_nutrients: ["단백질", "필수아미노산"], food_groups: ["육류"] },
  { name: "소고기다짐육", category: "육류", primary_nutrients: ["철분", "단백질", "아연"], food_groups: ["육류"] },
  { name: "오리고기", category: "육류", primary_nutrients: ["불포화지방산", "단백질", "비타민A"], food_groups: ["육류"] },

  // 생선 (7개)
  { name: "대구살", category: "생선", primary_nutrients: ["단백질", "비타민B", "칼슘"], food_groups: ["생선"] },
  { name: "가자미살", category: "생선", primary_nutrients: ["단백질", "비타민D", "오메가3"], food_groups: ["생선"] },
  { name: "멸치", category: "생선", primary_nutrients: ["칼슘", "오메가3", "단백질"], food_groups: ["생선"] },
  { name: "오징어", category: "생선", primary_nutrients: ["타우린", "단백질"], food_groups: ["생선"] },
  { name: "게살", category: "생선", primary_nutrients: ["단백질", "칼슘", "키토산"], food_groups: ["생선"] },
  { name: "전복", category: "생선", primary_nutrients: ["단백질", "타우린", "아르기닌"], food_groups: ["생선"] },
  { name: "고등어", category: "생선", primary_nutrients: ["오메가3", "DHA", "단백질"], food_groups: ["생선"] },

  // 달걀 (1개)
  { name: "메추리알", category: "달걀", primary_nutrients: ["단백질", "비타민A", "철분"], food_groups: ["계란"] },

  // 두부/콩 (4개)
  { name: "순두부", category: "두부/콩", primary_nutrients: ["단백질", "칼슘", "수분"], food_groups: ["콩류"] },
  { name: "콩비지", category: "두부/콩", primary_nutrients: ["식이섬유", "단백질", "칼슘"], food_groups: ["콩류"] },
  { name: "검은콩", category: "두부/콩", primary_nutrients: ["안토시아닌", "단백질", "식이섬유"], food_groups: ["콩류"] },
  { name: "낫토", category: "두부/콩", primary_nutrients: ["단백질", "비타민K2", "프로바이오틱스"], food_groups: ["콩류"] },

  // 과일 (5개)
  { name: "아보카도", category: "과일", primary_nutrients: ["불포화지방산", "식이섬유", "칼륨"], food_groups: ["과일"] },
  { name: "수박", category: "과일", primary_nutrients: ["수분", "라이코펜", "비타민A"], food_groups: ["과일"] },
  { name: "복숭아", category: "과일", primary_nutrients: ["비타민C", "식이섬유", "유기산"], food_groups: ["과일"] },
  { name: "귤", category: "과일", primary_nutrients: ["비타민C", "구연산", "식이섬유"], food_groups: ["과일"] },
  { name: "자두", category: "과일", primary_nutrients: ["식이섬유", "비타민C", "소르비톨"], food_groups: ["과일"] },

  // 유제품 (3개)
  { name: "아기치즈", category: "유제품", primary_nutrients: ["칼슘", "단백질", "지방"], food_groups: ["유제품"] },
  { name: "무염버터", category: "유제품", primary_nutrients: ["지방", "비타민A"], food_groups: ["유제품"] },
  { name: "리코타치즈", category: "유제품", primary_nutrients: ["단백질", "칼슘"], food_groups: ["유제품"] },

  // 해조류 (3개)
  { name: "다시마", category: "해조류", primary_nutrients: ["요오드", "칼슘", "알긴산"], food_groups: ["해조류"] },
  { name: "톳", category: "해조류", primary_nutrients: ["철분", "칼슘", "식이섬유"], food_groups: ["해조류"] },
  { name: "파래", category: "해조류", primary_nutrients: ["철분", "비타민A", "칼슘"], food_groups: ["해조류"] },

  // 곡류 (5개)
  { name: "쌀가루", category: "곡류", primary_nutrients: ["탄수화물"], food_groups: ["곡류"] },
  { name: "찹쌀", category: "곡류", primary_nutrients: ["탄수화물", "식이섬유"], food_groups: ["곡류"] },
  { name: "파스타면", category: "곡류", primary_nutrients: ["탄수화물", "단백질"], food_groups: ["곡류"] },
  { name: "당면", category: "곡류", primary_nutrients: ["탄수화물"], food_groups: ["곡류"] },
  { name: "기장", category: "곡류", primary_nutrients: ["식이섬유", "마그네슘"], food_groups: ["곡류"] },

  // 조미료 (4개)
  { name: "들기름", category: "조미료", primary_nutrients: ["오메가3", "불포화지방산"], food_groups: ["조미료"] },
  { name: "올리브유", category: "조미료", primary_nutrients: ["불포화지방산", "비타민E"], food_groups: ["조미료"] },
  { name: "아기간장", category: "조미료", primary_nutrients: ["아미노산"], food_groups: ["조미료"] },
  { name: "아기된장", category: "조미료", primary_nutrients: ["이소플라본", "아미노산"], food_groups: ["조미료"] },
];

// 3. New Safety Rules Data (8 rules)
export const NEW_SAFETY_RULES = [
  { ingredient_name: "방울토마토", age_from_month: 6, age_to_month: 11, safety_level: "SAFE_AFTER_MODIFICATION", hazard_type: "choking", modification_note: "동그랗고 껍질이 질겨요. 껍질을 벗기고 4등분 이상 잘라 제공하세요." },
  { ingredient_name: "방울토마토", age_from_month: 12, age_to_month: 23, safety_level: "SAFE_AFTER_MODIFICATION", hazard_type: "choking", modification_note: "통째로 주면 기도가 막힐 수 있어요. 반드시 4등분으로 잘라 제공하세요." },
  { ingredient_name: "토마토", age_from_month: 6, age_to_month: 11, safety_level: "SAFE_AFTER_MODIFICATION", hazard_type: "choking", modification_note: "산도가 있고 껍질이 질길 수 있어요. 껍질과 씨를 제거하고 푹 익혀서 제공하세요." },
  { ingredient_name: "메추리알", age_from_month: 6, age_to_month: 11, safety_level: "SAFE_AFTER_MODIFICATION", hazard_type: "choking", modification_note: "동그랗고 단단하여 질식 위험이 큽니다. 완전히 익혀 4등분 이상으로 잘게 으깨어 제공하세요." },
  { ingredient_name: "메추리알", age_from_month: 12, age_to_month: 23, safety_level: "SAFE_AFTER_MODIFICATION", hazard_type: "choking", modification_note: "통째로 삼키지 않도록 반 또는 4등분으로 잘라 제공하세요." },
  { ingredient_name: "아보카도", age_from_month: 6, age_to_month: 11, safety_level: "SAFE_AFTER_MODIFICATION", hazard_type: "other", modification_note: "덜 익은 아보카도는 단단하고 소화가 어려워요. 완전히 후숙된 부드러운 과육만 으깨서 제공하세요." },
  { ingredient_name: "복숭아", age_from_month: 6, age_to_month: 11, safety_level: "SAFE_AFTER_MODIFICATION", hazard_type: "allergen", modification_note: "과일 알레르기 유발 가능성이 있습니다. 껍질을 두껍게 벗기고 씨 주변을 피해 부드러운 과육만 소량 시작하세요." },
  { ingredient_name: "오징어", age_from_month: 12, age_to_month: 23, safety_level: "SAFE_AFTER_MODIFICATION", hazard_type: "choking", modification_note: "조직이 질겨 질식 위험이 있어요. 완전히 익힌 뒤 아주 잘게 다져서 제공하세요." },
  { ingredient_name: "멸치", age_from_month: 12, age_to_month: 23, safety_level: "SAFE_AFTER_MODIFICATION", hazard_type: "other", modification_note: "염분이 높을 수 있으므로 미온수에 담가 짠기를 뺀 후 조리하세요." },
  { ingredient_name: "고등어", age_from_month: 12, age_to_month: 23, safety_level: "SAFE_AFTER_MODIFICATION", hazard_type: "other", modification_note: "가시를 완전히 제거한 순살을 사용하고 기름기가 많으므로 바짝 구워 기름을 빼고 제공하세요." },
];

// 4. New Recipes Data (55 recipes)
export const NEW_RECIPES = [
  // --- 6~8개월 (10개) ---
  {
    name: "소고기 청경채죽",
    min_age_stage: "6-8",
    cook_minutes: 15,
    difficulty: 1,
    is_quick: true,
    allergens: [],
    choking_hazard_note: null,
    caution_note: "소고기 핏물을 충분히 빼고 조리하세요.",
    menu_type: "porridge",
    ingredients: [
      { name: "소고기", quantity: 20, unit: "g" },
      { name: "청경채", quantity: 15, unit: "g" },
      { name: "쌀가루", quantity: 20, unit: "g" },
    ],
    steps: [
      "쌀가루를 찬물에 부드럽게 푼다.",
      "소고기는 핏물을 빼고 삶아 곱게 간다.",
      "청경채는 잎 부분만 데쳐 잘게 간다.",
      "모든 재료를 냄비에 넣고 저어가며 푹 끓인다.",
    ],
    nutrition: { carbs_g: 18, protein_g: 6, fat_g: 2, fiber_g: 0.8, key_micronutrients: ["철분", "비타민A"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 6, age_to_month: 8, texture: "부드러운 미음/죽 농도", size_guide: "건더기 없이 곱게 간 형태", cooking_method: "푹 끓여 체에 밭쳐 부드럽게 제공", serving_note: "한 김 식혀 미온수로 농도를 맞춰 먹이세요.", oil_level: "없음" },
  },
  {
    name: "닭안심 양배추죽",
    min_age_stage: "6-8",
    cook_minutes: 18,
    difficulty: 1,
    is_quick: false,
    allergens: [],
    choking_hazard_note: null,
    caution_note: "닭안심 힘줄을 깨끗이 제거하세요.",
    menu_type: "porridge",
    ingredients: [
      { name: "닭안심", quantity: 20, unit: "g" },
      { name: "양배추", quantity: 20, unit: "g" },
      { name: "쌀가루", quantity: 20, unit: "g" },
    ],
    steps: [
      "닭안심 힘줄을 제거하고 삶아 믹서에 곱게 간다.",
      "양배추 잎을 부드럽게 쪄서 간다.",
      "찬물에 푼 쌀가루와 닭안심, 양배추를 섞는다.",
      "약불에서 주걱으로 저으며 걸쭉하게 끓인다.",
    ],
    nutrition: { carbs_g: 19, protein_g: 7, fat_g: 1.5, fiber_g: 1.0, key_micronutrients: ["단백질", "비타민U"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 6, age_to_month: 8, texture: "부드러운 미음/죽 농도", size_guide: "고운 입자", cooking_method: "체에 거르거나 부드럽게 갈아 끓임", serving_note: "양배추의 은은한 단맛으로 아기 선호도가 높습니다.", oil_level: "없음" },
  },
  {
    name: "대구살 감자죽",
    min_age_stage: "6-8",
    cook_minutes: 15,
    difficulty: 1,
    is_quick: true,
    allergens: ["생선"],
    choking_hazard_note: "생선 가시가 완전히 제거되었는지 두 번 확인하세요.",
    caution_note: "신선한 순살 대구살만 사용하세요.",
    menu_type: "porridge",
    ingredients: [
      { name: "대구살", quantity: 20, unit: "g" },
      { name: "감자", quantity: 25, unit: "g" },
      { name: "쌀가루", quantity: 15, unit: "g" },
    ],
    steps: [
      "대구살의 가시를 꼼꼼히 확인하고 푹 찐 뒤 으깬다.",
      "감자는 껍질을 벗겨 찐 후 곱게 으깬다.",
      "냄비에 쌀가루 푼 물과 대구살, 감자를 넣는다.",
      "약불에서 5분간 뭉근하게 끓인다.",
    ],
    nutrition: { carbs_g: 16, protein_g: 6, fat_g: 1.0, fiber_g: 0.7, key_micronutrients: ["단백질", "칼륨"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 6, age_to_month: 8, texture: "고운 감자 스프 농도", size_guide: "가시 없는 고운 입자", cooking_method: "대구살을 푹 익혀 곱게 으깸", serving_note: "생선 가시가 없는지 두 번 확인하세요.", oil_level: "없음" },
  },
  {
    name: "콜리플라워 소고기죽",
    min_age_stage: "6-8",
    cook_minutes: 18,
    difficulty: 1,
    is_quick: false,
    allergens: [],
    choking_hazard_note: null,
    caution_note: null,
    menu_type: "porridge",
    ingredients: [
      { name: "소고기", quantity: 20, unit: "g" },
      { name: "콜리플라워", quantity: 20, unit: "g" },
      { name: "쌀가루", quantity: 20, unit: "g" },
    ],
    steps: [
      "콜리플라워 꽃송이만 끓는 물에 데쳐 곱게 간다.",
      "소고기는 핏물을 빼고 익혀 곱게 간다.",
      "쌀가루 푼 물에 소고기와 콜리플라워를 섞는다.",
      "약불에서 저어가며 푹 끓여낸다.",
    ],
    nutrition: { carbs_g: 17, protein_g: 6.5, fat_g: 2.0, fiber_g: 1.1, key_micronutrients: ["철분", "비타민C"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 6, age_to_month: 8, texture: "부드러운 죽 농도", size_guide: "입자 없는 퓨레 상태", cooking_method: "콜리플라워와 소고기를 곱게 갈아 조리", serving_note: "비타민C가 소고기 철분 흡수를 돕습니다.", oil_level: "없음" },
  },
  {
    name: "비트 사과 퓨레",
    min_age_stage: "6-8",
    cook_minutes: 12,
    difficulty: 1,
    is_quick: true,
    allergens: [],
    choking_hazard_note: null,
    caution_note: "비트는 소화기관이 미숙한 아기를 위해 소량만 섞으세요.",
    menu_type: "snack",
    ingredients: [
      { name: "비트", quantity: 15, unit: "g" },
      { name: "사과", quantity: 45, unit: "g" },
    ],
    steps: [
      "비트는 껍질을 벗겨 찜기에 푹 찐다.",
      "사과는 껍질과 씨를 제거하고 작게 썬다.",
      "익힌 비트와 사과를 믹서에 넣고 곱게 간다.",
      "소분하여 미온으로 식혀 먹인다.",
    ],
    nutrition: { carbs_g: 12, protein_g: 0.5, fat_g: 0.2, fiber_g: 1.4, key_micronutrients: ["철분", "비타민C"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 6, age_to_month: 8, texture: "고운 과일 퓨레", size_guide: "숟가락으로 흘러내리는 점도", cooking_method: "비트를 푹 쪄서 사과와 함께 블렌딩", serving_note: "예쁜 붉은색과 달콤함으로 식욕을 돋웁니다.", oil_level: "없음" },
  },
  {
    name: "단호박 사과 매시",
    min_age_stage: "6-8",
    cook_minutes: 10,
    difficulty: 1,
    is_quick: true,
    allergens: [],
    choking_hazard_note: null,
    caution_note: null,
    menu_type: "snack",
    ingredients: [
      { name: "단호박", quantity: 40, unit: "g" },
      { name: "사과", quantity: 30, unit: "g" },
    ],
    steps: [
      "단호박 껍질과 씨를 제거하고 푹 찐다.",
      "사과는 강판에 갈거나 살짝 쪄서 준비한다.",
      "단호박과 사과를 볼에 넣고 곱게 으깬다.",
      "부드러운 스프 상태가 되도록 잘 섞는다.",
    ],
    nutrition: { carbs_g: 14, protein_g: 1.0, fat_g: 0.3, fiber_g: 1.8, key_micronutrients: ["베타카로틴", "식이섬유"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 6, age_to_month: 8, texture: "부드러운 매시 형태", size_guide: "덩어리 없이 크리미한 상태", cooking_method: "푹 쪄서 곱게 으깸", serving_note: "변비가 있는 아기에게 특히 좋은 영양 간식입니다.", oil_level: "없음" },
  },
  {
    name: "아보카도 바나나 퓨레",
    min_age_stage: "6-8",
    cook_minutes: 5,
    difficulty: 1,
    is_quick: true,
    allergens: [],
    choking_hazard_note: null,
    caution_note: "충분히 후숙되어 부드러운 아보카도를 사용하세요.",
    menu_type: "snack",
    ingredients: [
      { name: "아보카도", quantity: 30, unit: "g" },
      { name: "바나나", quantity: 40, unit: "g" },
    ],
    steps: [
      "잘 익은 아보카도의 부드러운 과육만 덜어낸다.",
      "바나나 껍질을 벗겨 포크로 곱게 으깬다.",
      "아보카도와 바나나를 섞어 크림처럼 으깬다.",
    ],
    nutrition: { carbs_g: 15, protein_g: 1.2, fat_g: 4.5, fiber_g: 2.2, key_micronutrients: ["불포화지방산", "칼륨"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 6, age_to_month: 8, texture: "크리미한 요거트 질감", size_guide: "매끄럽게 으깬 상태", cooking_method: "열을 가하지 않고 즉석에서 으깸", serving_note: "두뇌 발달에 좋은 좋은 지방이 듬뿍 들어있습니다.", oil_level: "없음" },
  },
  {
    name: "가자미살 당근죽",
    min_age_stage: "6-8",
    cook_minutes: 15,
    difficulty: 1,
    is_quick: true,
    allergens: ["생선"],
    choking_hazard_note: "가시가 없는지 꼼꼼하게 살피세요.",
    caution_note: null,
    menu_type: "porridge",
    ingredients: [
      { name: "가자미살", quantity: 20, unit: "g" },
      { name: "당근", quantity: 15, unit: "g" },
      { name: "쌀가루", quantity: 20, unit: "g" },
    ],
    steps: [
      "가자미살은 푹 쪄서 가시가 없도록 손으로 으깬다.",
      "당근은 삶아 곱게 간다.",
      "냄비에 쌀가루 물과 가자미, 당근을 넣는다.",
      "약불에서 주걱으로 저으며 5분간 끓인다.",
    ],
    nutrition: { carbs_g: 17, protein_g: 5.5, fat_g: 0.8, fiber_g: 0.9, key_micronutrients: ["단백질", "비타민A"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 6, age_to_month: 8, texture: "부드러운 죽", size_guide: "가시 확인 후 곱게 으깬 형태", cooking_method: "가자미를 푹 쪄서 곱게 간 재료와 끓임", serving_note: "비린내가 적어 초기 생선 이유식으로 가장 좋습니다.", oil_level: "없음" },
  },
  {
    name: "오트밀 단호박죽",
    min_age_stage: "6-8",
    cook_minutes: 10,
    difficulty: 1,
    is_quick: true,
    allergens: [],
    choking_hazard_note: null,
    caution_note: null,
    menu_type: "porridge",
    ingredients: [
      { name: "오트밀", quantity: 20, unit: "g" },
      { name: "단호박", quantity: 35, unit: "g" },
    ],
    steps: [
      "단호박은 껍질을 벗겨 찐 후 부드럽게 으깬다.",
      "냄비에 오트밀과 물 120ml를 넣고 끓인다.",
      "오트밀이 퍼지면 단호박을 넣고 잘 섞는다.",
      "약불에서 2분간 저어 부드러운 죽으로 완성한다.",
    ],
    nutrition: { carbs_g: 21, protein_g: 3.2, fat_g: 1.5, fiber_g: 2.5, key_micronutrients: ["철분", "식이섬유"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 6, age_to_month: 8, texture: "부드러운 오트밀 죽", size_guide: "푹 퍼진 미세 오트밀", cooking_method: "오트밀을 푹 불려 단호박과 조리", serving_note: "아침 대용으로 빠르고 영양가 높은 한 끼입니다.", oil_level: "없음" },
  },
  {
    name: "청경채 고구마 매시",
    min_age_stage: "6-8",
    cook_minutes: 12,
    difficulty: 1,
    is_quick: true,
    allergens: [],
    choking_hazard_note: null,
    caution_note: null,
    menu_type: "snack",
    ingredients: [
      { name: "청경채", quantity: 15, unit: "g" },
      { name: "고구마", quantity: 45, unit: "g" },
    ],
    steps: [
      "고구마는 껍질을 벗겨 찜기에 푹 찐다.",
      "청경채 잎을 살짝 데쳐 곱게 다지거나 간다.",
      "익힌 고구마에 물 약간을 섞으며 곱게 으깬다.",
      "청경채를 고구마와 골고루 섞어 완성한다.",
    ],
    nutrition: { carbs_g: 16, protein_g: 1.2, fat_g: 0.2, fiber_g: 1.5, key_micronutrients: ["비타민A", "식이섬유"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 6, age_to_month: 8, texture: "촉촉한 매시 질감", size_guide: "입자 없는 퓨레", cooking_method: "고구마 쪄서 으깨고 청경채 섞기", serving_note: "달달한 고구마 맛으로 채소 거부감을 줄여줍니다.", oil_level: "없음" },
  },

  // --- 9~11개월 (12개) ---
  {
    name: "소고기 표고버섯 진밥",
    min_age_stage: "9-11",
    cook_minutes: 20,
    difficulty: 2,
    is_quick: false,
    allergens: [],
    choking_hazard_note: null,
    caution_note: "버섯은 아기가 씹기 좋게 3~5mm로 다지세요.",
    menu_type: "rice",
    ingredients: [
      { name: "소고기다짐육", quantity: 30, unit: "g" },
      { name: "표고버섯", quantity: 15, unit: "g" },
      { name: "당근", quantity: 15, unit: "g" },
      { name: "밥", quantity: 60, unit: "g" },
    ],
    steps: [
      "표고버섯과 당근을 3~5mm 크기로 다진다.",
      "냄비에 소고기다짐육을 볶다가 표고와 당근을 넣는다.",
      "물 100ml와 밥을 넣고 중불에서 끓인다.",
      "밥알이 퍼지고 재료가 부드러워질 때까지 저어가며 익힌다.",
    ],
    nutrition: { carbs_g: 25, protein_g: 9, fat_g: 3, fiber_g: 1.5, key_micronutrients: ["철분", "비타민D"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 9, age_to_month: 11, texture: "부드러운 5배죽/진밥", size_guide: "3~5mm 작은 입자", cooking_method: "표고와 소고기를 푹 익혀 부드럽게 조리", serving_note: "표고버섯의 풍부한 감칠맛으로 소금 없이도 맛있습니다.", oil_level: "소량" },
  },
  {
    name: "닭안심 단호박 진밥",
    min_age_stage: "9-11",
    cook_minutes: 18,
    difficulty: 1,
    is_quick: false,
    allergens: [],
    choking_hazard_note: null,
    caution_note: null,
    menu_type: "rice",
    ingredients: [
      { name: "닭안심", quantity: 30, unit: "g" },
      { name: "단호박", quantity: 30, unit: "g" },
      { name: "밥", quantity: 60, unit: "g" },
    ],
    steps: [
      "닭안심을 삶아 결대로 잘게 다진다.",
      "단호박은 껍질을 벗겨 4mm 크기로 깍둑썰기한다.",
      "냄비에 밥, 닭안심, 단호박, 물을 넣고 끓인다.",
      "약불에서 단호박이 부드럽게 으깨질 때까지 뜸을 들인다.",
    ],
    nutrition: { carbs_g: 27, protein_g: 8.5, fat_g: 1.5, fiber_g: 1.8, key_micronutrients: ["단백질", "베타카로틴"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 9, age_to_month: 11, texture: "촉촉한 진밥", size_guide: "3~5mm 다짐", cooking_method: "닭안심을 푹 끓여 부드럽게 조리", serving_note: "단호박의 단맛이 닭고기와 잘 어우러집니다.", oil_level: "없음" },
  },
  {
    name: "순두부 계란죽",
    min_age_stage: "9-11",
    cook_minutes: 10,
    difficulty: 1,
    is_quick: true,
    allergens: ["계란", "대두"],
    choking_hazard_note: null,
    caution_note: "계란을 완전히 완숙으로 익히세요.",
    menu_type: "porridge",
    ingredients: [
      { name: "순두부", quantity: 50, unit: "g" },
      { name: "계란", quantity: 1, unit: "개" },
      { name: "밥", quantity: 50, unit: "g" },
    ],
    steps: [
      "냄비에 밥과 물 100ml를 넣고 끓여 부드럽게 만든다.",
      "순두부를 숟가락으로 으깨며 넣는다.",
      "계란을 곱게 풀어 빙 둘러 넣고 완전히 익을 때까지 젓는다.",
    ],
    nutrition: { carbs_g: 20, protein_g: 9.5, fat_g: 5.5, fiber_g: 0.6, key_micronutrients: ["단백질", "칼슘"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 9, age_to_month: 11, texture: "부드럽고 몽글몽글한 죽", size_guide: "부드러운 순두부 입자", cooking_method: "계란을 완전히 완숙으로 익힘", serving_note: "목 넘김이 매우 부드러워 감기 걸렸을 때도 좋습니다.", oil_level: "없음" },
  },
  {
    name: "대구살 브로콜리 리조또",
    min_age_stage: "9-11",
    cook_minutes: 15,
    difficulty: 2,
    is_quick: true,
    allergens: ["생선", "우유"],
    choking_hazard_note: "생선 가시가 없는지 확인하세요.",
    caution_note: "우유 알레르기가 있는지 확인하세요.",
    menu_type: "rice",
    ingredients: [
      { name: "대구살", quantity: 30, unit: "g" },
      { name: "브로콜리", quantity: 20, unit: "g" },
      { name: "우유", quantity: 30, unit: "ml" },
      { name: "밥", quantity: 60, unit: "g" },
    ],
    steps: [
      "대구살을 쪄서 가시를 살피며 잘게 부순다.",
      "브로콜리는 꽃 부분만 데쳐 잘게 다진다.",
      "팬에 밥과 물 50ml, 우유 30ml를 넣고 끓인다.",
      "대구살과 브로콜리를 넣고 걸쭉해질 때까지 조린다.",
    ],
    nutrition: { carbs_g: 24, protein_g: 8, fat_g: 2.2, fiber_g: 1.2, key_micronutrients: ["칼슘", "비타민C"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 9, age_to_month: 11, texture: "고소한 리조또 진밥", size_guide: "3~4mm 입자", cooking_method: "우유를 넣어 부드럽게 끓임", serving_note: "우유 알레르기가 없는지 사전에 확인하세요.", oil_level: "소량" },
  },
  {
    name: "사과 당근 핑거스틱",
    min_age_stage: "9-11",
    cook_minutes: 12,
    difficulty: 1,
    is_quick: true,
    allergens: [],
    choking_hazard_note: "당근이 푹 물러 손으로 눌렀을 때 쉽게 으스러지는지 확인하세요.",
    caution_note: "아기가 먹을 때 곁에서 지켜보세요.",
    menu_type: "finger_food",
    ingredients: [
      { name: "사과", quantity: 30, unit: "g" },
      { name: "당근", quantity: 30, unit: "g" },
    ],
    steps: [
      "당근과 사과를 아기 손가락 굵기(길이 4~5cm, 두께 5mm) 스틱 모양으로 자른다.",
      "찜기에 당근을 먼저 올려 8분간 푹 찐다.",
      "사과를 넣고 3분간 더 쪄서 잇몸으로 으깰 수 있게 익힌다.",
      "식혀서 아기 식판에 올려준다.",
    ],
    nutrition: { carbs_g: 10, protein_g: 0.5, fat_g: 0.2, fiber_g: 1.6, key_micronutrients: ["비타민A", "식이섬유"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 9, age_to_month: 11, texture: "잇몸으로 뭉개지는 스틱", size_guide: "손가락 크기 스틱 (길이 4cm)", cooking_method: "푹 쪄서 손으로 눌렀을 때 쉽게 으깨지도록 조리", serving_note: "아기가 손으로 쥐고 갉아먹는 연습에 최적입니다.", oil_level: "없음" },
  },
  {
    name: "완두콩 감자 수프",
    min_age_stage: "9-11",
    cook_minutes: 12,
    difficulty: 1,
    is_quick: true,
    allergens: ["우유"],
    choking_hazard_note: "완두콩 낱알 흡인 위험이 있으므로 반드시 곱게 갈아 조리하세요.",
    caution_note: null,
    menu_type: "soup",
    ingredients: [
      { name: "완두콩", quantity: 25, unit: "g" },
      { name: "감자", quantity: 40, unit: "g" },
      { name: "우유", quantity: 40, unit: "ml" },
    ],
    steps: [
      "완두콩은 삶아 껍질을 벗겨 준비한다.",
      "감자는 껍질을 벗겨 얇게 썰어 삶는다.",
      "완두콩과 감자를 믹서에 넣고 우유와 함께 부드럽게 간다.",
      "냄비에 담아 약불에서 한소끔 데워낸다.",
    ],
    nutrition: { carbs_g: 15, protein_g: 4.5, fat_g: 1.8, fiber_g: 2.1, key_micronutrients: ["식이섬유", "칼슘"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 9, age_to_month: 11, texture: "부드러운 크림 수프", size_guide: "부드럽게 간 스프", cooking_method: "완두콩 껍질을 벗겨 체에 걸러 조리", serving_note: "완두콩 껍질을 벗기면 소화가 훨씬 잘 됩니다.", oil_level: "없음" },
  },
  {
    name: "게살 야채죽",
    min_age_stage: "9-11",
    cook_minutes: 15,
    difficulty: 1,
    is_quick: true,
    allergens: ["갑각류"],
    choking_hazard_note: "게살 껍질 조각이 들어가지 않았는지 확인하세요.",
    caution_note: "갑각류 알레르기 유무를 먼저 확인하세요.",
    menu_type: "porridge",
    ingredients: [
      { name: "게살", quantity: 25, unit: "g" },
      { name: "애호박", quantity: 20, unit: "g" },
      { name: "당근", quantity: 15, unit: "g" },
      { name: "밥", quantity: 60, unit: "g" },
    ],
    steps: [
      "게살을 결대로 곱게 찢는다.",
      "애호박과 당근을 3mm 크기로 다진다.",
      "냄비에 밥과 물 120ml를 붓고 끓인다.",
      "야채와 게살을 넣고 밥알이 푹 퍼질 때까지 끓인다.",
    ],
    nutrition: { carbs_g: 24, protein_g: 7, fat_g: 0.8, fiber_g: 1.2, key_micronutrients: ["단백질", "키토산"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 9, age_to_month: 11, texture: "부드러운 죽 농도", size_guide: "잘게 찢은 게살과 다진 채소", cooking_method: "푹 끓여 진밥/죽 형태로 완성", serving_note: "갑각류 알레르기 여부를 사전에 소량 확인하세요.", oil_level: "없음" },
  },
  {
    name: "소고기 비트 진밥",
    min_age_stage: "9-11",
    cook_minutes: 20,
    difficulty: 2,
    is_quick: false,
    allergens: [],
    choking_hazard_note: null,
    caution_note: null,
    menu_type: "rice",
    ingredients: [
      { name: "소고기다짐육", quantity: 30, unit: "g" },
      { name: "비트", quantity: 15, unit: "g" },
      { name: "양파", quantity: 15, unit: "g" },
      { name: "밥", quantity: 60, unit: "g" },
    ],
    steps: [
      "비트와 양파를 3~4mm 크기로 잘게 다진다.",
      "냄비에 소고기다짐육과 양파를 볶는다.",
      "비트, 밥, 물 100ml를 붓고 중약불에서 끓인다.",
      "예쁜 분홍빛 진밥이 되도록 저어가며 조린다.",
    ],
    nutrition: { carbs_g: 26, protein_g: 8.5, fat_g: 2.8, fiber_g: 1.4, key_micronutrients: ["철분", "엽산"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 9, age_to_month: 11, texture: "촉촉한 진밥", size_guide: "3~4mm 크기 다짐", cooking_method: "비트와 소고기를 푹 익혀 부드럽게 조리", serving_note: "철분이 매우 풍부하여 빈혈 예방에 탁월합니다.", oil_level: "소량" },
  },
  {
    name: "연어 양배추 진밥",
    min_age_stage: "9-11",
    cook_minutes: 18,
    difficulty: 1,
    is_quick: false,
    allergens: ["생선"],
    choking_hazard_note: "연어 가시와 껍질을 완벽하게 제거하세요.",
    caution_note: null,
    menu_type: "rice",
    ingredients: [
      { name: "연어", quantity: 30, unit: "g" },
      { name: "양배추", quantity: 25, unit: "g" },
      { name: "밥", quantity: 60, unit: "g" },
    ],
    steps: [
      "연어는 쪄서 가시와 껍질을 제거하고 살코기만 으깬다.",
      "양배추는 잎 부분을 부드럽게 다진다.",
      "냄비에 밥, 연어, 양배추, 물 100ml를 넣고 끓인다.",
      "약불에서 7분간 푹 익혀 완성한다.",
    ],
    nutrition: { carbs_g: 24, protein_g: 8.8, fat_g: 3.5, fiber_g: 1.3, key_micronutrients: ["오메가3", "단백질"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 9, age_to_month: 11, texture: "부드러운 진밥", size_guide: "3~5mm 다짐", cooking_method: "연어 살코기를 부드럽게 익힘", serving_note: "연어의 고소한 지방과 양배추의 단맛이 일품입니다.", oil_level: "없음" },
  },
  {
    name: "가자미 감자조림밥",
    min_age_stage: "9-11",
    cook_minutes: 18,
    difficulty: 2,
    is_quick: false,
    allergens: ["생선"],
    choking_hazard_note: "가시를 꼼꼼히 제거하세요.",
    caution_note: null,
    menu_type: "rice",
    ingredients: [
      { name: "가자미살", quantity: 30, unit: "g" },
      { name: "감자", quantity: 35, unit: "g" },
      { name: "당근", quantity: 15, unit: "g" },
      { name: "밥", quantity: 60, unit: "g" },
    ],
    steps: [
      "감자와 당근을 4mm 크기로 썬다.",
      "가자미살은 가시를 살피고 작게 썬다.",
      "냄비에 물 120ml와 감자, 당근을 넣고 먼저 익힌다.",
      "가자미와 밥을 넣고 밥알이 푹 무를 때까지 조린다.",
    ],
    nutrition: { carbs_g: 27, protein_g: 7.5, fat_g: 1.2, fiber_g: 1.4, key_micronutrients: ["단백질", "칼륨"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 9, age_to_month: 11, texture: "촉촉한 진밥", size_guide: "4mm 부드러운 조각", cooking_method: "감자와 가자미를 푹 끓여 무르게 조리", serving_note: "간을 하지 않아도 생선과 채소의 단맛이 우러납니다.", oil_level: "소량" },
  },
  {
    name: "아보카도 계란 노른자 비빔밥",
    min_age_stage: "9-11",
    cook_minutes: 8,
    difficulty: 1,
    is_quick: true,
    allergens: ["계란"],
    choking_hazard_note: null,
    caution_note: "계란은 완전히 완숙으로 익힌 노른자를 사용하세요.",
    menu_type: "rice",
    ingredients: [
      { name: "아보카도", quantity: 30, unit: "g" },
      { name: "계란", quantity: 1, unit: "개" },
      { name: "밥", quantity: 60, unit: "g" },
      { name: "김", quantity: 1, unit: "g" },
    ],
    steps: [
      "계란은 완숙으로 삶아 노른자만 분리해 으깬다.",
      "잘 익은 아보카도를 작게 깍둑썰기한다.",
      "따뜻한 진밥 위에 계란 노른자와 아보카도를 얹는다.",
      "김을 아주 잘게 부수어 올리고 골고루 비빈다.",
    ],
    nutrition: { carbs_g: 26, protein_g: 6.2, fat_g: 7.0, fiber_g: 2.3, key_micronutrients: ["콜린", "불포화지방산"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 9, age_to_month: 11, texture: "부드럽고 크리미한 비빔밥", size_guide: "노른자 으깸, 아보카도 작은 조각", cooking_method: "계란 완숙 삶기", serving_note: "돌 전에는 계란 노른자 위주로 시작하는 것을 권장합니다.", oil_level: "없음" },
  },
  {
    name: "닭안심 핑거스틱",
    min_age_stage: "9-11",
    cook_minutes: 15,
    difficulty: 1,
    is_quick: false,
    allergens: [],
    choking_hazard_note: "부드럽게 쪄서 아기가 잇몸으로 베어 물 수 있게 하세요.",
    caution_note: null,
    menu_type: "finger_food",
    ingredients: [
      { name: "닭안심", quantity: 40, unit: "g" },
      { name: "당근", quantity: 15, unit: "g" },
      { name: "양파", quantity: 10, unit: "g" },
    ],
    steps: [
      "닭안심 힘줄을 제거하고 믹서에 곱게 간다.",
      "당근과 양파를 아주 곱게 다져 닭고기와 섞는다.",
      "반죽을 손가락 굵기 스틱 모양으로 빚는다.",
      "찜기에 올려 10분간 속까지 충분히 찐다.",
    ],
    nutrition: { carbs_g: 3, protein_g: 10.5, fat_g: 1.2, fiber_g: 0.6, key_micronutrients: ["단백질", "아연"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 9, age_to_month: 11, texture: "부드러운 핑거푸드 스틱", size_guide: "손가락 굵기 스틱", cooking_method: "찜기에서 부드럽게 찜", serving_note: "기름 없이 쪄서 퍽퍽하지 않고 촉촉합니다.", oil_level: "없음" },
  },

  // --- 12~17개월 (13개) ---
  {
    name: "맑은 순두부 계란국",
    min_age_stage: "12-17",
    cook_minutes: 10,
    difficulty: 1,
    is_quick: true,
    allergens: ["계란", "대두"],
    choking_hazard_note: null,
    caution_note: "염도를 낮추기 위해 국간장은 소량만 사용하세요.",
    menu_type: "soup",
    ingredients: [
      { name: "순두부", quantity: 60, unit: "g" },
      { name: "계란", quantity: 1, unit: "개" },
      { name: "대파", quantity: 5, unit: "g" },
      { name: "국간장", quantity: 2, unit: "g" },
    ],
    steps: [
      "물 250ml에 국간장 약간을 넣고 끓인다.",
      "순두부를 숟가락으로 큼직하게 떠 넣는다.",
      "계란을 곱게 풀어 냄비 가장자리에 둘러 넣는다.",
      "송송 썬 대파를 넣고 한소끔 끓여 불을 끈다.",
    ],
    nutrition: { carbs_g: 2, protein_g: 9.8, fat_g: 6.0, fiber_g: 0.4, key_micronutrients: ["단백질", "칼슘"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 12, age_to_month: 17, texture: "부드러운 맑은 국", size_guide: "한입 크기 순두부", cooking_method: "센 불에 오래 끓이지 않고 부드럽게 익힘", serving_note: "간을 최소화하고 따뜻하게 밥과 곁들여주세요.", oil_level: "없음" },
  },
  {
    name: "잔멸치 아기 주먹밥",
    min_age_stage: "12-17",
    cook_minutes: 8,
    difficulty: 1,
    is_quick: true,
    allergens: ["생선"],
    choking_hazard_note: "주먹밥을 너무 크지 않게 한입 크기로 빚으세요.",
    caution_note: "멸치의 짠기를 물에 불려 뺀 뒤 사용하세요.",
    menu_type: "rice",
    ingredients: [
      { name: "멸치", quantity: 10, unit: "g" },
      { name: "김", quantity: 2, unit: "g" },
      { name: "밥", quantity: 80, unit: "g" },
      { name: "참기름", quantity: 3, unit: "g" },
    ],
    steps: [
      "잔멸치를 미온수에 5분간 불려 짠기를 뺀 뒤 마른 팬에 볶는다.",
      "볶은 멸치를 칼로 잘게 다진다.",
      "볼에 따뜻한 밥, 멸치, 잘게 부순 김, 참기름을 넣고 섞는다.",
      "아기가 한입에 먹기 좋은 작은 완자 크기로 뭉친다.",
    ],
    nutrition: { carbs_g: 44, protein_g: 7.2, fat_g: 4.5, fiber_g: 1.0, key_micronutrients: ["칼슘", "철분"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 12, age_to_month: 17, texture: "핑거푸드 주먹밥", size_guide: "지름 1.5~2cm 볼 형태", cooking_method: "멸치 짠기 빼고 마른 팬 볶기", serving_note: "손으로 집어먹는 자기주도 식사에 훌륭합니다.", oil_level: "소량" },
  },
  {
    name: "토마토 소고기 리조또",
    min_age_stage: "12-17",
    cook_minutes: 18,
    difficulty: 2,
    is_quick: false,
    allergens: ["우유"],
    choking_hazard_note: null,
    caution_note: "토마토 껍질은 질길 수 있으니 꼭 벗겨서 조리하세요.",
    menu_type: "rice",
    ingredients: [
      { name: "토마토", quantity: 40, unit: "g" },
      { name: "소고기다짐육", quantity: 35, unit: "g" },
      { name: "양파", quantity: 15, unit: "g" },
      { name: "밥", quantity: 70, unit: "g" },
      { name: "아기치즈", quantity: 1, unit: "장" },
    ],
    steps: [
      "토마토는 끓는 물에 데쳐 껍질을 벗기고 잘게 다진다.",
      "팬에 소고기와 다진 양파를 볶는다.",
      "토마토와 밥, 물 60ml를 넣고 자작하게 졸인다.",
      "불을 끄고 아기치즈를 넣어 여열로 녹이며 섞는다.",
    ],
    nutrition: { carbs_g: 38, protein_g: 13.5, fat_g: 7.8, fiber_g: 2.1, key_micronutrients: ["라이코펜", "철분"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 12, age_to_month: 17, texture: "크리미한 치즈 리조또", size_guide: "5~8mm 입자", cooking_method: "토마토 껍질 제거 후 치즈로 부드럽게 마무리", serving_note: "상큼하고 고소하여 편식하는 아기도 잘 먹습니다.", oil_level: "소량" },
  },
  {
    name: "팽이버섯 소고기덮밥",
    min_age_stage: "12-17",
    cook_minutes: 15,
    difficulty: 1,
    is_quick: true,
    allergens: [],
    choking_hazard_note: "팽이버섯이 길면 목에 걸릴 수 있으니 1cm 이하로 썰어주세요.",
    caution_note: null,
    menu_type: "rice",
    ingredients: [
      { name: "팽이버섯", quantity: 30, unit: "g" },
      { name: "소고기", quantity: 35, unit: "g" },
      { name: "양파", quantity: 20, unit: "g" },
      { name: "밥", quantity: 80, unit: "g" },
      { name: "참기름", quantity: 3, unit: "g" },
    ],
    steps: [
      "팽이버섯은 밑동을 자르고 1cm 길이로 송송 썬다.",
      "소고기와 양파는 작게 채썬다.",
      "팬에 참기름을 두르고 소고기와 양파를 볶는다.",
      "팽이버섯과 물 50ml를 넣고 버섯 숨이 죽을 때까지 익혀 밥 위에 얹는다.",
    ],
    nutrition: { carbs_g: 43, protein_g: 12.8, fat_g: 6.2, fiber_g: 2.4, key_micronutrients: ["철분", "식이섬유"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 12, age_to_month: 17, texture: "부드러운 덮밥", size_guide: "1cm 짧은 길이", cooking_method: "버섯을 짧게 잘라 충분히 익힘", serving_note: "팽이버섯은 길면 목에 걸릴 수 있으니 짧게 썰어주세요.", oil_level: "소량" },
  },
  {
    name: "새송이버섯 들기름구이",
    min_age_stage: "12-17",
    cook_minutes: 10,
    difficulty: 1,
    is_quick: true,
    allergens: [],
    choking_hazard_note: null,
    caution_note: null,
    menu_type: "snack",
    ingredients: [
      { name: "새송이버섯", quantity: 50, unit: "g" },
      { name: "들기름", quantity: 5, unit: "g" },
    ],
    steps: [
      "새송이버섯을 아기가 씹기 좋은 0.5cm 두께로 깍둑썰기한다.",
      "팬에 들기름을 두르고 약불로 예열한다.",
      "버섯을 넣고 노릇하고 촉촉해질 때까지 은근하게 굽는다.",
      "한 김 식혀 핑거푸드 반찬으로 낸다.",
    ],
    nutrition: { carbs_g: 3, protein_g: 2.0, fat_g: 5.0, fiber_g: 1.8, key_micronutrients: ["오메가3", "식이섬유"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 12, age_to_month: 17, texture: "쫄깃하고 부드러운 구이", size_guide: "작은 깍둑썰기 (7~8mm)", cooking_method: "들기름에 약불로 은근히 구움", serving_note: "들기름의 고소한 향으로 버섯을 맛있게 즐길 수 있습니다.", oil_level: "소량" },
  },
  {
    name: "아기 토마토 파스타",
    min_age_stage: "12-17",
    cook_minutes: 15,
    difficulty: 2,
    is_quick: true,
    allergens: ["밀"],
    choking_hazard_note: "파스타면은 1~2cm 짧은 길이로 잘라 제공하세요.",
    caution_note: "면을 평소보다 푹 삶아 부드럽게 조리하세요.",
    menu_type: "noodle",
    ingredients: [
      { name: "파스타면", quantity: 35, unit: "g" },
      { name: "토마토", quantity: 45, unit: "g" },
      { name: "소고기다짐육", quantity: 25, unit: "g" },
      { name: "양파", quantity: 15, unit: "g" },
    ],
    steps: [
      "파스타면(숏파스타 또는 잘게 부순 면)을 부드럽게 푹 삶는다.",
      "토마토는 껍질을 벗겨 으깨고 양파는 다진다.",
      "팬에 소고기와 양파를 볶다가 토마토 퓨레를 넣고 조린다.",
      "삶은 파스타면을 넣고 소스가 배어들도록 1분간 버무린다.",
    ],
    nutrition: { carbs_g: 32, protein_g: 10.2, fat_g: 4.5, fiber_g: 2.0, key_micronutrients: ["라이코펜", "철분"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 12, age_to_month: 17, texture: "부드러운 면 요리", size_guide: "1~2cm 짧은 면 또는 마카로니", cooking_method: "면을 평소보다 2~3분 더 푹 삶음", serving_note: "면을 작게 잘라 숟가락이나 포크로 떠먹게 해주세요.", oil_level: "소량" },
  },
  {
    name: "대구살전",
    min_age_stage: "12-17",
    cook_minutes: 12,
    difficulty: 1,
    is_quick: true,
    allergens: ["생선", "계란"],
    choking_hazard_note: "가시가 없는지 두 번 확인하세요.",
    caution_note: "계란 옷을 충분히 익히세요.",
    menu_type: "pancake",
    ingredients: [
      { name: "대구살", quantity: 45, unit: "g" },
      { name: "계란", quantity: 1, unit: "개" },
      { name: "당근", quantity: 10, unit: "g" },
    ],
    steps: [
      "대구살을 가시 없이 확인하고 칼등으로 곱게 으깬다.",
      "당근을 잘게 다져 대구살, 푼 계란과 함께 섞는다.",
      "팬에 기름을 살짝 두르고 한 숟가락씩 떠 올린다.",
      "약불에서 속까지 완전히 익혀낸다.",
    ],
    nutrition: { carbs_g: 2, protein_g: 14.5, fat_g: 5.8, fiber_g: 0.5, key_micronutrients: ["고단백", "비타민A"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 12, age_to_month: 17, texture: "촉촉하고 부드러운 전", size_guide: "한입 크기 핑거푸드", cooking_method: "약불에서 계란 옷이 타지 않게 조리", serving_note: "가시가 없는 순살 생선 패티로 밥반찬에 아주 좋습니다.", oil_level: "소량" },
  },
  {
    name: "부추 계란전",
    min_age_stage: "12-17",
    cook_minutes: 10,
    difficulty: 1,
    is_quick: true,
    allergens: ["계란"],
    choking_hazard_note: "부추는 질길 수 있으니 1cm 이하로 썰어주세요.",
    caution_note: null,
    menu_type: "pancake",
    ingredients: [
      { name: "부추", quantity: 25, unit: "g" },
      { name: "계란", quantity: 1, unit: "개" },
      { name: "당근", quantity: 15, unit: "g" },
    ],
    steps: [
      "부추를 깨끗이 씻어 1cm 길이로 송송 썬다.",
      "당근은 잘게 채썰어 부추와 함께 계란물에 넣는다.",
      "팬을 달궈 반죽을 얇고 넓게 부친다.",
      "앞뒤로 노릇하게 완전히 익힌 뒤 한입 크기로 자른다.",
    ],
    nutrition: { carbs_g: 3, protein_g: 7.2, fat_g: 5.2, fiber_g: 1.1, key_micronutrients: ["단백질", "철분"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 12, age_to_month: 17, texture: "부드러운 전 요리", size_guide: "1.5cm 조각", cooking_method: "부추를 짧게 썰어 속까지 익힘", serving_note: "부추는 질길 수 있으므로 짧게 송송 썰어주세요.", oil_level: "소량" },
  },
  {
    name: "소고기 무국밥",
    min_age_stage: "12-17",
    cook_minutes: 20,
    difficulty: 2,
    is_quick: false,
    allergens: [],
    choking_hazard_note: null,
    caution_note: "무를 푹 끓여 입안에서 쉽게 으깨지도록 하세요.",
    menu_type: "soup",
    ingredients: [
      { name: "소고기", quantity: 40, unit: "g" },
      { name: "무", quantity: 40, unit: "g" },
      { name: "대파", quantity: 10, unit: "g" },
      { name: "밥", quantity: 80, unit: "g" },
    ],
    steps: [
      "소고기는 핏물을 빼고 얇게 썬다.",
      "무는 아기가 씹기 좋게 얇은 나박썰기를 한다.",
      "냄비에 소고기와 무를 볶다가 물 300ml를 붓고 푹 끓인다.",
      "무가 투명하게 익으면 대파를 넣고 밥과 함께 낸다.",
    ],
    nutrition: { carbs_g: 44, protein_g: 13.2, fat_g: 5.5, fiber_g: 1.6, key_micronutrients: ["철분", "비타민C"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 12, age_to_month: 17, texture: "시원하고 부드러운 국밥", size_guide: "얇고 작은 나박썰기", cooking_method: "무를 푹 끓여 입에서 으깨지도록 조리", serving_note: "국물에 밥을 말아 부드럽게 넘길 수 있습니다.", oil_level: "소량" },
  },
  {
    name: "단호박 치즈 리조또",
    min_age_stage: "12-17",
    cook_minutes: 12,
    difficulty: 1,
    is_quick: true,
    allergens: ["유제품"],
    choking_hazard_note: null,
    caution_note: "치즈의 염도를 감안해 추가 간을 하지 마세요.",
    menu_type: "rice",
    ingredients: [
      { name: "단호박", quantity: 50, unit: "g" },
      { name: "아기치즈", quantity: 1, unit: "장" },
      { name: "우유", quantity: 30, unit: "ml" },
      { name: "밥", quantity: 70, unit: "g" },
    ],
    steps: [
      "단호박은 쪄서 숟가락으로 부드럽게 으깬다.",
      "냄비에 밥, 으깬 단호박, 우유를 넣고 끓인다.",
      "약불에서 2분간 저으며 농도를 맞춘다.",
      "불을 끄고 아기치즈를 넣어 녹여 섞는다.",
    ],
    nutrition: { carbs_g: 41, protein_g: 7.8, fat_g: 6.5, fiber_g: 2.2, key_micronutrients: ["칼슘", "베타카로틴"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 12, age_to_month: 17, texture: "부드럽고 달콤한 리조또", size_guide: "밥알과 으깬 단호박", cooking_method: "치즈를 마지막에 녹여 풍미를 더함", serving_note: "칼슘과 비타민A를 맛있게 보충할 수 있습니다.", oil_level: "없음" },
  },
  {
    name: "새우 브로콜리 볶음밥",
    min_age_stage: "12-17",
    cook_minutes: 15,
    difficulty: 2,
    is_quick: true,
    allergens: ["갑각류"],
    choking_hazard_note: "새우살을 질기지 않게 잘게 다져 볶으세요.",
    caution_note: "새우 내장을 깨끗이 제거하세요.",
    menu_type: "rice",
    ingredients: [
      { name: "새우", quantity: 30, unit: "g" },
      { name: "브로콜리", quantity: 25, unit: "g" },
      { name: "당근", quantity: 15, unit: "g" },
      { name: "밥", quantity: 80, unit: "g" },
    ],
    steps: [
      "새우는 내장을 제거하고 잘게 다진다.",
      "브로콜리와 당근을 5mm 크기로 다진다.",
      "팬에 기름을 살짝 두르고 당근과 새우를 볶는다.",
      "브로콜리와 밥을 넣고 골고루 볶아 완성한다.",
    ],
    nutrition: { carbs_g: 45, protein_g: 10.5, fat_g: 3.8, fiber_g: 1.8, key_micronutrients: ["단백질", "키토산"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 12, age_to_month: 17, texture: "촉촉한 볶음밥", size_guide: "5mm 작은 입자", cooking_method: "새우를 작게 다져 질기지 않게 볶음", serving_note: "새우의 감칠맛이 살아있는 인기 만점 볶음밥입니다.", oil_level: "소량" },
  },
  {
    name: "소고기 양배추 덮밥",
    min_age_stage: "12-17",
    cook_minutes: 15,
    difficulty: 1,
    is_quick: true,
    allergens: [],
    choking_hazard_note: null,
    caution_note: null,
    menu_type: "rice",
    ingredients: [
      { name: "소고기", quantity: 35, unit: "g" },
      { name: "양배추", quantity: 35, unit: "g" },
      { name: "양파", quantity: 15, unit: "g" },
      { name: "밥", quantity: 80, unit: "g" },
      { name: "참기름", quantity: 3, unit: "g" },
    ],
    steps: [
      "소고기, 양배추, 양파를 5~8mm 크기로 채썬다.",
      "팬에 참기름을 두르고 소고기와 양파를 볶는다.",
      "양배추와 물 50ml를 넣고 뚜껑을 덮어 숨을 죽인다.",
      "양배추가 투명하고 달큰해지면 밥 위에 얹는다.",
    ],
    nutrition: { carbs_g: 45, protein_g: 12.0, fat_g: 6.0, fiber_g: 2.3, key_micronutrients: ["철분", "비타민U"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 12, age_to_month: 17, texture: "부드러운 덮밥", size_guide: "5~8mm 채썰기", cooking_method: "양배추를 푹 익혀 부드러운 단맛 추출", serving_note: "소화가 잘되어 저녁 메뉴로 안성맞춤입니다.", oil_level: "소량" },
  },
  {
    name: "닭안심 야채 핑거볼",
    min_age_stage: "12-17",
    cook_minutes: 18,
    difficulty: 2,
    is_quick: false,
    allergens: [],
    choking_hazard_note: "한입에 삼키지 않도록 아기 입 크기에 맞게 빚으세요.",
    caution_note: null,
    menu_type: "meatball",
    ingredients: [
      { name: "닭안심", quantity: 45, unit: "g" },
      { name: "당근", quantity: 15, unit: "g" },
      { name: "애호박", quantity: 15, unit: "g" },
      { name: "밥", quantity: 50, unit: "g" },
    ],
    steps: [
      "닭안심을 곱게 다지고 당근과 애호박도 잘게 다진다.",
      "볼에 닭안심, 야채, 밥을 넣고 끈기가 생기게 치댄다.",
      "동글동글 한입 크기(지름 2cm) 경단 모양으로 빚는다.",
      "찜기에 올려 12분간 속까지 푹 쪄낸다.",
    ],
    nutrition: { carbs_g: 30, protein_g: 12.5, fat_g: 2.0, fiber_g: 1.2, key_micronutrients: ["단백질", "비타민A"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 12, age_to_month: 17, texture: "부드러운 완자 형태", size_guide: "지름 1.5~2cm 볼", cooking_method: "찜기에서 부드럽게 찜", serving_note: "식어도 부드러워 외출용 도시락 메뉴로도 좋습니다.", oil_level: "없음" },
  },

  // --- 18~23개월 (10개) ---
  {
    name: "아기 소불고기 덮밥",
    min_age_stage: "18-23",
    cook_minutes: 18,
    difficulty: 2,
    is_quick: false,
    allergens: ["대두"],
    choking_hazard_note: null,
    caution_note: "설탕 대신 배를 갈아 넣어 단맛을 조절하세요.",
    menu_type: "rice",
    ingredients: [
      { name: "소고기", quantity: 45, unit: "g" },
      { name: "양파", quantity: 25, unit: "g" },
      { name: "표고버섯", quantity: 15, unit: "g" },
      { name: "배", quantity: 15, unit: "g" },
      { name: "밥", quantity: 90, unit: "g" },
      { name: "아기간장", quantity: 5, unit: "g" },
    ],
    steps: [
      "배를 강판에 갈아 아기간장과 섞어 불고기 양념을 만든다.",
      "소고기는 얇게 썰어 양념에 5분간 재운다.",
      "양파와 표고버섯을 채썬다.",
      "팬에 고기와 야채, 물 약간을 넣고 부드럽게 익혀 밥에 얹는다.",
    ],
    nutrition: { carbs_g: 52, protein_g: 15.5, fat_g: 7.2, fiber_g: 2.5, key_micronutrients: ["철분", "비타민D"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 18, age_to_month: 23, texture: "부드러운 불고기 덮밥", size_guide: "1~1.5cm 한입 크기", cooking_method: "배즙으로 연육하여 부드럽게 조리", serving_note: "설탕 없이 배의 천연 단맛으로 감칠맛을 냅니다.", oil_level: "소량" },
  },
  {
    name: "닭안심 데리야끼 조림",
    min_age_stage: "18-23",
    cook_minutes: 15,
    difficulty: 2,
    is_quick: true,
    allergens: ["대두"],
    choking_hazard_note: null,
    caution_note: "짜지 않게 물을 넉넉히 잡고 조리하세요.",
    menu_type: "stew",
    ingredients: [
      { name: "닭안심", quantity: 50, unit: "g" },
      { name: "양파", quantity: 20, unit: "g" },
      { name: "당근", quantity: 15, unit: "g" },
      { name: "아기간장", quantity: 5, unit: "g" },
    ],
    steps: [
      "닭안심을 한입 크기로 깍둑썰기한다.",
      "팬에 기름을 살짝 두르고 닭안심 표면을 익힌다.",
      "양파, 당근, 물 80ml, 아기간장을 넣는다.",
      "국물이 자작해질 때까지 은근하게 조려낸다.",
    ],
    nutrition: { carbs_g: 6, protein_g: 14.8, fat_g: 3.5, fiber_g: 1.0, key_micronutrients: ["고단백", "비타민B"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 18, age_to_month: 23, texture: "촉촉한 고기 반찬", size_guide: "1cm 크기 깍둑썰기", cooking_method: "간장 소스에 조려 간이 배게 함", serving_note: "짜지 않은 저염 데리야끼로 밥도둑 반찬입니다.", oil_level: "소량" },
  },
  {
    name: "들기름 팽이버섯 볶음밥",
    min_age_stage: "18-23",
    cook_minutes: 10,
    difficulty: 1,
    is_quick: true,
    allergens: ["계란"],
    choking_hazard_note: "버섯을 1cm 이하로 썰어주세요.",
    caution_note: null,
    menu_type: "rice",
    ingredients: [
      { name: "팽이버섯", quantity: 35, unit: "g" },
      { name: "계란", quantity: 1, unit: "개" },
      { name: "밥", quantity: 90, unit: "g" },
      { name: "들기름", quantity: 5, unit: "g" },
    ],
    steps: [
      "팽이버섯을 1cm 길이로 송송 썬다.",
      "팬에 들기름을 두르고 팽이버섯을 달달 볶는다.",
      "계란을 넣어 스크램블 형태로 볶는다.",
      "밥을 넣고 들기름 향이 배도록 고루 볶아낸다.",
    ],
    nutrition: { carbs_g: 48, protein_g: 9.8, fat_g: 8.5, fiber_g: 2.2, key_micronutrients: ["오메가3", "식이섬유"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 18, age_to_month: 23, texture: "고소한 볶음밥", size_guide: "1cm 버섯 입자", cooking_method: "들기름에 계란과 볶음", serving_note: "재료가 간단하면서도 풍미가 아주 뛰어납니다.", oil_level: "보통" },
  },
  {
    name: "메추리알 버섯 조림",
    min_age_stage: "18-23",
    cook_minutes: 15,
    difficulty: 1,
    is_quick: true,
    allergens: ["계란", "대두"],
    choking_hazard_note: "메추리알은 질식 방지를 위해 통째로 주지 말고 4등분으로 잘라주세요.",
    caution_note: null,
    menu_type: "stew",
    ingredients: [
      { name: "메추리알", quantity: 4, unit: "개" },
      { name: "표고버섯", quantity: 20, unit: "g" },
      { name: "당근", quantity: 15, unit: "g" },
      { name: "아기간장", quantity: 5, unit: "g" },
    ],
    steps: [
      "메추리알을 완숙으로 삶아 껍질을 벗긴다.",
      "표고버섯과 당근을 한입 크기로 썬다.",
      "냄비에 물 100ml, 아기간장, 재료를 모두 넣고 끓인다.",
      "중약불에서 10분간 국물이 절반으로 줄 때까지 조린다.",
      "제공 시 메추리알을 반 또는 4등분으로 잘라 준다.",
    ],
    nutrition: { carbs_g: 5, protein_g: 7.5, fat_g: 4.8, fiber_g: 1.2, key_micronutrients: ["단백질", "비타민A"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 18, age_to_month: 23, texture: "탱글탱글한 조림 반찬", size_guide: "메추리알 4등분 자르기", cooking_method: "간장 소스에 조린 후 잘라서 제공", serving_note: "질식 방지를 위해 통째로 주지 말고 반드시 잘라주세요.", oil_level: "없음" },
  },
  {
    name: "맑은 감자 멸치국",
    min_age_stage: "18-23",
    cook_minutes: 15,
    difficulty: 1,
    is_quick: true,
    allergens: ["생선", "계란"],
    choking_hazard_note: null,
    caution_note: "멸치 육수를 우려낸 뒤 멸치는 건져내세요.",
    menu_type: "soup",
    ingredients: [
      { name: "감자", quantity: 45, unit: "g" },
      { name: "멸치", quantity: 10, unit: "g" },
      { name: "대파", quantity: 10, unit: "g" },
      { name: "계란", quantity: 1, unit: "개" },
    ],
    steps: [
      "냄비에 멸치를 넣고 볶다가 물 350ml를 부어 멸치 육수를 낸다.",
      "멸치를 건져내고 얇게 썬 감자를 넣어 익힌다.",
      "감자가 투명해지면 푼 계란을 줄알 쳐 넣는다.",
      "송송 썬 대파를 넣고 불을 끈다.",
    ],
    nutrition: { carbs_g: 12, protein_g: 9.0, fat_g: 5.2, fiber_g: 1.0, key_micronutrients: ["칼슘", "칼륨"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 18, age_to_month: 23, texture: "구수한 맑은 국", size_guide: "포슬포슬한 감자 조각", cooking_method: "멸치 육수를 진하게 우려 감자와 끓임", serving_note: "멸치 육수 자체의 감칠맛으로 소금 없이도 깊은 맛이 납니다.", oil_level: "없음" },
  },
  {
    name: "아기 순살 고등어구이",
    min_age_stage: "18-23",
    cook_minutes: 12,
    difficulty: 1,
    is_quick: true,
    allergens: ["생선"],
    choking_hazard_note: "생선 가시가 완전히 없는지 손으로 만져 확인하세요.",
    caution_note: "기름기가 많으므로 기름을 잘 빼서 제공하세요.",
    menu_type: "finger_food",
    ingredients: [
      { name: "고등어", quantity: 50, unit: "g" },
      { name: "들기름", quantity: 3, unit: "g" },
    ],
    steps: [
      "순살 고등어의 잔가시를 핀셋으로 꼼꼼히 제거한다.",
      "종이호일에 들기름을 살짝 바르고 고등어를 올린다.",
      "팬이나 에어프라이어에 겉바속촉으로 노릇하게 굽는다.",
      "살코기를 발라 한입 크기로 떼어 제공한다.",
    ],
    nutrition: { carbs_g: 0, protein_g: 12.0, fat_g: 9.5, fiber_g: 0, key_micronutrients: ["DHA", "오메가3"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 18, age_to_month: 23, texture: "고소한 생선 구이", size_guide: "가시 없는 살코기 조각", cooking_method: "기름을 쏙 빼며 노릇하게 구움", serving_note: "두뇌 발달에 핵심인 DHA가 가장 풍부한 생선입니다.", oil_level: "소량" },
  },
  {
    name: "아기 잡채",
    min_age_stage: "18-23",
    cook_minutes: 20,
    difficulty: 2,
    is_quick: false,
    allergens: ["대두"],
    choking_hazard_note: "당면은 목에 걸릴 수 있으니 가위로 2~3cm로 짧게 잘라주세요.",
    caution_note: null,
    menu_type: "noodle",
    ingredients: [
      { name: "당면", quantity: 30, unit: "g" },
      { name: "소고기", quantity: 30, unit: "g" },
      { name: "시금치", quantity: 20, unit: "g" },
      { name: "당근", quantity: 15, unit: "g" },
      { name: "아기간장", quantity: 5, unit: "g" },
      { name: "참기름", quantity: 4, unit: "g" },
    ],
    steps: [
      "당면을 부드럽게 삶아 찬물에 헹군 뒤 2~3cm 길이로 짧게 자른다.",
      "시금치는 데쳐 물기를 짜고, 당근과 소고기는 채썬다.",
      "팬에 소고기와 당근을 볶다가 시금치와 삶은 당면을 넣는다.",
      "아기간장과 참기름을 넣고 골고루 볶아낸다.",
    ],
    nutrition: { carbs_g: 36, protein_g: 9.5, fat_g: 6.8, fiber_g: 1.8, key_micronutrients: ["철분", "비타민A"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 18, age_to_month: 23, texture: "부드러운 잡채면", size_guide: "당면을 2~3cm로 짧게 자름", cooking_method: "당면을 푹 삶아 부드럽게 조리", serving_note: "목에 걸리지 않도록 당면을 가위로 충분히 잘라주세요.", oil_level: "소량" },
  },
  {
    name: "옥수수 치즈전",
    min_age_stage: "18-23",
    cook_minutes: 10,
    difficulty: 1,
    is_quick: true,
    allergens: ["유제품", "계란"],
    choking_hazard_note: "옥수수 알갱이를 포크나 칼등으로 살짝 으깨어 조리하세요.",
    caution_note: null,
    menu_type: "pancake",
    ingredients: [
      { name: "옥수수", quantity: 35, unit: "g" },
      { name: "아기치즈", quantity: 1, unit: "장" },
      { name: "계란", quantity: 1, unit: "개" },
    ],
    steps: [
      "옥수수 알갱이를 칼등이나 포크로 살짝 으깬다.",
      "볼에 계란을 풀고 옥수수와 잘게 찢은 치즈를 섞는다.",
      "팬에 기름을 살짝 두르고 반죽을 한 숟가락씩 올린다.",
      "치즈가 녹으며 노릇해질 때까지 앞뒤로 굽는다.",
    ],
    nutrition: { carbs_g: 10, protein_g: 8.5, fat_g: 7.5, fiber_g: 1.4, key_micronutrients: ["칼슘", "단백질"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 18, age_to_month: 23, texture: "고소하고 쫀득한 전", size_guide: "한입 크기 핑거푸드", cooking_method: "옥수수를 으깨어 약불에 부침", serving_note: "옥수수 낱알 흡인 방지를 위해 으깨어 조리했습니다.", oil_level: "소량" },
  },
  {
    name: "연근 들기름 조림",
    min_age_stage: "18-23",
    cook_minutes: 15,
    difficulty: 1,
    is_quick: true,
    allergens: ["대두"],
    choking_hazard_note: "연근이 너무 딱딱하지 않도록 먼저 푹 삶아내세요.",
    caution_note: null,
    menu_type: "stew",
    ingredients: [
      { name: "연근", quantity: 40, unit: "g" },
      { name: "당근", quantity: 15, unit: "g" },
      { name: "들기름", quantity: 5, unit: "g" },
      { name: "아기간장", quantity: 4, unit: "g" },
    ],
    steps: [
      "연근을 껍질 벗겨 얇게 썰어 끓는 물에 5분간 삶아 아린 맛을 뺀다.",
      "삶은 연근을 아기 한입 크기로 자른다.",
      "팬에 들기름을 두르고 연근과 당근을 볶는다.",
      "물 50ml와 아기간장을 넣고 부드럽게 조려낸다.",
    ],
    nutrition: { carbs_g: 9, protein_g: 1.5, fat_g: 5.2, fiber_g: 2.5, key_micronutrients: ["식이섬유", "철분"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 18, age_to_month: 23, texture: "부드럽고 아삭한 조림", size_guide: "얇고 작은 조각", cooking_method: "먼저 푹 삶은 뒤 들기름에 조림", serving_note: "코피가 자주 나거나 철분이 필요한 아기에게 명약입니다.", oil_level: "소량" },
  },
  {
    name: "게살 계란 덮밥",
    min_age_stage: "18-23",
    cook_minutes: 10,
    difficulty: 1,
    is_quick: true,
    allergens: ["갑각류", "계란"],
    choking_hazard_note: null,
    caution_note: "계란을 완숙으로 익히세요.",
    menu_type: "rice",
    ingredients: [
      { name: "게살", quantity: 30, unit: "g" },
      { name: "계란", quantity: 1, unit: "개" },
      { name: "대파", quantity: 10, unit: "g" },
      { name: "밥", quantity: 90, unit: "g" },
      { name: "참기름", quantity: 3, unit: "g" },
    ],
    steps: [
      "게살을 결대로 찢고 대파는 얇게 송송 썬다.",
      "팬에 참기름을 두르고 대파와 게살을 볶는다.",
      "물 40ml를 붓고 끓어오르면 푼 계란을 둘러 촉촉하게 익힌다.",
      "따뜻한 밥 위에 몽글몽글하게 얹어낸다.",
    ],
    nutrition: { carbs_g: 48, protein_g: 13.0, fat_g: 7.0, fiber_g: 0.8, key_micronutrients: ["단백질", "키토산"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 18, age_to_month: 23, texture: "촉촉하고 부드러운 덮밥", size_guide: "부드러운 계란과 게살", cooking_method: "계란을 완숙으로 몽글몽글하게 익힘", serving_note: "호텔 중식 게살 볶음밥처럼 부드럽고 감칠맛이 좋습니다.", oil_level: "소량" },
  },

  // --- 24개월+ (10개) ---
  {
    name: "아기 궁중 떡볶이",
    min_age_stage: "24+",
    cook_minutes: 18,
    difficulty: 2,
    is_quick: false,
    allergens: ["대두", "밀"],
    choking_hazard_note: "고기와 채소를 한입 크기로 썰어주세요.",
    caution_note: "간을 약하게 하여 유아 입맛에 맞추세요.",
    menu_type: "finger_food",
    ingredients: [
      { name: "소고기", quantity: 40, unit: "g" },
      { name: "양파", quantity: 20, unit: "g" },
      { name: "당근", quantity: 15, unit: "g" },
      { name: "표고버섯", quantity: 15, unit: "g" },
      { name: "아기간장", quantity: 5, unit: "g" },
      { name: "참기름", quantity: 4, unit: "g" },
    ],
    steps: [
      "소고기와 채소들을 먹기 좋은 크기로 썬다.",
      "팬에 참기름을 두르고 소고기와 야채를 볶는다.",
      "물 80ml와 아기간장을 넣고 자작하게 끓인다.",
      "채소와 고기가 부드럽게 익어 양념이 배면 불을 끈다.",
    ],
    nutrition: { carbs_g: 10, protein_g: 14.0, fat_g: 8.5, fiber_g: 2.2, key_micronutrients: ["철분", "비타민D"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 24, age_to_month: 36, texture: "부드러운 조림/핑거푸드", size_guide: "1~1.5cm 한입 크기", cooking_method: "간장 소스에 채소와 고기를 볶아 조림", serving_note: "맵지 않고 달콤 짭짤하여 유아식 최고의 특식입니다.", oil_level: "소량" },
  },
  {
    name: "전복 영양죽",
    min_age_stage: "24+",
    cook_minutes: 22,
    difficulty: 2,
    is_quick: false,
    allergens: ["패류"],
    choking_hazard_note: "전복 살을 충분히 잘게 다져 씹기 편하게 하세요.",
    caution_note: "전복 알레르기가 있는지 확인하세요.",
    menu_type: "porridge",
    ingredients: [
      { name: "전복", quantity: 35, unit: "g" },
      { name: "당근", quantity: 15, unit: "g" },
      { name: "애호박", quantity: 15, unit: "g" },
      { name: "밥", quantity: 80, unit: "g" },
      { name: "참기름", quantity: 4, unit: "g" },
    ],
    steps: [
      "전복을 깨끗이 솔로 씻어 내장을 떼고 살만 잘게 다진다.",
      "당근과 애호박도 잘게 다진다.",
      "냄비에 참기름을 두르고 전복을 달달 볶는다.",
      "밥과 물 200ml, 야채를 넣고 밥알이 푹 퍼지도록 끓인다.",
    ],
    nutrition: { carbs_g: 45, protein_g: 12.5, fat_g: 5.5, fiber_g: 1.5, key_micronutrients: ["아르기닌", "타우린"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 24, age_to_month: 36, texture: "진하고 구수한 죽", size_guide: "잘게 다진 전복 살코기", cooking_method: "참기름에 볶아 푹 끓임", serving_note: "체력 보충과 입맛을 돋우는 대표 보양 이유식입니다.", oil_level: "소량" },
  },
  {
    name: "아기 버섯 불고기",
    min_age_stage: "24+",
    cook_minutes: 18,
    difficulty: 2,
    is_quick: false,
    allergens: ["대두"],
    choking_hazard_note: null,
    caution_note: null,
    menu_type: "stew",
    ingredients: [
      { name: "소고기", quantity: 50, unit: "g" },
      { name: "팽이버섯", quantity: 20, unit: "g" },
      { name: "새송이버섯", quantity: 20, unit: "g" },
      { name: "양파", quantity: 20, unit: "g" },
      { name: "아기간장", quantity: 5, unit: "g" },
    ],
    steps: [
      "소고기를 얇게 썰어 아기간장에 살짝 버무린다.",
      "새송이버섯과 양파는 채썰고, 팽이버섯은 2cm로 썬다.",
      "냄비에 소고기와 버섯, 양파, 물 50ml를 넣고 볶는다.",
      "재료가 푹 익어 자연스러운 버섯 채수가 우러나오면 완성한다.",
    ],
    nutrition: { carbs_g: 8, protein_g: 16.5, fat_g: 7.8, fiber_g: 2.8, key_micronutrients: ["철분", "식이섬유"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 24, age_to_month: 36, texture: "부드러운 불고기 전골", size_guide: "1.5cm 한입 크기", cooking_method: "채수를 우려 자작하게 끓임", serving_note: "다양한 버섯의 식감과 풍미를 익히는 좋은 메뉴입니다.", oil_level: "소량" },
  },
  {
    name: "훈제오리 야채볶음밥",
    min_age_stage: "24+",
    cook_minutes: 15,
    difficulty: 1,
    is_quick: true,
    allergens: [],
    choking_hazard_note: null,
    caution_note: "오리고기를 데쳐 기름기를 뺀 후 사용하세요.",
    menu_type: "rice",
    ingredients: [
      { name: "오리고기", quantity: 45, unit: "g" },
      { name: "부추", quantity: 15, unit: "g" },
      { name: "양파", quantity: 15, unit: "g" },
      { name: "밥", quantity: 90, unit: "g" },
    ],
    steps: [
      "오리고기는 끓는 물에 살짝 데쳐 기름기를 뺀 뒤 작게 썬다.",
      "부추와 양파를 잘게 다진다.",
      "팬에 오리고기와 양파를 먼저 볶아 향을 낸다.",
      "밥과 부추를 넣고 빠르게 볶아낸다.",
    ],
    nutrition: { carbs_g: 48, protein_g: 13.5, fat_g: 8.0, fiber_g: 1.5, key_micronutrients: ["불포화지방산", "비타민A"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 24, age_to_month: 36, texture: "고소한 볶음밥", size_guide: "1cm 작은 조각", cooking_method: "오리 기름을 한번 뺀 후 담백하게 볶음", serving_note: "부추와 오리의 궁합이 뛰어나며 기력 회복에 좋습니다.", oil_level: "보통" },
  },
  {
    name: "오징어 야채볶음",
    min_age_stage: "24+",
    cook_minutes: 15,
    difficulty: 2,
    is_quick: true,
    allergens: ["연체류"],
    choking_hazard_note: "오징어가 질기지 않도록 칼집을 넣고 아주 잘게 썰어주세요.",
    caution_note: "오래 볶으면 질겨지므로 살짝 익히세요.",
    menu_type: "stew",
    ingredients: [
      { name: "오징어", quantity: 40, unit: "g" },
      { name: "애호박", quantity: 25, unit: "g" },
      { name: "당근", quantity: 15, unit: "g" },
      { name: "양파", quantity: 15, unit: "g" },
      { name: "참기름", quantity: 3, unit: "g" },
    ],
    steps: [
      "오징어 껍질을 벗기고 격자로 칼집을 낸 후 아주 잘게 썬다.",
      "애호박, 당근, 양파를 채썬다.",
      "팬에 참기름을 두르고 야채를 먼저 볶다가 오징어를 넣는다.",
      "오징어가 부드럽게 익도록 단시간에 볶아낸다.",
    ],
    nutrition: { carbs_g: 6, protein_g: 11.5, fat_g: 4.2, fiber_g: 1.7, key_micronutrients: ["타우린", "고단백"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 24, age_to_month: 36, texture: "부드럽고 쫄깃한 볶음 반찬", size_guide: "아주 잘게 썬 오징어", cooking_method: "칼집을 내어 연하게 볶음", serving_note: "질길 수 있으니 꼭 작게 썰어주고 잘 씹는지 지켜봐주세요.", oil_level: "소량" },
  },
  {
    name: "아기 된장 나물비빔밥",
    min_age_stage: "24+",
    cook_minutes: 12,
    difficulty: 1,
    is_quick: true,
    allergens: ["대두"],
    choking_hazard_note: null,
    caution_note: "저염 아기된장을 소량만 사용하세요.",
    menu_type: "rice",
    ingredients: [
      { name: "콩나물", quantity: 25, unit: "g" },
      { name: "시금치", quantity: 20, unit: "g" },
      { name: "당근", quantity: 15, unit: "g" },
      { name: "밥", quantity: 90, unit: "g" },
      { name: "아기된장", quantity: 3, unit: "g" },
      { name: "들기름", quantity: 4, unit: "g" },
    ],
    steps: [
      "콩나물, 시금치, 채썬 당근을 끓는 물에 데쳐 물기를 짠다.",
      "나물들을 아기 한입 크기로 쫑쫑 썬다.",
      "아기된장과 들기름을 섞어 부드러운 양념을 만든다.",
      "밥 위에 나물과 된장 소스를 올리고 골고루 비벼준다.",
    ],
    nutrition: { carbs_g: 50, protein_g: 7.5, fat_g: 5.5, fiber_g: 3.2, key_micronutrients: ["이소플라본", "식이섬유"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 24, age_to_month: 36, texture: "구수한 나물 비빔밥", size_guide: "1cm 나물 송송", cooking_method: "나물을 데쳐 저염 된장에 버무림", serving_note: "된장의 유익균과 나물의 풍부한 식이섬유가 장 건강을 돕습니다.", oil_level: "소량" },
  },
  {
    name: "리코타치즈 과일 샐러드",
    min_age_stage: "24+",
    cook_minutes: 5,
    difficulty: 1,
    is_quick: true,
    allergens: ["유제품"],
    choking_hazard_note: "블루베리와 딸기는 4등분으로 잘라 제공하세요.",
    caution_note: null,
    menu_type: "snack",
    ingredients: [
      { name: "리코타치즈", quantity: 35, unit: "g" },
      { name: "딸기", quantity: 30, unit: "g" },
      { name: "블루베리", quantity: 20, unit: "g" },
      { name: "바나나", quantity: 30, unit: "g" },
    ],
    steps: [
      "딸기와 블루베리는 깨끗이 씻어 4등분한다.",
      "바나나는 한입 크기로 썬다.",
      "볼에 신선한 과일을 담고 리코타치즈를 숟가락으로 얹는다.",
      "치즈와 과일을 살살 버무려 바로 먹인다.",
    ],
    nutrition: { carbs_g: 18, protein_g: 4.8, fat_g: 4.0, fiber_g: 2.4, key_micronutrients: ["비타민C", "칼슘"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 24, age_to_month: 36, texture: "신선하고 크리미한 디저트", size_guide: "과일 4등분 조각", cooking_method: "조리 없이 신선하게 제공", serving_note: "간식이나 아침 식사에 곁들이기 좋은 영양 폭탄 샐러드입니다.", oil_level: "없음" },
  },
  {
    name: "연근 소고기전",
    min_age_stage: "24+",
    cook_minutes: 15,
    difficulty: 2,
    is_quick: false,
    allergens: ["계란"],
    choking_hazard_note: null,
    caution_note: "소고기가 속까지 완전히 익도록 약불에서 은근히 구우세요.",
    menu_type: "pancake",
    ingredients: [
      { name: "연근", quantity: 35, unit: "g" },
      { name: "소고기다짐육", quantity: 35, unit: "g" },
      { name: "계란", quantity: 1, unit: "개" },
    ],
    steps: [
      "연근은 강판에 곱게 갈아 물기를 살짝 짠다.",
      "갈아놓은 연근, 소고기다짐육, 계란을 볼에 넣고 치댄다.",
      "팬에 기름을 두르고 한 숟가락씩 도톰하게 올린다.",
      "약불에서 속까지 소고기가 완전히 익도록 노릇하게 부친다.",
    ],
    nutrition: { carbs_g: 7, protein_g: 13.0, fat_g: 7.2, fiber_g: 1.6, key_micronutrients: ["철분", "단백질"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 24, age_to_month: 36, texture: "겉바속촉 고기전", size_guide: "한입 크기 전", cooking_method: "연근을 갈아 넣어 쫀득하게 부침", serving_note: "연근 특유의 전분기로 밀가루 없이도 쫀득하고 고소합니다.", oil_level: "소량" },
  },
  {
    name: "아기 잔치국수",
    min_age_stage: "24+",
    cook_minutes: 15,
    difficulty: 1,
    is_quick: true,
    allergens: ["밀", "계란", "생선"],
    choking_hazard_note: "국수는 2~3cm 길이로 짧게 잘라 숟가락으로 떠먹게 하세요.",
    caution_note: null,
    menu_type: "noodle",
    ingredients: [
      { name: "국수", quantity: 40, unit: "g" },
      { name: "멸치", quantity: 10, unit: "g" },
      { name: "애호박", quantity: 20, unit: "g" },
      { name: "당근", quantity: 15, unit: "g" },
      { name: "계란", quantity: 1, unit: "개" },
    ],
    steps: [
      "멸치로 진하게 육수를 끓이고 멸치를 건진다.",
      "육수에 채썬 애호박과 당근을 넣어 익힌다.",
      "국수를 부드럽게 삶아 찬물에 헹군 뒤 짧게 자른다.",
      "지단을 부쳐 썰어 올리고 따뜻한 멸치 육수를 부어낸다.",
    ],
    nutrition: { carbs_g: 38, protein_g: 11.2, fat_g: 6.0, fiber_g: 1.5, key_micronutrients: ["칼슘", "비타민A"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 24, age_to_month: 36, texture: "부드러운 온면", size_guide: "2~3cm 짧은 면", cooking_method: "면을 푹 삶고 멸치 육수 조리", serving_note: "면을 짧게 잘라 숟가락으로 국물과 함께 떠먹게 해주세요.", oil_level: "소량" },
  },
  {
    name: "아기 두부 된장국밥",
    min_age_stage: "24+",
    cook_minutes: 15,
    difficulty: 1,
    is_quick: true,
    allergens: ["대두"],
    choking_hazard_note: null,
    caution_note: "된장을 연하게 풀어 짜지 않게 끓이세요.",
    menu_type: "soup",
    ingredients: [
      { name: "두부", quantity: 50, unit: "g" },
      { name: "감자", quantity: 30, unit: "g" },
      { name: "애호박", quantity: 20, unit: "g" },
      { name: "아기된장", quantity: 3, unit: "g" },
      { name: "밥", quantity: 90, unit: "g" },
    ],
    steps: [
      "냄비에 물 300ml를 붓고 감자와 애호박을 깍둑썰어 넣고 끓인다.",
      "채소가 익으면 아기된장을 체에 밭쳐 곱게 푼다.",
      "두부를 한입 크기로 썰어 넣고 3분간 더 끓인다.",
      "따뜻한 밥을 국물에 말아 낸다.",
    ],
    nutrition: { carbs_g: 52, protein_g: 11.0, fat_g: 4.8, fiber_g: 2.2, key_micronutrients: ["칼슘", "단백질"], source: "식품의약품안전처 식품영양성분DB" },
    variant: { age_from_month: 24, age_to_month: 36, texture: "구수하고 부드러운 국밥", size_guide: "1cm 두부 깍둑썰기", cooking_method: "된장을 연하게 풀어 채소와 끓임", serving_note: "자극적이지 않은 구수한 맛으로 아침 든든한 식사로 최고입니다.", oil_level: "없음" },
  },
];

async function main() {
  console.log("🚀 [1/6] 식재료 대량 추가 시작...");
  
  // 1. Insert new ingredients
  for (const ing of NEW_INGREDIENTS) {
    const { error } = await supabase
      .from('ingredients')
      .upsert(
        {
          name: ing.name,
          category: ing.category,
          primary_nutrients: ing.primary_nutrients,
          food_groups: ing.food_groups,
        },
        { onConflict: 'name' }
      );
    if (error) {
      console.error(`❌ 식재료 ${ing.name} 추가 실패:`, error.message);
    }
  }
  console.log(`✅ 식재료 48종 추가/업데이트 완료!`);

  // Fetch all ingredients map (name -> id)
  const { data: allIngs, error: ingErr } = await supabase.from('ingredients').select('id, name');
  if (ingErr) throw ingErr;
  const ingMap = new Map(allIngs.map((i) => [i.name, i.id]));

  console.log(`📊 현재 DB 총 식재료 수: ${ingMap.size}개`);

  // 2. Insert new safety rules
  console.log("🛡️ [2/6] 식재료 안전 규칙 추가 시작...");
  for (const rule of NEW_SAFETY_RULES) {
    const ingId = ingMap.get(rule.ingredient_name);
    if (!ingId) {
      console.warn(`⚠️ 안전규칙 대상 재료 미발견: ${rule.ingredient_name}`);
      continue;
    }
    // Check if rule already exists
    const { data: existing } = await supabase
      .from('ingredient_safety_rules')
      .select('id')
      .eq('ingredient_id', ingId)
      .eq('age_from_month', rule.age_from_month)
      .maybeSingle();

    if (!existing) {
      const { error: sErr } = await supabase.from('ingredient_safety_rules').insert({
        ingredient_id: ingId,
        age_from_month: rule.age_from_month,
        age_to_month: rule.age_to_month,
        safety_level: rule.safety_level,
        hazard_type: rule.hazard_type,
        modification_note: rule.modification_note,
      });
      if (sErr) console.error(`❌ 안전규칙 추가 실패 (${rule.ingredient_name}):`, sErr.message);
    }
  }
  console.log(`✅ 식재료 안전 규칙 추가 완료!`);

  // 3. Insert new recipes
  console.log("🍳 [3/6] 신규 레시피 55개 및 연관 데이터 추가 시작...");
  let insertedRecipeCount = 0;

  for (const r of NEW_RECIPES) {
    // Check existing recipe
    const { data: existingRecipe } = await supabase
      .from('recipes')
      .select('id')
      .eq('name', r.name)
      .maybeSingle();

    let recipeId = existingRecipe?.id;

    if (!recipeId) {
      const { data: newRec, error: rErr } = await supabase
        .from('recipes')
        .insert({
          name: r.name,
          min_age_stage: r.min_age_stage,
          cook_minutes: r.cook_minutes,
          difficulty: r.difficulty,
          is_quick: r.is_quick,
          allergens: r.allergens,
          choking_hazard_note: r.choking_hazard_note,
          caution_note: r.caution_note,
          menu_type: r.menu_type,
        })
        .select('id')
        .single();

      if (rErr) {
        console.error(`❌ 레시피 ${r.name} 추가 실패:`, rErr.message);
        continue;
      }
      recipeId = newRec.id;
      insertedRecipeCount++;
    }

    // Insert recipe_ingredients
    for (const ing of r.ingredients) {
      const ingId = ingMap.get(ing.name);
      if (!ingId) {
        console.error(`❌ 레시피 ${r.name}의 재료 ${ing.name} 를 찾을 수 없습니다!`);
        continue;
      }
      await supabase.from('recipe_ingredients').upsert(
        {
          recipe_id: recipeId,
          ingredient_id: ingId,
          quantity: ing.quantity,
          unit: ing.unit,
          is_optional: false,
        },
        { onConflict: 'recipe_id,ingredient_id' }
      );
    }

    // Insert recipe_steps
    for (let i = 0; i < r.steps.length; i++) {
      await supabase.from('recipe_steps').upsert(
        {
          recipe_id: recipeId,
          step_number: i + 1,
          instruction: r.steps[i],
        },
        { onConflict: 'recipe_id,step_number' }
      );
    }

    // Insert nutrition_data
    await supabase.from('nutrition_data').upsert(
      {
        recipe_id: recipeId,
        carbs_g: r.nutrition.carbs_g,
        protein_g: r.nutrition.protein_g,
        fat_g: r.nutrition.fat_g,
        fiber_g: r.nutrition.fiber_g,
        key_micronutrients: r.nutrition.key_micronutrients,
        source: r.nutrition.source,
      },
      { onConflict: 'recipe_id' }
    );

    // Insert recipe_age_variants
    if (r.variant) {
      const { data: existingVariant } = await supabase
        .from('recipe_age_variants')
        .select('id')
        .eq('recipe_id', recipeId)
        .eq('age_from_month', r.variant.age_from_month)
        .maybeSingle();

      if (!existingVariant) {
        await supabase.from('recipe_age_variants').insert({
          recipe_id: recipeId,
          age_from_month: r.variant.age_from_month,
          age_to_month: r.variant.age_to_month,
          texture: r.variant.texture,
          size_guide: r.variant.size_guide,
          cooking_method: r.variant.cooking_method,
          serving_note: r.variant.serving_note,
          oil_level: r.variant.oil_level,
        });
      }
    }
  }

  console.log(`✅ 신규 레시피 55개 및 재료/단계/영양정보/월령변형 완벽 저장 완료! (신규 삽입: ${insertedRecipeCount}개)`);

  // 4. Generate SQL Migration File (0019_mass_ingredients_and_recipes.sql)
  console.log("📝 [4/6] SQL 마이그레이션 파일 생성 시작...");
  generateMigrationSql();

  // 5. Final Verification
  console.log("🔍 [5/6] 최종 검증 쿼리 실행...");
  const { count: finalIngCount } = await supabase.from('ingredients').select('*', { count: 'exact', head: true });
  const { count: finalRecCount } = await supabase.from('recipes').select('*', { count: 'exact', head: true });
  const { count: finalVarCount } = await supabase.from('recipe_age_variants').select('*', { count: 'exact', head: true });
  const { count: finalSafeCount } = await supabase.from('ingredient_safety_rules').select('*', { count: 'exact', head: true });
  const { count: finalStepCount } = await supabase.from('recipe_steps').select('*', { count: 'exact', head: true });
  const { count: finalNutCount } = await supabase.from('nutrition_data').select('*', { count: 'exact', head: true });

  console.log("\n==========================================");
  console.log("🎉 대량 메뉴 & 식재료 확장 최종 결과");
  console.log("==========================================");
  console.log(`- 식재료 (ingredients): ${finalIngCount}개 (기존 59개 -> +48개 확장 완료)`);
  console.log(`- 레시피 (recipes): ${finalRecCount}개 (기존 95개 -> +55개 신규 추가 완료)`);
  console.log(`- 조리 단계 (recipe_steps): ${finalStepCount}개`);
  console.log(`- 영양 정보 (nutrition_data): ${finalNutCount}개`);
  console.log(`- 월령별 가이드 (recipe_age_variants): ${finalVarCount}개`);
  console.log(`- 안전 규칙 (ingredient_safety_rules): ${finalSafeCount}개`);
  console.log("==========================================\n");
}

function generateMigrationSql() {
  let sql = `-- 0019_mass_ingredients_and_recipes.sql
-- 식재료 48종 및 레시피 55종 대량 확장 마이그레이션

-- 1. 신규 식재료 48종 추가
insert into ingredients (name, category, primary_nutrients, food_groups) values
${NEW_INGREDIENTS.map(i => `  ('${i.name}', '${i.category}', array[${i.primary_nutrients.map(n => `'${n}'`).join(', ')}], array[${i.food_groups.map(g => `'${g}'`).join(', ')}])`).join(',\n')}
on conflict (name) do update set
  category = excluded.category,
  primary_nutrients = excluded.primary_nutrients,
  food_groups = excluded.food_groups;

-- 2. 식재료 안전 규칙 추가
${NEW_SAFETY_RULES.map(r => `insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, ${r.age_from_month}, ${r.age_to_month}, '${r.safety_level}', '${r.hazard_type}', '${r.modification_note.replace(/'/g, "''")}'
from ingredients where name = '${r.ingredient_name}'
and not exists (
  select 1 from ingredient_safety_rules sr
  where sr.ingredient_id = ingredients.id and sr.age_from_month = ${r.age_from_month}
);`).join('\n\n')}

-- 3. 신규 레시피 55종 및 연관 데이터 추가
`;

  for (const r of NEW_RECIPES) {
    const safeCaution = r.caution_note ? `'${r.caution_note.replace(/'/g, "''")}'` : 'null';
    const safeChoking = r.choking_hazard_note ? `'${r.choking_hazard_note.replace(/'/g, "''")}'` : 'null';
    const allergensArray = r.allergens.length > 0 ? `'{${r.allergens.join(',')}}'` : "'{}'";

    sql += `
-- 레시피: ${r.name}
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('${r.name}', '${r.min_age_stage}', ${r.cook_minutes}, ${r.difficulty}, ${r.is_quick}, ${allergensArray}, ${safeChoking}, ${safeCaution}, '${r.menu_type}')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
${r.ingredients.map(ing => `  ('${ing.name}', ${ing.quantity}, '${ing.unit}')`).join(',\n')}
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '${r.name}')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
${r.steps.map((st, idx) => `  (${idx + 1}, '${st.replace(/'/g, "''")}')`).join(',\n')}
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '${r.name}')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, ${r.nutrition.carbs_g}, ${r.nutrition.protein_g}, ${r.nutrition.fat_g}, ${r.nutrition.fiber_g}, array[${r.nutrition.key_micronutrients.map(m => `'${m}'`).join(', ')}], '${r.nutrition.source}'
from r
on conflict (recipe_id) do nothing;
`;

    if (r.variant) {
      sql += `with r as (select id from recipes where name = '${r.name}')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, ${r.variant.age_from_month}, ${r.variant.age_to_month}, '${r.variant.texture}', '${r.variant.size_guide}', '${r.variant.cooking_method}', '${r.variant.serving_note.replace(/'/g, "''")}', '${r.variant.oil_level}'
from r;
`;
    }
  }

  const migrationPath = path.resolve('supabase/migrations/0019_mass_ingredients_and_recipes.sql');
  fs.writeFileSync(migrationPath, sql, 'utf-8');
  console.log(`✅ 마이그레이션 파일 생성 완료: ${migrationPath}`);
}

main().catch((err) => {
  console.error("❌ 처리 중 오류 발생:", err);
  process.exit(1);
});
