"use server";

import {
  createReservation,
  updateReservationStatus,
} from "@/lib/data/reservations";
import { createService, updateService } from "@/lib/data/services";
import type { NewReservationInput, ReservationStatus } from "@/lib/types";

export async function setReservationStatusAction(
  id: string,
  status: ReservationStatus
): Promise<{ ok: boolean; error?: string }> {
  try {
    await updateReservationStatus(id, status);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Bilinmeyen hata" };
  }
}

export async function createReservationAction(
  input: NewReservationInput
): Promise<{ ok: boolean; error?: string }> {
  try {
    await createReservation(input);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Bilinmeyen hata" };
  }
}

export async function createServiceAction(input: {
  name: string;
  durationMin: number;
  price: number;
  category: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    await createService(input);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Bilinmeyen hata" };
  }
}

export async function updateServiceAction(
  id: string,
  input: { name?: string; durationMin?: number; price?: number; category?: string }
): Promise<{ ok: boolean; error?: string }> {
  try {
    await updateService(id, input);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Bilinmeyen hata" };
  }
}
