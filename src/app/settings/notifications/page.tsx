"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function NotificationSettingsPage() {
  const supabase = createClient();
  const [enabled, setEnabled] = useState(false);
  const [notifyTime, setNotifyTime] = useState("16:00");
  const [status, setStatus] = useState<"idle" | "loading" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadExisting() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("notification_settings")
        .select("enabled, notify_time")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setEnabled(data.enabled);
        setNotifyTime(data.notify_time.slice(0, 5));
      }
    }
    loadExisting();
  }, [supabase]);

  async function handleEnable() {
    setStatus("loading");
    setMessage(null);

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("error");
      setMessage("이 브라우저는 알림을 지원하지 않아요.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setStatus("error");
      setMessage("알림 권한이 거부됐어요. 브라우저 설정에서 다시 허용해 주세요.");
      return;
    }

    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    });

    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription, enabled: true, notifyTime }),
    });

    if (!res.ok) {
      setStatus("error");
      setMessage("저장 중 문제가 발생했어요.");
      return;
    }

    setEnabled(true);
    setStatus("saved");
    setMessage("오후 4시 알림이 켜졌어요.");
  }

  async function handleDisable() {
    setStatus("loading");
    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: false, notifyTime }),
    });
    setStatus(res.ok ? "saved" : "error");
    setEnabled(false);
    setMessage(res.ok ? "알림을 껐어요." : "저장 중 문제가 발생했어요.");
  }

  async function handleTimeChange(newTime: string) {
    setNotifyTime(newTime);
    if (!enabled) return; // 알림이 꺼져있으면 시간만 로컬에 반영, 켤 때 같이 저장됨
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: true, notifyTime: newTime }),
    });
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-cream px-6 pb-10 pt-11">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/home" className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-sm shadow-sm">
          ←
        </Link>
        <h1 className="font-display text-lg">알림 설정</h1>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-2xl border border-line bg-white p-4">
        <div>
          <div className="font-display text-[15px]">오후 저녁 메뉴 알림</div>
          <div className="mt-0.5 text-xs text-ink-soft">매일 설정한 시간에 오늘의 메뉴를 알려드려요.</div>
        </div>
        <button
          onClick={enabled ? handleDisable : handleEnable}
          disabled={status === "loading"}
          className={`rounded-pill px-4 py-2 text-[13px] font-bold ${
            enabled ? "bg-mint-pale text-[#2E8F5D]" : "bg-ink text-white"
          }`}
        >
          {enabled ? "켜짐" : "꺼짐 · 켜기"}
        </button>
      </div>

      <div className="mb-2 text-[13px] font-bold text-ink-soft">알림 시간</div>
      <input
        type="time"
        value={notifyTime}
        onChange={(e) => handleTimeChange(e.target.value)}
        className="mb-4 w-full rounded-2xl border border-line bg-white px-3.5 py-3 text-[14.5px]"
      />

      {message && (
        <div className={`text-[12.5px] ${status === "error" ? "text-coral-deep" : "text-mint"}`}>{message}</div>
      )}
    </div>
  );
}
