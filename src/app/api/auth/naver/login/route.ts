import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

// Supabase는 네이버를 기본 provider로 지원하지 않아서, 표준 OAuth2 인가 코드 흐름을 직접 구현한다.
// 토큰 교환/세션 생성은 /api/auth/naver/callback 에서 처리한다.
export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const state = randomBytes(16).toString("hex");

  const clientId = process.env.NAVER_CLIENT_ID || "dKJgp5e43l_rLNi3BQ1Z";

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
