import { SupabaseClient } from "@supabase/supabase-js";
import { RecipeWithDetails } from "@/lib/types/recipe";

/**
 * recipes + recipe_ingredients(+ingredients 이름) + recipe_steps + nutrition_data 를
 * 한 번에 조합해서 가져온다. STEP 8에서 이 결과를 recommend.ts 의 scoreRecipes 입력으로 변환해 쓴다.
 */
export const DEFAULT_RECIPES: RecipeWithDetails[] = [
  {
    id: "rec-beef-zucchini",
    name: "소고기 애호박 덮밥",
    min_age_stage: "18-23",
    cook_minutes: 20,
    difficulty: 2,
    is_quick: false,
    allergens: [],
    choking_hazard_note: "고기와 채소를 아기가 씹기 좋은 크기로 다졌는지 확인하세요.",
    caution_note: "나트륨 함량이 낮도록 간을 최소화했어요.",
    created_at: "2026-01-01T00:00:00.000Z",
    image_url: null,
    ingredients: [
      { id: "i1", recipe_id: "rec-beef-zucchini", ingredient_id: "ing-beef", quantity: 40, unit: "g", is_optional: false, ingredient: { name: "소고기", category: "육류", primary_nutrients: ["단백질", "철분", "아연"] } },
      { id: "i2", recipe_id: "rec-beef-zucchini", ingredient_id: "ing-zucchini", quantity: 30, unit: "g", is_optional: false, ingredient: { name: "애호박", category: "채소", primary_nutrients: ["비타민A", "식이섬유"] } },
      { id: "i3", recipe_id: "rec-beef-zucchini", ingredient_id: "ing-onion", quantity: 10, unit: "g", is_optional: false, ingredient: { name: "양파", category: "채소", primary_nutrients: ["식이섬유"] } },
      { id: "i4", recipe_id: "rec-beef-zucchini", ingredient_id: "ing-rice", quantity: 80, unit: "g", is_optional: false, ingredient: { name: "밥", category: "곡류", primary_nutrients: ["탄수화물"] } },
    ],
    steps: [
      { id: "s1", recipe_id: "rec-beef-zucchini", step_number: 1, instruction: "소고기를 잘게 다진다." },
      { id: "s2", recipe_id: "rec-beef-zucchini", step_number: 2, instruction: "애호박과 양파를 잘게 썬다." },
      { id: "s3", recipe_id: "rec-beef-zucchini", step_number: 3, instruction: "팬에 재료를 충분히 익힌다." },
      { id: "s4", recipe_id: "rec-beef-zucchini", step_number: 4, instruction: "밥과 함께 섞는다." },
    ],
    nutrition: {
      id: "n1",
      recipe_id: "rec-beef-zucchini",
      carbs_g: 42,
      protein_g: 14,
      fat_g: 6,
      fiber_g: 2.1,
      key_micronutrients: ["철분", "비타민A"],
      source: "식품의약품안전처 식품영양성분DB",
    },
  },
  {
    id: "rec-tofu-egg",
    name: "두부 계란찜",
    min_age_stage: "12-17",
    cook_minutes: 10,
    difficulty: 1,
    is_quick: true,
    allergens: ["계란"],
    choking_hazard_note: null,
    caution_note: "완전히 익혀서 제공하세요 (반숙 금지).",
    created_at: "2026-01-01T00:00:00.000Z",
    image_url: null,
    ingredients: [
      { id: "i5", recipe_id: "rec-tofu-egg", ingredient_id: "ing-tofu", quantity: 50, unit: "g", is_optional: false, ingredient: { name: "두부", category: "두부/콩", primary_nutrients: ["단백질", "칼슘"] } },
      { id: "i6", recipe_id: "rec-tofu-egg", ingredient_id: "ing-egg", quantity: 1, unit: "개", is_optional: false, ingredient: { name: "계란", category: "달걀", primary_nutrients: ["단백질", "콜린"] } },
    ],
    steps: [
      { id: "s5", recipe_id: "rec-tofu-egg", step_number: 1, instruction: "두부를 곱게 으깬다." },
      { id: "s6", recipe_id: "rec-tofu-egg", step_number: 2, instruction: "계란을 풀어 두부와 섞는다." },
      { id: "s7", recipe_id: "rec-tofu-egg", step_number: 3, instruction: "내열 용기에 담아 찜기나 전자레인지에 완전히 익힌다." },
    ],
    nutrition: {
      id: "n2",
      recipe_id: "rec-tofu-egg",
      carbs_g: 3,
      protein_g: 11,
      fat_g: 7,
      fiber_g: 0.4,
      key_micronutrients: ["칼슘", "단백질"],
      source: "식품의약품안전처 식품영양성분DB",
    },
  },
  {
    id: "rec-egg-rice",
    name: "계란밥",
    min_age_stage: "9-11",
    cook_minutes: 8,
    difficulty: 1,
    is_quick: true,
    allergens: ["계란"],
    choking_hazard_note: null,
    caution_note: "계란은 완전히 익혀서 사용하세요.",
    created_at: "2026-01-01T00:00:00.000Z",
    image_url: null,
    ingredients: [
      { id: "i7", recipe_id: "rec-egg-rice", ingredient_id: "ing-rice", quantity: 70, unit: "g", is_optional: false, ingredient: { name: "밥", category: "곡류", primary_nutrients: ["탄수화물"] } },
      { id: "i8", recipe_id: "rec-egg-rice", ingredient_id: "ing-egg", quantity: 1, unit: "개", is_optional: false, ingredient: { name: "계란", category: "달걀", primary_nutrients: ["단백질", "콜린"] } },
    ],
    steps: [
      { id: "s8", recipe_id: "rec-egg-rice", step_number: 1, instruction: "계란을 완전히 풀어 스크램블 형태로 익힌다." },
      { id: "s9", recipe_id: "rec-egg-rice", step_number: 2, instruction: "따뜻한 밥에 계란을 섞는다." },
    ],
    nutrition: {
      id: "n3",
      recipe_id: "rec-egg-rice",
      carbs_g: 38,
      protein_g: 8,
      fat_g: 5,
      fiber_g: 0.3,
      key_micronutrients: ["단백질"],
      source: "식품의약품안전처 식품영양성분DB",
    },
  },
  {
    id: "rec-chicken-porridge",
    name: "닭고기 야채죽",
    min_age_stage: "12-17",
    cook_minutes: 25,
    difficulty: 2,
    is_quick: false,
    allergens: [],
    choking_hazard_note: "닭고기는 결대로 잘게 찢어서 제공하세요.",
    caution_note: null,
    created_at: "2026-01-01T00:00:00.000Z",
    image_url: null,
    ingredients: [
      { id: "i9", recipe_id: "rec-chicken-porridge", ingredient_id: "ing-chicken", quantity: 40, unit: "g", is_optional: false, ingredient: { name: "닭가슴살", category: "육류", primary_nutrients: ["단백질"] } },
      { id: "i10", recipe_id: "rec-chicken-porridge", ingredient_id: "ing-carrot", quantity: 20, unit: "g", is_optional: false, ingredient: { name: "당근", category: "채소", primary_nutrients: ["비타민A"] } },
      { id: "i11", recipe_id: "rec-chicken-porridge", ingredient_id: "ing-onion", quantity: 15, unit: "g", is_optional: false, ingredient: { name: "양파", category: "채소", primary_nutrients: ["식이섬유"] } },
      { id: "i12", recipe_id: "rec-chicken-porridge", ingredient_id: "ing-brownrice", quantity: 60, unit: "g", is_optional: false, ingredient: { name: "현미밥", category: "곡류", primary_nutrients: ["탄수화물", "식이섬유"] } },
    ],
    steps: [
      { id: "s10", recipe_id: "rec-chicken-porridge", step_number: 1, instruction: "닭가슴살을 삶아 결대로 잘게 찢는다." },
      { id: "s11", recipe_id: "rec-chicken-porridge", step_number: 2, instruction: "당근과 양파를 잘게 다진다." },
      { id: "s12", recipe_id: "rec-chicken-porridge", step_number: 3, instruction: "냄비에 현미밥과 육수를 넣고 재료를 넣어 푹 끓인다." },
    ],
    nutrition: {
      id: "n4",
      recipe_id: "rec-chicken-porridge",
      carbs_g: 35,
      protein_g: 13,
      fat_g: 5,
      fiber_g: 2.4,
      key_micronutrients: ["비타민A", "단백질"],
      source: "식품의약품안전처 식품영양성분DB",
    },
  },
  {
    id: "rec-salmon-broccoli",
    name: "연어 브로콜리 진밥",
    min_age_stage: "18-23",
    cook_minutes: 20,
    difficulty: 2,
    is_quick: false,
    allergens: [],
    choking_hazard_note: "연어 가시가 없는지 확인하고 브로콜리는 잘게 썰어 제공하세요.",
    caution_note: null,
    created_at: "2026-01-01T00:00:00.000Z",
    image_url: null,
    ingredients: [
      { id: "i13", recipe_id: "rec-salmon-broccoli", ingredient_id: "ing-salmon", quantity: 40, unit: "g", is_optional: false, ingredient: { name: "연어", category: "생선", primary_nutrients: ["단백질", "오메가-3"] } },
      { id: "i14", recipe_id: "rec-salmon-broccoli", ingredient_id: "ing-broccoli", quantity: 30, unit: "g", is_optional: false, ingredient: { name: "브로콜리", category: "채소", primary_nutrients: ["비타민C", "식이섬유"] } },
      { id: "i15", recipe_id: "rec-salmon-broccoli", ingredient_id: "ing-rice", quantity: 80, unit: "g", is_optional: false, ingredient: { name: "밥", category: "곡류", primary_nutrients: ["탄수화물"] } },
    ],
    steps: [
      { id: "s13", recipe_id: "rec-salmon-broccoli", step_number: 1, instruction: "연어를 완전히 익혀 가시를 제거하고 잘게 부순다." },
      { id: "s14", recipe_id: "rec-salmon-broccoli", step_number: 2, instruction: "브로콜리를 데친 뒤 잘게 다진다." },
      { id: "s15", recipe_id: "rec-salmon-broccoli", step_number: 3, instruction: "밥과 함께 골고루 섞는다." },
    ],
    nutrition: {
      id: "n5",
      recipe_id: "rec-salmon-broccoli",
      carbs_g: 40,
      protein_g: 15,
      fat_g: 8,
      fiber_g: 2.8,
      key_micronutrients: ["오메가-3", "비타민C"],
      source: "식품의약품안전처 식품영양성분DB",
    },
  },
  {
    id: "rec-tofu-friedrice",
    name: "두부 채소 볶음밥",
    min_age_stage: "9-11",
    cook_minutes: 15,
    difficulty: 1,
    is_quick: false,
    allergens: [],
    choking_hazard_note: null,
    caution_note: "기름은 소량만 사용하세요.",
    created_at: "2026-01-01T00:00:00.000Z",
    image_url: null,
    ingredients: [
      { id: "i16", recipe_id: "rec-tofu-friedrice", ingredient_id: "ing-tofu", quantity: 50, unit: "g", is_optional: false, ingredient: { name: "두부", category: "두부/콩", primary_nutrients: ["단백질", "칼슘"] } },
      { id: "i17", recipe_id: "rec-tofu-friedrice", ingredient_id: "ing-carrot", quantity: 15, unit: "g", is_optional: false, ingredient: { name: "당근", category: "채소", primary_nutrients: ["비타민A"] } },
      { id: "i18", recipe_id: "rec-tofu-friedrice", ingredient_id: "ing-zucchini", quantity: 15, unit: "g", is_optional: false, ingredient: { name: "애호박", category: "채소", primary_nutrients: ["비타민A", "식이섬유"] } },
      { id: "i19", recipe_id: "rec-tofu-friedrice", ingredient_id: "ing-rice", quantity: 70, unit: "g", is_optional: false, ingredient: { name: "밥", category: "곡류", primary_nutrients: ["탄수화물"] } },
    ],
    steps: [
      { id: "s16", recipe_id: "rec-tofu-friedrice", step_number: 1, instruction: "두부를 으깨고 당근과 애호박을 다진다." },
      { id: "s17", recipe_id: "rec-tofu-friedrice", step_number: 2, instruction: "팬에 참기름을 살짝 두르고 볶는다." },
      { id: "s18", recipe_id: "rec-tofu-friedrice", step_number: 3, instruction: "밥을 넣고 골고루 볶는다." },
    ],
    nutrition: {
      id: "n6",
      recipe_id: "rec-tofu-friedrice",
      carbs_g: 38,
      protein_g: 10,
      fat_g: 6,
      fiber_g: 2.0,
      key_micronutrients: ["칼슘", "비타민A"],
      source: "식품의약품안전처 식품영양성분DB",
    },
  },
  {
    id: "rec-banana-yogurt",
    name: "바나나 요거트",
    min_age_stage: "6-8",
    cook_minutes: 5,
    difficulty: 1,
    is_quick: true,
    allergens: ["우유"],
    choking_hazard_note: null,
    caution_note: "무가당 플레인 요거트를 사용하세요.",
    created_at: "2026-01-01T00:00:00.000Z",
    image_url: null,
    ingredients: [
      { id: "i20", recipe_id: "rec-banana-yogurt", ingredient_id: "ing-banana", quantity: 50, unit: "g", is_optional: false, ingredient: { name: "바나나", category: "과일", primary_nutrients: ["칼륨", "식이섬유"] } },
      { id: "i21", recipe_id: "rec-banana-yogurt", ingredient_id: "ing-yogurt", quantity: 60, unit: "g", is_optional: false, ingredient: { name: "플레인요거트", category: "유제품", primary_nutrients: ["칼슘", "단백질"] } },
    ],
    steps: [
      { id: "s19", recipe_id: "rec-banana-yogurt", step_number: 1, instruction: "바나나를 포크로 곱게 으깬다." },
      { id: "s20", recipe_id: "rec-banana-yogurt", step_number: 2, instruction: "플레인 요거트와 골고루 섞는다." },
    ],
    nutrition: {
      id: "n7",
      recipe_id: "rec-banana-yogurt",
      carbs_g: 22,
      protein_g: 4,
      fat_g: 2,
      fiber_g: 1.8,
      key_micronutrients: ["칼슘", "칼륨"],
      source: "식품의약품안전처 식품영양성분DB",
    },
  },
  {
    id: "rec-tuna-riceball",
    name: "참치 주먹밥",
    min_age_stage: "18-23",
    cook_minutes: 10,
    difficulty: 1,
    is_quick: true,
    allergens: [],
    choking_hazard_note: "한입 크기로 작게 뭉쳐서 제공하세요.",
    caution_note: "참치는 기름기를 잘 빼고 사용하세요.",
    created_at: "2026-01-01T00:00:00.000Z",
    image_url: null,
    ingredients: [
      { id: "i22", recipe_id: "rec-tuna-riceball", ingredient_id: "ing-tuna", quantity: 30, unit: "g", is_optional: false, ingredient: { name: "참치", category: "생선", primary_nutrients: ["단백질", "오메가-3"] } },
      { id: "i23", recipe_id: "rec-tuna-riceball", ingredient_id: "ing-rice", quantity: 70, unit: "g", is_optional: false, ingredient: { name: "밥", category: "곡류", primary_nutrients: ["탄수화물"] } },
      { id: "i24", recipe_id: "rec-tuna-riceball", ingredient_id: "ing-seaweed", quantity: 2, unit: "g", is_optional: false, ingredient: { name: "김", category: "해조류", primary_nutrients: ["요오드", "식이섬유"] } },
    ],
    steps: [
      { id: "s21", recipe_id: "rec-tuna-riceball", step_number: 1, instruction: "참치 기름을 빼고 잘게 으깬다." },
      { id: "s22", recipe_id: "rec-tuna-riceball", step_number: 2, instruction: "밥과 섞어 한입 크기로 뭉친다." },
      { id: "s23", recipe_id: "rec-tuna-riceball", step_number: 3, instruction: "부순 김을 겉에 묻힌다." },
    ],
    nutrition: {
      id: "n8",
      recipe_id: "rec-tuna-riceball",
      carbs_g: 36,
      protein_g: 12,
      fat_g: 3,
      fiber_g: 1.0,
      key_micronutrients: ["오메가-3", "요오드"],
      source: "식품의약품안전처 식품영양성분DB",
    },
  },
];

