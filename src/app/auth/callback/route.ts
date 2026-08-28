import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 카카오/구글 로그인 후 Supabase가 이 URL로 되돌려보낸다 (redirectTo와 짝을 이룸).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const code = searchParams.get("code");

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  if (code) {
    const supabase = createClient();
    const {
      data: { session },
      error: exchangeError,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(exchangeError.message)}`
      );
    }

    if (session?.user) {
      const { data: babies } = await supabase
        .from("babies")
        .select("id")
        .eq("user_id", session.user.id)
        .limit(1);

      if (babies && babies.length > 0) {
        return NextResponse.redirect(`${origin}/home`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/onboarding/baby`);
}
