"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// 이모지 대신 SVG 아이콘을 쓴다 — 기기/브라우저별 이모지 폰트 차이로 깨져 보이는 문제를 피하기 위함.
const ICONS: Record<string, JSX.Element> = {
  like: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 20.5s-7.5-4.6-9.5-9C1 8 2.8 4.5 6.2 4.5c2 0 3.6 1.2 4.3 2.8.7-1.6 2.3-2.8 4.3-2.8 3.4 0 5.2 3.5 3.7 7-2 4.4-9.5 9-9.5 9z" />
    </svg>
  ),
  dislike: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M7 14V4M7 14l3 6a2 2 0 0 0 2-2v-4h5a2 2 0 0 0 2-2.3L18 6a2 2 0 0 0-2-1.7H9.5A2.5 2.5 0 0 0 7 7" />
    </svg>
  ),
  cooked: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="13" r="7" />
      <path d="M18 8l3-3M4 21l4-4" />
    </svg>
  ),
  reroll: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" />
    </svg>
  ),
};

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
      <path d="M12 2.5l2.9 6.3 6.9.7-5.1 4.8 1.4 6.8L12 17.8 5.9 21.1l1.4-6.8-5.1-4.8 6.9-.7L12 2.5z" />
    </svg>
  );
}

export function FeedbackBar({ recipeId, initialFavorited }: { recipeId: string; initialFavorited: boolean }) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [justSent, setJustSent] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function sendFeedback(type: "like" | "dislike" | "cooked" | "reroll") {
    setBusy(true);
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId, type }),
    });
    setBusy(false);
    if (res.ok) {
      setJustSent(type);
      if (type === "reroll") router.push("/home");
    }
  }

  async function toggleFavorite() {
    setBusy(true);
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId }),
    });
    setBusy(false);
    if (res.ok) {
      const data = await res.json();
      setFavorited(data.favorited);
    }
  }

  const buttons: { type: "like" | "dislike" | "cooked" | "reroll"; label: string }[] = [
    { type: "like", label: "좋아요" },
    { type: "dislike", label: "별로예요" },
    { type: "cooked", label: "만들어봤어요" },
    { type: "reroll", label: "다시 추천받기" },
  ];

  return (
    <div className="px-5 pb-2 pt-4.5">
      <div className="mb-2 flex justify-between gap-2">
        {buttons.map((b) => (
          <button
            key={b.type}
            onClick={() => sendFeedback(b.type)}
            disabled={busy}
            className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border py-2.5 text-[11px] ${
              justSent === b.type ? "border-coral bg-coral-pale text-coral-deep" : "border-line bg-white text-ink-soft"
            }`}
          >
            <span className="h-[18px] w-[18px]">{ICONS[b.type]}</span>
            {b.label}
          </button>
        ))}
        <button
          onClick={toggleFavorite}
          disabled={busy}
          className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border py-2.5 text-[11px] ${
            favorited ? "border-yellow bg-yellow-pale text-[#8A5E12]" : "border-line bg-white text-ink-soft"
          }`}
        >
          <span className="h-[18px] w-[18px]">
            <StarIcon filled={favorited} />
          </span>
          {favorited ? "즐겨찾기됨" : "즐겨찾기"}
        </button>
      </div>
    </div>
  );
}
