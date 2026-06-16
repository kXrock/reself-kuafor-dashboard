import { CalendarClock, MessageCircle, TrendingUp, Wallet } from "lucide-react";
import { getReservations } from "@/lib/data/reservations";
import { getEmployees } from "@/lib/data/employees";
import { getServices } from "@/lib/data/services";
import { getBusiness } from "@/lib/data/business";
import { AirtableConfigError } from "@/lib/airtable";
import {
  computeDashboardMetrics,
  enrichReservations,
  formatTRY,
  recentActivity,
  todaysReservations,
  weeklyTrend,
} from "@/lib/domain";
import { fmtTime } from "@/lib/datetime";
import { PageHeader, Card, SectionTitle, EmptyState } from "@/components/ui/primitives";
import { AutoRefresh, LiveBadge } from "@/components/shell/AutoRefresh";
import { DataError } from "@/components/ui/DataError";
import { ReservationCard } from "@/components/reservations/ReservationCard";
import { WeeklyTrend } from "@/components/charts/WeeklyTrend";

export const dynamic = "force-dynamic";

function greeting(): string {
  const h = Number(
    new Intl.DateTimeFormat("tr-TR", { hour: "numeric", hour12: false, timeZone: "Europe/Istanbul" }).format(new Date())
  );
  if (h < 12) return "Günaydın";
  if (h < 18) return "İyi günler";
  return "İyi akşamlar";
}

export default async function DashboardPage() {
  let data;
  try {
    const [reservations, employees, services, business] = await Promise.all([
      getReservations(),
      getEmployees(),
      getServices(),
      getBusiness(),
    ]);
    data = { reservations, employees, services, business };
  } catch (e) {
    if (e instanceof AirtableConfigError) return <DataError message={e.message} />;
    return (
      <DataError
        message={e instanceof Error ? e.message : "Airtable verisi alınamadı."}
      />
    );
  }

  const enriched = enrichReservations(data.reservations, data.employees, data.services);
  const metrics = computeDashboardMetrics(enriched, data.employees);
  const today = todaysReservations(enriched);
  const trend = weeklyTrend(data.reservations);
  const activity = recentActivity(enriched);

  return (
    <div>
      <AutoRefresh />
      <PageHeader
        eyebrow={`${greeting()} · Bugüne bakış`}
        title={data.business.name}
        action={<LiveBadge />}
      />

      {/* Asymmetric summary cards: hero metric spans wider */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="col-span-2 flex flex-col justify-between p-5 lg:col-span-2">
          <div className="flex items-center gap-2 text-muted">
            <CalendarClock size={16} />
            <span className="text-sm">Bugünkü randevu</span>
          </div>
          <div className="mt-4 flex items-end gap-3">
            <span className="numeral text-6xl font-semibold leading-none">
              {metrics.todayCount}
            </span>
            <span className="mb-1 text-sm text-muted">
              {metrics.pendingCount > 0
                ? `${metrics.pendingCount} onay bekliyor`
                : "tümü onaylı"}
            </span>
          </div>
        </Card>

        <StatCard
          icon={<TrendingUp size={16} />}
          label="Doluluk"
          value={`%${metrics.occupancyPct}`}
        >
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-hairline">
            <div
              className="h-full rounded-full bg-clay"
              style={{ width: `${metrics.occupancyPct}%` }}
            />
          </div>
        </StatCard>

        <StatCard
          icon={<Wallet size={16} />}
          label="Beklenen ciro"
          value={formatTRY(metrics.expectedRevenue)}
        >
          <p className="mt-2 text-[11px] text-muted">bugün · iptaller hariç</p>
        </StatCard>
      </div>

      {/* Today's appointments */}
      <section className="mt-8">
        <SectionTitle>Bugünün ajandası</SectionTitle>
        {today.length === 0 ? (
          <EmptyState
            title="Bugün ajanda sakin"
            message="Yeni randevular WhatsApp'tan düştükçe burada belirecek."
          />
        ) : (
          <div className="space-y-2.5">
            {today.map((r) => (
              <ReservationCard key={r.id} r={r} />
            ))}
          </div>
        )}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Weekly trend */}
        <section>
          <SectionTitle>Bu hafta</SectionTitle>
          <Card className="p-4">
            <WeeklyTrend data={trend} />
          </Card>
        </section>

        {/* Activity feed */}
        <section>
          <SectionTitle>Son aktiviteler</SectionTitle>
          <Card className="divide-y divide-hairline">
            {activity.map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366]/12 text-[#0F7A3D]">
                  <MessageCircle size={15} strokeWidth={2.2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    <span className="font-medium">{r.customerName}</span>{" "}
                    <span className="text-muted">
                      · {r.serviceNames.join(" + ") || "randevu"}
                    </span>
                  </p>
                  <p className="text-[11px] text-muted">
                    {r.source === "whatsapp" ? "WhatsApp ajanı" : "Manuel kayıt"} ·{" "}
                    {fmtTime(r.start)}
                  </p>
                </div>
              </div>
            ))}
          </Card>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-muted">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="numeral mt-2 text-2xl font-semibold">{value}</p>
      {children}
    </Card>
  );
}
