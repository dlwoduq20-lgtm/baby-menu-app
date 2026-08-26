"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/landing");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-2xl border border-line bg-white p-4 text-center text-[13.5px] text-coral-deep"
    >
      로그아웃
    </button>
  );
}
