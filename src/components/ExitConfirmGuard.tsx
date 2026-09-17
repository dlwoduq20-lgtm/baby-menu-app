"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

const HASH_READY = "#ready";

export function ExitConfirmGuard() {
  const pathname = usePathname();
  const [showConfirm, setShowConfirm] = useState(false);
  const showConfirmRef = useRef(false);
  const isExitingRef = useRef(false);
  const lastBackTimeRef = useRef(0);

  useEffect(() => {
    showConfirmRef.current = showConfirm;
  }, [showConfirm]);

  const isHome = !pathname || pathname === "/" || pathname === "/home" || pathname.startsWith("/home");

  useEffect(() => {
    if (!isHome) {
      setShowConfirm(false);
      return;
    }

    // Arm guard with base entry + #ready fragment entry
    const armReadyGuard = () => {
      if (isExitingRef.current) return;
      try {
        if (window.location.hash !== HASH_READY) {
          window.history.replaceState({ isBase: true }, "", window.location.pathname);
          window.history.pushState({ isReady: true }, "", window.location.pathname + HASH_READY);
        }
      } catch (e) {}
    };

    armReadyGuard();

    const handlePopState = () => {
      if (isExitingRef.current) return;

      // When armed or returning to #ready, do not show modal
      if (window.location.hash === HASH_READY) {
        return;
      }

      // If already open, ignore rapid duplicate events (<300ms)
      const now = Date.now();
      if (showConfirmRef.current) {
        if (now - lastBackTimeRef.current < 300) {
          return;
        }
        handleConfirmExit();
        return;
      }

      // First back press: hash was removed (from #ready to empty). Show modal on MAIN SCREEN!
      lastBackTimeRef.current = now;
      setShowConfirm(true);
    };

    window.addEventListener("popstate", handlePopState);

    const onUserInteraction = () => {
      if (isExitingRef.current || showConfirmRef.current) return;
      if (window.location.hash !== HASH_READY) {
        armReadyGuard();
      }
    };
    window.addEventListener("touchstart", onUserInteraction, { passive: true });
    window.addEventListener("pointerdown", onUserInteraction, { passive: true });

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("touchstart", onUserInteraction);
      window.removeEventListener("pointerdown", onUserInteraction);
    };
  }, [isHome]);

  // [취소] 버튼: 모달 닫고 가드 즉시 재적재
  function handleCancel() {
    setShowConfirm(false);
    try {
      if (window.location.hash !== HASH_READY) {
        window.history.replaceState({ isBase: true }, "", window.location.pathname);
        window.history.pushState({ isReady: true }, "", window.location.pathname + HASH_READY);
      }
    } catch (e) {}
  }

  // [확인/종료] 버튼: 부드러운 앱 종료
  function handleConfirmExit() {
    isExitingRef.current = true;
    setShowConfirm(false);

    // 1. Android Intent Deep Link (Native TWA LauncherActivity will call finishAffinity cleanly)
    try {
      window.location.href = "babymenu://exit";
    } catch (e) {
      try {
        window.close();
      } catch (e2) {}
    }
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

