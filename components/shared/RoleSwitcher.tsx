"use client";

import { Shield, UserRound } from "lucide-react";
import { SelectMenu } from "@/components/shared/SelectMenu";
import { useStore } from "@/store/useStore";
import type { UserRole } from "@/types/finance";

export function RoleSwitcher() {
  const role = useStore((state) => state.role);
  const setRole = useStore((state) => state.setRole);

  return (
    <div className="flex h-12 items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-[var(--foreground)] shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
      {role === "admin" ? <Shield size={16} /> : <UserRound size={16} />}
      <span className="hidden text-sm font-semibold sm:inline">Role</span>
      <SelectMenu<UserRole>
        value={role}
        onChange={setRole}
        ariaLabel="Switch role"
        className="min-w-[112px]"
        menuClassName="right-0 left-auto min-w-[180px]"
        triggerClassName="px-4"
        options={[
          { label: "Viewer", value: "viewer" },
          { label: "Admin", value: "admin" },
        ]}
      />
    </div>
  );
}
