import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[430px] flex-col justify-center bg-cream px-6 text-center">
      <div className="mx-auto mb-4 flex h-[74px] w-[74px] items-center justify-center rounded-[24px] bg-coral-pale text-3xl">
        🍚
      </div>
      <h1 className="font-display text-2xl leading-relaxed">
        매일 오후 4시,
        <br />
        우리 아기 <span className="text-coral-deep">오늘 저녁</span>을
        <br />
        알려드려요
      </h1>
      <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
        월령과 냉장고 속 재료를 확인해서
        <br />
        딱 맞는 메뉴 2가지를 골라드릴게요.
      </p>

      <Link
        href="/login"
        className="mt-8 rounded-pill bg-ink py-3.5 text-[15px] font-bold text-white"
      >
        시작하기
      </Link>
    </div>
  );
}
