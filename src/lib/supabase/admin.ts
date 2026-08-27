import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * 절대 클라이언트(브라우저) 코드에서 import하면 안 된다.
 * 오후 4시 알림 크론처럼 "특정 사용자 세션 없이 모든 사용자 데이터를 다뤄야 하는" 서버 작업 전용.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";
  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
