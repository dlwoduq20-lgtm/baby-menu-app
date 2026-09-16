"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function CenterLoadingOverlay() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement)?.closest("a");
      const href = anchor?.getAttribute("href");
      // 내부 이동(같은 오리진, #/새탭/외부링크 제외)이며 현재 경로와 다를 때만 표시
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("#") &&
        !anchor?.hasAttribute("target") &&
        href !== pathname
      ) {
        setLoading(true);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  useEffect(() => {
    // 경로가 실제로 바뀌었다는 건 다음 페이지가 준비돼서 전환됐다는 뜻 -> 오버레이 숨김
    setLoading(false);
  }, [pathname, searchParams]);

  // 네트워크 지연이나 취소 시 5초 후 자동 해제
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-[0.5px]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-coral-pale border-t-coral-deep" />
      </div>
    </div>
  );
}

