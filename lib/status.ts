import type { ReservationStatus, ReservationSource } from "./types";

/**
 * Maps the 7 raw Airtable `State` options into 4 UI buckets.
 * Client-safe (no server-only imports) so badges can use it anywhere.
 */
export function mapState(rawState: string | undefined | null): ReservationStatus {
  switch ((rawState ?? "").trim()) {
    case "Onaylandı":
    case "Müşteri Onayladı":
      return "onaylandi";
    case "İptal Edildi":
      return "iptal";
    case "Tamamlandı":
      return "tamamlandi";
    case "Yeni Oluşturuldu":
    case "Onay Bekliyor":
    case "Beklemede":
    default:
      return "beklemede";
  }
}

/** The canonical Airtable `State` value we write back for each UI action. */
export const STATE_WRITE_VALUE: Record<ReservationStatus, string> = {
  onaylandi: "Onaylandı",
  beklemede: "Onay Bekliyor",
  iptal: "İptal Edildi",
  tamamlandi: "Tamamlandı",
};

export const STATUS_META: Record<
  ReservationStatus,
  { label: string; dot: string; chipBg: string; chipText: string; chipBorder: string }
> = {
  onaylandi: {
    label: "Onaylandı",
    dot: "#3F7A57",
    chipBg: "rgba(63,122,87,0.10)",
    chipText: "#2E5C41",
    chipBorder: "rgba(63,122,87,0.28)",
  },
  beklemede: {
    label: "Beklemede",
    dot: "#B5872B",
    chipBg: "rgba(181,135,43,0.12)",
    chipText: "#8A6516",
    chipBorder: "rgba(181,135,43,0.30)",
  },
  iptal: {
    label: "İptal",
    dot: "#A8503C",
    chipBg: "rgba(168,80,60,0.10)",
    chipText: "#8A3C2B",
    chipBorder: "rgba(168,80,60,0.26)",
  },
  tamamlandi: {
    label: "Tamamlandı",
    dot: "#8A7E70",
    chipBg: "rgba(138,126,112,0.12)",
    chipText: "#5F564C",
    chipBorder: "rgba(138,126,112,0.30)",
  },
};

export function mapSource(raw: string | undefined | null): ReservationSource {
  return (raw ?? "").trim() === "Manuel" ? "manuel" : "whatsapp";
}
