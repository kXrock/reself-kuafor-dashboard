import "server-only";
import { revalidatePath } from "next/cache";
import type { FieldSet } from "airtable";
import {
  FIELDS,
  TABLES,
  belongsToBusiness,
  fetchAll,
  getBase,
  getBusinessId,
  linkedIds,
} from "@/lib/airtable";
import type { Service } from "@/lib/types";

function selectName(value: unknown): string | null {
  if (value && typeof value === "object" && "name" in value) {
    return String((value as { name: unknown }).name);
  }
  return typeof value === "string" ? value : null;
}

export async function getServices(): Promise<Service[]> {
  const businessId = getBusinessId();
  const records = await fetchAll(TABLES.services);

  return records
    .filter(
      (r) =>
        belongsToBusiness(r.fields, FIELDS.service.business, businessId) &&
        Boolean(r.fields[FIELDS.service.name])
    )
    .map((r) => {
      const f = r.fields;
      const price = f[FIELDS.service.price];
      const duration = f[FIELDS.service.durationMin];
      return {
        id: r.id,
        name: (f[FIELDS.service.name] as string) ?? "Hizmet",
        durationMin: typeof duration === "number" ? duration : 0,
        price: typeof price === "number" ? price : null,
        category: selectName(f[FIELDS.service.category]),
        employeeIds: linkedIds(f[FIELDS.service.employees]),
      } satisfies Service;
    })
    .sort((a, b) => a.name.localeCompare(b.name, "tr"));
}

export async function updateService(
  id: string,
  data: { name?: string; durationMin?: number; price?: number; category?: string }
): Promise<void> {
  const base = getBase();
  const fields: Partial<FieldSet> = {};
  if (data.name !== undefined) fields[FIELDS.service.name] = data.name;
  if (data.durationMin !== undefined) fields[FIELDS.service.durationMin] = data.durationMin;
  if (data.price !== undefined) fields[FIELDS.service.price] = data.price;
  if (data.category !== undefined) fields[FIELDS.service.category] = data.category;

  await base(TABLES.services).update([{ id, fields }]);
  revalidatePath("/hizmetler");
}

export async function createService(data: {
  name: string;
  durationMin: number;
  price: number;
  category: string;
}): Promise<void> {
  const base = getBase();
  const businessId = getBusinessId();
  await base(TABLES.services).create([
    {
      fields: {
        [FIELDS.service.name]: data.name,
        [FIELDS.service.durationMin]: data.durationMin,
        [FIELDS.service.price]: data.price,
        [FIELDS.service.category]: data.category,
        [FIELDS.service.business]: [businessId],
      },
    },
  ]);
  revalidatePath("/hizmetler");
}
