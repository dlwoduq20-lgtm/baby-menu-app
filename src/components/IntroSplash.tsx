"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

let hasShownIntro = false;

export function IntroSplash() {
  const pathname = usePathname();

  const [stage, setStage] = useState<"visible" | "leaving" | "hidden">(() => {
    if (typeof window !== "undefined") {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const lastShown = localStorage.getItem("introShownDate");
        if (hasShownIntro || lastShown === today || sessionStorage.getItem("introShown")) {
          return "hidden";
        }
      } catch (e) {}
    }
    return "hidden";
  });

  useEffect(() => {
    // 오직 루트 또는 홈 화면 진입 시에만 판정
    if (pathname !== "/home" && pathname !== "/") {
      setStage("hidden");
      return;
    }

    try {
      const today = new Date().toISOString().slice(0, 10);
      const lastShown = localStorage.getItem("introShownDate");
      if (hasShownIntro || lastShown === today || sessionStorage.getItem("introShown")) {
        setStage("hidden");
        return;
      }
      localStorage.setItem("introShownDate", today);
      sessionStorage.setItem("introShown", "true");
    } catch (e) {
      return;
    }
    hasShownIntro = true;

    // 오늘 첫 실행(콜드 런치) 시에만 잠깐 노출 후 즉시 페이드아웃
    setStage("visible");
    const leaveTimer = setTimeout(() => setStage("leaving"), 150);
    const hideTimer = setTimeout(() => setStage("hidden"), 400);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname]);

  if (stage === "hidden") return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-coral transition-opacity duration-400 ${
        stage === "leaving" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="animate-intro-pop flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-xl">
        <span className="text-4xl">🍚</span>
      </div>
      <p className="animate-intro-fade mt-5 font-display text-lg text-white">오늘 뭐 먹이지</p>
    </div>
  );
}

