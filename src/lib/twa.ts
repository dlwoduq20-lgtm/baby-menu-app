/**
 * TWA (Trusted Web Activity) / Standalone 앱 환경 감지 유틸리티
 */

export function isTwaEnvironment(): boolean {
  if (typeof window === "undefined") return false;

  // 1. 이미 세션에 TWA로 판별된 기록이 있는 경우 (앱 내 화면 이동 시 유지)
  if (sessionStorage.getItem("is_twa") === "true") {
    return true;
  }

  // 2. Android TWA 최초 진입 시 전달되는 리퍼러 확인
  // TWA 런처는 "android-app://com.jy.babymenu" 형태의 리퍼러로 시작합니다.
  const referrer = document.referrer || "";
  const isAndroidAppReferrer = referrer.startsWith("android-app://");

  // 3. 디스플레이 모드가 standalone(독립형 창)인지 확인
  const isStandaloneMatch = window.matchMedia("(display-mode: standalone)").matches;
  const isNavigatorStandalone = Boolean((navigator as any).standalone);

  const isTwa = isAndroidAppReferrer || isStandaloneMatch || isNavigatorStandalone;

  if (isTwa) {
    sessionStorage.setItem("is_twa", "true");
  }

  return isTwa;
}
