import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-cream px-6 pb-16 pt-11">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/landing" className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-sm shadow-sm">
          ←
        </Link>
        <h1 className="font-display text-lg">개인정보처리방침</h1>
      </div>

      <div className="flex flex-col gap-5 text-[13px] leading-relaxed text-ink">
        <p className="text-ink-soft">
          시행일: 2026년 9월 10일<br />
          &quot;오늘 뭐 먹이지&quot;(이하 &quot;서비스&quot;)를 운영하는 JY(이하 &quot;운영자&quot;)는 이용자의 개인정보를 중요하게 생각하며,
          관련 법령을 준수하기 위해 다음과 같이 개인정보처리방침을 수립·공개합니다.
        </p>

        <section>
          <h2 className="mb-1.5 font-display text-[14px]">1. 수집하는 개인정보 항목</h2>
          <p className="mb-1">
            서비스는 회원 가입 및 아기 저녁 메뉴 추천 기능 제공을 위해 아래 정보를 수집합니다.
          </p>
          <ul className="list-disc pl-4">
            <li>소셜 로그인(카카오, 구글, 네이버)을 통한 이메일 주소, 이름(선택 제공 시)</li>
            <li>보호자가 직접 입력하는 아기 정보: 이름(애칭), 생년월일, 성별, 알레르기 식품, 못 먹는 음식, 선호 음식</li>
            <li>현재 보유 식재료 목록</li>
            <li>서비스 이용 기록: 추천 메뉴 히스토리, 좋아요/즐겨찾기/피드백 기록</li>
            <li>알림 수신을 위한 브라우저 푸시 구독 정보</li>
            <li>자동 수집 정보: 접속 로그, 쿠키, 기기 정보</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-1.5 font-display text-[14px]">2. 개인정보의 수집 및 이용 목적</h2>
          <ul className="list-disc pl-4">
            <li>회원 식별 및 로그인 상태 유지</li>
            <li>아기 월령·알레르기·보유 재료를 고려한 맞춤 식단 추천 제공</li>
            <li>오후 4시 및 매주 토요일 알림 발송</li>
            <li>서비스 개선을 위한 이용 통계 분석 (개인 식별 없이 처리)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-1.5 font-display text-[14px]">3. 아기(자녀) 정보에 관한 안내</h2>
          <p>
            아기의 생년월일, 알레르기 등 정보는 보호자인 회원 본인이 서비스 이용 목적으로 직접 입력하는 정보입니다.
            해당 정보는 오직 맞춤 메뉴 추천 계산에만 사용되며, 보호자 본인 외 제3자에게 공개되지 않습니다.
            보호자는 언제든 아기 정보를 수정하거나 삭제할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 font-display text-[14px]">4. 보유 및 이용 기간</h2>
          <p>
            회원 탈퇴 시 지체 없이 파기합니다. 단, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 별도 보관합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 font-display text-[14px]">5. 개인정보의 제3자 제공</h2>
          <p>
            운영자는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 법령에 근거가 있거나
            수사기관이 적법한 절차에 따라 요청하는 경우는 예외로 합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 font-display text-[14px]">6. 개인정보 처리위탁</h2>
          <p className="mb-1">서비스 운영을 위해 아래와 같이 개인정보 처리를 위탁하고 있습니다.</p>
          <ul className="list-disc pl-4">
            <li>Supabase Inc. — 회원 데이터베이스 및 인증 처리</li>
            <li>Vercel Inc. — 웹 서비스 호스팅</li>
            <li>Anthropic PBC — 맞춤 메뉴 최종 선택을 위한 AI 처리 (개인 식별 정보 제외, 아기 월령·보유재료 등 비식별 정보만 전달)</li>
            <li>카카오, Google, 네이버 — 소셜 로그인 인증</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-1.5 font-display text-[14px]">7. 이용자의 권리</h2>
          <p>
            이용자는 언제든 본인의 개인정보 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다.
            앱 내 &quot;마이&quot; 화면에서 직접 수정·삭제하거나, 아래 연락처로 요청해 주시면 지체 없이 조치합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 font-display text-[14px]">8. 개인정보 보호책임자</h2>
          <p>
            성명: JY<br />
            이메일: dlwoduq20@gmail.com<br />
            개인정보 관련 문의는 위 이메일로 연락해 주시기 바랍니다.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 font-display text-[14px]">9. 고지의 의무</h2>
          <p>
            이 방침은 법령·정책 변경에 따라 수정될 수 있으며, 변경 시 서비스 내 공지를 통해 안내합니다.
          </p>
        </section>
      </div>
    </div>
  );
}
