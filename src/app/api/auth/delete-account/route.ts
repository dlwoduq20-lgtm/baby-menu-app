import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * 스토어 심사(구글 플레이 & 애플 앱스토어 지침 5.1.1) 필수 요건:
 * 회원 탈퇴(계정 완전 삭제) API
 */
export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인된 사용자가 아닙니다." }, { status: 401 });
  }

  const adminClient = createAdminClient();
  const userId = user.id;

  try {
    // 1. 유저 관련 데이터 정리 (DB Cascade 외 명시적 정리)
    await Promise.allSettled([
      adminClient.from("notification_settings").delete().eq("user_id", userId),
      adminClient.from("user_ingredients").delete().eq("user_id", userId),
      adminClient.from("recommendations").delete().eq("user_id", userId),
      adminClient.from("recommendation_feedback").delete().eq("user_id", userId),
      adminClient.from("favorites").delete().eq("user_id", userId),
      adminClient.from("babies").delete().eq("user_id", userId),
    ]);

    // 2. Supabase Auth 계정 삭제
    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(userId);
    if (deleteUserError) {
      return NextResponse.json({ error: deleteUserError.message }, { status: 500 });
    }

    // 3. 사용자 세션 로그아웃
    await supabase.auth.signOut();

    return NextResponse.json({ success: true, message: "계정이 안전하게 완전 삭제되었습니다." });
  } catch (err: any) {
    console.error("Account deletion failed:", err);
    return NextResponse.json(
      { error: err.message || "회원 탈퇴 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
