import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PageViewTracker } from "./PageViewTracker";
import { PublicLinkItem } from "./PublicLinkItem";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string; locale: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  // Obtener Perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) {
    notFound();
  }

  // Obtener Links (solo visibles, ordenados)
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", profile.id)
    .eq("visible", true)
    .order("position", { ascending: true });

  return <ProfileContent profile={profile} links={links || []} />;
}

function ProfileContent({ profile, links }: { profile: any; links: any[] }) {
  const t = useTranslations("profile");
  const tc = useTranslations("common");

  // Custom typography based on profile.font_family
  let fontClass = "font-sans";
  if (profile.font_family === "Epilogue") fontClass = "font-headline";
  else if (profile.font_family === "Inter") fontClass = "font-body";

  // Accent color overrides
  const customAccentStyle = profile.accent_color
    ? { color: profile.accent_color }
    : {};
  const customBgStyle = profile.accent_color
    ? { backgroundColor: profile.accent_color }
    : {};

  // Base text color when hover/bg overrides happen
  const textColorClass = profile.accent_color ? "" : "text-primary-container";
  const bgColorClass = "bg-surface-container-highest";

  return (
    <div
      className={`bg-surface text-on-surface ${fontClass} selection:bg-primary-container selection:text-on-primary-container relative z-0 flex min-h-screen flex-col items-center`}
    >
      <PageViewTracker profileId={profile.id} />

      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,_#1e2023_0%,_#111316_70%)] opacity-50"></div>

      <main className="relative z-10 flex w-full max-w-md flex-col items-center px-6 py-12">
        <header className="mb-12 flex w-full flex-col items-center">
          <div className="relative mb-6">
            <div className="luminous-gradient pointer-events-none absolute inset-0 scale-110 rounded-full opacity-20 blur-2xl"></div>
            <img
              alt={`Portrait of ${profile.full_name || profile.username}`}
              className="border-surface-container-high relative z-10 h-32 w-32 rounded-full border-4 object-cover"
              src={
                profile.avatar_url ||
                "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
              }
            />
          </div>
          <div className="text-center">
            <h1
              className="mb-2 text-3xl font-black tracking-tighter"
              style={customAccentStyle}
            >
              @{profile.username}
            </h1>
            <p className="text-on-surface-variant mx-auto max-w-xs text-base leading-relaxed">
              {profile.bio || `${profile.username} profile`}
            </p>
          </div>
        </header>

        <div className="mb-16 w-full space-y-4">
          {links.length === 0 ? (
            <p className="text-center text-slate-500 italic">
              No links added yet.
            </p>
          ) : (
            links.map((link) => (
              <PublicLinkItem
                key={link.id}
                link={link}
                buttonStyle={profile.button_style}
                textColorClass={textColorClass}
                bgColorClass={bgColorClass}
              />
            ))
          )}

          <div className="w-full pt-8">
            <div className="bg-surface-container-low border-outline-variant/10 relative overflow-hidden rounded-2xl border p-6">
              <div className="luminous-gradient pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-10 blur-3xl"></div>
              <h3
                className="relative z-10 mb-2 text-lg font-bold tracking-tight"
                style={customAccentStyle}
              >
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
                  size="pill"
                  className="text-on-primary-fixed font-bold shadow-none"
                  style={
                    profile.accent_color
                      ? { backgroundColor: profile.accent_color }
                      : {}
                  }
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
            <Link
              href="/privacy"
              className="hover:text-on-surface transition-colors"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/terms"
              className="hover:text-on-surface transition-colors"
            >
              {t("terms")}
            </Link>
            <Link
              href="/support"
              className="hover:text-on-surface transition-colors"
            >
              {t("report")}
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
