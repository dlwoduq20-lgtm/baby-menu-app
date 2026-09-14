"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * 모바일 PWA 및 하이브리드 앱 뒤로가기 제스처/버튼 처리 컴포넌트
 */
export function AndroidBackHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handlePopState = () => {
      // Next.js App Router와 브라우저 히스토리 동기화 유지
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname, router]);

  return null;
}
