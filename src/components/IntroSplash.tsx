"use client";

import { useEffect, useState } from "react";

export function IntroSplash() {
  const [stage, setStage] = useState<"hidden" | "visible" | "leaving">("hidden");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("introShown")) return;
    sessionStorage.setItem("introShown", "true");
    setStage("visible");
    const leaveTimer = setTimeout(() => setStage("leaving"), 1200);
    const hideTimer = setTimeout(() => setStage("hidden"), 1600);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (stage === "hidden") return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-coral-deep transition-opacity duration-400 ${
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
