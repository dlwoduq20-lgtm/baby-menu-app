"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { calcAgeInMonths } from "@/lib/babyAge";

export default function BabyProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"female" | "male" | "unspecified">("unspecified");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agePreview = useMemo(() => {
    if (!birthDate) return null;
    try {
      return calcAgeInMonths(birthDate);
    } catch {
      return null;
    }
  }, [birthDate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !birthDate) {
      setError("이름과 생년월일을 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("로그인이 만료됐어요. 다시 로그인해 주세요.");
      setSubmitting(false);
      router.push("/login");
      return;
    }

    const { data, error: insertError } = await supabase
      .from("babies")
      .insert({ user_id: user.id, name: name.trim(), birth_date: birthDate, gender })
      .select()
      .single();

    setSubmitting(false);

    if (insertError || !data) {
      setError(`저장 중 문제가 발생했어요: ${insertError?.message ?? "알 수 없는 오류"}`);
      return;
    }

    router.push(`/onboarding/allergy?babyId=${data.id}`);
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-cream px-6 pb-10 pt-11">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-coral" />
          <span className="h-1.5 w-1.5 rounded-full bg-line" />
          <span className="h-1.5 w-1.5 rounded-full bg-line" />
        </div>
      </div>

      <h1 className="mb-1.5 font-display text-xl leading-snug">
        우리 아기를
        <br />
        소개해 주세요
      </h1>
      <p className="mb-6 text-[13.5px] text-ink-soft">월령에 딱 맞는 메뉴만 추천해 드릴게요.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-1.5 block text-[13px] font-bold text-ink-soft">아기 이름</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예) 하은"
            className="w-full rounded-2xl border border-line bg-white px-3.5 py-3 text-[14.5px]"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-[13px] font-bold text-ink-soft">생년월일</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full rounded-2xl border border-line bg-white px-3.5 py-3 text-[14.5px]"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-[13px] font-bold text-ink-soft">성별</label>
          <div className="flex gap-2">
            {[
              { v: "female", label: "여아" },
              { v: "male", label: "남아" },
              { v: "unspecified", label: "비공개" },
            ].map((opt) => (
              <button
                key={opt.v}
                type="button"
                onClick={() => setGender(opt.v as typeof gender)}
                className={`flex-1 rounded-2xl border py-3 text-[14px] ${
                  gender === opt.v
                    ? "border-coral bg-coral-pale font-bold text-coral-deep"
                    : "border-line bg-white text-ink-soft"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {agePreview !== null && (
          <div className="mb-2 rounded-xl bg-mint-pale px-3.5 py-2.5 text-xs">
            👶 {birthDate}생 {name || "아기"}는 오늘 기준 <b>{agePreview}개월</b>이에요. (달력 기준 정확 계산)
          </div>
        )}
        {error && <div className="mb-2 text-xs text-coral-deep">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full rounded-pill bg-ink py-3.5 text-[15px] font-bold text-white disabled:opacity-60"
        >
          {submitting ? "저장 중..." : "다음"}
        </button>
      </form>
    </div>
  );
}
