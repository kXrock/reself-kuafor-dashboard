/**
 * Application-level types. The Airtable record shapes (Turkish field names) are
 * mapped into these in lib/data/*. UI components only ever see these types — so
 * a future Supabase migration changes only the data layer, not the components.
 */

export type ReservationStatus = "onaylandi" | "beklemede" | "iptal" | "tamamlandi";

export type ReservationSource = "whatsapp" | "manuel";

export interface Service {
  id: string;
  name: string;
  durationMin: number;
  price: number | null;
  category: string | null;
  employeeIds: string[];
}

export interface Employee {
  id: string;
  name: string;
  workingHours: string | null; // "10:00-21:00"
  serviceNames: string[]; // specialty, derived from "Verdiği Hizmetler"
}

export interface Reservation {
  id: string;
  reservationNo: number | null;
  customerName: string;
  customerPhone: string | null;
  start: string | null; // ISO
  end: string | null; // ISO
  status: ReservationStatus;
  rawState: string; // original Airtable State name
  source: ReservationSource;
  note: string | null;
  numberOfPeople: number | null;
  serviceIds: string[];
  serviceNames: string[];
  employeeId: string | null;
  employeeName: string | null;
}

export interface Business {
  id: string;
  name: string;
  sector: string | null;
  workingHours: string | null; // "10:00-21:00"
}

export interface NewReservationInput {
  customerName: string;
  customerPhone: string;
  serviceId: string;
  employeeId: string;
  start: string; // ISO with offset
  end: string; // ISO with offset
  numberOfPeople: number;
  note?: string;
}
