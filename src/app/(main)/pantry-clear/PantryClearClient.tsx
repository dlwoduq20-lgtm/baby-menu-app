"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Ingredient } from "@/lib/types/ingredient";
import { RecipeWithDetails } from "@/lib/types/recipe";
import { AgeRule } from "@/lib/safetyRules";
import { IngredientSafetyRule } from "@/lib/data/ingredientSafety";
import {
  calcAgeInMonths,
  getAgeStage,
  formatBabyAge,
  getDetailedStageLabel,
} from "@/lib/babyAge";
import {
  scoreRecipes,
  applySafetyFilter,
  applyIngredientSafetyFilter,
  toEngineRecipe,
  ScoredRecipe,
} from "@/lib/recommend";
import { IngredientPicker } from "@/components/IngredientPicker";

function BowlIllustration({ isQuick }: { isQuick: boolean }) {
  return (
    <svg
      viewBox="0 0 92 92"
      className="h-[72px] w-[72px] shrink-0 rounded-[18px]"
      style={{ background: isQuick ? "#E3F4EA" : "#FCEBDA" }}
    >
      <ellipse cx="46" cy="60" rx="34" ry="20" fill="#EADFC9" />
      <ellipse cx="46" cy="54" rx="30" ry="16" fill="#FBEFD8" />
      <circle cx="34" cy="50" r="5" fill="#D98A5F" />
      <circle cx="48" cy="46" r="5.5" fill="#D98A5F" />
      <circle cx="58" cy="52" r="4.5" fill="#8FBF6B" />
      <circle cx="40" cy="58" r="4" fill="#8FBF6B" />
      <circle cx="55" cy="60" r="4" fill="#E8A33A" />
    </svg>
  );
}

interface PantryClearClientProps {
  userId: string;
  baby: { id: string; name: string; birth_date: string };
  allergies: string[];
  allIngredients: Ingredient[];
  initialOwnedIds: string[];
  allRecipes: RecipeWithDetails[];
  ageRules: AgeRule[];
  ingredientSafetyRules: IngredientSafetyRule[];
}