export async function fetchRecipeById(
  supabase: SupabaseClient,
  recipeId: string
): Promise<RecipeWithDetails | null> {
  try {
    const [{ data: recipe, error: recipeError }, { data: ingredients }, { data: steps }, { data: nutrition }] =
      await Promise.all([
        supabase.from("recipes").select("*").eq("id", recipeId).single(),
        supabase.from("recipe_ingredients").select("*, ingredient:ingredients(name, category, primary_nutrients)").eq("recipe_id", recipeId),
        supabase.from("recipe_steps").select("*").eq("recipe_id", recipeId).order("step_number"),
        supabase.from("nutrition_data").select("*").eq("recipe_id", recipeId).maybeSingle(),
      ]);

    if (recipeError || !recipe) {
      const fallback = DEFAULT_RECIPES.find((r) => r.id === recipeId || r.name === recipeId);
      return fallback ?? null;
    }

    return {
      ...recipe,
      ingredients: ingredients ?? [],
      steps: steps ?? [],
      nutrition: nutrition ?? null,
    };
  } catch {
    const fallback = DEFAULT_RECIPES.find((r) => r.id === recipeId || r.name === recipeId);
    return fallback ?? null;
  }
}

export async function fetchAllRecipesWithDetails(supabase: SupabaseClient): Promise<RecipeWithDetails[]> {
  try {
    const [{ data: recipes, error: recipesError }, { data: ingredients }, { data: steps }, { data: nutrition }] =
      await Promise.all([
        supabase.from("recipes").select("*"),
        supabase.from("recipe_ingredients").select("*, ingredient:ingredients(name, category, primary_nutrients)"),
        supabase.from("recipe_steps").select("*").order("step_number"),
        supabase.from("nutrition_data").select("*"),
      ]);

    if (recipesError || !recipes || recipes.length === 0) {
      return DEFAULT_RECIPES;
    }

    return recipes.map((recipe) => ({
      ...recipe,
      ingredients: (ingredients ?? []).filter((i) => i.recipe_id === recipe.id),
      steps: (steps ?? []).filter((s) => s.recipe_id === recipe.id),
      nutrition: (nutrition ?? []).find((n) => n.recipe_id === recipe.id) ?? null,
    }));
  } catch {
    return DEFAULT_RECIPES;
  }
}
