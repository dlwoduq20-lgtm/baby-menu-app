import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminNutritionTargetsPage() {
  const supabase = createClient();
  const { data: targets } = await supabase.from("nutrition_targets").select("*").order("stage");

  return (
    <div>
      <p className="mb-4 text-[13px] text-ink-soft">
        시드 값은 "초안"이에요 — 실제 서비스 전에 반드시 검증된 수치와 출처로 교체해 주세요. 여기서 수정하면
        주간 식단/레시피 상세의 영양 커버리지 % 계산에 바로 반영돼요.
      </p>
      <div className="flex flex-col gap-2">
        {(targets ?? []).map((t) => (
          <Link
            key={t.stage}
            href={`/admin/nutrition-targets/${t.stage}`}
            className="flex items-center justify-between rounded-2xl border border-line bg-white p-4"
          >
            <div>
              <div className="font-display text-[15px]">{t.stage}개월</div>
              <div className="mt-1 text-xs text-ink-soft">
                탄 {t.daily_carbs_g ?? "-"}g · 단 {t.daily_protein_g ?? "-"}g · 지 {t.daily_fat_g ?? "-"}g · 식이섬유{" "}
                {t.daily_fiber_g ?? "-"}g
              </div>
              <div className="mt-1 text-[10.5px] text-ink-soft">출처: {t.source}</div>
            </div>
            <span className="text-xs text-ink-soft">수정 →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