export function PantryClearClient({
  userId,
  baby,
  allergies,
  allIngredients,
  initialOwnedIds,
  allRecipes,
  ageRules,
  ingredientSafetyRules,
}: PantryClearClientProps) {
  const supabase = createClient();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initialOwnedIds)
  );
  const [isPantryDrawerOpen, setIsPantryDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "ready" | "one" | "two">("all");

  const ageMonths = useMemo(() => calcAgeInMonths(baby.birth_date), [baby.birth_date]);
  const ageStage = useMemo(() => getAgeStage(ageMonths), [ageMonths]);

  // 보유 재료 이름 목록 (ID -> 이름)
  const ownedIngredientNames = useMemo(() => {
    const idToName = new Map(allIngredients.map((i) => [i.id, i.name]));
    return Array.from(selectedIds)
      .map((id) => idToName.get(id))
      .filter((name): name is string => Boolean(name));
  }, [selectedIds, allIngredients]);

  // 재료 토글 (낙관적 업데이트 + Supabase DB 연동)
  async function handleToggle(ing: Ingredient) {
    const isOwned = selectedIds.has(ing.id);

    setSelectedIds((prev) => {
      const next = new Set(prev);
      isOwned ? next.delete(ing.id) : next.add(ing.id);
      return next;
    });

    const { error } = isOwned
      ? await supabase
          .from("user_ingredients")
          .delete()
          .eq("user_id", userId)
          .eq("ingredient_id", ing.id)
      : await supabase
          .from("user_ingredients")
          .upsert(
            { user_id: userId, ingredient_id: ing.id, is_owned: true },
            { onConflict: "user_id,ingredient_id" }
          );

    if (error) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        isOwned ? next.add(ing.id) : next.delete(ing.id);
        return next;
      });
    }
  }

  // 3단계 그룹 계산 (0개 / 1개 / 2개 부족)
  const engineRecipes = useMemo(() => allRecipes.map(toEngineRecipe), [allRecipes]);

  const { readyRecipes, oneMissingRecipes, twoMissingRecipes } = useMemo(() => {
    const scored = scoreRecipes(
      engineRecipes,
      { ageStage, ageMonths, allergies, dislikedFoods: [] },
      ownedIngredientNames
    );
    const stageSafe = applySafetyFilter(scored, ageStage, ageRules);
    const safe = applyIngredientSafetyFilter(stageSafe, ageMonths, ingredientSafetyRules);

    return {
      readyRecipes: safe.filter((r) => r.missingIngredients.length === 0),
      oneMissingRecipes: safe.filter((r) => r.missingIngredients.length === 1),
      twoMissingRecipes: safe.filter((r) => r.missingIngredients.length === 2),
    };
  }, [engineRecipes, ageStage, ageMonths, allergies, ownedIngredientNames, ageRules, ingredientSafetyRules]);

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-cream px-[22px] pb-12 pt-10">
      {/* 상단 네비게이션 & 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/home"
            className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white text-sm shadow-sm transition-transform active:scale-95"
          >
            ←
          </Link>
          <div>
            <h1 className="font-display text-[20px] text-ink">냉장고 털기 모드</h1>
            <div className="text-[11.5px] text-ink-soft">
              {baby.name} ({formatBabyAge(ageMonths)} · {getDetailedStageLabel(ageMonths)}) 맞춤
            </div>
          </div>
        </div>
      </div>

      {/* 보유 재료 컨트롤러 카드 (아코디언 방식) */}
      <div className="mb-4 rounded-2xl border border-line bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0F9F4] text-lg">
              🧊
            </span>
            <div>
              <div className="font-display text-[14px] text-ink">
                내 냉장고 재료: <span className="text-[#1E7246]">{selectedIds.size}개</span>
              </div>
              <div className="text-[11px] text-ink-soft">
                재료를 체크하면 즉시 레시피가 재분류돼요
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPantryDrawerOpen(!isPantryDrawerOpen)}
            className="rounded-pill border border-line bg-cream px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:bg-coral-pale hover:text-coral-deep"
          >
            {isPantryDrawerOpen ? "재료 닫기 ▲" : "재료 수정 ▼"}
          </button>
        </div>

        {/* 아코디언 펼침: IngredientPicker 내장 */}
        {isPantryDrawerOpen && (
          <div className="mt-4 border-t border-line pt-4">
            <IngredientPicker
              ingredients={allIngredients}
              selectedIds={selectedIds}
              onToggle={handleToggle}
            />
            <div className="mt-3 text-right">
              <Link
                href="/ingredients"
                className="text-xs font-bold text-coral-deep hover:underline"
              >
                전체 식재료 관리 페이지로 가기 →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 3단계 퀵 탭 */}
      <div className="sticky top-2 z-10 mb-5 flex gap-1.5 rounded-xl bg-white/90 p-1 backdrop-blur-md shadow-xs border border-line">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
            activeTab === "all"
              ? "bg-ink text-white shadow-xs"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          전체 ({readyRecipes.length + oneMissingRecipes.length + twoMissingRecipes.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ready")}
          className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
            activeTab === "ready"
              ? "bg-[#2E8F5D] text-white shadow-xs"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          바로 가능 ({readyRecipes.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("one")}
          className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
            activeTab === "one"
              ? "bg-coral-deep text-white shadow-xs"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          1개 부족 ({oneMissingRecipes.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("two")}
          className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
            activeTab === "two"
              ? "bg-ink text-white shadow-xs"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          2개 부족 ({twoMissingRecipes.length})
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1단계: 🎉 바로 만들 수 있어요 (재료 100%) */}
      {/* ======================================================== */}
      {(activeTab === "all" || activeTab === "ready") && (
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E3F4EA] text-xs">
                🎉
              </span>
              <h2 className="font-display text-[16px] text-ink">
                바로 만들 수 있어요
              </h2>
            </div>
            <span className="rounded-pill bg-mint-pale px-2.5 py-0.5 text-xs font-bold text-[#2E8F5D]">
              {readyRecipes.length}개
            </span>
          </div>

          {readyRecipes.length > 0 ? (
            <div className="space-y-3">
              {readyRecipes.map((r) => (
                <RecipePantryCard key={r.id} recipe={r} tier="ready" />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-white/60 p-5 text-center text-xs text-ink-soft">
              현재 냉장고 재료로 100% 바로 만들 수 있는 메뉴가 없어요.
              <br />
              <button
                type="button"
                onClick={() => setIsPantryDrawerOpen(true)}
                className="mt-2 font-bold text-coral-deep hover:underline"
              >
                + 재료를 1개만 더 등록해볼까요?
              </button>
            </div>
          )}
        </section>
      )}

      {/* ======================================================== */}
      {/* 2단계: 🛒 하나만 더 있으면 돼요 (재료 1개 부족) */}
      {/* ======================================================== */}
      {(activeTab === "all" || activeTab === "one") && (
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-coral-pale text-xs">
                🛒
              </span>
              <h2 className="font-display text-[16px] text-ink">
                하나만 더 있으면 돼요
              </h2>
            </div>
            <span className="rounded-pill bg-coral-pale px-2.5 py-0.5 text-xs font-bold text-coral-deep">
              {oneMissingRecipes.length}개
            </span>
          </div>

          {oneMissingRecipes.length > 0 ? (
            <div className="space-y-3">
              {oneMissingRecipes.map((r) => (
                <RecipePantryCard key={r.id} recipe={r} tier="one" />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-white/60 p-5 text-center text-xs text-ink-soft">
              1개 부족한 메뉴가 없어요.
            </div>
          )}
        </section>
      )}

      {/* ======================================================== */}
      {/* 3단계: 🛒 두 개 더 있으면 돼요 (재료 2개 부족) */}
      {/* ======================================================== */}
      {(activeTab === "all" || activeTab === "two") && (
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cream-deep text-xs">
                🛒
              </span>
              <h2 className="font-display text-[16px] text-ink">
                두 개 더 있으면 돼요
              </h2>
            </div>
            <span className="rounded-pill bg-cream-deep px-2.5 py-0.5 text-xs font-bold text-ink">
              {twoMissingRecipes.length}개
            </span>
          </div>

          {twoMissingRecipes.length > 0 ? (
            <div className="space-y-3">
              {twoMissingRecipes.map((r) => (
                <RecipePantryCard key={r.id} recipe={r} tier="two" />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-white/60 p-5 text-center text-xs text-ink-soft">
              2개 부족한 메뉴가 없어요.
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function RecipePantryCard({
  recipe,
  tier,
}: {
  recipe: ScoredRecipe;
  tier: "ready" | "one" | "two";
}) {
  const total = recipe.requiredIngredients.length;
  const owned = recipe.ownedCount;

  return (
    <div className="rounded-card border border-line bg-white p-4 shadow-card transition-all hover:border-coral/40">
      <div className="flex gap-3">
        <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[18px] bg-cream-deep">
          {recipe.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <BowlIllustration isQuick={recipe.isQuick} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {tier === "ready" && (
              <span className="rounded-pill bg-mint-pale px-2 py-0.5 text-[10.5px] font-bold text-[#2E8F5D]">
                ✨ 재료 {owned}/{total} 완비
              </span>
            )}
            {tier === "one" && (
              <span className="rounded-pill bg-coral-pale px-2 py-0.5 text-[10.5px] font-bold text-coral-deep">
                재료 {owned}/{total} (1개 부족)
              </span>
            )}
            {tier === "two" && (
              <span className="rounded-pill bg-cream-deep px-2 py-0.5 text-[10.5px] font-bold text-ink">
                재료 {owned}/{total} (2개 부족)
              </span>
            )}
            {recipe.isQuick && (
              <span className="rounded-pill bg-coral-pale px-2 py-0.5 text-[10.5px] font-bold text-coral-deep">
                초간편
              </span>
            )}
          </div>

          <h3 className="mt-1 font-display text-[15.5px] leading-tight text-ink">
            {recipe.name}
          </h3>

          <div className="mt-1 flex items-center gap-2.5 text-[11.5px] text-ink-soft">
            <span>⏱ {recipe.cookMinutes}분</span>
            <span>·</span>
            <span>
              난이도 {"●".repeat(recipe.difficulty)}
              <span className="text-line">{"○".repeat(3 - recipe.difficulty)}</span>
            </span>
          </div>

          {/* 부족 재료 안내 */}
          {recipe.missingIngredients.length > 0 && (
            <div className="mt-1 text-[11.5px] font-bold text-coral-deep">
              부족: {recipe.missingIngredients.join(", ")}
            </div>
          )}
        </div>
      </div>

      {/* 재료 리스트 뱃지 */}
      <div className="mt-2.5 border-t border-line/60 pt-2.5">
        <div className="flex flex-wrap gap-1">
          {recipe.requiredIngredients.map((ing) => {
            const isMissing = recipe.missingIngredients.includes(ing);
            return (
              <span
                key={ing}
                className={`rounded-pill px-2 py-0.5 text-[11px] ${
                  isMissing
                    ? "bg-coral-pale/80 font-bold text-coral-deep"
                    : "bg-[#F0F9F4] text-[#2E8F5D]"
                }`}
              >
                {isMissing ? `+ ${ing} 필요` : `✓ ${ing}`}
              </span>
            );
          })}
        </div>
      </div>

      {/* 상세 보기 링크 */}
      <Link
        href={`/recipe/${recipe.id}`}
        className="mt-3 block w-full rounded-pill border border-line bg-cream/70 py-2 text-center text-xs font-bold text-ink transition-all hover:bg-coral-pale hover:text-coral-deep active:scale-[0.98]"
      >
        레시피 조리법 보기 →
      </Link>
    </div>
  );
}
