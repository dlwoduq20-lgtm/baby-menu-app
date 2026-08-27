import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminAgeRulesPage() {
  const supabase = createClient();
  const { data: rules } = await supabase.from("age_rules").select("*").order("stage");

  return (
    <div>
      <p className="mb-4 text-[13px] text-ink-soft">
        여기서 수정한 내용은 추천 시 안전성 검증(<code>applySafetyFilter</code>)에 바로 반영돼요.
      </p>
      <div className="flex flex-col gap-2">
        {(rules ?? []).map((r) => (
          <Link
            key={r.stage}
            href={`/admin/age-rules/${r.stage}`}
            className="flex items-center justify-between rounded-2xl border border-line bg-white p-4"
          >
            <div>
              <div className="font-display text-[15px]">{r.stage}개월</div>
              <div className="mt-1 text-xs text-ink-soft">
                질식위험 {r.choking_hazard_foods.length}개 · 피해야할 음식 {r.avoid_foods.length}개
              </div>
            </div>
            <span className="text-xs text-ink-soft">수정 →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
