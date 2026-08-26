import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 카카오/구글 로그인 후 Supabase가 이 URL로 되돌려보낸다 (redirectTo와 짝을 이룸).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // 최초 로그인 사용자는 아기 등록으로, 기존 사용자는 홈으로 보내는 분기는
  // STEP 4에서 babies 테이블 조회 결과에 따라 여기서 처리한다. 지금은 온보딩으로 고정.
  return NextResponse.redirect(`${origin}/onboarding/baby`);
}
