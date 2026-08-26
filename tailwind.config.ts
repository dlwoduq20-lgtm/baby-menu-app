import type { Config } from "tailwindcss";

// 디자인 토큰: baby-dinner-app-mockup.html / -onboarding.html 과 동일한 값
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8F0",
        "cream-deep": "#FCEBDA",
        coral: "#FF8A65",
        "coral-deep": "#F26B3A",
        "coral-pale": "#FFE4D8",
        mint: "#5FB98C",
        "mint-pale": "#E3F4EA",
        yellow: "#FFC94D",
        "yellow-pale": "#FFF3D6",
        ink: "#3B2E28",
        "ink-soft": "#8F8078",
        line: "#F0E4D8",
      },
      fontFamily: {
        display: ["var(--font-jua)", "sans-serif"], // 제목용 (둥근 느낌)
        body: ["var(--font-gowun)", "sans-serif"],   // 본문용
      },
      borderRadius: {
        card: "26px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 14px 30px -18px rgba(59,46,40,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
