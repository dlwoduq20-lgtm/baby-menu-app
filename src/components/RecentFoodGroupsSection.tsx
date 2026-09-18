"use client";

interface RecentFoodGroupsSectionProps {
  recentFoodGroups: string[];
  hasRecentRecommendations: boolean;
}

const ALL_FOOD_GROUPS = [
  "곡류",
  "육류",
  "생선",
  "계란",
  "콩류",
  "채소",
  "과일",
  "유제품",
] as const;

const FOOD_GROUP_EMOJIS: Record<string, string> = {
  생선: "🐟",
  육류: "🥩",
  계란: "🥚",
  콩류: "🫘",
  채소: "🥦",
  과일: "🍎",
  유제품: "🧀",
  곡류: "🌾",
};

export function RecentFoodGroupsSection({
  recentFoodGroups,
  hasRecentRecommendations,
}: RecentFoodGroupsSectionProps) {
  if (!hasRecentRecommendations) return null;

  const recentGroups = new Set(recentFoodGroups);
  const missingGroups = ALL_FOOD_GROUPS.filter((g) => !recentGroups.has(g));
  const firstMissing = missingGroups[0];
  const emoji = firstMissing ? FOOD_GROUP_EMOJIS[firstMissing] || "🥗" : "🎉";

  return (
    <div className="mb-3 rounded-2xl border border-line bg-white p-4">
      <div className="mb-2 font-display text-[14px]">최근 3일 식단 현황</div>
      <div className="flex flex-wrap gap-1.5">
        {ALL_FOOD_GROUPS.map((g) => (
          <span
            key={g}
            className={`rounded-pill px-2.5 py-1 text-[11px] ${
              recentGroups.has(g) ? "bg-mint-pale text-[#2E8F5D]" : "bg-line text-ink-soft"
            }`}
          >
            {g}
          </span>
        ))}
      </div>
      {missingGroups.length > 0 ? (
        <div className="mt-2.5 text-[12.5px] text-coral-deep">
          {emoji} 최근 3일 동안 {firstMissing}이(가) 없었어요. 오늘은 {firstMissing} 메뉴를 추천해볼까요?
        </div>
      ) : (
        <div className="mt-2.5 text-[12.5px] text-[#2E8F5D]">
          🎉 최근 3일 동안 8대 식품군을 골고루 섭취했어요!
        </div>
      )}
    </div>
  );
}
