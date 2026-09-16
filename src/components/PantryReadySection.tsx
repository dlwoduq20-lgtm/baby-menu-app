"use client";

import { useState } from "react";
import Link from "next/link";
import { ScoredRecipe } from "@/lib/recommend";

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

interface PantryReadySectionProps {
  readyRecipes: ScoredRecipe[];
  recommendedIds: string[];
  almostReadyRecipes?: ScoredRecipe[];
  ownedCount: number;
}

export function PantryReadySection({
  readyRecipes,
  recommendedIds,
  almostReadyRecipes = [],
  ownedCount,
}: PantryReadySectionProps) {
  // 추천된 메뉴(오늘의 추천, 초간편)를 제외한 100% 매칭 메뉴
  const otherReadyRecipes = readyRecipes.filter((r) => !recommendedIds.includes(r.id));

  // 추천 외 다른 메뉴가 있으면 others를 기본으로, 없으면 all(전체), 그것도 없으면 almost를 기본 선택
  const initialMode: "others" | "all" | "almost" =
    otherReadyRecipes.length > 0
      ? "others"
      : readyRecipes.length > 0
      ? "all"
      : almostReadyRecipes.length > 0
      ? "almost"
      : "all";

  const [filterMode, setFilterMode] = useState<"others" | "all" | "almost">(initialMode);
  const [isExpanded, setIsExpanded] = useState(false);

  // 현재 탭에 따라 보여줄 목록 결정
  const displayList =
    filterMode === "others"
      ? otherReadyRecipes
      : filterMode === "all"
      ? readyRecipes
      : almostReadyRecipes;

  const visibleList = isExpanded ? displayList : displayList.slice(0, 3);
  const hasMore = displayList.length > 3;

  return (
    <section className="mb-6 mt-6 scroll-mt-6" id="pantry-section">
      {/* 헤더 타이틀 */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E3F4EA] text-xs">
            🍳
          </span>
          <h2 className="font-display text-[17px] text-ink">
            현재 보유 재료로 100% 가능한 메뉴
          </h2>
        </div>
        <span className="rounded-pill bg-mint-pale px-2.5 py-0.5 text-xs font-bold text-[#2E8F5D]">
          {readyRecipes.length}개 발견
        </span>
      </div>

      <p className="mb-3 text-[12.5px] leading-relaxed text-ink-soft">
        장보러 갈 필요 없이 지금 집 냉장고 재료만으로 완성할 수 있는 식단이에요.
      </p>

      {/* 필터 탭 */}
      {readyRecipes.length > 0 && (
        <div className="mb-3.5 flex gap-1.5 rounded-xl bg-cream-deep/60 p-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setFilterMode("others");
              setIsExpanded(false);
            }}
            className={`flex-1 rounded-lg py-1.5 font-bold transition-colors ${
              filterMode === "others"
                ? "bg-white text-coral-deep shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            추천 외 다른 메뉴 ({otherReadyRecipes.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterMode("all");
              setIsExpanded(false);
            }}
            className={`flex-1 rounded-lg py-1.5 font-bold transition-colors ${
              filterMode === "all"
                ? "bg-white text-coral-deep shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            100% 전체 ({readyRecipes.length})
          </button>
          {almostReadyRecipes.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setFilterMode("almost");
                setIsExpanded(false);
              }}
              className={`flex-1 rounded-lg py-1.5 font-bold transition-colors ${
                filterMode === "almost"
                  ? "bg-white text-coral-deep shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              재료 1개 부족 ({almostReadyRecipes.length})
            </button>
          )}
        </div>
      )}

      {/* 100% 매칭 메뉴 리스트 */}
      {displayList.length > 0 ? (
        <div className="space-y-3">
          {visibleList.map((recipe) => {
            const is100Percent = recipe.missingIngredients.length === 0;
            return (
              <div
                key={recipe.id}
                className="rounded-card border border-line bg-white p-4 shadow-card transition-all hover:border-coral/40"
              >
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
                      {is100Percent ? (
                        <span className="rounded-pill bg-mint-pale px-2 py-0.5 text-[10.5px] font-bold text-[#2E8F5D]">
                          ✨ 100% 재료 완비
                        </span>
                      ) : (
                        <span className="rounded-pill bg-yellow-pale px-2 py-0.5 text-[10.5px] font-bold text-[#B27B00]">
                          🥕 1개만 더 있으면 완성
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

                    {/* 조리 시간 및 난이도 */}
                    <div className="mt-1.5 flex items-center gap-2.5 text-[11.5px] text-ink-soft">
                      <span>⏱ {recipe.cookMinutes}분</span>
                      <span>·</span>
                      <span>
                        난이도 {"●".repeat(recipe.difficulty)}
                        <span className="text-line">
                          {"○".repeat(3 - recipe.difficulty)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 보유 재료 뱃지 리스트 */}
                <div className="mt-2.5 border-t border-line/60 pt-2.5">
                  <div className="mb-1 text-[11px] font-medium text-ink-soft">
                    {is100Percent ? "필요한 모든 재료 보유 중:" : "부족한 재료:"}
                  </div>
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
                  className="mt-3 block w-full rounded-pill border border-line bg-cream/70 py-2 text-center text-xs font-bold text-ink transition-all duration-150 hover:bg-coral-pale hover:text-coral-deep active:scale-[0.98] active:bg-coral-pale"
                >
                  레시피 조리법 보기 →
                </Link>
              </div>
            );
          })}

          {/* 더보기 / 접기 토글 */}
          {hasMore && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 w-full rounded-2xl border border-dashed border-coral/40 bg-white py-2.5 text-center text-xs font-bold text-coral-deep transition-colors hover:bg-coral-pale/30"
            >
              {isExpanded
                ? "간단히 접기 ▲"
                : `다른 100% 가능 메뉴 더보기 (+${displayList.length - 3}개) ▼`}
            </button>
          )}
        </div>
      ) : (
        /* 일치하는 메뉴가 없을 때의 Empty State */
        <div className="rounded-card border border-line bg-white p-5 text-center shadow-card">
          <span className="inline-block text-3xl">🧺</span>
          <h3 className="mt-2 font-display text-[15px] text-ink">
            {filterMode === "others"
              ? "오늘 추천된 메뉴 외에는 100% 일치 레시피가 없어요"
              : "보유 재료로 100% 일치하는 메뉴가 없어요"}
          </h3>
          <p className="mt-1 text-xs text-ink-soft">
            현재 보유 재료({ownedCount}개)에 1~2개 재료만 더 등록하면 훨씬 많은 레시피가 열려요!
          </p>
          <div className="mt-3.5 flex justify-center gap-2">
            <Link
              href="/ingredients"
              className="rounded-pill bg-coral-deep px-4 py-2 text-xs font-bold text-white shadow-sm"
            >
              + 식재료 추가 등록하기
            </Link>
            {almostReadyRecipes.length > 0 && (
              <button
                type="button"
                onClick={() => setFilterMode("almost")}
                className="rounded-pill border border-line bg-cream px-3.5 py-2 text-xs font-bold text-ink"
              >
                1개 부족 메뉴 보기 ({almostReadyRecipes.length})
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
