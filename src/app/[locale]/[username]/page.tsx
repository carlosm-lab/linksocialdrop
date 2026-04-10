import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

import { notFound } from "next/navigation";
import { PageViewTracker } from "./PageViewTracker";
import { PublicLinkItem } from "./PublicLinkItem";
import type { Metadata, ResolvingMetadata } from "next";
import { siteConfig } from "@/config/site";
import { getContrastColor } from "@/lib/colors";

export const revalidate = 60; // Regenerar la caché en background cada 60 segundos (ISR)

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Creamos un cliente público sin cookies para permitir caching estático e ISR
const supabasePublic = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata(
  { params }: { params: Promise<{ username: string; locale: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { username, locale } = await params;

  // Obtener Perfil
  const { data: profile } = await supabasePublic
    .from("profiles")
    .select("username, full_name, bio, avatar_url")
    .eq("username", username)
    .single();

  if (!profile) {
    return {
      title: "Not Found",
      description: "Profile not found",
    };
  }

  const displayName = profile.full_name || profile.username;
  const title = `${displayName} (@${profile.username}) | ${siteConfig.name}`;
  const description =
    profile.bio ||
    `Visita el perfil de ${displayName} en ${siteConfig.name} para descubrir todos sus enlaces importantes en un solo lugar.`;
  const url = `${siteConfig.url}/${locale}/${profile.username}`;
  const imageUrl = profile.avatar_url || siteConfig.ogImage;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: `Avatar de ${displayName}`,
        },
      ],
      locale,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.url}/en/${profile.username}`,
        es: `${siteConfig.url}/es/${profile.username}`,
      },
    },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string; locale: string }>;
}) {
  const { username } = await params;

  // PERF-003: Single query with embedded links join (replaces 2 sequential queries)
  const { data: profile } = await supabasePublic
    .from("profiles")
    .select("*, links(*)")
    .eq("username", username)
    .single();

  if (!profile) {
    notFound();
  }

  // Filter visible links and sort by position
  const links = (profile.links || [])
    .filter((l: any) => l.visible)
    .sort((a: any, b: any) => a.position - b.position);

  // SEO-003: JSON-LD structured data for Person
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.full_name || username,
    url: `${siteConfig.url}/${username}`,
    ...(profile.bio && { description: profile.bio }),
    ...(profile.avatar_url && { image: profile.avatar_url }),
    sameAs: links.filter((l: any) => l.url).map((l: any) => l.url),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProfileContent profile={profile} links={links} />
    </>
  );
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

  // Base text color when hover/bg overrides happen
  const textColorClass = profile.accent_color ? "" : "text-primary-container";
  const bgColorClass = "bg-surface-container-highest";

  return (
    <div
      className={`bg-surface text-on-surface ${fontClass} selection:bg-primary-container selection:text-on-primary-container relative z-0 flex min-h-screen flex-col items-center`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: profile.full_name || profile.username,
              alternateName: profile.username,
              description: profile.bio || "",
              image: profile.avatar_url || siteConfig.ogImage,
            },
          }),
        }}
      />
      <PageViewTracker profileId={profile.id} />

      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,_#1e2023_0%,_#111316_70%)] opacity-50"></div>

      <main
        id="main-content"
        className="relative z-10 flex w-full max-w-md flex-col items-center px-6 py-12"
      >
        <header className="mb-12 flex w-full flex-col items-center">
          <div className="relative mb-6">
            <div className="luminous-gradient pointer-events-none absolute inset-0 scale-110 rounded-full opacity-20 blur-2xl"></div>
            <Image
              alt={`Portrait of ${profile.full_name || profile.username}`}
              className="border-surface-container-high relative z-10 h-32 w-32 rounded-full border-4 object-cover"
              src={
                profile.avatar_url ||
                "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
              }
              width={128}
              height={128}
              sizes="128px"
              priority
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
                accentColor={profile.accent_color}
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
                  aria-label={t("joinNewsletter")}
                  className="bg-surface-container-highest text-on-surface focus-visible:ring-primary-container focus-visible:ring-offset-background flex-1 rounded-lg border-none px-3 text-sm outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-offset-2"
                  placeholder="email@example.com"
                  type="email"
                />
                <Button
                  size="pill"
                  className="text-on-primary-fixed font-bold shadow-none"
                  style={
                    profile.accent_color
                      ? {
                          backgroundColor: profile.accent_color,
                          color: getContrastColor(profile.accent_color),
                        }
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
