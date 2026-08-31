import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

// Supabase는 네이버를 기본 provider로 지원하지 않아서, 표준 OAuth2 인가 코드 흐름을 직접 구현한다.
// 토큰 교환/세션 생성은 /api/auth/naver/callback 에서 처리한다.
export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const state = randomBytes(16).toString("hex");

  const clientId = process.env.NAVER_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(
        "Vercel 환경 변수에 NAVER_CLIENT_ID가 등록되지 않았거나 재배포가 필요합니다."
      )}`
    );
  }

  const authorizeUrl = new URL("https://nid.naver.com/oauth2.0/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", `${origin}/api/auth/naver/callback`);
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl.toString());
  response.cookies.set("naver_oauth_state", state, {
    httpOnly: true,
    secure: true,
    maxAge: 300, // 5분
    path: "/",
  });
  return response;
}
