"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export function ExitConfirmGuard() {
  const pathname = usePathname();
  const [showConfirm, setShowConfirm] = useState(false);
  const showConfirmRef = useRef(false);
  const isExitingRef = useRef(false);
  const isArmedRef = useRef(false);

  useEffect(() => {
    showConfirmRef.current = showConfirm;
  }, [showConfirm]);

  useEffect(() => {
    // 홈 화면(/home 또는 /)에서만 뒤로가기 종료 가드 활성화
    if (pathname !== "/home" && pathname !== "/") {
      setShowConfirm(false);
      isArmedRef.current = false;
      return;
    }

    const armGuard = () => {
      if (isExitingRef.current || isArmedRef.current) return;
      try {
        window.history.pushState({ isExitGuard: true }, "", window.location.href);
        isArmedRef.current = true;
      } catch (e) {}
    };

    // 마운트 시 가드 1차 적재
    armGuard();

    // 사용자가 화면을 터치/클릭하는 순간(User Activation)에도 가드 확실히 보장
    const onUserInteraction = () => {
      if (!isArmedRef.current && !showConfirmRef.current && !isExitingRef.current) {
        armGuard();
      }
    };
    window.addEventListener("pointerdown", onUserInteraction, { passive: true });
    window.addEventListener("touchstart", onUserInteraction, { passive: true });

    // 하드웨어 뒤로가기 감지
    const handlePopState = () => {
      if (isExitingRef.current) return;
      isArmedRef.current = false;

      // 모달이 이미 열려 있는 상태에서 한 번 더 뒤로가기를 누른 경우 -> 더블 백 즉시 앱 종료
      if (showConfirmRef.current) {
        handleConfirmExit();
        return;
      }

      // 첫 번째 뒤로가기: 종료 확인 모달 노출
      setShowConfirm(true);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pointerdown", onUserInteraction);
      window.removeEventListener("touchstart", onUserInteraction);
    };
  }, [pathname]);

  // [취소] 버튼 클릭: 모달 닫고 가드 재적재
  function handleCancel() {
    setShowConfirm(false);
    isArmedRef.current = false;
    try {
      window.history.pushState({ isExitGuard: true }, "", window.location.href);
      isArmedRef.current = true;
    } catch (e) {}
  }

  // [확인] 버튼 클릭: 앱 완전 종료
  function handleConfirmExit() {
    isExitingRef.current = true;
    setShowConfirm(false);

    // 1. 네이티브 TWA 종료 시도 (Android Intent Deep Link)
    try {
      window.location.href = "babymenu://exit";
    } catch (e) {}

    // 2. 브라우저 창 닫기 및 세션 백 시도
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

