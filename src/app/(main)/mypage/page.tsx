import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calcAgeInMonths, getAgeStage, AGE_STAGE_LABEL } from "@/lib/babyAge";
import { LogoutButton } from "@/components/LogoutButton";

export default async function MyPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: babies } = await supabase.from("babies").select("*").eq("user_id", user.id).limit(1);
  const baby = babies?.[0];

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-cream px-6 pb-10 pt-11">
      <h1 className="mb-5 font-display text-xl">마이</h1>

      <div className="mb-4 rounded-2xl border border-line bg-white p-4">
        <div className="text-xs text-ink-soft">로그인 계정</div>
        <div className="mt-1 text-[14px]">{user.email ?? "소셜 로그인 계정"}</div>
        {baby && (
          <div className="mt-3 border-t border-line pt-3 text-[13.5px]">
            <b className="font-display">{baby.name}</b> ·{" "}
            {AGE_STAGE_LABEL[getAgeStage(calcAgeInMonths(baby.birth_date))]}
          </div>
        )}
      </div>

      <div className="mb-4 flex flex-col gap-2.5">
        <Link href="/onboarding/baby" className="rounded-2xl border border-line bg-white p-4 text-[13.5px]">
          👶 아기 프로필 수정
        </Link>
        <Link href="/ingredients" className="rounded-2xl border border-line bg-white p-4 text-[13.5px]">
          🥕 식재료 관리
        </Link>
        <Link href="/favorites" className="rounded-2xl border border-line bg-white p-4 text-[13.5px]">
          ⭐ 즐겨찾기
        </Link>
        <Link href="/settings/notifications" className="rounded-2xl border border-line bg-white p-4 text-[13.5px]">
          🔔 알림 설정
        </Link>
      </div>

      <LogoutButton />

      <p className="mt-6 text-center text-[11px] text-ink-soft">
        본 서비스는 일반적인 식단 정보를 제공하며, 의료적 조언을 대체하지 않습니다.
      </p>
    </div>
  );
}
