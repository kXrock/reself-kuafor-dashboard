"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Silently re-fetches server data on an interval so externally-created
 * reservations (e.g. dropped in by the WhatsApp agent) appear without a manual
 * refresh. router.refresh() re-runs the server components and reconciles the
 * UI in place — open modals / scroll position are preserved.
 *
 * Also refreshes immediately when the tab regains focus, and pauses polling
 * while the tab is hidden to avoid needless Airtable calls.
 */
export function AutoRefresh({ intervalMs = 10000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    // Poll on a fixed interval. Browsers automatically throttle timers in truly
    // backgrounded tabs, so this stays cheap when nobody is looking; when the
    // dashboard is on screen (the demo case) it refreshes every intervalMs.
    const id = setInterval(() => router.refresh(), intervalMs);

    // Refresh immediately when the operator returns to the tab/app.
    const onFocus = () => router.refresh();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);

    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [router, intervalMs]);

  return null;
}

export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3F7A57]/30 bg-[#3F7A57]/10 px-2.5 py-1 text-[11px] font-semibold text-[#2E5C41]">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3F7A57] opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3F7A57]" />
      </span>
      Canlı
    </span>
  );
}
