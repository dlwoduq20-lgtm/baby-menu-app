// STEP 10: 오후 4시 푸시 수신. STEP 12: 오프라인 캐싱 + 홈 화면 설치 지원 추가.

const CACHE_NAME = "baby-menu-app-v15";
const PRECACHE_URLS = [
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/favicon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll(PRECACHE_URLS).catch((err) => {
          console.warn("[SW] Precache non-fatal warning:", err);
        })
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

// 페이지 이동: 네트워크 우선, 오프라인이면 해당 페이지 캐시 -> 없으면 통과
// 정적 자산(js/css/이미지): 캐시 우선, 없으면 네트워크 요청 후 캐시에 저장
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const isNavigation = request.mode === "navigate";

  if (isNavigation) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok && new URL(request.url).origin === self.location.origin) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
    )
  );
});

self.addEventListener("push", (event) => {
  let payload = { title: "오늘 저녁 뭐 먹일지 정하셨나요? 🍽️", body: "지금 확인하기", url: "/home" };
  try {
    if (event.data) payload = { ...payload, ...event.data.json() };
  } catch (e) {
    // JSON이 아니면 기본 payload 사용
  }

  const title = payload.title || "오늘 뭐 먹이지 🍽️";
  const options = {
    body: payload.body || "오늘의 저녁 메뉴를 확인해 보세요!",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [200, 100, 200],
    tag: "dinner-push",
    renotify: true,
    requireInteraction: true,
    data: { url: payload.url || "/home" },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const rawUrl = event.notification.data?.url || "/home";
  const targetUrl = new URL(rawUrl, self.location.origin).href;

  event.waitUntil(
    (async () => {
      // 1. 열려 있는 모든 창 검색 (포커스 가능한 TWA 창 포함)
      const clientList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      // 2. 이미 열려 있는 창이 있는 경우: 해당 창 포커스 후 대상 URL로 이동
      for (const client of clientList) {
        if (client.url && client.url.startsWith(self.location.origin)) {
          if ("focus" in client) {
            await client.focus();
          }
          if ("navigate" in client) {
            return await client.navigate(targetUrl);
          }
          return;
        }
      }

      // 3. 열려 있는 창이 없는 경우: URL로 새 창 열기 (Android App Links를 통해 TWA로 열림)
      if (self.clients.openWindow) {
        return await self.clients.openWindow(targetUrl);
      }
    })()
  );
});
