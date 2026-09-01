import Link from "next/link";
import { ScoredRecipe } from "@/lib/recommend";

function BowlIllustration({ quick }: { quick: boolean }) {
  return (
    <svg viewBox="0 0 92 92" className="h-[92px] w-[92px] shrink-0 rounded-[20px]" style={{ background: quick ? "#E3F4EA" : "#FCEBDA" }}>
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

function MatchRing({ ratio }: { ratio: number }) {
  const color = ratio >= 1 ? "#5FB98C" : "#FFC94D";
  const track = ratio >= 1 ? "#E3F4EA" : "#FFF3D6";
  const deg = Math.round(ratio * 360);

  return (
    <div
      className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full"
      style={{ background: `conic-gradient(${color} 0deg ${deg}deg, ${track} ${deg}deg 360deg)` }}
    >
      <div className="flex h-[34px] w-[34px] flex-col items-center justify-center rounded-full bg-white text-[9.5px] font-bold leading-tight">
        <b className="text-[11px]">
          {ratio >= 1 ? "완료" : `${Math.round(ratio * 100)}%`}
        </b>
        보유
      </div>
    </div>
  );
}

export function RecommendCard({
  recipe,
  totalRequired,
  badgeLabel,
  quick = false,
  reason,
}: {
  recipe: ScoredRecipe;
  totalRequired: number;
  badgeLabel: string;
  quick?: boolean;
  reason?: string | null;
}) {
  const ratio = recipe.ownedCount / totalRequired;

  return (
    <div className="mb-4 rounded-card border border-line bg-white p-[18px] shadow-card">
      <div className="flex gap-3.5">
        <div
          className={`h-[92px] w-[92px] shrink-0 overflow-hidden rounded-[20px] ${
            quick ? "bg-mint-pale" : "bg-cream-deep"
          }`}
        >
          <BowlIllustration quick={quick} />
        </div>
        <div className="min-w-0 flex-1">
          <span
            className={`mb-1.5 inline-block rounded-pill px-2.5 py-1 text-[11px] font-bold ${
              quick ? "bg-mint-pale text-[#2E8F5D]" : "bg-coral-pale text-coral-deep"
            }`}
          >
            {badgeLabel}
          </span>
          <div className="mb-1 font-display text-lg">{recipe.name}</div>
          <div className="text-[12.5px] leading-snug text-ink-soft">
            {reason
              ? reason
              : recipe.missingIngredients.length === 0
              ? `집에 있는 재료 ${recipe.ownedCount}개로 바로 만들 수 있어요.`
              : `${recipe.missingIngredients.join(", ")}만 있으면 완성돼요.`}
          </div>
          <div className="mt-3 flex items-center gap-3 text-[12.5px] text-ink-soft">
            <span>⏱ {recipe.cookMinutes}분</span>
            <span>
              {"●".repeat(recipe.difficulty)}
              <span className="text-line">{"○".repeat(3 - recipe.difficulty)}</span>
            </span>
            {recipe.missingIngredients.length === 0 && <span>추가 구매 없음</span>}
          </div>
        </div>
        {quick && <MatchRing ratio={ratio} />}
      </div>
      <Link
        href={`/recipe/${recipe.id}`}
        className={`mt-3.5 block w-full rounded-pill py-3 text-center text-[14.5px] font-bold text-white ${
          quick ? "bg-coral-deep" : "bg-ink"
        }`}
      >
        레시피 보기
      </Link>
    </div>
  );
}
