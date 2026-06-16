# Kerem'in Kuaförü · Randevu Paneli

White-label, kurulabilir (PWA) staff dashboard. Veriler **canlı Airtable** base'inden
gelir; "Akıllı İçgörü" (Analitik) sayfası bilinçli olarak örnek/mock veridir.

## Kurulum

```bash
npm install
cp .env.local.example .env.local   # zaten oluşturuldu; sadece API key'i doldurun
npm run dev
```

`.env.local` içine **kendi Airtable Personal Access Token'ınızı** girin:

```
AIRTABLE_API_KEY=pat_xxx        # ← tek doldurmanız gereken alan
AIRTABLE_BASE_ID=appTewXqMoLGKvlU3      # Rezervasyon_App
AIRTABLE_BUSINESS_ID=rechno3sDdqoeBMtP  # Kerem'in Kuaförü (tenant)
```

Token kapsamları: `data.records:read`, `data.records:write`, `schema.bases:read`.
Token girilmeden uygulama anlamlı bir "bağlantı kurulamadı" ekranı gösterir (sessizce mock'a düşmez).

## Komutlar

| Komut | Açıklama |
|------|----------|
| `npm run dev` | Geliştirme sunucusu (localhost:3000) |
| `npm run build && npm start` | Production + tam PWA (kurulabilirlik/SW dev'de kapalı) |
| `npm run icons` | Marka monogram ikonlarını yeniden üretir |

## Mimari

- **Sunum**: `app/(app)/*` sayfaları (Bugün, Takvim, Çalışanlar, Hizmetler) ve mock `analitik`.
- **Veri katmanı**: `lib/data/*` — tüm Airtable çağrıları burada, **server-only**.
  Supabase'e geçişte yalnızca bu dosyaların içi değişir; tipler (`lib/types.ts`) ve
  bileşenler aynı kalır.
- **Yazma**: durum değiştirme / yeni randevu / hizmet ekle-düzenle → gerçek Airtable
  `update`/`create` (Server Actions, `app/actions.ts`).
- **Marka**: `lib/brand.ts` tek kaynak — isim/renk/logo buradan değişir (white-label).
- **Tasarım sistemi**: `tailwind.config.ts` + `app/globals.css` tokenları (krem/espresso/terracotta,
  Fraunces + Work Sans).

## Airtable şema notları

Bu base **çok kiracılı** (İşletmeler tablosu). Panel `AIRTABLE_BUSINESS_ID` ile tek
işletmeye scope'lanır. Prototip için Hizmetler'e `Fiyat`/`Kategori`, Rezervasyonlar'a
`Kaynak`/`Not` alanları eklendi ve demo verisi bu haftaya tarihlendirildi.
