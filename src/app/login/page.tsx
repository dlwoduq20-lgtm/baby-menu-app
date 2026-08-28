"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Provider = "google" | "kakao";

function LoginForm() {
  const [loading, setLoading] = useState<Provider | null>(null);
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const supabase = createClient();

  async function handleLogin(provider: Provider) {
    setLoading(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: provider === "google" ? {
          access_type: "offline",
          prompt: "consent",
        } : undefined,
      },
    });
    if (error) {
      alert(`로그인 중 문제가 발생했어요: ${error.message}`);
      setLoading(null);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[430px] flex-col justify-center bg-cream px-6">
      <h1 className="mb-2 font-display text-2xl leading-snug">
        간편하게
        <br />
        시작할게요
      </h1>
      <p className="mb-6 text-[13.5px] leading-relaxed text-ink-soft">
        3초면 충분해요. 계정 하나로 아기 정보를
        <br />
        안전하게 보관해 드려요.
      </p>

      {urlError && (
        <div className="mb-4 rounded-2xl border border-[#F4DFAE] bg-yellow-pale p-3.5 text-xs leading-relaxed text-[#7A5A16]">
          ⚠️ <b>로그인 안내:</b> {decodeURIComponent(urlError)}
        </div>
      )}

      <button
        onClick={() => handleLogin("kakao")}
        disabled={loading !== null}
        className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-line bg-white px-[18px] py-3.5 text-[14.5px] disabled:opacity-60"
      >
        <span className="flex h-6.5 w-6.5 items-center justify-center rounded-lg bg-[#FEE500] text-sm">💬</span>
        {loading === "kakao" ? "이동 중..." : "카카오로 계속하기"}
      </button>

      <button
        onClick={() => handleLogin("google")}
        disabled={loading !== null}
        className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-line bg-white px-[18px] py-3.5 text-[14.5px] disabled:opacity-60"
      >
        <span className="flex h-6.5 w-6.5 items-center justify-center rounded-lg bg-[#EAF1FD] text-sm font-bold">G</span>
        {loading === "google" ? "이동 중..." : "Google로 계속하기"}
      </button>

      <a
        href="/api/auth/naver/login"
        className="flex w-full items-center gap-3 rounded-2xl border border-line bg-white px-[18px] py-3.5 text-[14.5px]"
      >
        <span className="flex h-6.5 w-6.5 items-center justify-center rounded-lg bg-[#03C75A] text-sm font-bold text-white">
          N
        </span>
        네이버로 계속하기
      </a>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
