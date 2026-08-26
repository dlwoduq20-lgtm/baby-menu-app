"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

  const buttons: { type: "like" | "dislike" | "cooked" | "reroll"; label: string; icon: string }[] = [
    { type: "like", label: "좋아요", icon: "❤️" },
    { type: "dislike", label: "별로예요", icon: "👎" },
    { type: "cooked", label: "만들어봤어요", icon: "🍳" },
    { type: "reroll", label: "다시 추천받기", icon: "🔄" },
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
            <span className="text-base">{b.icon}</span>
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
          <span className="text-base">⭐</span>
          {favorited ? "즐겨찾기됨" : "즐겨찾기"}
        </button>
      </div>
    </div>
  );
}
