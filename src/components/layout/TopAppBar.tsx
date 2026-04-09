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
            <Icon name="menu" className="text-on-surface" />
          </div>
        </div>
      </div>
    </header>
  );
}
