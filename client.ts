import { createBrowserClient } from "@supabase/ssr";

// 클라이언트 컴포넌트(브라우저)에서 사용하는 Supabase 인스턴스.
// 로그인 버튼, 식재료 체크 등 사용자 상호작용이 바로 일어나는 화면에서 사용한다.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
