import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { getEmployees } from "@/lib/data/employees";
import { getReservations } from "@/lib/data/reservations";
import { getServices } from "@/lib/data/services";
import { AirtableConfigError } from "@/lib/airtable";
import {
  employeeLoadToday,
  enrichReservations,
  isToday,
  type EnrichedReservation,
} from "@/lib/domain";
import { dayKey, fmtDayLabel, localDayKey } from "@/lib/datetime";
import { Card, Avatar, SectionTitle, EmptyState } from "@/components/ui/primitives";
import { DataError } from "@/components/ui/DataError";
import { ReservationCard } from "@/components/reservations/ReservationCard";

export const dynamic = "force-dynamic";

export default async function EmployeeDetailPage({ params }: { params: { id: string } }) {
  let employees, reservations, services;
  try {
    [employees, reservations, services] = await Promise.all([
      getEmployees(),
      getReservations(),
      getServices(),
    ]);
  } catch (e) {
    return (
      <DataError
        message={
          e instanceof AirtableConfigError
            ? e.message
            : e instanceof Error
              ? e.message
              : "Veri alınamadı."
        }
      />
    );
  }

  const employee = employees.find((e) => e.id === params.id);
  if (!employee) notFound();

  const enriched = enrichReservations(reservations, employees, services).filter(
    (r) => r.employeeId === employee.id && r.status !== "iptal"
  );
  const load = employeeLoadToday(employee, enriched);

  const todays = enriched
    .filter((r) => isToday(r))
    .sort((a, b) => (a.start ?? "").localeCompare(b.start ?? ""));

  // Upcoming (after today), grouped by day.
  const todayKey = localDayKey(new Date());
  const upcoming = enriched
    .filter((r) => {
      const k = dayKey(r.start);
      return k !== null && k > todayKey;
    })
    .sort((a, b) => (a.start ?? "").localeCompare(b.start ?? ""));

  const upcomingByDay = new Map<string, EnrichedReservation[]>();
  for (const r of upcoming) {
    const k = dayKey(r.start)!;
    if (!upcomingByDay.has(k)) upcomingByDay.set(k, []);
    upcomingByDay.get(k)!.push(r);
  }

  return (
    <div>
      <Link
        href="/calisanlar"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={16} /> Ekip
      </Link>

      <Card className="mb-6 flex items-center gap-4 p-5">
        <Avatar name={employee.name} size={64} />
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tightish">
            {employee.name}
          </h1>
          <p className="text-sm text-muted">
            {employee.serviceNames.length > 0 ? employee.serviceNames.join(", ") : "Genel"}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted">
            {employee.workingHours && (
              <span className="inline-flex items-center gap-1">
                <Clock size={12} /> {employee.workingHours}
              </span>
            )}
            <span className="font-medium text-ink/70">
              Bugün %{load.occupancyPct} dolu
            </span>
          </div>
        </div>
      </Card>

      <section className="mb-7">
        <SectionTitle>Bugün</SectionTitle>
        {todays.length === 0 ? (
          <EmptyState title="Bugün randevu yok" message={`${employee.name} bugün için boş görünüyor.`} />
        ) : (
          <div className="space-y-2.5">
            {todays.map((r) => (
              <ReservationCard key={r.id} r={r} />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionTitle>Yaklaşan</SectionTitle>
        {upcomingByDay.size === 0 ? (
          <EmptyState title="Yaklaşan randevu yok" message="İlerleyen günler için henüz kayıt yok." />
        ) : (
          <div className="space-y-5">
            {[...upcomingByDay.entries()].map(([k, items]) => (
              <div key={k}>
                <p className="mb-2 text-xs font-medium text-muted">
                  {fmtDayLabel(items[0].start)}
                </p>
                <div className="space-y-2.5">
                  {items.map((r) => (
                    <ReservationCard key={r.id} r={r} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
