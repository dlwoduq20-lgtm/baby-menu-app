"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RecipeRow } from "@/lib/types/recipe";
import { AgeStage } from "@/lib/babyAge";

const STAGES: AgeStage[] = ["0-5", "6-8", "9-11", "12-17", "18-23", "24+"];

export function RecipeEditForm({ recipe }: { recipe: RecipeRow }) {
  const router = useRouter();
  const [form, setForm] = useState({
    min_age_stage: recipe.min_age_stage,
    cook_minutes: recipe.cook_minutes,
    difficulty: recipe.difficulty,
    is_quick: recipe.is_quick,
    allergens: recipe.allergens.join(", "),
    choking_hazard_note: recipe.choking_hazard_note ?? "",
    caution_note: recipe.caution_note ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const res = await fetch(`/api/admin/recipes/${recipe.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        allergens: form.allergens
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("저장됐어요.");
      router.refresh();
    } else {
      setMessage("저장 중 문제가 발생했어요.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-xs font-bold text-ink-soft">최소 추천 월령</label>
        <select
          value={form.min_age_stage}
          onChange={(e) => setForm({ ...form, min_age_stage: e.target.value as AgeStage })}
          className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-bold text-ink-soft">조리시간(분)</label>
          <input
            type="number"
            value={form.cook_minutes}
            onChange={(e) => setForm({ ...form, cook_minutes: Number(e.target.value) })}
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs font-bold text-ink-soft">난이도(1~3)</label>
          <input
            type="number"
            min={1}
            max={3}
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: Number(e.target.value) as 1 | 2 | 3 })}
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 self-end pb-2.5 text-xs">
          <input
            type="checkbox"
            checked={form.is_quick}
            onChange={(e) => setForm({ ...form, is_quick: e.target.checked })}
          />
          초간편 메뉴
        </label>
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold text-ink-soft">알레르기 유발 식품 (쉼표로 구분)</label>
        <input
          value={form.allergens}
          onChange={(e) => setForm({ ...form, allergens: e.target.value })}
          placeholder="예: 계란, 우유"
          className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold text-ink-soft">질식 위험 안내</label>
        <textarea
          value={form.choking_hazard_note}
          onChange={(e) => setForm({ ...form, choking_hazard_note: e.target.value })}
          rows={2}
          className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold text-ink-soft">기타 주의사항</label>
        <textarea
          value={form.caution_note}
          onChange={(e) => setForm({ ...form, caution_note: e.target.value })}
          rows={2}
          className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-pill bg-ink py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {saving ? "저장 중..." : "저장"}
      </button>
      {message && <div className="text-xs text-ink-soft">{message}</div>}
    </div>
  );
}
