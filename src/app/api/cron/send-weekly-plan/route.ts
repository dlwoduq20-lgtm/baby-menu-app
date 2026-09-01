import { NextResponse } from "next/server";
import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeWeeklyPlan } from "@/lib/service/weeklyPlan";

// vercel.json: "0 1 * * 6" → 매주 토요일 UTC 01:00 = 한국시간(KST) 오전 10:00
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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results = await Promise.allSettled(
    (subscribers ?? []).map(async (sub) => {
      const plan = await computeWeeklyPlan(supabase, sub.user_id);
      if (!plan) return;

      const menuNames = plan.days
        .map((d) => d.main?.name)
        .filter(Boolean)
        .slice(0, 3)
        .join(", ");

      const payload = JSON.stringify({
        title: "이번 주 식단이 준비됐어요 🗓️",
        body: `${plan.baby.name}이의 이번 주 메뉴: ${menuNames} 등. 장보기 리스트도 같이 확인해보세요.`,
        url: "/weekly",
      });

      try {
        await webpush.sendNotification(
          { endpoint: sub.push_endpoint, keys: { p256dh: sub.push_p256dh, auth: sub.push_auth } },
          payload
        );
      } catch (err: any) {
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
