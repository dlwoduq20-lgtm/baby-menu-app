import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const FEEDBACK_ICON: Record<string, string> = { like: "❤️", dislike: "👎", cooked: "🍳", reroll: "🔄" };

export default async function HistoryPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: babies } = await supabase.from("babies").select("id").eq("user_id", user.id).limit(1);
  const baby = babies?.[0];

  const [{ data: recommendations }, { data: feedback }] = await Promise.all([
    baby
      ? supabase
          .from("recommendations")
          .select("recipe_id, recommendation_type, recommended_date, recipe:recipes(name)")
          .eq("baby_id", baby.id)
          .order("recommended_date", { ascending: false })
          .limit(30)
      : Promise.resolve({ data: [] as any[] }),
    supabase
      .from("recommendation_feedback")
      .select("recipe_id, feedback_type")
      .eq("user_id", user.id),
  ]);

  const feedbackByRecipe = new Map<string, string[]>();
  for (const f of feedback ?? []) {
    const list = feedbackByRecipe.get(f.recipe_id) ?? [];
    list.push(f.feedback_type);
    feedbackByRecipe.set(f.recipe_id, list);
  }

  // 날짜별로 묶기
  const byDate = new Map<string, any[]>();
  for (const r of recommendations ?? []) {
    const list = byDate.get(r.recommended_date) ?? [];
    list.push(r);
    byDate.set(r.recommended_date, list);
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-cream px-6 pb-10 pt-11">
      <div className="mb-5 flex items-center gap-3">
        <Link href="/home" className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-sm shadow-sm">
          ←
        </Link>
        <h1 className="font-display text-lg">추천 기록</h1>
      </div>

      {byDate.size === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-6 text-center text-[13.5px] text-ink-soft">
          아직 쌓인 추천 기록이 없어요.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {Array.from(byDate.entries()).map(([date, items]) => (
            <div key={date}>
              <div className="mb-2 text-xs font-bold text-ink-soft">{date}</div>
              <div className="flex flex-col gap-2">
                {items.map((item: any) => (
                  <Link
                    key={`${item.recipe_id}-${item.recommendation_type}`}
                    href={`/recipe/${item.recipe_id}`}
                    className="flex items-center justify-between rounded-2xl border border-line bg-white p-3.5"
                  >
                    <div className="text-[13.5px]">
                      <span className="mr-1.5 rounded-pill bg-coral-pale px-2 py-0.5 text-[10.5px] font-bold text-coral-deep">
                        {item.recommendation_type === "main" ? "오늘의 추천" : "초간편"}
                      </span>
                      {item.recipe?.name}
                    </div>
                    <div className="text-sm">
                      {(feedbackByRecipe.get(item.recipe_id) ?? []).map((t) => FEEDBACK_ICON[t]).join(" ")}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
