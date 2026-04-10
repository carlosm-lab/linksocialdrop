"use client";

import { useLocale } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeLabels: Record<string, string> = {
  es: "ES",
  en: "EN",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 px-1 py-0.5">
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase transition-all ${
            locale === loc
              ? "bg-primary-container text-on-primary-container"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {localeLabels[loc]}
        </Link>
      ))}
    </div>
  );
}
