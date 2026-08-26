"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ALLERGY_OPTIONS = ["계란", "우유", "밀", "대두", "땅콩", "갑각류", "견과류", "복숭아"];
const AVOID_OPTIONS = ["브로콜리", "가지", "버섯", "파프리카", "고수"];

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-pill border px-3.5 py-2 text-[13px] ${
        active ? "border-coral bg-coral-pale font-bold text-coral-deep" : "border-line bg-white text-ink-soft"
      }`}
    >
      {label}
    </button>
  );
}

function AllergyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const babyId = searchParams.get("babyId");
  const supabase = createClient();

  const [allergies, setAllergies] = useState<string[]>([]);
  const [avoided, setAvoided] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function handleNext() {
    if (!babyId) {
      setError("아기 정보를 먼저 등록해 주세요.");
      return;
    }
    setSubmitting(true);
    setError(null);

    if (allergies.length > 0) {
      const { error: allergyError } = await supabase
        .from("baby_allergies")
        .insert(allergies.map((allergen) => ({ baby_id: babyId, allergen })));
      if (allergyError) {
        setError(`알레르기 저장 실패: ${allergyError.message}`);
        setSubmitting(false);
        return;
      }
    }

    if (avoided.length > 0) {
      const { error: prefError } = await supabase
        .from("baby_preferences")
        .insert(avoided.map((food_name) => ({ baby_id: babyId, food_name, preference_type: "not_eaten" as const })));
      if (prefError) {
        setError(`선호도 저장 실패: ${prefError.message}`);
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(false);
    router.push(`/onboarding/ingredients?babyId=${babyId}`);
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-cream px-6 pb-10 pt-11">
      <div className="mb-6 flex gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-coral" />
        <span className="h-1.5 w-1.5 rounded-full bg-coral" />
        <span className="h-1.5 w-1.5 rounded-full bg-line" />
      </div>

      <h1 className="mb-1.5 font-display text-xl leading-snug">
        주의해야 할
        <br />
        음식이 있나요?
      </h1>
      <p className="mb-6 text-[13.5px] text-ink-soft">알레르기와 못 먹는 음식은 추천에서 자동으로 제외돼요.</p>

      <label className="mb-2 block text-[13px] font-bold text-ink-soft">알레르기</label>
      <div className="mb-6 flex flex-wrap gap-2">
        {ALLERGY_OPTIONS.map((f) => (
          <Chip key={f} label={f} active={allergies.includes(f)} onClick={() => toggle(allergies, setAllergies, f)} />
        ))}
      </div>

      <label className="mb-2 block text-[13px] font-bold text-ink-soft">먹지 않는 음식</label>
      <div className="mb-6 flex flex-wrap gap-2">
        {AVOID_OPTIONS.map((f) => (
          <Chip key={f} label={f} active={avoided.includes(f)} onClick={() => toggle(avoided, setAvoided, f)} />
        ))}
      </div>

      {error && <div className="mb-3 text-xs text-coral-deep">{error}</div>}

      <button
        onClick={handleNext}
        disabled={submitting}
        className="w-full rounded-pill bg-ink py-3.5 text-[15px] font-bold text-white disabled:opacity-60"
      >
        {submitting ? "저장 중..." : "다음"}
      </button>
    </div>
  );
}

export default function AllergyPage() {
  return (
    <Suspense fallback={null}>
      <AllergyForm />
    </Suspense>
  );
}
