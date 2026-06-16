"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutGrid,
  Scissors,
  Sparkles,
  Users,
} from "lucide-react";

const items = [
  { href: "/", label: "Bugün", icon: LayoutGrid },
  { href: "/takvim", label: "Takvim", icon: CalendarDays },
  { href: "/calisanlar", label: "Ekip", icon: Users },
  { href: "/hizmetler", label: "Hizmetler", icon: Scissors },
  { href: "/analitik", label: "İçgörü", icon: Sparkles },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-surface/95 backdrop-blur md:hidden">
      <ul className="mx-auto flex max-w-2xl items-stretch justify-between px-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="flex flex-col items-center gap-1 py-2.5 text-[11px]"
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.2 : 1.7}
                  className={active ? "text-clay" : "text-muted"}
                />
                <span className={active ? "font-semibold text-ink" : "text-muted"}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SideNav() {
  const pathname = usePathname();
  return (
    <nav className="hidden md:block">
      <ul className="space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-clay/10 font-semibold text-ink"
                    : "text-muted hover:bg-hairline/40 hover:text-ink"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.7} className={active ? "text-clay" : ""} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
