"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function ExitConfirmGuard() {
  const pathname = usePathname();
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (pathname !== "/home") {
      setShowConfirm(false);
      return;
    }

    // 홈 진입 시 가드용 더미 엔트리 1개 적재
    try {
      window.history.pushState({ exitGuard: true }, "", window.location.href);
    } catch (e) {}

    function handlePopState() {
      setShowConfirm((prev) => {
        if (prev) {
          // 이미 팝업이 떠 있는 상태에서 또 뒤로가기를 누르면 즉시 앱 종료
          handleConfirmExit();
          return false;
        }
        // 첫 뒤로가기: 트랩 유지 후 팝업 노출
        try {
          window.history.pushState({ exitGuard: true }, "", window.location.href);
        } catch (e) {}
        return true;
      });
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [pathname]);

  function handleConfirmExit() {
    setShowConfirm(false);
    try {
      window.close();
    } catch (e) {}
    window.history.go(-2);
    setTimeout(() => {
      try {
        window.history.go(-1);
      } catch (e) {}
    }, 100);
  }


  if (!showConfirm) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 px-8 backdrop-blur-[1px]">
      <div className="w-full max-w-[300px] rounded-2xl bg-white p-5 text-center shadow-xl">
        <p className="mb-4 font-display text-[15.5px] text-ink">앱을 종료하시겠습니까?</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowConfirm(false)}
            className="flex-1 rounded-pill border border-line py-2.5 text-[13.5px] font-medium text-ink-soft active:bg-cream transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirmExit}
            className="flex-1 rounded-pill bg-coral-deep py-2.5 text-[13.5px] font-bold text-white shadow-sm active:scale-95 transition-transform"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
