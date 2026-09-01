"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Row = {
  stage: string;
  daily_carbs_g: number | null;
  daily_protein_g: number | null;
  daily_fat_g: number | null;
  daily_fiber_g: number | null;
  key_nutrients: string[];
  source: string;
};

export function NutritionTargetEditForm({ target }: { target: Row }) {
  const router = useRouter();
  const [form, setForm] = useState({
    daily_carbs_g: target.daily_carbs_g ?? "",
    daily_protein_g: target.daily_protein_g ?? "",
    daily_fat_g: target.daily_fat_g ?? "",
    daily_fiber_g: target.daily_fiber_g ?? "",
    key_nutrients: target.key_nutrients.join(", "),
    source: target.source,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const res = await fetch(`/api/admin/nutrition-targets/${target.stage}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        daily_carbs_g: form.daily_carbs_g === "" ? null : Number(form.daily_carbs_g),
        daily_protein_g: form.daily_protein_g === "" ? null : Number(form.daily_protein_g),
        daily_fat_g: form.daily_fat_g === "" ? null : Number(form.daily_fat_g),
        daily_fiber_g: form.daily_fiber_g === "" ? null : Number(form.daily_fiber_g),
        key_nutrients: form.key_nutrients.split(",").map((s) => s.trim()).filter(Boolean),
        source: form.source,
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

  const numberFields: { key: "daily_carbs_g" | "daily_protein_g" | "daily_fat_g" | "daily_fiber_g"; label: string }[] = [
    { key: "daily_carbs_g", label: "하루 탄수화물(g)" },
    { key: "daily_protein_g", label: "하루 단백질(g)" },
    { key: "daily_fat_g", label: "하루 지방(g)" },
    { key: "daily_fiber_g", label: "하루 식이섬유(g)" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {numberFields.map((f) => (
        <div key={f.key}>
          <label className="mb-1 block text-xs font-bold text-ink-soft">{f.label}</label>
          <input
            type="number"
            value={form[f.key]}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
          />
        </div>
      ))}

      <div>
        <label className="mb-1 block text-xs font-bold text-ink-soft">핵심 영양소 (쉼표 구분)</label>
        <input
          value={form.key_nutrients}
          onChange={(e) => setForm({ ...form, key_nutrients: e.target.value })}
          className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold text-ink-soft">출처 (필수 — 임의로 비워두지 마세요)</label>
        <textarea
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
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
