"use client";

import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface SelectMenuProps<T extends string> {
  value: T;
  options: Array<SelectOption<T>>;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
  menuClassName?: string;
  triggerClassName?: string;
}

export function SelectMenu<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  className,
  menuClassName,
  triggerClassName,
}: SelectMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <div ref={rootRef} className={clsx("relative", className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={clsx(
          "flex h-12 w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 text-left text-[var(--foreground)] shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:border-[var(--surface-strong)] hover:bg-[var(--surface-hover)]",
          triggerClassName,
        )}
      >
        <span className="truncate text-[15px] font-medium">{selected.label}</span>
        <ChevronDown
          size={18}
          className={clsx(
            "shrink-0 text-[var(--muted-foreground)] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          className={clsx(
            "absolute left-0 top-[calc(100%+0.5rem)] z-30 w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_24px_60px_rgba(15,23,42,0.22)]",
            menuClassName,
          )}
        >
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={clsx(
                  "flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition",
                  active
                    ? "bg-[var(--surface-highlight)] text-[var(--foreground-strong)]"
                    : "text-[var(--foreground)] hover:bg-[var(--surface-hover)]",
                )}
              >
                <span>{option.label}</span>
                {active ? <Check size={16} className="text-[var(--accent)]" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
