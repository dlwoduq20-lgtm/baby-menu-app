import { createBrowserClient } from "@supabase/ssr";

// 클라이언트 컴포넌트(브라우저)에서 사용하는 Supabase 인스턴스.
// 로그인 버튼, 식재료 체크 등 사용자 상호작용이 바로 일어나는 화면에서 사용한다.
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
  return createBrowserClient(url, anonKey);
}
