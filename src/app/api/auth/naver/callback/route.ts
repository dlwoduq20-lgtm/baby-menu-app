import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// 네이버는 Supabase 네이티브 provider가 아니므로,
// "네이버로 본인 확인 → 이메일 확보 → Supabase admin API로 매직링크 발급 → 그 링크로 세션 생성" 브릿지 방식을 쓴다.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieState = request.headers.get("cookie")?.match(/naver_oauth_state=([^;]+)/)?.[1];
  if (!code || !state || state !== cookieState) {
    return NextResponse.redirect(`${origin}/login?error=naver_state_mismatch`);
  }

  const clientId = process.env.NAVER_CLIENT_ID || "dKJgp5e43l_rLNi3BQ1Z";
  const clientSecret = process.env.NAVER_CLIENT_SECRET || "bWN5tbUuds";

  // 1) 인가 코드 → 액세스 토큰
  const tokenUrl = new URL("https://nid.naver.com/oauth2.0/token");
  tokenUrl.searchParams.set("grant_type", "authorization_code");
  tokenUrl.searchParams.set("client_id", clientId);
  tokenUrl.searchParams.set("client_secret", clientSecret);
  tokenUrl.searchParams.set("code", code);
  tokenUrl.searchParams.set("state", state);

  const tokenRes = await fetch(tokenUrl.toString());
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return NextResponse.redirect(`${origin}/login?error=naver_token_failed`);
  }

  // 2) 액세스 토큰 → 프로필(이메일 포함)
  const profileRes = await fetch("https://openapi.naver.com/v1/nid/me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const profileData = await profileRes.json();
  const email: string | undefined = profileData?.response?.email;
  const name: string | undefined = profileData?.response?.name;

  if (!email) {
    return NextResponse.redirect(`${origin}/login?error=naver_email_required`);
  }

  // 3) Supabase 사용자 확보 + 매직링크 발급 (STEP 3에서 만든 카카오/구글과 동일한 users 테이블로 합류)
  const admin = createAdminClient();
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: `${origin}/auth/callback`,
      data: { full_name: name, provider: "naver" },
    },
  });

  if (linkError || !linkData?.properties?.action_link) {
    return NextResponse.redirect(`${origin}/login?error=naver_bridge_failed`);
  }

  // action_link로 이동하면 Supabase가 자체적으로 세션 쿠키를 설정하고 redirectTo로 다시 보내준다.
  return NextResponse.redirect(linkData.properties.action_link);
}
