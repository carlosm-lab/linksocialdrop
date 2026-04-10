"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { signOut } from "@/actions/auth";
import Image from "next/image";

interface TopAppBarProps {
  isAuthenticated?: boolean;
  avatarUrl?: string;
}

export function TopAppBar({
  isAuthenticated = false,
  avatarUrl,
}: TopAppBarProps) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-[#111316]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Icon
            name="grid_view"
            className="flex-shrink-0 text-2xl text-[#00F5FF]"
            style={{ width: "24px", height: "24px" }}
          />
          <Link
            href="/"
            onClick={closeMenu}
            className="font-headline text-xl font-black tracking-tighter text-[#00F5FF]"
            style={{ minHeight: "28px" }}
          >
            LinkSocialDrop
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <Link
              href="/admin/links"
              className="text-slate-400 transition-colors hover:text-[#63f7ff]"
            >
              {t("links")}
            </Link>
            <Link
              href="/admin/appearance"
              className="text-slate-400 transition-colors hover:text-[#63f7ff]"
            >
              {t("appearance")}
            </Link>
            <Link
              href="/admin/analytics"
              className="text-slate-400 transition-colors hover:text-[#63f7ff]"
            >
              {t("analytics")}
            </Link>

            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="border-primary-container/20 ml-4 h-10 w-10 overflow-hidden rounded-full border-2">
                  {avatarUrl ? (
                    <Image
                      alt="User Profile"
                      className="h-full w-full object-cover"
                      src={avatarUrl}
                      width={119}
                      height={119}
                      quality={75}
                    />
                  ) : (
                    <div className="bg-primary-container/20 flex h-full w-full items-center justify-center">
                      <Icon
                        name="person"
                        className="text-primary-container text-lg"
                      />
                    </div>
                  )}
                </div>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="text-slate-400 transition-colors hover:text-red-400"
                    title="Sign out"
                  >
                    <Icon name="logout" className="text-xl" />
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  variant="luminous"
                  className="ml-4 rounded-full px-6 py-2.5 transition-transform hover:scale-[0.98]"
                >
                  {tc("getStarted")}
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-on-surface p-2"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <Icon name={isMobileMenuOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="bg-surface/95 absolute top-full left-0 w-full overflow-hidden border-b border-white/5 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col space-y-6 p-6 text-base font-medium">
            <Link
              href="/admin/links"
              onClick={closeMenu}
              className="text-slate-300 transition-colors hover:text-[#63f7ff]"
            >
              {t("links")}
            </Link>
            <Link
              href="/admin/appearance"
              onClick={closeMenu}
              className="text-slate-300 transition-colors hover:text-[#63f7ff]"
            >
              {t("appearance")}
            </Link>
            <Link
              href="/admin/analytics"
              onClick={closeMenu}
              className="text-slate-300 transition-colors hover:text-[#63f7ff]"
            >
              {t("analytics")}
            </Link>

            <div className="border-t border-white/10 pt-4">
              <LanguageSwitcher />
            </div>

            <div className="border-t border-white/10 pt-4">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="border-primary-container/20 h-10 w-10 overflow-hidden rounded-full border-2">
                      {avatarUrl ? (
                        <Image
                          alt="User Profile"
                          className="h-full w-full object-cover"
                          src={avatarUrl}
                          width={119}
                          height={119}
                          quality={75}
                        />
                      ) : (
                        <div className="bg-primary-container/20 flex h-full w-full items-center justify-center">
                          <Icon
                            name="person"
                            className="text-primary-container text-lg"
                          />
                        </div>
                      )}
                    </div>
                    <span className="text-slate-300">{tc("account")}</span>
                  </div>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="flex items-center gap-2 text-slate-400 transition-colors hover:text-red-400"
                    >
                      <span>{tc("signOut")}</span>
                      <Icon name="logout" className="text-xl" />
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="block w-full"
                >
                  <Button
                    variant="luminous"
                    className="w-full rounded-full py-3"
                  >
                    {tc("getStarted")}
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
