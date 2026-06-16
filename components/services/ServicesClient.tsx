"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, Loader2, Pencil, Plus } from "lucide-react";
import { formatTRY } from "@/lib/domain";
import { Modal } from "@/components/ui/Modal";
import { Card, EmptyState } from "@/components/ui/primitives";
import { createServiceAction, updateServiceAction } from "@/app/actions";

type ServiceLite = {
  id: string;
  name: string;
  durationMin: number;
  price: number | null;
  category: string | null;
};

const CATEGORIES = ["Saç", "Sakal", "Bakım", "Renklendirme"];
const UNCATEGORIZED = "Diğer";

export function ServicesClient({ services }: { services: ServiceLite[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<ServiceLite | null>(null);
  const [creating, setCreating] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<string, ServiceLite[]>();
    for (const s of services) {
      const cat = s.category ?? UNCATEGORIZED;
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(s);
    }
    // Stable category ordering: known categories first, then others.
    const order = [...CATEGORIES, UNCATEGORIZED];
    return [...map.entries()].sort(
      (a, b) => order.indexOf(a[0]) - order.indexOf(b[0])
    );
  }, [services]);

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 rounded bg-clay px-3.5 py-2 text-sm font-semibold text-cream transition-colors hover:bg-clay/90"
        >
          <Plus size={16} /> Hizmet ekle
        </button>
      </div>

      {services.length === 0 ? (
        <EmptyState
          title="Henüz hizmet yok"
          message="İlk hizmetinizi ekleyin; randevu formunda otomatik görünecek."
        />
      ) : (
        <div className="space-y-7">
          {grouped.map(([cat, items]) => (
            <section key={cat}>
              <h2 className="eyebrow mb-3">{cat}</h2>
              <Card className="divide-y divide-hairline">
                {items.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setEditing(s)}
                    className="group flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-hairline/30"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-ink">{s.name}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted">
                        <Clock size={12} /> {s.durationMin} dk
                      </p>
                    </div>
                    <span className="numeral text-base font-semibold">
                      {s.price != null ? formatTRY(s.price) : "—"}
                    </span>
                    <Pencil
                      size={15}
                      className="shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </button>
                ))}
              </Card>
            </section>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <ServiceForm
          service={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={() => {
            setEditing(null);
            setCreating(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function ServiceForm({
  service,
  onClose,
  onSaved,
}: {
  service: ServiceLite | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = Boolean(service);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: service?.name ?? "",
    durationMin: service?.durationMin ?? 30,
    price: service?.price ?? 0,
    category: service?.category ?? CATEGORIES[0],
  });

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    setError(null);
    if (!form.name.trim()) return setError("Hizmet adı zorunlu.");
    startTransition(async () => {
      const res = isEdit
        ? await updateServiceAction(service!.id, {
            name: form.name.trim(),
            durationMin: Number(form.durationMin),
            price: Number(form.price),
            category: form.category,
          })
        : await createServiceAction({
            name: form.name.trim(),
            durationMin: Number(form.durationMin),
            price: Number(form.price),
            category: form.category,
          });
      if (res.ok) onSaved();
      else setError(res.error ?? "Kaydedilemedi");
    });
  };

  return (
    <Modal open onClose={onClose} title={isEdit ? "Hizmeti düzenle" : "Yeni hizmet"}>
      <div className="space-y-3.5">
        <Field label="Hizmet adı">
          <input value={form.name} onChange={(e) => set({ name: e.target.value })} className={inputCls} placeholder="Saç Kesimi" />
        </Field>
        <Field label="Kategori">
          <select value={form.category} onChange={(e) => set({ category: e.target.value })} className={inputCls}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Süre (dk)">
            <input
              type="number"
              min={5}
              step={5}
              value={form.durationMin}
              onChange={(e) => set({ durationMin: Number(e.target.value) })}
              className={inputCls}
            />
          </Field>
          <Field label="Fiyat (₺)">
            <input
              type="number"
              min={0}
              step={10}
              value={form.price}
              onChange={(e) => set({ price: Number(e.target.value) })}
              className={inputCls}
            />
          </Field>
        </div>

        {error && <p className="text-sm text-[#8A3C2B]">{error}</p>}

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 rounded border border-hairline py-2.5 text-sm font-medium text-muted hover:text-ink">
            Vazgeç
          </button>
          <button
            onClick={submit}
            disabled={pending}
            className="flex-[2] inline-flex items-center justify-center gap-1.5 rounded bg-clay py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-clay/90 disabled:opacity-60"
          >
            {pending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {isEdit ? "Kaydet" : "Hizmeti ekle"}
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
