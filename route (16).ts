import { NextResponse } from "next/server";
import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeDailyMenu } from "@/lib/service/dailyMenu";

// Vercel Cron(또는 다른 스케줄러)이 매일 오후 4시(KST)에 이 엔드포인트를 호출한다.
// vercel.json 예시: { "crons": [{ "path": "/api/cron/send-dinner-push", "schedule": "0 7 * * *" }] }
// (UTC 07:00 = KST 16:00)
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const supabase = createAdminClient();

  const { data: subscribers, error } = await supabase
    .from("notification_settings")
    .select("user_id, push_endpoint, push_p256dh, push_auth")
    .eq("enabled", true)
    .not("push_endpoint", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = await Promise.allSettled(
    (subscribers ?? []).map(async (sub) => {
      const menu = await computeDailyMenu(supabase, sub.user_id);
      if (!menu || !menu.main) return; // 온보딩 미완료거나 오늘 추천할 메뉴가 없으면 스킵

      const payload = JSON.stringify({
        title: "오늘 저녁 뭐 먹일지 정하셨나요? 🍽️",
        body: `${menu.baby.name}이에게 오늘의 저녁 메뉴를 준비했어요.\n🥕 ${menu.main.name}${
          menu.quick ? `\n😮‍💨 초간편 ${menu.quick.name}` : ""
        }`,
        url: "/home",
      });

      try {
        await webpush.sendNotification(
          {
            endpoint: sub.push_endpoint,
            keys: { p256dh: sub.push_p256dh, auth: sub.push_auth },
          },
          payload
        );
      } catch (err: any) {
        // 구독이 만료/취소된 경우(410 Gone) 더 이상 시도하지 않도록 정리
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          await supabase.from("notification_settings").update({ enabled: false }).eq("user_id", sub.user_id);
        }
        throw err;
      }
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return NextResponse.json({ total: subscribers?.length ?? 0, sent, failed });
}
