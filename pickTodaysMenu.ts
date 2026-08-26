import { ScoredRecipe } from "@/lib/recommend";

export type AiPick = {
  mainRecipeId: string | null;
  mainReason: string | null;
  quickRecipeId: string | null;
  quickReason: string | null;
};

function summarize(list: ScoredRecipe[]) {
  return list.slice(0, 5).map((r) => ({
    id: r.id,
    name: r.name,
    ownedCount: r.ownedCount,
    missingIngredients: r.missingIngredients,
    cookMinutes: r.cookMinutes,
    difficulty: r.difficulty,
  }));
}

const SYSTEM_PROMPT = `당신은 아기 저녁 메뉴 추천 서비스의 "최종 선택자"입니다.
반드시 아래 규칙을 지키세요.
1. 절대 새로운 메뉴를 만들지 마세요. 이미 월령/알레르기/안전성 검증을 통과한 main_candidates, quick_candidates 목록의 id 중에서만 골라야 합니다.
2. main_candidates 중 하나를 mainRecipeId로, quick_candidates 중 하나를 quickRecipeId로 고르세요. 후보가 비어 있으면 null로 두세요.
3. 왜 이 메뉴가 오늘 가장 적합한지 한국어로 한 문장씩 이유를 쓰세요 (mainReason, quickReason). 보유 재료를 최대한 활용한다는 점을 우선적으로 언급하세요.
4. 의료적 판단이나 진단은 하지 마세요. 재료 활용도와 편의성 관점에서만 설명하세요.
5. 반드시 아래 JSON 형식으로만 답하세요. 다른 텍스트나 코드블록 없이 순수 JSON만 출력하세요.
{"mainRecipeId": "...", "mainReason": "...", "quickRecipeId": "...", "quickReason": "..."}`;

/**
 * 스펙 16장의 마지막 단계: "AI가 후보 중 우선순위 결정".
 * mainCandidates / quickCandidates 는 반드시 scoreRecipes + applySafetyFilter를 통과한 결과만 넘겨야 한다.
 * AI 호출이 실패하거나, AI가 후보에 없는 id를 반환하면 null을 반환해서
 * 호출부가 결정론적 스코어링 1위로 안전하게 폴백하도록 한다.
 */
export async function pickTodaysMenuWithAI(
  mainCandidates: ScoredRecipe[],
  quickCandidates: ScoredRecipe[],
  context: { babyName: string; ageMonths: number; ownedIngredients: string[] }
): Promise<AiPick | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null; // 키가 없으면 STEP 8까지의 결정론적 스코어링만 사용

  const userPrompt = JSON.stringify({
    baby: { name: context.babyName, ageMonths: context.ageMonths },
    ownedIngredients: context.ownedIngredients,
    main_candidates: summarize(mainCandidates),
    quick_candidates: summarize(quickCandidates),
  });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = (data.content ?? []).map((block: { text?: string }) => block.text ?? "").join("");
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned) as AiPick;

    return parsed;
  } catch {
    return null; // 네트워크 오류, JSON 파싱 실패 등 — 호출부가 폴백 처리
  }
}
