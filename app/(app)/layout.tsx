import Link from "next/link";
import { brand } from "@/lib/brand";
import { BottomNav, SideNav } from "@/components/shell/Nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-cream">
      {/* Mobile brand header */}
      <header className="sticky top-0 z-20 border-b border-hairline bg-cream/90 backdrop-blur md:hidden">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <Monogram />
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold tracking-tightish">
              {brand.name}
            </p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
              {brand.tagline}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl md:gap-8 md:px-8 md:py-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="sticky top-8">
            <Link href="/" className="mb-8 flex items-center gap-3">
              <Monogram />
              <div className="leading-tight">
                <p className="font-display text-xl font-semibold tracking-tightish">
                  {brand.name}
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                  {brand.tagline}
                </p>
              </div>
            </Link>
            <SideNav />
            {brand.showPoweredBy && (
              <p className="mt-10 text-[11px] text-muted/70">
                Powered by Reself
              </p>
            )}
          </div>
        </aside>

        {/* Main column */}
        <main
          className="w-full min-w-0 px-5 pt-5 md:px-0 md:pb-0 md:pt-0"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 96px)" }}
        >
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

function Monogram() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink">
      <span className="font-display text-lg font-semibold text-clay-soft">
        {brand.monogram}
      </span>
    </span>
  );
}
