/**
 * 앱 환경 감지 유틸리티 (네이티브 웹뷰 / TWA / Standalone PWA)
 */

export function isTwaEnvironment(): boolean {
  if (typeof window === "undefined") return false;

  // 1. 이미 세션에 앱으로 판별된 기록이 있는 경우 (앱 내 화면 이동 시 유지)
  if (sessionStorage.getItem("is_twa") === "true") {
    return true;
  }

  // 2. 네이티브 웹뷰 앱 확인 (User-Agent 또는 AndroidApp JavascriptInterface)
  const isNativeApp =
    navigator.userAgent.includes("BabyMenuApp") ||
    Boolean((window as any).AndroidApp) ||
    Boolean((window as any).isBabyMenuApp);

  // 3. Android TWA 최초 진입 시 전달되는 리퍼러 확인
  // TWA 런처는 "android-app://com.jy.babymenu" 형태의 리퍼러로 시작합니다.
  const referrer = document.referrer || "";
  const isAndroidAppReferrer = referrer.startsWith("android-app://");

  // 4. 디스플레이 모드가 standalone(독립형 창)인지 확인
  const isStandaloneMatch = window.matchMedia("(display-mode: standalone)").matches;
  const isNavigatorStandalone = Boolean((navigator as any).standalone);

  const isApp = isNativeApp || isAndroidAppReferrer || isStandaloneMatch || isNavigatorStandalone;

  if (isApp) {
    sessionStorage.setItem("is_twa", "true");
  }

  return isApp;
}
