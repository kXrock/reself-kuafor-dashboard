import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { SplashRedirect } from "@/components/shell/SplashRedirect";

export const metadata: Metadata = {
  title: brand.name,
};

export default function SplashPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-ink px-6 text-cream">
      <div className="animate-splash-in flex flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-clay-soft/40 bg-clay/15">
          <span className="font-display text-4xl font-semibold text-clay-soft">
            {brand.monogram}
          </span>
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tightish">
          {brand.name}
        </h1>
        <p className="mt-2 text-sm uppercase tracking-[0.22em] text-cream/55">
          {brand.tagline}
        </p>
      </div>
      <SplashRedirect to="/" delayMs={1500} />
    </main>
  );
}
