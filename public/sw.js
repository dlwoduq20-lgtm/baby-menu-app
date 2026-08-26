// STEP 10: 지금은 오후 4시 푸시 수신용 최소 기능만 담당한다.
// 오프라인 캐싱/설치(manifest) 관련 로직은 STEP 12에서 이 파일에 추가한다.

self.addEventListener("push", (event) => {
  let payload = { title: "오늘 저녁 뭐 먹일지 정하셨나요? 🍽️", body: "지금 확인하기", url: "/home" };
  try {
    if (event.data) payload = { ...payload, ...event.data.json() };
  } catch (e) {
    // JSON이 아니면 기본 payload 사용
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { url: payload.url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/home";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
