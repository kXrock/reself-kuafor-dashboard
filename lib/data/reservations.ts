import "server-only";
import { revalidatePath } from "next/cache";
import {
  FIELDS,
  TABLES,
  belongsToBusiness,
  fetchAll,
  getBase,
  getBusinessId,
  linkedIds,
} from "@/lib/airtable";
import { mapSource, mapState, STATE_WRITE_VALUE } from "@/lib/status";
import type {
  NewReservationInput,
  Reservation,
  ReservationStatus,
} from "@/lib/types";

/** "Hizmet Adı" lookup comes back as either string[] or {linkedRecordIds, valuesByLinkedRecordId}. */
function lookupNames(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string");
  }
  if (value && typeof value === "object" && "valuesByLinkedRecordId" in value) {
    const map = (value as { valuesByLinkedRecordId: Record<string, unknown> })
      .valuesByLinkedRecordId;
    const names: string[] = [];
    for (const v of Object.values(map)) {
      if (Array.isArray(v)) v.forEach((x) => typeof x === "string" && names.push(x));
      else if (typeof v === "string") names.push(v);
    }
    return names;
  }
  return [];
}

function selectName(value: unknown): string {
  if (value && typeof value === "object" && "name" in value) {
    return String((value as { name: unknown }).name);
  }
  return typeof value === "string" ? value : "";
}

export async function getReservations(): Promise<Reservation[]> {
  const businessId = getBusinessId();
  const records = await fetchAll(TABLES.reservations);

  return records
    .filter((r) => belongsToBusiness(r.fields, FIELDS.reservation.business, businessId))
    .map((r) => {
      const f = r.fields;
      const rawState = selectName(f[FIELDS.reservation.state]);
      const employeeIds = linkedIds(f[FIELDS.reservation.employee]);
      const no = f[FIELDS.reservation.reservationNo];
      const people = f[FIELDS.reservation.numberOfPeople];

      return {
        id: r.id,
        reservationNo: typeof no === "number" ? no : null,
        customerName: (f[FIELDS.reservation.customerName] as string) ?? "Müşteri",
        customerPhone: (f[FIELDS.reservation.customerPhone] as string) ?? null,
        start: (f[FIELDS.reservation.start] as string) ?? null,
        end: (f[FIELDS.reservation.end] as string) ?? null,
        status: mapState(rawState),
        rawState,
        source: mapSource(selectName(f[FIELDS.reservation.source])),
        note: (f[FIELDS.reservation.note] as string) ?? null,
        numberOfPeople: typeof people === "number" ? people : null,
        serviceIds: linkedIds(f[FIELDS.reservation.services]),
        serviceNames: lookupNames(f[FIELDS.reservation.serviceNames]),
        employeeId: employeeIds[0] ?? null,
        employeeName: null, // joined in the page layer against getEmployees()
      } satisfies Reservation;
    })
    .sort((a, b) => (a.start ?? "").localeCompare(b.start ?? ""));
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus
): Promise<void> {
  const base = getBase();
  await base(TABLES.reservations).update([
    { id, fields: { [FIELDS.reservation.state]: STATE_WRITE_VALUE[status] } },
  ]);
  revalidatePath("/takvim");
  revalidatePath("/");
}

export async function createReservation(input: NewReservationInput): Promise<void> {
  const base = getBase();
  const businessId = getBusinessId();
  await base(TABLES.reservations).create([
    {
      fields: {
        [FIELDS.reservation.customerName]: input.customerName,
        [FIELDS.reservation.customerPhone]: input.customerPhone,
        [FIELDS.reservation.business]: [businessId],
        [FIELDS.reservation.services]: [input.serviceId],
        [FIELDS.reservation.employee]: [input.employeeId],
        [FIELDS.reservation.start]: input.start,
        [FIELDS.reservation.end]: input.end,
        [FIELDS.reservation.numberOfPeople]: input.numberOfPeople,
        [FIELDS.reservation.state]: "Onay Bekliyor",
        [FIELDS.reservation.source]: "Manuel",
        [FIELDS.reservation.note]: input.note ?? "",
      },
    },
  ]);
  revalidatePath("/takvim");
  revalidatePath("/");
}
