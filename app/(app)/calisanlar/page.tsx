import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { getEmployees } from "@/lib/data/employees";
import { getReservations } from "@/lib/data/reservations";
import { getServices } from "@/lib/data/services";
import { AirtableConfigError } from "@/lib/airtable";
import { employeeLoadToday, enrichReservations } from "@/lib/domain";
import { PageHeader, Card, Avatar } from "@/components/ui/primitives";
import { DataError } from "@/components/ui/DataError";

export const dynamic = "force-dynamic";

export default async function CalisanlarPage() {
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
              : "Ekip verisi alınamadı."
        }
      />
    );
  }

  const enriched = enrichReservations(reservations, employees, services);

  return (
    <div>
      <PageHeader eyebrow="Ekip" title="Çalışanlar" />
      <div className="grid gap-3 sm:grid-cols-2">
        {employees.map((e) => {
          const load = employeeLoadToday(e, enriched);
          return (
            <Link key={e.id} href={`/calisanlar/${e.id}`}>
              <Card className="flex items-center gap-4 p-4 transition-colors hover:border-clay/40">
                <Avatar name={e.name} size={52} />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-semibold tracking-tightish">
                    {e.name}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {e.serviceNames.length > 0 ? e.serviceNames.join(", ") : "Genel"}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-muted">
                    {e.workingHours && (
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} /> {e.workingHours}
                      </span>
                    )}
                    <span className="font-medium text-ink/70">
                      Bugün {load.count} randevu · %{load.occupancyPct}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-hairline">
                    <div className="h-full rounded-full bg-clay" style={{ width: `${load.occupancyPct}%` }} />
                  </div>
                </div>
                <ChevronRight size={18} className="shrink-0 text-muted" />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
