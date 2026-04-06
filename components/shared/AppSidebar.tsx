"use client";

import clsx from "clsx";
import {
  BarChart3,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const primaryLinks = [
  { label: "Dashboard", href: "#overview", icon: LayoutDashboard },
  { label: "Transactions", href: "#transactions", icon: Wallet },
  { label: "Analytics", href: "#analytics", icon: BarChart3 },
  { label: "Insights", href: "#insights", icon: Sparkles },
];

const secondaryLinks = [
  { label: "Settings", href: "#overview", icon: Settings },
  { label: "Help Center", href: "#transactions", icon: HelpCircle },
];

export function AppSidebar() {
  const [activeId, setActiveId] = useState<string>("overview");
  const sectionIds = useMemo(
    () => primaryLinks.map((link) => link.href.replace("#", "")),
    [],
  );

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;

        const mostVisible = visible.sort(
          (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0),
        )[0];
        setActiveId(mostVisible.target.id);
      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionIds]);

  return (
    <aside className="sticky top-5 hidden h-[calc(100vh-2.5rem)] xl:flex xl:w-[288px] xl:flex-col">
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,#11131a_0%,#141821_48%,#12151d_100%)] p-6 text-white shadow-[0_28px_80px_rgba(2,6,23,0.28)]">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/10">
            <CreditCard size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Workspace</p>
            <p className="text-2xl font-semibold tracking-tight">Zorvyn</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <p className="px-3 text-xs uppercase tracking-[0.24em] text-white/35">Menu</p>
          {primaryLinks.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeId === item.href.replace("#", "");

            return (
              <a
                key={item.label}
                href={item.href}
                className={clsx(
                  "flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                  index === 0 || isActive
                    ? "bg-white/8 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
                    : "text-white/62 hover:bg-white/6 hover:text-white",
                )}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>

        <div className="mt-8 space-y-3">
          <p className="px-3 text-xs uppercase tracking-[0.24em] text-white/35">General</p>
          {secondaryLinks.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/62 transition hover:bg-white/6 hover:text-white"
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>

        <button
          type="button"
          className="mt-auto shrink-0 cursor-pointer rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,#47317d_0%,#1b1534_38%,#12151d_100%)] p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:brightness-110"
        >
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-900">
            <Sparkles size={18} />
          </div>
          <p className="text-xl font-semibold tracking-tight text-white">Switch to Pro</p>
          <p className="mt-2 text-sm leading-5 text-white/65">
            Unlock advanced analytics, export tools, and richer visual reporting.
          </p>
        </button>

        <button
          type="button"
          className="mt-4 flex shrink-0 cursor-pointer items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/75 transition hover:bg-white/6 hover:text-white"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
}
