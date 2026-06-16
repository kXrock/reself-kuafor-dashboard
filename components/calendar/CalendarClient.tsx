"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addDays, addWeeks, startOfWeek } from "date-fns";
import { tr } from "date-fns/locale";
import { format } from "date-fns";
import { CalendarPlus, Check, ChevronLeft, ChevronRight, Loader2, Phone, Trash2, X } from "lucide-react";
import type { EnrichedReservation } from "@/lib/domain";
import type { ReservationStatus } from "@/lib/types";
import { buildLocalIso, dayKey, fmtTime, localDayKey } from "@/lib/datetime";
import { formatTRY } from "@/lib/domain";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/primitives";
import { StatusBadge, SourceBadge } from "@/components/ui/badges";
import { ReservationCard } from "@/components/reservations/ReservationCard";
import {
  createReservationAction,
  setReservationStatusAction,
} from "@/app/actions";

type EmployeeLite = { id: string; name: string };
type ServiceLite = { id: string; name: string; durationMin: number; price: number | null };

export function CalendarClient({
  reservations,
  employees,
  services,
  nowMs,
}: {
  reservations: EnrichedReservation[];
  employees: EmployeeLite[];
  services: ServiceLite[];
  nowMs: number;
}) {
  const router = useRouter();
  const [view, setView] = useState<"gun" | "hafta">("gun");
  const [cursor, setCursor] = useState<Date>(new Date(nowMs));
  const [empFilter, setEmpFilter] = useState<string>("all");
  const [detail, setDetail] = useState<EnrichedReservation | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const weekStart = useMemo(() => startOfWeek(cursor, { weekStartsOn: 1 }), [cursor]);
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );
  const selectedKey = localDayKey(cursor);

  const filtered = useMemo(
    () => (empFilter === "all" ? reservations : reservations.filter((r) => r.employeeId === empFilter)),
    [reservations, empFilter]
  );

  const byDay = useMemo(() => {
    const map = new Map<string, EnrichedReservation[]>();
    for (const r of filtered) {
      const k = dayKey(r.start);
      if (!k) continue;
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(r);
    }
    for (const list of map.values()) list.sort((a, b) => (a.start ?? "").localeCompare(b.start ?? ""));
    return map;
  }, [filtered]);

  const shiftWeek = (dir: number) => setCursor((c) => addWeeks(c, dir));

  return (
    <div>
      {/* Controls */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="inline-flex rounded border border-hairline bg-surface p-0.5">
          {(["gun", "hafta"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-sm px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                view === v ? "bg-ink text-cream" : "text-muted hover:text-ink"
              }`}
            >
              {v === "gun" ? "Gün" : "Hafta"}
            </button>
          ))}
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-1.5 rounded bg-clay px-3.5 py-2 text-sm font-semibold text-cream transition-colors hover:bg-clay/90"
        >
          <CalendarPlus size={16} /> Yeni
        </button>
      </div>

      {/* Employee filter */}
      <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">
        <FilterChip active={empFilter === "all"} onClick={() => setEmpFilter("all")}>
          Tüm ekip
        </FilterChip>
        {employees.map((e) => (
          <FilterChip key={e.id} active={empFilter === e.id} onClick={() => setEmpFilter(e.id)}>
            {e.name}
          </FilterChip>
        ))}
      </div>

      {/* Week strip */}
      <div className="mb-5 flex items-center gap-2">
        <button onClick={() => shiftWeek(-1)} className="rounded p-1.5 text-muted hover:bg-hairline/50 hover:text-ink">
          <ChevronLeft size={18} />
        </button>
        <div className="no-scrollbar flex flex-1 justify-between gap-1.5 overflow-x-auto">
          {weekDays.map((d) => {
            const k = localDayKey(d);
            const active = k === selectedKey;
            const isToday = k === localDayKey(new Date(nowMs));
            const count = (byDay.get(k) ?? []).filter((r) => r.status !== "iptal").length;
            return (
              <button
                key={k}
                onClick={() => {
                  setCursor(d);
                  if (view === "hafta") setView("gun");
                }}
                className={`flex min-w-[44px] flex-1 flex-col items-center rounded border px-1 py-2 transition-colors ${
                  active
                    ? "border-clay bg-clay/10"
                    : "border-transparent hover:bg-hairline/40"
                }`}
              >
                <span className="text-[10px] uppercase tracking-wide text-muted">
                  {format(d, "EEE", { locale: tr })}
                </span>
                <span className={`numeral mt-0.5 text-lg leading-none ${active ? "text-clay" : ""}`}>
                  {format(d, "d")}
                </span>
                <span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: count > 0 ? "#B05B3B" : "transparent" }} />
                {isToday && <span className="mt-0.5 text-[9px] font-semibold text-clay">bugün</span>}
              </button>
            );
          })}
        </div>
        <button onClick={() => shiftWeek(1)} className="rounded p-1.5 text-muted hover:bg-hairline/50 hover:text-ink">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* List */}
      {view === "gun" ? (
        <DayList
          dateLabel={format(cursor, "d MMMM, EEEE", { locale: tr })}
          items={byDay.get(selectedKey) ?? []}
          onSelect={setDetail}
        />
      ) : (
        <div className="space-y-6">
          {weekDays.map((d) => {
            const k = localDayKey(d);
            const items = byDay.get(k) ?? [];
            if (items.length === 0) return null;
            return (
              <DayList
                key={k}
                dateLabel={format(d, "d MMMM, EEEE", { locale: tr })}
                items={items}
                onSelect={setDetail}
                compact
              />
            );
          })}
          {weekDays.every((d) => (byDay.get(localDayKey(d)) ?? []).length === 0) && (
            <EmptyState title="Bu hafta boş" message="Seçili filtrede randevu yok." />
          )}
        </div>
      )}

      {detail && (
        <DetailSheet
          reservation={detail}
          onClose={() => setDetail(null)}
          onChanged={() => {
            setDetail(null);
            router.refresh();
          }}
        />
      )}

      {formOpen && (
        <NewReservationForm
          employees={employees}
          services={services}
          defaultDateKey={selectedKey}
          onClose={() => setFormOpen(false)}
          oncreated={() => {
            setFormOpen(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active ? "border-ink bg-ink text-cream" : "border-hairline text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function DayList({
  dateLabel,
  items,
  onSelect,
  compact,
}: {
  dateLabel: string;
  items: EnrichedReservation[];
  onSelect: (r: EnrichedReservation) => void;
  compact?: boolean;
}) {
  return (
    <section>
      {compact && <h3 className="eyebrow mb-2.5">{dateLabel}</h3>}
      {items.length === 0 ? (
        <EmptyState
          title="Bu gün sakin"
          message="Bu tarihte planlanmış randevu yok. WhatsApp ajanı yeni talepleri buraya düşürecek."
        />
      ) : (
        <div className="space-y-2.5">
          {items.map((r) => (
            <ReservationCard key={r.id} r={r} onClick={() => onSelect(r)} />
          ))}
        </div>
      )}
    </section>
  );
}

const ACTIONS: { status: ReservationStatus; label: string; icon: React.ReactNode; tone: string }[] = [
  { status: "onaylandi", label: "Onayla", icon: <Check size={16} />, tone: "border-[#3F7A57]/40 text-[#2E5C41] hover:bg-[#3F7A57]/10" },
  { status: "tamamlandi", label: "Tamamlandı", icon: <Check size={16} />, tone: "border-hairline text-ink hover:bg-hairline/50" },
  { status: "iptal", label: "İptal et", icon: <Trash2 size={16} />, tone: "border-[#A8503C]/40 text-[#8A3C2B] hover:bg-[#A8503C]/10" },
];

function DetailSheet({
  reservation,
  onClose,
  onChanged,
}: {
  reservation: EnrichedReservation;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [busyStatus, setBusyStatus] = useState<ReservationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const act = (status: ReservationStatus) => {
    setError(null);
    setBusyStatus(status);
    startTransition(async () => {
      const res = await setReservationStatusAction(reservation.id, status);
      setBusyStatus(null);
      if (res.ok) onChanged();
      else setError(res.error ?? "Güncellenemedi");
    });
  };

  return (
    <Modal open onClose={onClose} title={reservation.customerName}>
      <div className="flex items-center justify-between">
        <StatusBadge status={reservation.status} />
        <SourceBadge source={reservation.source} />
      </div>

      <dl className="mt-4 space-y-2.5 text-sm">
        <Row label="Hizmet" value={reservation.serviceNames.join(" + ") || "—"} />
        <Row label="Personel" value={reservation.employeeName ?? "Atanmadı"} />
        <Row label="Saat" value={`${fmtTime(reservation.start)} – ${fmtTime(reservation.end)}`} />
        <Row label="Süre" value={`${reservation.durationMin} dk`} />
        {reservation.price > 0 && <Row label="Tutar" value={formatTRY(reservation.price)} />}
        {reservation.customerPhone && (
          <Row
            label="Telefon"
            value={
              <a
                href={`tel:${reservation.customerPhone}`}
                className="inline-flex items-center gap-1 text-clay"
              >
                <Phone size={13} /> {reservation.customerPhone}
              </a>
            }
          />
        )}
        {reservation.note && <Row label="Not" value={reservation.note} />}
      </dl>

      {error && <p className="mt-3 text-sm text-[#8A3C2B]">{error}</p>}

      <div className="mt-5 grid grid-cols-3 gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a.status}
            disabled={pending}
            onClick={() => act(a.status)}
            className={`inline-flex items-center justify-center gap-1.5 rounded border px-2 py-2 text-xs font-semibold transition-colors disabled:opacity-50 ${a.tone}`}
          >
            {busyStatus === a.status ? <Loader2 size={16} className="animate-spin" /> : a.icon}
            {a.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] text-muted">
        Durum değişikliği Airtable'a anında kaydedilir.
      </p>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-hairline/60 pb-2.5 last:border-0">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

function NewReservationForm({
  employees,
  services,
  defaultDateKey,
  onClose,
  oncreated,
}: {
  employees: EmployeeLite[];
  services: ServiceLite[];
  defaultDateKey: string;
  onClose: () => void;
  oncreated: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    serviceId: services[0]?.id ?? "",
    employeeId: employees[0]?.id ?? "",
    date: defaultDateKey,
    time: "10:00",
    numberOfPeople: 1,
    note: "",
  });

  const submit = () => {
    setError(null);
    if (!form.customerName.trim()) return setError("Müşteri adı zorunlu.");
    if (!form.serviceId || !form.employeeId) return setError("Hizmet ve personel seçin.");

    const svc = services.find((s) => s.id === form.serviceId);
    const startIso = buildLocalIso(form.date, form.time);
    const dur = svc?.durationMin && svc.durationMin > 0 ? svc.durationMin : 30;
    const endIso = new Date(new Date(startIso).getTime() + dur * 60000).toISOString();

    startTransition(async () => {
      const res = await createReservationAction({
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        serviceId: form.serviceId,
        employeeId: form.employeeId,
        start: startIso,
        end: endIso,
        numberOfPeople: form.numberOfPeople,
        note: form.note.trim() || undefined,
      });
      if (res.ok) oncreated();
      else setError(res.error ?? "Kaydedilemedi");
    });
  };

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <Modal open onClose={onClose} title="Yeni Randevu">
      <div className="space-y-3.5">
        <Field label="Müşteri adı">
          <input
            value={form.customerName}
            onChange={(e) => set({ customerName: e.target.value })}
            className={inputCls}
            placeholder="Ad Soyad"
          />
        </Field>
        <Field label="Telefon">
          <input
            value={form.customerPhone}
            onChange={(e) => set({ customerPhone: e.target.value })}
            className={inputCls}
            placeholder="90..."
            inputMode="tel"
          />
        </Field>
        <Field label="Hizmet">
          <select value={form.serviceId} onChange={(e) => set({ serviceId: e.target.value })} className={inputCls}>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
                {s.price ? ` · ${formatTRY(s.price)}` : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Personel">
          <select value={form.employeeId} onChange={(e) => set({ employeeId: e.target.value })} className={inputCls}>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tarih">
            <input type="date" value={form.date} onChange={(e) => set({ date: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Saat">
            <input type="time" value={form.time} onChange={(e) => set({ time: e.target.value })} className={inputCls} />
          </Field>
        </div>
        <Field label="Not (opsiyonel)">
          <textarea
            value={form.note}
            onChange={(e) => set({ note: e.target.value })}
            className={`${inputCls} min-h-[64px] resize-none`}
            placeholder="Müşteri tercihi, özel istek…"
          />
        </Field>

        {error && <p className="text-sm text-[#8A3C2B]">{error}</p>}

        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 rounded border border-hairline py-2.5 text-sm font-medium text-muted hover:text-ink"
          >
            <X size={15} className="mr-1 inline" /> Vazgeç
          </button>
          <button
            onClick={submit}
            disabled={pending}
            className="flex-[2] inline-flex items-center justify-center gap-1.5 rounded bg-clay py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-clay/90 disabled:opacity-60"
          >
            {pending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            Randevuyu oluştur
          </button>
        </div>
      </div>
    </Modal>
  );
}

const inputCls =
  "w-full rounded border border-hairline bg-cream/40 px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-clay";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}
