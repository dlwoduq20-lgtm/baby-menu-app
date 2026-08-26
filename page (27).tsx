import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function FavoritesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: favorites } = await supabase
    .from("favorites")
    .select("recipe_id, created_at, recipe:recipes(id, name, cook_minutes, difficulty, is_quick)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-cream px-6 pb-10 pt-11">
      <div className="mb-5 flex items-center gap-3">
        <Link href="/home" className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-sm shadow-sm">
          ←
        </Link>
        <h1 className="font-display text-lg">즐겨찾기</h1>
      </div>

      {!favorites || favorites.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-6 text-center text-[13.5px] text-ink-soft">
          아직 즐겨찾기한 메뉴가 없어요. 레시피 상세에서 ⭐를 눌러보세요.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {favorites.map((f: any) => (
            <Link
              key={f.recipe_id}
              href={`/recipe/${f.recipe_id}`}
              className="flex items-center justify-between rounded-2xl border border-line bg-white p-4"
            >
              <div>
                <div className="font-display text-[15px]">{f.recipe?.name}</div>
                <div className="mt-1 text-xs text-ink-soft">
                  ⏱ {f.recipe?.cook_minutes}분 · 난이도 {"★".repeat(f.recipe?.difficulty ?? 1)}
                  {f.recipe?.is_quick && " · 초간편"}
                </div>
              </div>
              <span className="text-yellow">⭐</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
