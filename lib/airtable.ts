import "server-only";
import Airtable, { type FieldSet, type Records } from "airtable";

/**
 * Server-only Airtable client. The API key never reaches the browser because
 * every consumer of this module is a Server Component / Server Action / Route
 * Handler. If env vars are missing we throw a typed, meaningful error rather
 * than silently falling back to mock data.
 */

export class AirtableConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AirtableConfigError";
  }
}

export const TABLES = {
  businesses: "tblEvewLgmLtM29z9",
  reservations: "tbl5Tft1Tb01WGHbO",
  services: "tblHP2pfnutWSWAxb",
  employees: "tblJIGBIk8GcHSQrV",
} as const;

// Exact Airtable field IDs (resilient to display-name changes).
export const FIELDS = {
  business: {
    name: "fldpeGyABh6cZ47hH",
    sector: "fld8YjgHemeMI5POP",
    workingHours: "fldP5p3yUuwXgVMYM",
  },
  reservation: {
    reservationNo: "fldvZiNkw0V7o9C8c",
    customerName: "fldFeJlhSeYetEKl0",
    customerPhone: "fldpNtrAfwNQ3khDP",
    business: "fldi1NeWWfcyQ2rln",
    start: "fldKVNLBbT8R0lasw",
    end: "fld7Y14wFwuIsOL5S",
    services: "fld40B3eXQry82nJR",
    serviceNames: "fldR1if1lyU7KkNZo",
    numberOfPeople: "fld6Jo3GXivgqpjkJ",
    state: "fldf2rMDctpzxQ9G8",
    employee: "fldwbfIeDcc7gqWsM",
    source: "fldApA3DvhQIGhmkU",
    note: "fldPyaABpgM1E9iAi",
  },
  service: {
    name: "fldr23411iOtswNv6",
    durationMin: "fldwxhpdCb0MThTR5",
    business: "fldocmvZ6TKWAF8wm",
    employees: "fld9ntpWBJ9jEtHlX",
    price: "fldnVEgyYVma55VIl",
    category: "fldNhRGyoEIKSxUQu",
  },
  employee: {
    name: "fld8dKhKXYOQmHTh1",
    workingHours: "fld2hzDsQA1QnTfmu",
    business: "fldA3n2DWqZXUfYX3",
    services: "fld1b4E3rkJ0GU7V5",
  },
} as const;

let cachedBase: Airtable.Base | null = null;

export function getBase(): Airtable.Base {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    throw new AirtableConfigError(
      "Airtable bağlantısı yapılandırılmamış. .env.local içine AIRTABLE_API_KEY ve AIRTABLE_BASE_ID ekleyin."
    );
  }

  if (!cachedBase) {
    cachedBase = new Airtable({ apiKey }).base(baseId);
  }
  return cachedBase;
}

export function getBusinessId(): string {
  const id = process.env.AIRTABLE_BUSINESS_ID;
  if (!id) {
    throw new AirtableConfigError(
      "AIRTABLE_BUSINESS_ID tanımlı değil — dashboard hangi işletmeye bağlanacağını bilmiyor."
    );
  }
  return id;
}

/**
 * Fetch all records of a table (handles pagination).
 * `returnFieldsByFieldId` is REQUIRED so record.fields is keyed by field ID
 * (fldXXX) instead of the display name — our FIELDS map uses IDs.
 */
export async function fetchAll(tableId: string): Promise<Records<FieldSet>> {
  const base = getBase();
  return base(tableId).select({ pageSize: 100, returnFieldsByFieldId: true }).all();
}

/** Linked-record fields come back as arrays of record IDs. Normalize safely. */
export function linkedIds(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string");
  }
  return [];
}

/** A record belongs to our tenant if its business link includes our business id. */
export function belongsToBusiness(
  fields: FieldSet,
  businessFieldId: string,
  businessId: string
): boolean {
  return linkedIds(fields[businessFieldId]).includes(businessId);
}
