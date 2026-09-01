import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";

// 카카오/구글/네이버 로그인 후 Supabase가 이 URL로 되돌려보낸다 (redirectTo와 짝을 이룸).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  const supabase = createClient();

  if (code) {
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
  } else if (token_hash && type) {
    const {
      data: { session },
      error: verifyError,
    } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (verifyError) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(verifyError.message)}`
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
