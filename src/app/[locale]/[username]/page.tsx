import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string; locale: string }>;
}) {
  const { username } = await params;

  return <ProfileContent username={username} />;
}

function ProfileContent({ username }: { username: string }) {
  const t = useTranslations("profile");
  const tc = useTranslations("common");

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container relative z-0 flex min-h-screen flex-col items-center">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,_#1e2023_0%,_#111316_70%)] opacity-50"></div>

      <main className="relative z-10 flex w-full max-w-md flex-col items-center px-6 py-12">
        <header className="mb-12 flex w-full flex-col items-center">
          <div className="relative mb-6">
            <div className="luminous-gradient pointer-events-none absolute inset-0 scale-110 rounded-full opacity-20 blur-2xl"></div>
            <img
              alt="Portrait of a digital curator"
              className="border-surface-container-high relative z-10 h-32 w-32 rounded-full border-4 object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN0E8vQWNuWerSDQcKGUUDDPOHEG5ObMWlrc9ZKnjX58yqTKzvzSLl7e4datDpcpBUqsCma3Do8OIzSfN7z3aOkdCax2SLqlhnCkCcdSroe0J5X73saSUER3YpzmjoiIplTNYpNySdf7nSpy_9H0cSUkAsO61Kp166nRhcAKGpQeYcVBURdn-S6rsW_Hk0GbO-lUHlD43ycnJBTT655Qjp9NkGQefEhgyE7PrgfNNdIqmeCmOxpLCZITcEyekUpTMuWlcEjEaKvVk"
            />
          </div>
          <div className="text-center">
            <h1 className="font-headline text-primary-container mb-2 text-3xl font-black tracking-tighter">
              @{username || "alexandra_flows"}
            </h1>
            <p className="text-on-surface-variant font-body mx-auto max-w-xs text-base leading-relaxed">
              Digital Curator &amp; Multimedia Artist. Exploring the
              intersection of generative aesthetics and obsidian spaces.
            </p>
          </div>
        </header>

        <div className="mb-16 w-full space-y-4">
          <Link
            href="#"
            className="group bg-surface-container-low hover:bg-surface-container-high relative flex w-full items-center rounded-xl p-4 transition-all duration-300 active:scale-[0.98]"
          >
            <div className="bg-surface-container-highest text-primary-container group-hover:luminous-gradient group-hover:text-on-primary-fixed flex h-12 w-12 items-center justify-center rounded-full transition-colors">
              <Icon name="camera" />
            </div>
            <span className="font-label ml-4 text-lg font-medium tracking-tight">
              Instagram
            </span>
            <Icon
              name="arrow_forward"
              className="text-primary-container ml-auto opacity-0 transition-opacity group-hover:opacity-100"
            />
          </Link>

          <Link
            href="#"
            className="group bg-surface-container-low hover:bg-surface-container-high relative flex w-full items-center rounded-xl p-4 transition-all duration-300 active:scale-[0.98]"
          >
            <div className="bg-surface-container-highest text-primary-container group-hover:luminous-gradient group-hover:text-on-primary-fixed flex h-12 w-12 items-center justify-center rounded-full transition-colors">
              <Icon name="brand_awareness" />
            </div>
            <span className="font-label ml-4 text-lg font-medium tracking-tight">
              Twitter / X
            </span>
            <Icon
              name="arrow_forward"
              className="text-primary-container ml-auto opacity-0 transition-opacity group-hover:opacity-100"
            />
          </Link>

          <Link
            href="#"
            className="group bg-surface-container-low hover:bg-surface-container-high relative flex w-full items-center rounded-xl p-4 transition-all duration-300 active:scale-[0.98]"
          >
            <div className="bg-surface-container-highest text-primary-container group-hover:luminous-gradient group-hover:text-on-primary-fixed flex h-12 w-12 items-center justify-center rounded-full transition-colors">
              <Icon name="play_circle" />
            </div>
            <span className="font-label ml-4 text-lg font-medium tracking-tight">
              YouTube
            </span>
            <Icon
              name="arrow_forward"
              className="text-primary-container ml-auto opacity-0 transition-opacity group-hover:opacity-100"
            />
          </Link>

          <Link
            href="#"
            className="group bg-surface-container-low hover:bg-surface-container-high relative flex w-full items-center rounded-xl p-4 transition-all duration-300 active:scale-[0.98]"
          >
            <div className="bg-surface-container-highest text-primary-container group-hover:luminous-gradient group-hover:text-on-primary-fixed flex h-12 w-12 items-center justify-center rounded-full transition-colors">
              <Icon name="language" />
            </div>
            <span className="font-label ml-4 text-lg font-medium tracking-tight">
              Official Website
            </span>
            <Icon
              name="arrow_forward"
              className="text-primary-container ml-auto opacity-0 transition-opacity group-hover:opacity-100"
            />
          </Link>

          <Link
            href="#"
            className="group bg-surface-container-low hover:bg-surface-container-high relative flex w-full items-center rounded-xl p-4 transition-all duration-300 active:scale-[0.98]"
          >
            <div className="bg-surface-container-highest text-primary-container group-hover:luminous-gradient group-hover:text-on-primary-fixed flex h-12 w-12 items-center justify-center rounded-full transition-colors">
              <Icon name="shopping_bag" />
            </div>
            <span className="font-label ml-4 text-lg font-medium tracking-tight">
              Shop Collection
            </span>
            <Icon
              name="arrow_forward"
              className="text-primary-container ml-auto opacity-0 transition-opacity group-hover:opacity-100"
            />
          </Link>

          <div className="w-full pt-8">
            <div className="bg-surface-container-low border-outline-variant/10 relative overflow-hidden rounded-2xl border p-6">
              <div className="luminous-gradient pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-10 blur-3xl"></div>
              <h3 className="font-headline text-primary relative z-10 mb-2 text-lg font-bold tracking-tight">
                {t("joinNewsletter")}
              </h3>
              <p className="text-on-surface-variant relative z-10 mb-4 text-sm">
                {t("newsletterDesc")}
              </p>
              <div className="relative z-10 flex gap-2">
                <input
                  className="bg-surface-container-highest text-on-surface focus:ring-primary-container/40 flex-1 rounded-lg border-none px-3 text-sm outline-none placeholder:text-slate-500 focus:ring-1"
                  placeholder="email@example.com"
                  type="email"
                />
                <Button
                  variant="luminous"
                  size="pill"
                  className="text-on-primary-fixed font-bold shadow-none"
                >
                  {tc("join")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-auto py-8 text-center">
          <div className="group flex cursor-default items-center justify-center gap-2 text-slate-500">
            <span className="font-label text-[10px] tracking-[0.2em] uppercase transition-colors hover:text-slate-400">
              {t("madeWith")}
            </span>
            <div className="group-hover:text-primary-container flex items-center gap-1 transition-colors">
              <span className="font-headline text-sm font-black tracking-tighter">
                {tc("brandName")}
              </span>
              <Icon name="water_drop" className="text-[14px]" />
            </div>
          </div>
          <div className="font-label mt-4 flex justify-center gap-6 text-[10px] tracking-[0.1em] text-slate-600 uppercase">
            <Link href="#" className="hover:text-on-surface transition-colors">
              {t("privacy")}
            </Link>
            <Link href="#" className="hover:text-on-surface transition-colors">
              {t("terms")}
            </Link>
            <Link href="#" className="hover:text-on-surface transition-colors">
              {t("report")}
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
