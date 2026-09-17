"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

export function ExitConfirmGuard() {
  const pathname = usePathname();
  const [showConfirm, setShowConfirm] = useState(false);
  const showConfirmRef = useRef(false);
  const isExitingRef = useRef(false);
  const hasArmedRef = useRef(false);

  useEffect(() => {
    showConfirmRef.current = showConfirm;
  }, [showConfirm]);

  const isHome = !pathname || pathname === "/" || pathname === "/home" || pathname.startsWith("/home");

  const armGuard = useCallback(() => {
    if (isExitingRef.current) return;
    try {
      // Chrome's History Manipulation Intervention skips pushState unless executed with a user gesture.
      // Calling pushState directly inside user interaction handlers ensures genuine user activation.
      window.history.pushState({ isExitGuard: true, timestamp: Date.now() }, "", window.location.href);
      hasArmedRef.current = true;
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!isHome) {
      setShowConfirm(false);
      hasArmedRef.current = false;
      return;
    }

    // 1. Initial arm on mount
    armGuard();

    // 2. Continuous gesture re-arming:
    // Whenever user touches, clicks, or scrolls the screen, ensure a user-activated history entry exists!
    const onUserInteraction = () => {
      if (isExitingRef.current || showConfirmRef.current) return;
      armGuard();
    };

    window.addEventListener("touchstart", onUserInteraction, { passive: true, capture: true });
    window.addEventListener("pointerdown", onUserInteraction, { passive: true, capture: true });
    window.addEventListener("click", onUserInteraction, { passive: true, capture: true });

    // 3. Popstate back button listener
    const handlePopState = (event: PopStateEvent) => {
      if (isExitingRef.current) return;

      // If exit modal is already open, second back press immediately exits (Double-Back to Exit)
      if (showConfirmRef.current) {
        handleConfirmExit();
        return;
      }

      // First back press: open exit confirmation modal
      setShowConfirm(true);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("touchstart", onUserInteraction, { capture: true });
      window.removeEventListener("pointerdown", onUserInteraction, { capture: true });
      window.removeEventListener("click", onUserInteraction, { capture: true });
    };
  }, [isHome, armGuard]);

  // [취소] 버튼: 모달 닫고 가드 즉시 재적재
  function handleCancel() {
    setShowConfirm(false);
    armGuard();
  }

  // [확인/종료] 버튼: 앱 완전 종료
  function handleConfirmExit() {
    isExitingRef.current = true;
    setShowConfirm(false);

    // 1. Android Intent Deep Link (Native TWA LauncherActivity will catch and finishAffinity)
    try {
      window.location.href = "babymenu://exit";
    } catch (e) {}

    // 2. Browser standard close and pop fallback
    setTimeout(() => {
      try {
        window.close();
      } catch (e) {}
      try {
        window.history.back();
      } catch (e2) {}
    }, 80);
  }

  if (!showConfirm) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 px-6 backdrop-blur-sm animate-intro-fade">
      <div className="w-full max-w-[300px] rounded-2xl bg-white p-5 text-center shadow-2xl">
        <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-peach-light/40">
          <span className="text-2xl">👋</span>
        </div>
        <h3 className="mb-1 font-display text-[16px] font-bold text-ink">앱을 종료하시겠습니까?</h3>
        <p className="mb-4 text-[12px] text-ink-muted">오늘의 추천 식단을 확인하셨나요?</p>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 rounded-pill border border-line py-2.5 text-[13.5px] font-medium text-ink-soft active:bg-cream transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirmExit}
            className="flex-1 rounded-pill bg-coral-deep py-2.5 text-[13.5px] font-bold text-white shadow-sm active:scale-95 transition-transform"
          >
            종료
          </button>
        </div>
      </div>
    </div>
  );
}

