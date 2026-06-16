import "server-only";
import {
  FIELDS,
  TABLES,
  belongsToBusiness,
  fetchAll,
  getBusinessId,
} from "@/lib/airtable";
import type { Employee } from "@/lib/types";

/** Linked "Verdiği Hizmetler" come back as [{id, name}] expansions or id arrays. */
function linkedNames(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => {
      if (v && typeof v === "object" && "name" in v) {
        return String((v as { name: unknown }).name);
      }
      return null;
    })
    .filter((v): v is string => Boolean(v));
}

export async function getEmployees(): Promise<Employee[]> {
  const businessId = getBusinessId();
  const records = await fetchAll(TABLES.employees);

  return records
    .filter(
      (r) =>
        belongsToBusiness(r.fields, FIELDS.employee.business, businessId) &&
        Boolean(r.fields[FIELDS.employee.name])
    )
    .map((r) => {
      const f = r.fields;
      return {
        id: r.id,
        name: (f[FIELDS.employee.name] as string) ?? "Personel",
        workingHours: (f[FIELDS.employee.workingHours] as string) ?? null,
        serviceNames: linkedNames(f[FIELDS.employee.services]),
      } satisfies Employee;
    })
    .sort((a, b) => a.name.localeCompare(b.name, "tr"));
}
