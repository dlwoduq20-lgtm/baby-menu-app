"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteAccountButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "탈퇴 처리 중 문제가 발생했습니다.");
      }

      alert("회원 탈퇴가 완료되었습니다. 모든 개인정보와 데이터가 안전하게 삭제되었습니다.");
      window.location.href = "/landing";
    } catch (err: any) {
      setErrorMsg(err.message || "오류가 발생했습니다.");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-xs text-ink-soft/70 underline transition-colors hover:text-coral-deep"
        >
          회원 탈퇴
        </button>
      </div>

      {/* 탈퇴 확인 모달 (스토어 심사 지침 준수) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5 backdrop-blur-xs">
          <div className="w-full max-w-[340px] rounded-card border border-line bg-white p-6 shadow-xl">
            <span className="mb-2 block text-3xl">⚠️</span>
            <h3 className="font-display text-[17px] text-ink">
              정말 탈퇴하시겠습니까?
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">
              탈퇴 시 등록된 <b>아기 프로필, 알레르기 정보, 냉장고 식재료 목록 및 추천 기록</b>이 즉시 영구 삭제되며 복구할 수 없습니다.
            </p>

            {errorMsg && (
              <div className="mt-3 rounded-xl bg-coral-pale p-2 text-center text-xs text-coral-deep">
                {errorMsg}
              </div>
            )}

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setIsOpen(false);
                  setErrorMsg(null);
                }}
                className="flex-1 rounded-xl border border-line bg-cream py-2.5 text-xs font-bold text-ink hover:bg-cream-deep"
              >
                취소
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-[#E5484D] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#D33E43] disabled:opacity-50"
              >
                {loading ? "삭제 중..." : "탈퇴하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
