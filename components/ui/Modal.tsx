"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 max-h-[88dvh] w-full overflow-y-auto rounded-t-lg border border-hairline bg-surface shadow-lift sm:max-w-md sm:rounded-lg">
        <div className="sticky top-0 flex items-center justify-between border-b border-hairline bg-surface px-5 py-3.5">
          <h3 className="font-display text-lg font-semibold tracking-tightish">{title}</h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-muted transition-colors hover:bg-hairline/50 hover:text-ink"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
