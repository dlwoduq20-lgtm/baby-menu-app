/**
 * 생년월일 기준으로 아기의 현재 월령을 "실제 달력 기준"으로 계산한다.
 * 30일 단위 나눗셈이 아니라, 연/월/일을 직접 비교해서 정확한 개월 수를 구한다.
 *
 * 예: 2024-10-01 생, 오늘 2026-08-26 → 22개월 (10/01 기준으로 아직 26일 지났지만
 * 8/26 < 10/01 이므로 만 나이 계산과 동일하게 1개월 차감)
 */
export function calcAgeInMonths(birthDateISO: string, today: Date = new Date()): number {
  const birth = new Date(birthDateISO);
  if (Number.isNaN(birth.getTime())) {
    throw new Error("잘못된 생년월일 형식입니다. YYYY-MM-DD 형식을 사용하세요.");
  }

  let months =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    (today.getMonth() - birth.getMonth());

  // 생일의 '일(day)'이 아직 지나지 않았다면 한 달을 차감한다.
  if (today.getDate() < birth.getDate()) {
    months -= 1;
  }

  return Math.max(0, months);
}

export type AgeStage =
  | "0-5"
  | "6-8"
  | "9-11"
  | "12-17"
  | "18-23"
  | "24+";

// 스펙 14장: 월령별 이유식/유아식 단계 매핑 (실제 서비스에서는 DB의 age_rules 테이블로 관리)
export function getAgeStage(months: number): AgeStage {
  if (months <= 5) return "0-5";
  if (months <= 8) return "6-8";
  if (months <= 11) return "9-11";
  if (months <= 17) return "12-17";
  if (months <= 23) return "18-23";
  return "24+";
}

export const AGE_STAGE_LABEL: Record<AgeStage, string> = {
  "0-5": "이유식 대상 아님 · 별도 안내 필요",
  "6-8": "초기/중기 이유식",
  "9-11": "후기 이유식",
  "12-17": "유아식 초기",
  "18-23": "유아식",
  "24+": "유아·어린이 키즈식 (2~7세)",
};

/**
 * [스프린트 안건 반영] 24개월~7세(84개월) 확장:
 * 24개월 미만: "N개월"
 * 24개월 이상 (만 2세~7세): "만 N세 (M개월)" 형식으로 부모 친화적 표기
 */
export function formatBabyAge(months: number): string {
  if (months < 24) {
    return `${months}개월`;
  }
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (remMonths === 0) {
    return `만 ${years}세 (${months}개월)`;
  }
  return `만 ${years}세 ${remMonths}개월 (${months}개월)`;
}

/**
 * 7세까지 세분화된 단계별 맞춤 라벨
 */
export function getDetailedStageLabel(months: number): string {
  if (months <= 5) return "이유식 준비기";
  if (months <= 8) return "초기/중기 이유식";
  if (months <= 11) return "후기 이유식";
  if (months <= 17) return "유아식 초기";
  if (months <= 23) return "유아식";
  if (months <= 35) return "완료기 유아식 (만 2세)";
  if (months <= 59) return "키즈 유아식 (만 3~4세)";
  if (months <= 84) return "어린이 성장식 (만 5~7세)";
  return "어린이 가족식 (7세 이상)";
}

