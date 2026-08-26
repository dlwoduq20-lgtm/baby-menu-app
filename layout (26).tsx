import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RegisterServiceWorker } from "@/components/RegisterServiceWorker";

// STEP 12: PWA 설치를 위한 manifest 연결 + iOS 홈 화면 아이콘/상태바 메타데이터
export const metadata: Metadata = {
  title: "오늘 뭐 먹이지",
  description: "우리 아기 월령과 집에 있는 재료로 오늘 저녁 메뉴를 추천해요.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "오늘뭐먹이지",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF8A65",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
