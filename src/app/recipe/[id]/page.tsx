import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchRecipeById } from "@/lib/data/recipes";
import { fetchNutritionTargets, findTargetForStage, coveragePercent } from "@/lib/data/nutritionTargets";
import { calcAgeInMonths, getAgeStage } from "@/lib/babyAge";
import { FeedbackBar } from "@/components/FeedbackBar";

export default async function RecipeDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const recipe = await fetchRecipeById(supabase, params.id);
  if (!recipe) notFound();

  const { data: ownedRows } = await supabase
    .from("user_ingredients")
    .select("ingredient_id")
    .eq("user_id", user.id)
    .eq("is_owned", true);
  const ownedIds = new Set((ownedRows ?? []).map((r) => r.ingredient_id));

  const { data: favoriteRow } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("recipe_id", recipe.id)
    .maybeSingle();

  const { data: babies } = await supabase.from("babies").select("*").eq("user_id", user.id).limit(1);
  const baby = babies?.[0];
  const babyAgeMonths = baby ? calcAgeInMonths(baby.birth_date) : null;
  const babyStage = baby ? getAgeStage(babyAgeMonths!) : null;
  const nutritionTargets = await fetchNutritionTargets(supabase);
  const target = babyStage ? findTargetForStage(nutritionTargets, babyStage) : null;

  // 이 레시피의 재료들이 채워주는 영양소 태그 (중복 제거)
  const coveredNutrients = Array.from(
    new Set(recipe.ingredients.flatMap((i) => i.ingredient?.primary_nutrients ?? []))
  );

  const ageLabel = recipe.min_age_stage === "24+" ? "24개월+" : `${recipe.min_age_stage.replace("-", "~")}개월+`;

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-cream pb-10">
      <div className="flex items-center gap-3.5 bg-cream-deep px-5 pb-4.5 pt-11">
        <Link href="/home" className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-sm shadow-sm">
          ←
        </Link>
        <h2 className="font-display text-lg">레시피 상세</h2>
      </div>

      <div className="mx-5 mt-4.5 flex h-[150px] items-center justify-center overflow-hidden rounded-[22px] bg-cream-deep">
        <svg width="100%" height="100%" viewBox="0 0 350 150" preserveAspectRatio="xMidYMid meet">
          <ellipse cx="175" cy="112" rx="120" ry="28" fill="#EADFC9" />
          <ellipse cx="175" cy="98" rx="105" ry="22" fill="#FBEFD8" />
          <circle cx="140" cy="88" r="10" fill="#D98A5F" />
          <circle cx="175" cy="80" r="11" fill="#D98A5F" />
          <circle cx="210" cy="92" r="9" fill="#8FBF6B" />
          <circle cx="155" cy="102" r="8" fill="#8FBF6B" />
          <circle cx="195" cy="106" r="8" fill="#E8A33A" />
        </svg>
      </div>

      <div className="flex flex-wrap gap-2 px-5 pt-4">
        <span className="rounded-pill border border-coral-pale bg-coral-pale px-3 py-1.5 text-xs font-bold text-coral-deep">
          {ageLabel}
        </span>
        <span className="rounded-pill border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink-soft">
          ⏱ {recipe.cook_minutes}분
        </span>
        <span className="rounded-pill border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink-soft">
          난이도 {"★".repeat(recipe.difficulty)}
          {"☆".repeat(3 - recipe.difficulty)}
        </span>
        <span className="rounded-pill border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink-soft">
          {recipe.allergens.length > 0 ? `알레르기: ${recipe.allergens.join(", ")}` : "알레르기 없음"}
        </span>
      </div>

      <div className="px-5 pt-4.5">
        <h1 className="font-display text-xl">{recipe.name}</h1>
      </div>

      <FeedbackBar recipeId={recipe.id} initialFavorited={Boolean(favoriteRow)} />

      <div className="px-5 pt-4.5">
        <h3 className="mb-2.5 font-display text-[15.5px]">재료</h3>
        <div className="flex flex-col gap-2">
          {recipe.ingredients.map((ing) => {
            const owned = ownedIds.has(ing.ingredient_id);
            return (
              <div
                key={ing.id}
                className="flex items-center justify-between rounded-2xl border border-line bg-white px-3.5 py-2.5 text-[13.5px]"
              >
                <span>
                  {ing.ingredient?.name} {ing.quantity}
                  {ing.unit}
                </span>
                <span className={`text-xs font-bold ${owned ? "text-mint" : "text-coral-deep"}`}>
                  {owned ? "보유" : "구매 필요"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {coveredNutrients.length > 0 && (
        <div className="mx-5 mt-3 rounded-2xl bg-mint-pale p-3.5">
          <div className="mb-1.5 text-[11.5px] font-bold text-[#2E8F5D]">🥕 이 재료들이 채워주는 영양소</div>
          <div className="flex flex-wrap gap-1.5">
            {coveredNutrients.map((n) => (
              <span key={n} className="rounded-pill bg-white px-2.5 py-1 text-[11px] text-[#2E8F5D]">
                {n}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 pt-4.5">
        <h3 className="mb-2.5 font-display text-[15.5px]">조리 순서</h3>
        <div>
          {recipe.steps.map((step) => (
            <div key={step.id} className="mb-3.5 flex gap-3 text-[13.5px] leading-relaxed">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                {step.step_number}
              </span>
              {step.instruction}
            </div>
          ))}
        </div>
      </div>

      {recipe.nutrition && (
        <div className="px-5 pt-2">
          <h3 className="mb-2.5 font-display text-[15.5px]">영양 정보 (1인분 기준 추정)</h3>
          <div className="grid grid-cols-4 gap-2 rounded-2xl border border-line bg-white p-3.5 text-center text-xs">
            <div>
              <div className="font-display text-sm">{recipe.nutrition.carbs_g ?? "-"}g</div>
              탄수화물
              {target && (
                <div className="mt-0.5 text-[10px] text-mint">
                  일일 {coveragePercent(recipe.nutrition.carbs_g, target.dailyCarbsG) ?? "-"}%
                </div>
              )}
            </div>
            <div>
              <div className="font-display text-sm">{recipe.nutrition.protein_g ?? "-"}g</div>
              단백질
              {target && (
                <div className="mt-0.5 text-[10px] text-mint">
                  일일 {coveragePercent(recipe.nutrition.protein_g, target.dailyProteinG) ?? "-"}%
                </div>
              )}
            </div>
            <div>
              <div className="font-display text-sm">{recipe.nutrition.fat_g ?? "-"}g</div>
              지방
              {target && (
                <div className="mt-0.5 text-[10px] text-mint">
                  일일 {coveragePercent(recipe.nutrition.fat_g, target.dailyFatG) ?? "-"}%
                </div>
              )}
            </div>
            <div>
              <div className="font-display text-sm">{recipe.nutrition.fiber_g ?? "-"}g</div>
              식이섬유
              {target && (
                <div className="mt-0.5 text-[10px] text-mint">
                  일일 {coveragePercent(recipe.nutrition.fiber_g, target.dailyFiberG) ?? "-"}%
                </div>
              )}
            </div>
          </div>
          {target && (
            <div className="mt-2 text-[10.5px] text-ink-soft">
              이 메뉴 한 끼로 {babyAgeMonths}개월 아기 하루 권장 섭취량의 위 비율만큼을 채울 수 있어요.
            </div>
          )}
          {recipe.nutrition.key_micronutrients.length > 0 && (
            <div className="mt-2 text-xs text-ink-soft">
              주요 영양소: {recipe.nutrition.key_micronutrients.join(", ")}
            </div>
          )}
          <div className="mt-1 text-[11px] text-ink-soft">출처: {recipe.nutrition.source}</div>
        </div>
      )}

      {(recipe.choking_hazard_note || recipe.caution_note) && (
        <div className="mx-5 mt-4.5 rounded-2xl border border-[#F4DFAE] bg-yellow-pale p-3.5 text-[12.5px] leading-relaxed text-[#7A5A16]">
          <b className="mb-1 block font-display text-[13.5px] text-[#8A5E12]">월령별 안전 확인</b>
          {recipe.choking_hazard_note && <p>{recipe.choking_hazard_note}</p>}
          {recipe.caution_note && <p>{recipe.caution_note}</p>}
        </div>
      )}

      <div className="px-5 pb-2 pt-4 text-center text-[11px] text-ink-soft">
        본 서비스는 일반적인 식단 정보를 제공하며, 의료적 조언을 대체하지 않습니다.
      </div>
    </div>
  );
}
