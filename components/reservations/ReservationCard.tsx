import { Clock, User } from "lucide-react";
import type { EnrichedReservation } from "@/lib/domain";
import { fmtTime } from "@/lib/datetime";
import { formatTRY } from "@/lib/domain";
import { StatusBadge, SourceBadge } from "@/components/ui/badges";

export function ReservationCard({
  r,
  onClick,
}: {
  r: EnrichedReservation;
  onClick?: () => void;
}) {
  const services = r.serviceNames.join(" + ") || "Hizmet";
  const body = (
    <div className="flex items-stretch gap-3">
      {/* time rail */}
      <div className="flex w-14 shrink-0 flex-col items-center justify-center border-r border-hairline pr-3">
        <span className="numeral text-lg font-semibold leading-none">{fmtTime(r.start)}</span>
        <span className="mt-1 text-[10px] text-muted">{fmtTime(r.end)}</span>
      </div>
      {/* details */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-medium text-ink">{r.customerName}</p>
          <StatusBadge status={r.status} />
        </div>
        <p className="mt-0.5 truncate text-sm text-muted">{services}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
          {r.employeeName && (
            <span className="inline-flex items-center gap-1">
              <User size={12} /> {r.employeeName}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> {r.durationMin} dk
          </span>
          {r.price > 0 && <span className="font-medium text-ink/70">{formatTRY(r.price)}</span>}
          <SourceBadge source={r.source} />
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="card w-full px-3.5 py-3 text-left transition-colors hover:border-clay/40"
      >
        {body}
      </button>
    );
  }
  return <div className="card px-3.5 py-3">{body}</div>;
}
