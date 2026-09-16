"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export function ExitConfirmGuard() {
  const pathname = usePathname();
  const [showConfirm, setShowConfirm] = useState(false);
  const showConfirmRef = useRef(false);
  const isExitingRef = useRef(false);

  useEffect(() => {
    showConfirmRef.current = showConfirm;
  }, [showConfirm]);

  useEffect(() => {
    if (pathname !== "/home") {
      setShowConfirm(false);
      return;
    }

    console.log("[ExitConfirmGuard] mounted on pathname:", pathname);

    // 1. Next.js 내부 상태(__NA 등)를 보존하며 Base -> Guard 1개만 정확히 적재
    const armGuard = () => {
      if (isExitingRef.current) return;
      try {
        const curState = window.history.state || {};
        if (!curState.exitGuard) {
          window.history.replaceState(
            { ...curState, isBase: true },
            "",
            window.location.href
          );
          window.history.pushState(
            { ...curState, exitGuard: true, t: Date.now() },
            "",
            window.location.href
          );
          console.log("[ExitConfirmGuard] armed with exactly 1 exitGuard entry");
        }
      } catch (e) {}
    };

    armGuard();

    // 2. 실제 브라우저 User Gesture 활성화 컨텍스트에서 현재 가드 엔트리를 갱신
    // (replaceState로 교체하므로 히스토리 스택 길이가 늘어나지 않음)
    const onUserInteraction = () => {
      if (isExitingRef.current) return;
      try {
        const curState = window.history.state || {};
        if (curState.exitGuard && !curState.active) {
          window.history.replaceState(
            { ...curState, exitGuard: true, active: true },
            "",
            window.location.href
          );
          console.log("[ExitConfirmGuard] activated guard entry with user gesture");
        }
      } catch (e) {}
    };

    window.addEventListener("pointerup", onUserInteraction, { passive: true });
    window.addEventListener("touchend", onUserInteraction, { passive: true });
    window.addEventListener("click", onUserInteraction, { passive: true });

    // 3. 하드웨어 뒤로가기 popstate 처리
    function handlePopState(e: PopStateEvent) {
      console.log("[ExitConfirmGuard] popstate fired!", {
        state: e.state,
        historyLength: window.history.length,
        isConfirmOpen: showConfirmRef.current,
        isExiting: isExitingRef.current,
      });

      if (isExitingRef.current) {
        return;
      }

      // 이미 종료 팝업이 열려 있는 상태에서 한 번 더 뒤로가기를 누른 경우:
      // 즉시 앱 종료 절차 실행
      if (showConfirmRef.current) {
        console.log("[ExitConfirmGuard] double-back while modal open -> exit app");
        handleConfirmExit();
        return;
      }

      // 첫 뒤로가기: 종료 확인 모달 표시
      setShowConfirm(true);
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pointerup", onUserInteraction);
      window.removeEventListener("touchend", onUserInteraction);
      window.removeEventListener("click", onUserInteraction);
    };
  }, [pathname]);

  // [취소] 버튼 클릭: 모달을 닫고 가드 히스토리 1개 재적재
  function handleCancel() {
    setShowConfirm(false);
    try {
      const curState = window.history.state || {};
      window.history.pushState(
        { ...curState, exitGuard: true, active: true, t: Date.now() },
        "",
        window.location.href
      );
    } catch (e) {}
  }

  // [확인] 버튼 클릭: 앱 종료
  function handleConfirmExit() {
    isExitingRef.current = true;
    setShowConfirm(false);

    // 1. 네이티브 TWA 종료 시도 (Android Custom Scheme Deep Link)
    try {
      window.location.href = "babymenu://exit";
    } catch (e) {}

    // 2. 브라우저 창 닫기 시도
    try {
      window.close();
    } catch (e) {}

    // 3. TWA 세션 스택 최하단으로 back 이동 (TWA 액티비티 자동 종료 트리거)
    setTimeout(() => {
      try {
        window.history.go(-window.history.length);
      } catch (e) {
        try {
          window.history.back();
        } catch (e2) {}
      }
    }, 50);
  }

  if (!showConfirm) return null;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/40 px-8 backdrop-blur-[1px]">
      <div className="w-full max-w-[300px] rounded-2xl bg-white p-5 text-center shadow-xl animate-intro-fade">
        <p className="mb-4 font-display text-[15.5px] text-ink">앱을 종료하시겠습니까?</p>
        <div className="flex gap-2">
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
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
