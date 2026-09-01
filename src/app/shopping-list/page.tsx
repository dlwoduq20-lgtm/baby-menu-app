import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeWeeklyPlan } from "@/lib/service/weeklyPlan";

export default async function ShoppingListPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const plan = await computeWeeklyPlan(supabase, user.id);
  if (!plan) redirect("/onboarding/baby");

  const toBuy = plan.shoppingList.filter((i) => !i.owned);
  const owned = plan.shoppingList.filter((i) => i.owned);

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-cream px-6 pb-10 pt-11">
      <div className="mb-5 flex items-center gap-3">
        <Link href="/weekly" className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-sm shadow-sm">
          ←
        </Link>
        <h1 className="font-display text-lg">장보기 리스트</h1>
      </div>

      <p className="mb-5 text-[12.5px] text-ink-soft">
        이번 주 식단에 필요한데 아직 없는 재료예요. 수량은 이번 주 메뉴들을 기준으로 합산한 대략치예요.
      </p>

      <div className="mb-2.5 text-xs font-bold text-coral-deep">구매 필요 ({toBuy.length}개)</div>
      {toBuy.length === 0 ? (
        <div className="mb-5 rounded-2xl border border-line bg-white p-4 text-center text-[13px] text-ink-soft">
          이번 주 메뉴는 지금 가진 재료만으로 다 만들 수 있어요!
        </div>
      ) : (
        <div className="mb-5 flex flex-col gap-2">
          {toBuy.map((item) => (
            <div
              key={`${item.ingredientId}_${item.unit}`}
              className="flex items-center justify-between rounded-2xl border border-line bg-white p-3.5 text-[13.5px]"
            >
              <span>
                {item.name} <span className="text-ink-soft">({item.category})</span>
              </span>
              <span className="font-bold text-coral-deep">
                {item.totalQuantity}
                {item.unit}
              </span>
            </div>
          ))}
        </div>
      )}

      {owned.length > 0 && (
        <>
          <div className="mb-2.5 text-xs font-bold text-ink-soft">이미 있어요 ({owned.length}개)</div>
          <div className="flex flex-wrap gap-2">
            {owned.map((item) => (
              <span
                key={`${item.ingredientId}_${item.unit}`}
                className="rounded-pill bg-mint-pale px-3 py-1.5 text-[12px] text-[#2E8F5D]"
              >
                {item.name}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
