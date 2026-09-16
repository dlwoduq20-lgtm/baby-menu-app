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

    console.log("[ExitConfirmGuard] mounted on pathname:", pathname);

    let hasActivatedWithGesture = false;

    // 1. 홈 진입 시 초기 가드 엔트리 적재
    const pushGuard = (force = false) => {
      try {
        if (force || !window.history.state?.exitGuard) {
          window.history.pushState({ exitGuard: true, t: Date.now() }, "", window.location.href);
          console.log("[ExitConfirmGuard] pushed exitGuard state, force:", force);
        }
      } catch (e) {}
    };

    pushGuard(false);

    // 2. 사용자의 첫 터치/클릭 인터랙션 발생 시!
    // 크롬의 History Manipulation Intervention은 사용자 제스처 없이 push된 엔트리를 뒤로가기 시 스킵합니다.
    // 사용자가 화면을 터치하는 순간, 실제 사용자 제스처 컨텍스트 안에서 새 가드 엔트리를 강제로 pushState하여
    // 브라우저가 이 엔트리를 '유효한 네비게이션'으로 인식하도록 만듭니다.
    const onUserInteraction = () => {
      if (!hasActivatedWithGesture) {
        hasActivatedWithGesture = true;
        pushGuard(true);
      }
    };
    window.addEventListener("pointerdown", onUserInteraction, { passive: true });
    window.addEventListener("touchstart", onUserInteraction, { passive: true });
    window.addEventListener("click", onUserInteraction, { passive: true });

    function handlePopState(e: PopStateEvent) {
      console.log("[ExitConfirmGuard] popstate fired!", {
        state: e.state,
        historyLength: window.history.length,
      });

      setShowConfirm((prev) => {
        if (prev) {
          // 이미 팝업이 떠 있는 상태에서 또 뒤로가기를 누르면 즉시 앱 종료
          console.log("[ExitConfirmGuard] second back pressed while modal open -> exit");
          handleConfirmExit();
          return false;
        }
        // 첫 뒤로가기: 트랩 유지 후 팝업 노출
        pushGuard(true);
        return true;
      });
    }

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pointerdown", onUserInteraction);
      window.removeEventListener("touchstart", onUserInteraction);
      window.removeEventListener("click", onUserInteraction);
    };
  }, [pathname]);

  function handleConfirmExit() {
    console.log("[ExitConfirmGuard] handleConfirmExit called");
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
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/40 px-8 backdrop-blur-[1px]">
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
