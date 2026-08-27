import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminRecipesPage() {
  const supabase = createClient();
  const { data: recipes } = await supabase.from("recipes").select("*").order("name");

  return (
    <div>
      <p className="mb-4 text-[13px] text-ink-soft">
        총 {recipes?.length ?? 0}개 레시피. 월령/난이도/알레르기/주의사항을 여기서 수정하면 추천 알고리즘에 바로 반영돼요.
      </p>
      <div className="flex flex-col gap-2">
        {(recipes ?? []).map((r) => (
          <Link
            key={r.id}
            href={`/admin/recipes/${r.id}`}
            className="flex items-center justify-between rounded-2xl border border-line bg-white p-4"
          >
            <div>
              <div className="font-display text-[15px]">{r.name}</div>
              <div className="mt-1 text-xs text-ink-soft">
                {r.min_age_stage}개월 · ⏱ {r.cook_minutes}분 · 난이도 {r.difficulty} · {r.is_quick ? "초간편" : "일반"}
                {r.allergens.length > 0 && ` · 알레르기: ${r.allergens.join(", ")}`}
              </div>
            </div>
            <span className="text-xs text-ink-soft">수정 →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
