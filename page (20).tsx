import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Root() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 로그인 안 된 사용자 → 로그인 화면
  // (실제로는 로그인 이후 babies 테이블 존재 여부로 /onboarding/baby vs /home 을 나눈다 — STEP 4에서 연결)
  if (!session) {
    redirect("/landing");
  }

  // 로그인은 됐지만 아기 프로필이 아직 없다면 온보딩으로 보낸다 (스펙 4장 최초 가입 플로우).
  const { data: babies } = await supabase.from("babies").select("id").eq("user_id", session.user.id).limit(1);

  if (!babies || babies.length === 0) {
    redirect("/onboarding/baby");
  }

  redirect("/home");
}
