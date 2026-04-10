"use client";

import { usePathname, Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function BottomNavBar() {
  const currentPath = usePathname();
  const t = useTranslations("nav");

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full rounded-t-[1.5rem] bg-[#111316]/80 shadow-[0_-12px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl md:hidden">
      <div className="flex w-full items-center justify-around px-4 pt-2 pb-6">
        <NavItem
          href="/dashboard/links"
          icon="link"
          label={t("links")}
          isActive={currentPath === "/dashboard/links"}
        />
        <NavItem
          href="/dashboard/appearance"
          icon="palette"
          label={t("appearance")}
          isActive={currentPath === "/dashboard/appearance"}
        />
        <NavItem
          href="/dashboard/analytics"
          icon="leaderboard"
          label={t("analytics")}
          isActive={currentPath === "/dashboard/analytics"}
        />
      </div>
    </nav>
  );
}

function NavItem({
  href,
  icon,
  label,
  isActive,
}: {
  href: string;
  icon: string;
  label: string;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl px-4 py-2 transition-all duration-200",
        isActive
          ? "scale-95 bg-[#00F5FF]/10 text-[#00F5FF]"
          : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"
      )}
    >
      <Icon name={icon} />
      <span className="mt-1 font-['Inter'] text-[10px] tracking-[0.05em] uppercase">
        {label}
      </span>
    </Link>
  );
}
