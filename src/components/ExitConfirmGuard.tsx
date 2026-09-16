"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export function ExitConfirmGuard() {
  const pathname = usePathname();
  const [showConfirm, setShowConfirm] = useState(false);
  const showConfirmRef = useRef(false);

  useEffect(() => {
    showConfirmRef.current = showConfirm;
  }, [showConfirm]);

  useEffect(() => {
    if (pathname !== "/home") {
      setShowConfirm(false);
      return;
    }

    console.log("[ExitConfirmGuard] mounted on pathname:", pathname);

    let hasActivatedWithGesture = false;

    // 1. Next.js 내부 상태(__NA, __PRIVATE_NEXTJS_INTERNALS_TREE 등)를 반드시 보존하며 push
    const pushGuard = () => {
      try {
        const curState = window.history.state || {};
        window.history.pushState(
          { ...curState, exitGuard: true, t: Date.now() },
          "",
          window.location.href
        );
        console.log("[ExitConfirmGuard] pushed exitGuard state (Next.js state preserved)");
      } catch (e) {}
    };

    // 마운트 시 가드 적재
    pushGuard();

    // 2. 사용자의 첫 터치/클릭 시 실제 브라우저 User Gesture 활성화 컨텍스트에서 가드 적재
    // 크롬의 History Manipulation Intervention(비활성 히스토리 스킵 정책)을 통과하도록 보장
    const onUserInteraction = () => {
      if (!hasActivatedWithGesture) {
        hasActivatedWithGesture = true;
        pushGuard();
      }
    };

    window.addEventListener("pointerdown", onUserInteraction, { passive: true });
    window.addEventListener("touchstart", onUserInteraction, { passive: true });
    window.addEventListener("click", onUserInteraction, { passive: true });

    // 3. 하드웨어 뒤로가기 popstate 처리
    function handlePopState(e: PopStateEvent) {
      console.log("[ExitConfirmGuard] popstate fired!", {
        state: e.state,
        historyLength: window.history.length,
        isConfirmOpen: showConfirmRef.current,
      });

      if (showConfirmRef.current) {
        // 이미 종료 팝업이 열려 있는 상태에서 한 번 더 뒤로가기를 누른 경우:
        // 모달을 닫고 기본 브라우저 뒤로가기 흐름을 그대로 두어 앱이 자연스럽게 종료됩니다.
        console.log("[ExitConfirmGuard] second back while modal open -> natural app exit");
        setShowConfirm(false);
        return;
      }

      // 첫 뒤로가기: 종료 확인 모달을 화면에 표시
      // ※ popstate 실행 중에 동기적으로 pushState를 호출하면 Next.js 라우터와 충돌하여
      //    페이지 리로드/언마운트가 발생하므로, 모달만 띄우고 가드는 취소 시에 재적재합니다.
      setShowConfirm(true);
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pointerdown", onUserInteraction);
      window.removeEventListener("touchstart", onUserInteraction);
      window.removeEventListener("click", onUserInteraction);
    };
  }, [pathname]);

  // [취소] 버튼 클릭: 모달을 닫고 가드 히스토리 1개 재적재
  function handleCancel() {
    setShowConfirm(false);
    try {
      const curState = window.history.state || {};
      window.history.pushState(
        { ...curState, exitGuard: true, t: Date.now() },
        "",
        window.location.href
      );
    } catch (e) {}
  }

  // [확인] 버튼 클릭: 앱 종료
  function handleConfirmExit() {
    setShowConfirm(false);
    try {
      window.close();
    } catch (e) {}
    window.history.back();
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
