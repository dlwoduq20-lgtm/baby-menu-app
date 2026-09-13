import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeDailyMenu } from "@/lib/service/dailyMenu";

export async function POST() {
  const supabaseUser = createClient();
  const {
    data: { user },
  } = await supabaseUser.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const adminClient = createAdminClient();
  const { data: sub } = await adminClient
    .from("notification_settings")
    .select("push_endpoint, push_p256dh, push_auth")
    .eq("user_id", user.id)
    .single();

  if (!sub || !sub.push_endpoint) {
    return NextResponse.json(
      { error: "등록된 기기 푸시 정보가 없어요. 먼저 '알림 켜기'를 눌러주세요." },
      { status: 400 }
    );
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const menu = await computeDailyMenu(adminClient, user.id);
  const babyName = menu?.baby?.name ?? "아기";
  const mainName = menu?.main?.name ?? "소고기 진밥";

  const payload = JSON.stringify({
    title: "오늘 저녁 뭐 먹일지 정하셨나요? 🍽️",
    body: `${babyName}이에게 오늘의 저녁 메뉴를 준비했어요.\n🥕 ${mainName}`,
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
    return NextResponse.json({ ok: true, message: "알림 발송 성공! 스마트폰 상단 바를 확인해 보세요." });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "발송 실패", statusCode: err.statusCode },
      { status: 500 }
    );
  }
}
