"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // 서비스워커 등록 실패는 조용히 무시 — 앱 자체 사용에는 영향 없음 (오프라인/설치만 제한됨)
      });
    }
  }, []);

  return null;
}
