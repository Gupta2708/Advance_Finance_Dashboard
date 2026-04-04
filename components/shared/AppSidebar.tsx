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

            return (
              <a
                key={item.label}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                  index === 0
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
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/62 transition hover:bg-white/6 hover:text-white"
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>

        <div className="mt-auto shrink-0 rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,#47317d_0%,#1b1534_38%,#12151d_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-900">
            <Sparkles size={18} />
          </div>
          <p className="text-xl font-semibold tracking-tight text-white">Switch to Pro</p>
          <p className="mt-2 text-sm leading-5 text-white/65">
            Unlock advanced analytics, export tools, and richer visual reporting.
          </p>
        </div>

        <button
          type="button"
          className="mt-4 flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/75 transition hover:bg-white/6 hover:text-white"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
}
