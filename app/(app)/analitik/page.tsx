import {
  AlarmClock,
  ArrowDownRight,
  ArrowUpRight,
  Lock,
  MessageSquare,
  Sparkles,
  TrendingDown,
  Users,
  Wallet,
} from "lucide-react";
import { PageHeader, Card } from "@/components/ui/primitives";
import { Donut, MiniHBars, Sparkline, TopicBars } from "@/components/analytics/charts";
import {
  DAYS,
  HOURS,
  cancellation,
  comingSoon,
  customers,
  demandHeatmap,
  noShow,
  revenue,
  staffOccupancy,
  whatsapp,
} from "@/lib/data/analytics-mock";

export const metadata = { title: "İçgörü · Akıllı Analitik" };

export default function AnalitikPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Akıllı içgörü katmanı"
        title="İçgörü"
        action={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-clay/30 bg-clay/10 px-3 py-1 text-[11px] font-semibold text-clay">
            <Sparkles size={13} /> Demo Görünüm · Örnek Veri
          </span>
        }
      />

      <p className="mb-7 max-w-2xl text-sm text-muted">
        Bu sayfa örnek verilerle hazırlanmıştır; ürün büyüdükçe WhatsApp ajanı ve
        randevu geçmişinizden otomatik üretilecek içgörüleri temsil eder.
      </p>

      {/* WhatsApp hero — the automation value proof */}
      <Card className="mb-8 overflow-hidden border-clay/30 bg-ink p-0 text-cream">
        <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_1fr] md:p-8">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-clay-soft">
              <MessageSquare size={14} /> WhatsApp Otomasyonu
            </p>
            <div className="mt-4 flex items-end gap-3">
              <span className="numeral text-7xl font-semibold leading-none text-cream">
                %{whatsapp.automationResolvedPct}
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-cream/70">
              Gelen taleplerin <strong className="text-cream">%{whatsapp.automationResolvedPct}'i</strong>{" "}
              insana ihtiyaç kalmadan ajan tarafından sonuçlandırıldı.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 self-center">
            <HeroStat label="Ort. yanıt süresi" value={`${whatsapp.avgResponseSec} sn`} />
            <HeroStat label="Talep → rezervasyon" value={`%${whatsapp.conversionPct}`} />
          </div>
        </div>
      </Card>

      {/* Operasyonel Verimlilik */}
      <SectionLabel icon={<AlarmClock size={15} />}>Operasyonel Verimlilik</SectionLabel>
      <div className="mb-9 grid gap-4 lg:grid-cols-2">
        <Card className="min-w-0 p-5 lg:col-span-2">
          <CardTitle>Talep yoğunluk haritası</CardTitle>
          <p className="mb-4 text-xs text-muted">Gün ve saat bazlı doluluk yoğunluğu</p>
          <Heatmap />
        </Card>

        <Card className="flex items-center justify-between p-5">
          <div>
            <CardTitle>No-show oranı</CardTitle>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="numeral text-4xl font-semibold">%{noShow.ratePct}</span>
              <span className="inline-flex items-center gap-0.5 text-sm font-medium text-[#2E5C41]">
                <ArrowDownRight size={15} /> %{Math.abs(noShow.deltaPct)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">son 4 haftada düşüş</p>
          </div>
          <Sparkline data={noShow.trend} />
        </Card>

        <Card className="p-5">
          <CardTitle>İptal zamanlaması</CardTitle>
          <p className="mb-3 text-xs text-muted">
            İptallerin <strong className="text-ink">%{cancellation.lastMinuteSharePct}'i</strong> son 2 saatte
          </p>
          <div className="space-y-2">
            {cancellation.buckets.map((b) => (
              <div key={b.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted">{b.label}</span>
                  <span className="numeral font-medium">%{b.value}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-hairline">
                  <div className="h-full rounded-full bg-[#A8503C]" style={{ width: `${b.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <CardTitle>Personel doluluk performansı</CardTitle>
          <div className="mt-3">
            <MiniHBars data={staffOccupancy} />
          </div>
        </Card>
      </div>

      {/* Gelir Optimizasyonu */}
      <SectionLabel icon={<Wallet size={15} />}>Gelir Optimizasyonu</SectionLabel>
      <div className="mb-9 grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <CardTitle>Tahmini kayıp gelir</CardTitle>
          <p className="numeral mt-2 text-4xl font-semibold text-[#8A3C2B]">
            ₺{revenue.lostEstimateTRY.toLocaleString("tr-TR")}
          </p>
          <p className="mt-1 text-xs text-muted">
            Bu ay kapasite dolu olduğu için karşılanamayan talepler
          </p>
        </Card>
        <Card className="p-5">
          <CardTitle>Slot verimliliği</CardTitle>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[#2E5C41]">
                <ArrowUpRight size={14} /> {revenue.bestSlot.label}
              </span>
              <span className="numeral font-medium">%{revenue.bestSlot.indexPct}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[#8A3C2B]">
                <TrendingDown size={14} /> {revenue.worstSlot.label}
              </span>
              <span className="numeral font-medium">%{revenue.worstSlot.indexPct}</span>
            </div>
          </div>
        </Card>
        <Card className="border-clay/30 bg-clay/[0.06] p-5">
          <CardTitle>Öneri</CardTitle>
          <p className="mt-2 text-sm text-ink/80">{revenue.emptySlotSuggestion}</p>
        </Card>
      </div>

      {/* Müşteri Davranışı */}
      <SectionLabel icon={<Users size={15} />}>Müşteri Davranışı & Sadakat</SectionLabel>
      <div className="mb-9 grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <CardTitle>Yeni / tekrar eden</CardTitle>
          <div className="mt-3">
            <Donut newPct={customers.newPct} returningPct={customers.returningPct} />
          </div>
        </Card>
        <Card className="p-5">
          <CardTitle>Ortalama sepet</CardTitle>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="numeral text-4xl font-semibold">
              ₺{customers.avgBasketTRY.toLocaleString("tr-TR")}
            </span>
            <span className="inline-flex items-center gap-0.5 text-sm font-medium text-[#2E5C41]">
              <ArrowUpRight size={15} /> %{customers.basketTrendPct}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">son çeyrekte artış</p>
        </Card>
        <Card className="p-5">
          <CardTitle>Churn riski taşıyan müşteriler</CardTitle>
          <ul className="mt-3 space-y-2.5">
            {customers.churnRisk.map((c) => (
              <li key={c.name} className="flex items-start justify-between gap-3 border-b border-hairline/60 pb-2 last:border-0">
                <div>
                  <p className="text-sm font-medium text-ink">{c.name}</p>
                  <p className="text-[11px] text-muted">{c.note}</p>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-[#8A3C2B]">{c.lastVisit}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* WhatsApp Etkileşim Analitiği */}
      <SectionLabel icon={<MessageSquare size={15} />}>WhatsApp Etkileşim Analitiği</SectionLabel>
      <div className="mb-9 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <CardTitle>Sık sorulan konu dağılımı</CardTitle>
          <div className="mt-3">
            <TopicBars data={whatsapp.topics} />
          </div>
        </Card>
        <Card className="flex flex-col justify-center gap-4 p-5">
          <div>
            <CardTitle>Otomasyon çözüm oranı</CardTitle>
            <p className="numeral mt-2 text-4xl font-semibold text-clay">
              %{whatsapp.automationResolvedPct}
            </p>
            <p className="text-xs text-muted">insan müdahalesi olmadan</p>
          </div>
          <div className="border-t border-hairline pt-3">
            <CardTitle>Ortalama yanıt süresi</CardTitle>
            <p className="numeral mt-1 text-3xl font-semibold">{whatsapp.avgResponseSec} sn</p>
            <p className="text-xs text-muted">manuel süreçte dakikalar sürerdi</p>
          </div>
        </Card>
      </div>

      {/* Coming soon teasers */}
      <SectionLabel icon={<Lock size={14} />}>Yol Haritası · Yakında</SectionLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        {comingSoon.map((c) => (
          <div
            key={c.title}
            className="relative overflow-hidden rounded border border-dashed border-hairline bg-surface/60 p-5"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                <Lock size={13} /> {c.phase}
              </span>
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold tracking-tightish text-ink/50">
              {c.title}
            </h3>
            <p className="mt-1.5 text-sm text-muted/80">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-clay">
      {icon}
      <h2 className="eyebrow !text-ink">{children}</h2>
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-ink">{children}</h3>;
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-cream/15 bg-cream/[0.06] p-4">
      <p className="text-[11px] uppercase tracking-wide text-cream/55">{label}</p>
      <p className="numeral mt-1 text-2xl font-semibold text-cream">{value}</p>
    </div>
  );
}

function Heatmap() {
  const shades = ["#F1E9DC", "#E7D2BE", "#D9A988", "#C57E58", "#B05B3B"];
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[520px]">
        <div className="grid grid-cols-[36px_repeat(11,1fr)] gap-1">
          <div />
          {HOURS.map((h) => (
            <div key={h} className="text-center text-[10px] text-muted">
              {h}
            </div>
          ))}
          {demandHeatmap.map((row, di) => (
            <FragmentRow key={DAYS[di]} day={DAYS[di]} row={row} shades={shades} />
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-[10px] text-muted">
          <span>Az</span>
          {shades.map((s) => (
            <span key={s} className="h-3 w-5 rounded-sm" style={{ backgroundColor: s }} />
          ))}
          <span>Yoğun</span>
        </div>
      </div>
    </div>
  );
}

function FragmentRow({
  day,
  row,
  shades,
}: {
  day: string;
  row: number[];
  shades: string[];
}) {
  return (
    <>
      <div className="flex items-center text-[11px] font-medium text-muted">{day}</div>
      {row.map((v, hi) => (
        <div
          key={hi}
          className="aspect-square rounded-sm"
          style={{ backgroundColor: shades[v] }}
          title={`${day} · yoğunluk ${v}/4`}
        />
      ))}
    </>
  );
}
