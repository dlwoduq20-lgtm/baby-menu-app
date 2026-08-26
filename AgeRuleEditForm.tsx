"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AgeRuleRow = {
  stage: string;
  recommended_food_groups: string[];
  texture: string;
  food_size_guide: string;
  cooking_method: string;
  avoid_foods: string[];
  caution_foods: string[];
  allergy_caution: string | null;
  choking_hazard_foods: string[];
};

const toCsv = (arr: string[]) => arr.join(", ");
const fromCsv = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

export function AgeRuleEditForm({ rule }: { rule: AgeRuleRow }) {
  const router = useRouter();
  const [form, setForm] = useState({
    recommended_food_groups: toCsv(rule.recommended_food_groups),
    texture: rule.texture,
    food_size_guide: rule.food_size_guide,
    cooking_method: rule.cooking_method,
    avoid_foods: toCsv(rule.avoid_foods),
    caution_foods: toCsv(rule.caution_foods),
    allergy_caution: rule.allergy_caution ?? "",
    choking_hazard_foods: toCsv(rule.choking_hazard_foods),
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const res = await fetch(`/api/admin/age-rules/${rule.stage}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recommended_food_groups: fromCsv(form.recommended_food_groups),
        texture: form.texture,
        food_size_guide: form.food_size_guide,
        cooking_method: form.cooking_method,
        avoid_foods: fromCsv(form.avoid_foods),
        caution_foods: fromCsv(form.caution_foods),
        allergy_caution: form.allergy_caution || null,
        choking_hazard_foods: fromCsv(form.choking_hazard_foods),
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

  const fields: { key: keyof typeof form; label: string; multiline?: boolean }[] = [
    { key: "recommended_food_groups", label: "권장 식품군 (쉼표 구분)" },
    { key: "texture", label: "식감" },
    { key: "food_size_guide", label: "음식 크기 가이드" },
    { key: "cooking_method", label: "조리 방법" },
    { key: "avoid_foods", label: "피해야 하는 음식 (쉼표 구분)" },
    { key: "caution_foods", label: "주의해야 하는 음식 (쉼표 구분)" },
    { key: "allergy_caution", label: "알레르기 주의 설명", multiline: true },
    { key: "choking_hazard_foods", label: "질식 위험 음식 (쉼표 구분)" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="mb-1 block text-xs font-bold text-ink-soft">{f.label}</label>
          {f.multiline ? (
            <textarea
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              rows={2}
              className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
            />
          ) : (
            <input
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
            />
          )}
        </div>
      ))}

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
