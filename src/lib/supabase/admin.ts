import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * 절대 클라이언트(브라우저) 코드에서 import하면 안 된다.
 * 오후 4시 알림 크론처럼 "특정 사용자 세션 없이 모든 사용자 데이터를 다뤄야 하는" 서버 작업 전용.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://aoeuzyftcesrciqkoygg.supabase.co";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZXV6eWZ0Y2VzcmNpcWtveWdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzcwNjExOCwiZXhwIjoyMTAzMjgyMTE4fQ.ASILoWO02U5H9Ih5Lp5N5MbyQnV5S7-HIRjb-suGxR4";
  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
