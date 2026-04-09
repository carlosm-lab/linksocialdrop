"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export function BottomNavBar() {
  const currentPath = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full rounded-t-[1.5rem] bg-[#111316]/80 shadow-[0_-12px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl md:hidden">
      <div className="flex w-full items-center justify-around px-4 pt-2 pb-6">
        <NavItem
          href="/admin/links"
          icon="link"
          label="Links"
          isActive={currentPath === "/admin/links"}
        />
        <NavItem
          href="/admin/appearance"
          icon="palette"
          label="Appearance"
          isActive={currentPath === "/admin/appearance"}
        />
        <NavItem
          href="/admin/analytics"
          icon="leaderboard"
          label="Analytics"
          isActive={currentPath === "/admin/analytics"}
        />
        <NavItem
          href="/admin/settings"
          icon="settings"
          label="Settings"
          isActive={currentPath === "/admin/settings"}
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
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl px-4 py-2 transition-all duration-200",
        isActive
          ? "scale-95 bg-[#00F5FF]/10 text-[#00F5FF]"
          : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"
      )}
    >
      <Icon
        name={icon}
        style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}
      />
      <span className="mt-1 font-['Inter'] text-[10px] tracking-[0.05em] uppercase">
        {label}
      </span>
    </Link>
  );
}
