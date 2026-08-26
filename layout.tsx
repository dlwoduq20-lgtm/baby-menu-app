import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  if (!isAdminEmail(user.email)) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center text-[13.5px] text-ink-soft">
        관리자 권한이 있는 계정으로 로그인해 주세요.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl">관리자</h1>
        <Link href="/home" className="text-xs text-ink-soft">
          앱으로 돌아가기
        </Link>
      </div>
      <div className="mb-6 flex gap-4 border-b border-line pb-3 text-[13.5px] font-bold text-ink-soft">
        <Link href="/admin/recipes">레시피 관리</Link>
        <Link href="/admin/age-rules">월령별 안전 규칙 관리</Link>
      </div>
      {children}
    </div>
  );
}
