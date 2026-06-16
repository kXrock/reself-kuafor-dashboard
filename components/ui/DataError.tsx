import { PlugZap } from "lucide-react";

export function DataError({ message }: { message: string }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-12 text-center">
      <PlugZap className="mb-3 text-clay" size={28} strokeWidth={1.6} />
      <p className="font-display text-lg font-medium text-ink">
        Bağlantı kurulamadı
      </p>
      <p className="mt-1.5 max-w-sm text-sm text-muted">{message}</p>
      <p className="mt-4 max-w-sm text-xs text-muted/80">
        <code className="rounded bg-hairline/50 px-1.5 py-0.5">.env.local</code>{" "}
        dosyasındaki Airtable anahtarlarını kontrol edip sayfayı yenileyin.
      </p>
    </div>
  );
}
