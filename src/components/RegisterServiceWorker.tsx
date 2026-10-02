"use client";

import { useEffect } from "react";
import { isTwaEnvironment } from "@/lib/twa";

export function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTwa = isTwaEnvironment();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // 최신 서비스워커 변경 사항 즉시 감지 및 갱신
          reg.update().catch(() => {});

          // 일반 브라우저(PC/모바일 웹 탭) 환경인 경우 기존에 남아있는 푸시 구독 자동 해제 및 정리
          if (!isTwa) {
            reg.pushManager.getSubscription().then(async (sub) => {
              if (sub) {
                try {
                  await sub.unsubscribe();
                  await fetch("/api/push/subscribe", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ endpoint: sub.endpoint }),
                  });
                } catch (err) {
                  console.warn("[SW] Non-TWA push subscription cleanup failed:", err);
                }
              }
            }).catch(() => {});
          }
        })
        .catch(() => {
          // 서비스워커 등록 실패는 조용히 무시
        });

      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  return null;
}
