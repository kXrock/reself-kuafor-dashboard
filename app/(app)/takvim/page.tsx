import { getReservations } from "@/lib/data/reservations";
import { getEmployees } from "@/lib/data/employees";
import { getServices } from "@/lib/data/services";
import { AirtableConfigError } from "@/lib/airtable";
import { enrichReservations } from "@/lib/domain";
import { PageHeader } from "@/components/ui/primitives";
import { AutoRefresh, LiveBadge } from "@/components/shell/AutoRefresh";
import { DataError } from "@/components/ui/DataError";
import { CalendarClient } from "@/components/calendar/CalendarClient";

export const dynamic = "force-dynamic";

export default async function TakvimPage() {
  let reservations, employees, services;
  try {
    [reservations, employees, services] = await Promise.all([
      getReservations(),
      getEmployees(),
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
              : "Takvim verisi alınamadı."
        }
      />
    );
  }

  const enriched = enrichReservations(reservations, employees, services);

  return (
    <div>
      <AutoRefresh />
      <PageHeader eyebrow="Randevu takvimi" title="Takvim" action={<LiveBadge />} />
      <CalendarClient
        reservations={enriched}
        employees={employees.map((e) => ({ id: e.id, name: e.name }))}
        services={services.map((s) => ({
          id: s.id,
          name: s.name,
          durationMin: s.durationMin,
          price: s.price,
        }))}
        nowMs={Date.now()}
      />
    </div>
  );
}
