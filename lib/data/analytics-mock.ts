/**
 * MOCK analytics data — DELIBERATELY NOT connected to Airtable.
 * This layer exists to show, in the demo, where the product's "Akıllı İçgörü
 * Katmanı" is headed. Numbers are hand-crafted to be realistic for a unisex
 * hair salon. Keep this isolated from the live operational data.
 */

export const HOURS = ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
export const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

// Demand heatmap: intensity 0–4 per [day][hour]. Tue–Wed afternoons hot.
export const demandHeatmap: number[][] = [
  [1, 1, 2, 2, 1, 1, 2, 2, 3, 2, 1], // Pzt
  [1, 2, 2, 3, 4, 4, 4, 3, 3, 2, 1], // Sal
  [2, 2, 3, 3, 4, 4, 4, 4, 3, 2, 2], // Çar
  [1, 2, 2, 2, 3, 3, 3, 4, 3, 2, 1], // Per
  [2, 2, 3, 3, 3, 4, 4, 4, 4, 3, 3], // Cum
  [3, 4, 4, 4, 4, 3, 3, 3, 2, 2, 1], // Cmt
  [0, 0, 1, 1, 2, 2, 2, 1, 1, 0, 0], // Paz
];

export const noShow = {
  ratePct: 8,
  deltaPct: -2, // last 4 weeks
  trend: [12, 11, 10, 9, 8], // weekly
};

export const cancellation = {
  ratePct: 11,
  lastMinuteSharePct: 60, // % of cancellations < 2h before
  buckets: [
    { label: "< 2 saat", value: 60 },
    { label: "2–24 saat", value: 28 },
    { label: "> 24 saat", value: 12 },
  ],
};

export const staffOccupancy = [
  { name: "Ahmet Yılmaz", pct: 82 },
  { name: "Fatma Çelik", pct: 74 },
  { name: "Emre Şahin", pct: 67 },
  { name: "Ayşe Kaya", pct: 61 },
  { name: "Mehmet Demir", pct: 55 },
];

export const revenue = {
  lostEstimateTRY: 4200, // unmet demand this month
  bestSlot: { label: "Cumartesi 11:00–13:00", indexPct: 96 },
  worstSlot: { label: "Salı 11:00–13:00", indexPct: 34 },
  emptySlotSuggestion:
    "Salı 11:00–13:00 düzenli boş kalıyor — bu dilime özel %15 indirimli kampanya öner.",
};

export const customers = {
  newPct: 35,
  returningPct: 65,
  avgBasketTRY: 540,
  basketTrendPct: 6,
  churnRisk: [
    { name: "Selin A.", lastVisit: "3 ay önce", note: "Önceden 2 haftada bir gelirdi" },
    { name: "Kaan T.", lastVisit: "4 ay önce", note: "Düzenli sakal müşterisi" },
    { name: "Derya M.", lastVisit: "3 ay önce", note: "Boya + bakım sabit müşteri" },
    { name: "Onur P.", lastVisit: "5 ay önce", note: "Aylık saç kesimi" },
  ],
};

export const whatsapp = {
  automationResolvedPct: 87,
  avgResponseSec: 14,
  conversionPct: 64, // talep → rezervasyon
  topics: [
    { label: "Müsaitlik sorgusu", value: 41 },
    { label: "Fiyat sorgusu", value: 27 },
    { label: "Randevu değişikliği", value: 18 },
    { label: "Konum / saat", value: 9 },
    { label: "Diğer", value: 5 },
  ],
};

export const comingSoon = [
  {
    title: "Talep Tahmini",
    desc: "Önümüzdeki hafta için gün/saat bazlı talep öngörüsü ve önerilen vardiya planı.",
    phase: "Faz 2",
  },
  {
    title: "Sektör Benchmark",
    desc: "Doluluk, no-show ve sepet büyüklüğünüzü bölgenizdeki benzer salonlarla kıyaslayın.",
    phase: "Faz 3",
  },
];
