import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AGE_STAGE_LABEL } from "@/lib/babyAge";
import { computeDailyMenu } from "@/lib/service/dailyMenu";
import { RecommendCard } from "@/components/RecommendCard";

export default async function HomePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const result = await computeDailyMenu(supabase, user.id);
  if (!result) redirect("/onboarding/baby");

  const { baby, ageMonths, ageStage, main, quick, mainReason, quickReason } = result;

  const { data: ownedRows } = await supabase
    .from("user_ingredients")
    .select("ingredient_id")
    .eq("user_id", user.id)
    .eq("is_owned", true);
  const ownedCount = ownedRows?.length ?? 0;

  const today = new Date();
  const dateLabel = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-cream pb-8">
      <div className="relative overflow-hidden bg-gradient-to-b from-cream-deep to-cream px-[22px] pb-[26px] pt-11">
        <span className="mb-4 inline-flex items-center gap-2 rounded-pill bg-white px-3.5 py-1.5 pr-3.5 text-[13px] text-ink-soft shadow-sm">
          <span className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-coral-pale text-sm">🐣</span>
          {baby.name}아 · 현재 {ageMonths}개월 ({AGE_STAGE_LABEL[ageStage]})
        </span>
        <h1 className="font-display text-[26px] leading-snug">
          오늘 저녁,
          <br />
          <span className="text-coral-deep">뭐 먹이지?</span>
        </h1>
        <div className="mt-1.5 text-[13px] text-ink-soft">{dateLabel} · 오후 4:00 추천 완료</div>
      </div>

      <div className="px-[22px]">
        {ageStage === "0-5" ? (
          <div className="mt-6 rounded-2xl border border-line bg-white p-5 text-[13.5px] text-ink-soft">
            이 서비스는 만 6개월 이상 아기를 기준으로 메뉴를 추천해요. 그 이전 시기의 수유/이유식 시작은
            소아과 상담을 먼저 받아보시길 권해요.
          </div>
        ) : (
          <>
            <div className="mb-2.5 mt-5 flex items-center gap-1.5 text-xs font-bold text-coral-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-coral" /> 오늘의 추천
            </div>
            {main ? (
              <RecommendCard
                recipe={main}
                totalRequired={main.requiredIngredients.length}
                badgeLabel={`${main.minAgeStage.replace("-", "~")}개월 · 유아식`}
                reason={mainReason}
              />
            ) : (
              <div className="mb-4 rounded-2xl border border-line bg-white p-4 text-[13px] text-ink-soft">
                지금 조건에 맞는 오늘의 추천 메뉴가 없어요. 식재료를 조금 더 등록해 보세요.
              </div>
            )}

            <div className="mb-2.5 mt-5 flex items-center gap-1.5 text-xs font-bold text-coral-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-coral" /> 너무 귀찮을 땐
            </div>
            {quick ? (
              <RecommendCard
                recipe={quick}
                totalRequired={quick.requiredIngredients.length}
                badgeLabel="초간편"
                quick
                reason={quickReason}
              />
            ) : (
              <div className="mb-4 rounded-2xl border border-line bg-white p-4 text-[13px] text-ink-soft">
                지금 조건에 맞는 초간편 메뉴가 없어요.
              </div>
            )}
          </>
        )}

        <div className="mb-2.5 mt-5 flex items-center gap-1.5 text-xs font-bold text-coral-deep">
          <span className="h-1.5 w-1.5 rounded-full bg-coral" /> 보유 식재료
        </div>
        <div className="mb-3 flex items-center justify-between rounded-2xl border border-line bg-white p-4">
          <div className="text-sm">
            <b className="font-display text-[15px]">현재 {ownedCount}개</b>의 재료가 있어요
            <span className="mt-0.5 block text-xs text-ink-soft">재료 관리에서 언제든 수정하세요</span>
          </div>
          <Link href="/ingredients" className="rounded-pill bg-coral-pale px-3.5 py-2 text-[12.5px] font-bold text-coral-deep">
            재료 관리
          </Link>
        </div>

        <Link
          href="/settings/notifications"
          className="mb-3 block rounded-2xl border border-line bg-white p-4 text-[13px] text-ink-soft"
        >
          🔔 오후 4시 알림 설정하기 →
        </Link>

        <Link
          href="/favorites"
          className="block rounded-2xl border border-line bg-white p-3.5 text-center text-[13px] text-ink-soft"
        >
          ⭐ 즐겨찾기
        </Link>
      </div>
    </div>
  );
}
