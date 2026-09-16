"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export function ExitConfirmGuard() {
  const pathname = usePathname();
  const [showConfirm, setShowConfirm] = useState(false);
  const showConfirmRef = useRef(false);
  const isExitingRef = useRef(false);
  const lastNavBackTimeRef = useRef(0);

  useEffect(() => {
    showConfirmRef.current = showConfirm;
  }, [showConfirm]);

  useEffect(() => {
    // 홈 화면(/home 또는 /)에서만 뒤로가기 종료 가드 활성화
    if (pathname !== "/home" && pathname !== "/") {
      setShowConfirm(false);
      return;
    }

    const HASH_TAG = "#ready";

    const armGuard = () => {
      if (isExitingRef.current) return;
      try {
        if (window.location.hash === HASH_TAG) {
          window.history.replaceState({ isBase: true }, "", window.location.pathname);
          window.history.pushState({ exitGuard: true }, "", HASH_TAG);
        } else {
          window.history.replaceState({ isBase: true }, "", window.location.href);
          window.history.pushState({ exitGuard: true }, "", HASH_TAG);
        }
        console.log("[ExitConfirmGuard] armed with base + #ready guard");
      } catch (e) {}
    };

    // 마운트 시 즉시 가드 적재
    armGuard();

    // 첫 터치/클릭 시에도 가드가 혹시 안 걸려 있으면 재적재
    const onUserInteraction = () => {
      if (window.location.hash !== HASH_TAG && !showConfirmRef.current && !isExitingRef.current) {
        armGuard();
      }
    };
    window.addEventListener("pointerup", onUserInteraction, { passive: true });
    window.addEventListener("touchend", onUserInteraction, { passive: true });

    // 하드웨어 뒤로가기 감지 (hashchange + popstate 2중 감지)
    const handleNavBack = () => {
      if (isExitingRef.current) return;

      // 동일 뒤로가기에 대해 브라우저가 popstate와 hashchange를 200ms 이내에 중복 발생시키는 현상 차단
      const now = Date.now();
      if (now - lastNavBackTimeRef.current < 200) {
        console.log("[ExitConfirmGuard] ignored duplicate browser event within 200ms");
        return;
      }
      lastNavBackTimeRef.current = now;

      console.log("[ExitConfirmGuard] back navigation detected! hash:", window.location.hash);

      // 모달이 이미 열려 있는 상태에서 한 번 더 뒤로가기를 누른 경우 -> 더블 백 즉시 앱 종료
      if (showConfirmRef.current) {
        console.log("[ExitConfirmGuard] double-back while modal open -> exit app");
        handleConfirmExit();
        return;
      }

      // 뒤로가기로 #ready 해시가 벗겨졌을 때 종료 확인 모달 표시
      if (window.location.hash !== HASH_TAG) {
        setShowConfirm(true);
      }
    };

    window.addEventListener("hashchange", handleNavBack);
    window.addEventListener("popstate", handleNavBack);

    return () => {
      window.removeEventListener("hashchange", handleNavBack);
      window.removeEventListener("popstate", handleNavBack);
      window.removeEventListener("pointerup", onUserInteraction);
      window.removeEventListener("touchend", onUserInteraction);
    };
  }, [pathname]);

  // [취소] 버튼 클릭: 모달을 닫고 #ready 가드 재적재
  function handleCancel() {
    setShowConfirm(false);
    try {
      if (window.location.hash !== "#ready") {
        window.history.pushState({ exitGuard: true }, "", "#ready");
      }
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

    // 2. 브라우저 창 닫기 시도
    try {
      window.close();
    } catch (e) {}

    // 3. 브라우저 세션 스택 최하단으로 back
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
