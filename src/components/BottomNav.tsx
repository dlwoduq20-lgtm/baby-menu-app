"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/home",
    label: "홈",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 2}>
        <path d="M4 11L12 4l8 7" />
        <path d="M6 10v9h12v-9" />
      </svg>
    ),
  },
  {
    href: "/ingredients",
    label: "식재료",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 2}>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <path d="M4 10h16M10 4v16" />
      </svg>
    ),
  },
  {
    href: "/history",
    label: "기록",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 2}>
        <path d="M6 3h9l5 5v13H6z" />
        <path d="M9 12h6M9 16h6" />
      </svg>
    ),
  },
  {
    href: "/mypage",
    label: "마이",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 2}>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c1.5-4 5-6 7-6s5.5 2 7 6" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 left-1/2 z-40 mx-auto w-full max-w-[430px] -translate-x-1/2 border-t border-line bg-white px-2 pb-6 pt-2.5">
      <div className="flex">
        {TABS.map((tab) => {
          const active = pathname === tab.href || pathname?.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-1 text-[11px] ${
                active ? "font-bold text-coral-deep" : "text-ink-soft"
              }`}
            >
              <span className="h-[22px] w-[22px]">{tab.icon(active)}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
