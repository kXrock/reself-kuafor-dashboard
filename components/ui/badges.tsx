import { MessageCircle, Hand } from "lucide-react";
import type { ReservationSource, ReservationStatus } from "@/lib/types";
import { STATUS_META } from "@/lib/status";

export function StatusBadge({ status }: { status: ReservationStatus }) {
  const m = STATUS_META[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor: m.chipBg, color: m.chipText, border: `1px solid ${m.chipBorder}` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: m.dot }} />
      {m.label}
    </span>
  );
}

export function SourceBadge({ source }: { source: ReservationSource }) {
  if (source === "whatsapp") {
    return (
      <span className="inline-flex items-center gap-1 rounded-sm border border-[#25D366]/30 bg-[#25D366]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#0F7A3D]">
        <MessageCircle size={11} strokeWidth={2.4} />
        WhatsApp
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-sm border border-hairline bg-hairline/30 px-1.5 py-0.5 text-[10px] font-semibold text-muted">
      <Hand size={11} strokeWidth={2.2} />
      Manuel
    </span>
  );
}
