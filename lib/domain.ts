import type { Business, Employee, Reservation, Service } from "./types";
import {
  dayKey,
  durationMinutes,
  lastSevenDays,
  localDayKey,
  parseHours,
} from "./datetime";

export interface EnrichedReservation extends Reservation {
  employeeName: string | null;
  price: number;
  durationMin: number;
}

/** Join reservations with employee names + service price/duration. Pure. */
export function enrichReservations(
  reservations: Reservation[],
  employees: Employee[],
  services: Service[]
): EnrichedReservation[] {
  const empById = new Map(employees.map((e) => [e.id, e]));
  const svcById = new Map(services.map((s) => [s.id, s]));

  return reservations.map((r) => {
    const emp = r.employeeId ? empById.get(r.employeeId) : undefined;
    const price = r.serviceIds.reduce((sum, id) => sum + (svcById.get(id)?.price ?? 0), 0);
    const measured = durationMinutes(r.start, r.end);
    const svcDuration = r.serviceIds.reduce(
      (sum, id) => sum + (svcById.get(id)?.durationMin ?? 0),
      0
    );
    return {
      ...r,
      employeeName: emp?.name ?? r.employeeName,
      price,
      durationMin: measured || svcDuration || 30,
    };
  });
}

const ACTIVE = new Set(["onaylandi", "beklemede", "tamamlandi"]);

export function isToday(r: Reservation, today = new Date()): boolean {
  return dayKey(r.start) === localDayKey(today);
}

export interface DashboardMetrics {
  todayCount: number;
  pendingCount: number;
  occupancyPct: number;
  expectedRevenue: number;
}

export function computeDashboardMetrics(
  reservations: EnrichedReservation[],
  employees: Employee[],
  today = new Date()
): DashboardMetrics {
  const todays = reservations.filter(
    (r) => isToday(r, today) && r.status !== "iptal"
  );

  const expectedRevenue = todays
    .filter((r) => r.status !== "iptal")
    .reduce((sum, r) => sum + r.price, 0);

  const pendingCount = reservations.filter(
    (r) => isToday(r, today) && r.status === "beklemede"
  ).length;

  // Occupancy: booked minutes today vs. total staff working minutes today.
  const bookedMinutes = todays.reduce((sum, r) => sum + r.durationMin, 0);
  const capacityMinutes = employees.reduce((sum, e) => {
    const h = parseHours(e.workingHours);
    return sum + (h ? Math.max(0, (h.close - h.open) * 60) : 0);
  }, 0);
  const occupancyPct =
    capacityMinutes > 0 ? Math.min(100, Math.round((bookedMinutes / capacityMinutes) * 100)) : 0;

  return {
    todayCount: todays.length,
    pendingCount,
    occupancyPct,
    expectedRevenue,
  };
}

export function todaysReservations(
  reservations: EnrichedReservation[],
  today = new Date()
): EnrichedReservation[] {
  return reservations
    .filter((r) => isToday(r, today))
    .sort((a, b) => (a.start ?? "").localeCompare(b.start ?? ""));
}

/** Counts per day for the last 7 days (excludes cancellations). */
export function weeklyTrend(
  reservations: Reservation[],
  today = new Date()
): { label: string; count: number }[] {
  const days = lastSevenDays(today);
  const counts = new Map(days.map((d) => [d.key, 0]));
  for (const r of reservations) {
    if (r.status === "iptal") continue;
    const k = dayKey(r.start);
    if (k && counts.has(k)) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return days.map((d) => ({ label: d.label, count: counts.get(d.key) ?? 0 }));
}

/** Most recent reservations by creation order proxy (start desc), for the activity feed. */
export function recentActivity(
  reservations: EnrichedReservation[],
  limit = 5
): EnrichedReservation[] {
  return [...reservations]
    .filter((r) => r.start)
    .sort((a, b) => (b.start ?? "").localeCompare(a.start ?? ""))
    .slice(0, limit);
}

/** Per-employee occupancy for today, for the staff page. */
export function employeeLoadToday(
  employee: Employee,
  reservations: EnrichedReservation[],
  today = new Date()
): { count: number; occupancyPct: number } {
  const mine = reservations.filter(
    (r) => r.employeeId === employee.id && isToday(r, today) && r.status !== "iptal"
  );
  const booked = mine.reduce((sum, r) => sum + r.durationMin, 0);
  const h = parseHours(employee.workingHours);
  const capacity = h ? Math.max(0, (h.close - h.open) * 60) : 0;
  const occupancyPct = capacity > 0 ? Math.min(100, Math.round((booked / capacity) * 100)) : 0;
  return { count: mine.length, occupancyPct };
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatTRY(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

export { ACTIVE };
