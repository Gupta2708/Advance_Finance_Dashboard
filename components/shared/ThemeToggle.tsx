"use client";

import { Moon, Sun } from "lucide-react";
import { useStore } from "@/store/useStore";

export function ThemeToggle() {
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-semibold text-[var(--foreground)] shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:border-[var(--surface-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground-strong)]"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
}
