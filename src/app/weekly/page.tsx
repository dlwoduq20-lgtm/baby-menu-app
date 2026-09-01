import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeWeeklyPlan, DAY_LABELS } from "@/lib/service/weeklyPlan";

function CoverageBar({ label, percent }: { label: string; percent: number | null }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px] text-ink-soft">
        <span>{label}</span>
        <span>{percent == null ? "—" : `${percent}%`}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-pill bg-line">
        <div
          className="h-full rounded-pill bg-mint"
          style={{ width: `${percent == null ? 0 : Math.min(100, percent)}%` }}
        />
      </div>
    </div>
  );
}

export default async function WeeklyPlanPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const plan = await computeWeeklyPlan(supabase, user.id);
  if (!plan) redirect("/onboarding/baby");

  const weekLabel = new Date(plan.weekStartDate).toLocaleDateString("ko-KR", { month: "long", day: "numeric" });

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-cream px-6 pb-10 pt-11">
      <div className="mb-5 flex items-center gap-3">
        <Link href="/home" className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-sm shadow-sm">
          ←
        </Link>
        <div>
          <h1 className="font-display text-lg">이번 주 식단</h1>
          <div className="text-[11px] text-ink-soft">{weekLabel} 주 · {plan.baby.name}이 · {plan.ageMonths}개월</div>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-line bg-white p-4">
        <div className="mb-3 font-display text-[14px]">
          이번 주 메뉴 재료들이 채워주는 영양 커버리지
        </div>
        <div className="flex flex-col gap-2.5">
          <CoverageBar label="탄수화물" percent={plan.nutritionCoverage.carbs} />
          <CoverageBar label="단백질" percent={plan.nutritionCoverage.protein} />
          <CoverageBar label="지방" percent={plan.nutritionCoverage.fat} />
          <CoverageBar label="식이섬유" percent={plan.nutritionCoverage.fiber} />
        </div>
        <div className="mt-3 text-[10.5px] leading-relaxed text-ink-soft">
          {plan.ageMonths}개월 아기의 하루 권장 섭취량 × 7일 대비, 이번 주 추천 메뉴들의 재료로 채워지는 비율이에요.
          {plan.nutritionCoverage.source && <> 출처: {plan.nutritionCoverage.source}</>}
        </div>
      </div>

      <Link
        href="/shopping-list"
        className="mb-5 flex items-center justify-between rounded-2xl border border-line bg-white p-4 text-[13.5px]"
      >
        <span>🛒 이번 주 장보기 리스트 보기</span>
        <span className="text-ink-soft">→</span>
      </Link>

      <div className="flex flex-col gap-3">
        {plan.days.map((day) => {
          const dateObj = new Date(day.date);
          const dow = DAY_LABELS[day.dayOffset];
          const dateLabel = dateObj.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
          return (
            <div key={day.dayOffset} className="rounded-2xl border border-line bg-white p-4">
              <div className="mb-2 text-xs font-bold text-coral-deep">
                {dateLabel} ({dow})
              </div>
              {day.main && (
                <Link href={`/recipe/${day.main.id}`} className="mb-1.5 block text-[13.5px]">
                  <span className="mr-1.5 rounded-pill bg-coral-pale px-2 py-0.5 text-[10.5px] font-bold text-coral-deep">
                    오늘의 추천
                  </span>
                  {day.main.name}
                </Link>
              )}
              {day.quick && (
                <Link href={`/recipe/${day.quick.id}`} className="block text-[13.5px]">
                  <span className="mr-1.5 rounded-pill bg-mint-pale px-2 py-0.5 text-[10.5px] font-bold text-[#2E8F5D]">
                    초간편
                  </span>
                  {day.quick.name}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
