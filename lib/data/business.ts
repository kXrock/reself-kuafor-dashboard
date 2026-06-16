import "server-only";
import {
  FIELDS,
  TABLES,
  fetchAll,
  getBusinessId,
} from "@/lib/airtable";
import type { Business } from "@/lib/types";

function selectName(value: unknown): string | null {
  if (value && typeof value === "object" && "name" in value) {
    return String((value as { name: unknown }).name);
  }
  return typeof value === "string" ? value : null;
}

export async function getBusiness(): Promise<Business> {
  const businessId = getBusinessId();
  const records = await fetchAll(TABLES.businesses);
  const record = records.find((r) => r.id === businessId);

  if (!record) {
    throw new Error(
      `İşletme kaydı bulunamadı (${businessId}). AIRTABLE_BUSINESS_ID değerini kontrol edin.`
    );
  }

  const f = record.fields;
  return {
    id: record.id,
    name: (f[FIELDS.business.name] as string) ?? "İşletme",
    sector: selectName(f[FIELDS.business.sector]),
    workingHours: (f[FIELDS.business.workingHours] as string) ?? null,
  };
}
