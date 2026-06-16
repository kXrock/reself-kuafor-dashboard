import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

export const TZ = "Europe/Istanbul";

/** Convert a stored UTC ISO string into a Date positioned in salon-local time. */
export function toLocal(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return toZonedTime(d, TZ);
}

export function fmtTime(iso: string | null | undefined): string {
  const d = toLocal(iso);
  return d ? format(d, "HH:mm") : "--:--";
}

export function fmtDayLabel(iso: string | null | undefined): string {
  const d = toLocal(iso);
  return d ? format(d, "d MMM, EEEE", { locale: tr }) : "";
}

export function fmtShortDay(date: Date): string {
  return format(date, "EEE", { locale: tr });
}

/** YYYY-MM-DD key in salon-local time, for day-bucketing. */
export function dayKey(iso: string | null | undefined): string | null {
  const d = toLocal(iso);
  return d ? format(d, "yyyy-MM-dd") : null;
}

export function localDayKey(date: Date): string {
  return format(toZonedTime(date, TZ), "yyyy-MM-dd");
}

/** Build an ISO string with the Istanbul offset from local date + "HH:mm". */
export function buildLocalIso(dateKey: string, time: string): string {
  // dateKey: yyyy-MM-dd, time: HH:mm — interpreted as salon-local wall time.
  const naive = new Date(`${dateKey}T${time}:00`);
  return fromZonedTime(naive, TZ).toISOString();
}

/** Minutes between two ISO timestamps. */
export function durationMinutes(start: string | null, end: string | null): number {
  if (!start || !end) return 0;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return ms > 0 ? Math.round(ms / 60000) : 0;
}

/** Last 7 calendar days (oldest → today) as local day keys + short labels. */
export function lastSevenDays(today = new Date()): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const zoned = toZonedTime(d, TZ);
    out.push({ key: format(zoned, "yyyy-MM-dd"), label: format(zoned, "EEE", { locale: tr }) });
  }
  return out;
}

export function parseHours(range: string | null): { open: number; close: number } | null {
  if (!range) return null;
  const m = range.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const open = Number(m[1]) + Number(m[2]) / 60;
  const close = Number(m[3]) + Number(m[4]) / 60;
  return { open, close };
}
