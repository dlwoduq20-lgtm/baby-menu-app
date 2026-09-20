"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { calcAgeInMonths, formatBabyAge, getDetailedStageLabel } from "@/lib/babyAge";

function BabyProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [existingBabyId, setExistingBabyId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"female" | "male" | "unspecified">("unspecified");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const modeParam = searchParams.get("mode");
      const { data: babies } = await supabase
        .from("babies")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (babies && babies.length > 0) {
        const baby = babies[0];
        setExistingBabyId(baby.id);
        setName(baby.name);
        setBirthDate(baby.birth_date);
        setGender((baby.gender as any) ?? "unspecified");
        if (modeParam === "edit" || babies.length > 0) {
          setIsEditMode(true);
        }
      }
      setLoading(false);
    }
    load();
  }, [supabase, searchParams]);

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

    if (isEditMode && existingBabyId) {
      // 기존 아기 정보 업데이트
      const { error: updateError } = await supabase
        .from("babies")
        .update({
          name: name.trim(),
          birth_date: birthDate,
          gender,
        })
        .eq("id", existingBabyId);

      setSubmitting(false);

      if (updateError) {
        setError(`저장 중 문제가 발생했어요: ${updateError.message}`);
        return;
      }

      router.push("/mypage");
      router.refresh();
      return;
    }

    // 신규 온보딩 등록
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

  if (loading) {
    return (
      <div className="mx-auto min-h-screen max-w-[430px] bg-cream px-6 pb-10 pt-11">
        <div className="py-20 text-center text-sm text-ink-soft">불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-cream px-6 pb-10 pt-11">
      {/* 상단 네비게이션 / 스텝 인디케이터 */}
      <div className="mb-6 flex items-center justify-between">
        {isEditMode ? (
          <Link
            href="/mypage"
            className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white text-sm shadow-sm transition-transform active:scale-95"
          >
            ←
          </Link>
        ) : (
          <div className="flex gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-coral" />
            <span className="h-1.5 w-1.5 rounded-full bg-line" />
            <span className="h-1.5 w-1.5 rounded-full bg-line" />
          </div>
        )}
      </div>

      <h1 className="mb-1.5 font-display text-xl leading-snug">
        {isEditMode ? "아기 프로필 수정" : <>우리 아기를<br />소개해 주세요</>}
      </h1>
      <p className="mb-6 text-[13.5px] text-ink-soft">
        {isEditMode
          ? "아기 정보를 수정하면 맞춤 식단 및 추천 기준이 새로 갱신돼요."
          : "월령에 딱 맞는 메뉴만 추천해 드릴게요."}
      </p>

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
            👶 {birthDate}생 {name || "아이"}는 오늘 기준 <b>{formatBabyAge(agePreview)}</b> ({getDetailedStageLabel(agePreview)})이에요.
          </div>
        )}
        {error && <div className="mb-2 text-xs text-coral-deep">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full rounded-pill bg-ink py-3.5 text-[15px] font-bold text-white disabled:opacity-60 transition-transform active:scale-[0.99]"
        >
          {submitting ? "저장 중..." : isEditMode ? "수정 완료" : "다음"}
        </button>
      </form>
    </div>
  );
}

export default function BabyProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto min-h-screen max-w-[430px] bg-cream px-6 pb-10 pt-11">
          <div className="py-20 text-center text-sm text-ink-soft">불러오는 중...</div>
        </div>
      }
    >
      <BabyProfileForm />
    </Suspense>
  );
}
