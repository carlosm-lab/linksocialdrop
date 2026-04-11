import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Database } from "@/types/database";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type LinkRow = Database["public"]["Tables"]["links"]["Row"];

import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageViewTracker } from "./PageViewTracker";
import { PublicLinkItem } from "./PublicLinkItem";
import { NewsletterForm } from "./NewsletterForm";
import { SmartBentoGrid } from "@/components/layout/SmartBentoGrid";
import { routing } from "@/i18n/routing";
import type { Metadata, ResolvingMetadata } from "next";
import { siteConfig } from "@/config/site";
import { generateThemeColors } from "@/lib/colors";

export const revalidate = 60; // Regenerar la caché en background cada 60 segundos (ISR)
export const experimental_ppr = true; // Activar Partial Prerendering

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Creamos un cliente público sin cookies para permitir caching estático e ISR
const supabasePublic = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export async function generateMetadata(
  { params }: { params: Promise<{ username: string; locale: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { username, locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  // Obtener Perfil
  const { data: profile } = await supabasePublic
    .from("profiles")
    .select("username, full_name, bio, avatar_url")
    .eq("username", username)
    .single();

  if (!profile) {
    return {
      title: t("profileNotFound"),
      description: t("profileNotFound"),
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
      languages: routing.locales.reduce(
        (acc, l) => {
          acc[l] = `${siteConfig.url}/${l}/${profile.username}`;
          return acc;
        },
        {} as Record<string, string>
      ),
    },
  };
}

export async function generateStaticParams() {
  // Pre-render the public profiles for the first 100 users, others via ISR fallback
  const { data: profiles } = await supabasePublic
    .from("profiles")
    .select("username")
    .limit(100);

  if (!profiles) return [];

  // Los parámetros generados se combinan con el array de locales de layout.tsx
  return profiles
    .filter((p) => p.username)
    .map((p) => ({
      username: p.username,
    }));
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
    .filter((l: LinkRow) => l.visible)
    .sort((a: LinkRow, b: LinkRow) => (a.position ?? 0) - (b.position ?? 0));

  // SEO-003: JSON-LD structured data for Person
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.full_name || username,
    url: `${siteConfig.url}/${username}`,
    ...(profile.bio && { description: profile.bio }),
    ...(profile.avatar_url && { image: profile.avatar_url }),
    sameAs: links.filter((l: LinkRow) => l.url).map((l: LinkRow) => l.url),
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

function ProfileContent({
  profile,
  links,
}: {
  profile: ProfileRow;
  links: LinkRow[];
}) {
  const t = useTranslations("profile");
  const tc = useTranslations("common");

  // Custom typography based on profile.font_family
  const typographyMap: Record<string, string> = {
    Epilogue: "font-headline",
    Inter: "font-body",
  };
  const fontClass = profile.font_family
    ? typographyMap[profile.font_family] || "font-sans"
    : "font-sans";

  // Generate dynamic theme variables ensuring full color harmony
  // Cast allows preparing for future 'custom_text_color' DB migration without TS errors.
  const themeVars = generateThemeColors(
    profile.accent_color || "#00f5ff",
    profile.background_color || "#111316",
    (profile as any).custom_text_color
  );

  const isBento = profile.layout_mode === "bento";

  return (
    <div
      style={themeVars as React.CSSProperties}
      className={`bg-background text-foreground ${fontClass} selection:bg-primary selection:text-primary-foreground relative z-0 flex min-h-screen flex-col items-center`}
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
      <Suspense fallback={null}>
        <PageViewTracker profileId={profile.id} />
      </Suspense>

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
              src={profile.avatar_url || "/images/avatar-placeholder.png"}
              width={128}
              height={128}
              sizes="128px"
              priority
            />
          </div>
          <div className="text-center">
            <h1 className="text-primary mb-2 text-3xl font-black tracking-tighter">
              @{profile.username}
            </h1>
            <p className="text-muted-foreground mx-auto max-w-xs text-base leading-relaxed">
              {profile.bio || `${profile.username} profile`}
            </p>
          </div>
        </header>

        <SmartBentoGrid isBento={isBento}>
          {links.length === 0 ? (
            <p className="col-span-2 w-full py-8 text-center text-slate-500 italic">
              {t("noLinks")}
            </p>
          ) : (
            links.map((link, index) => (
              <PublicLinkItem
                key={link.id}
                link={link}
                buttonStyle={profile.button_style}
                layoutMode={profile.layout_mode}
                index={index}
              />
            ))
          )}
        </SmartBentoGrid>

        <div className={`w-full pt-8 ${isBento ? "col-span-2" : ""}`}>
          <NewsletterForm
            profileId={profile.id}
            texts={{
              title: t("joinNewsletter"),
              description: t("newsletterDesc"),
              placeholder: "email@example.com",
              button: t("joinNewsletter"),
              success: "Done!",
            }}
          />
        </div>

        <footer className="mt-auto py-8 text-center">
          <div className="group flex cursor-default items-center justify-center gap-2 text-slate-500">
            <span className="font-label text-[10px] tracking-[0.2em] uppercase transition-colors hover:text-slate-400">
              {t("madeWith")}
            </span>
            <div className="group-hover:text-primary flex items-center gap-1 transition-colors">
              <span className="font-headline text-sm font-black tracking-tighter">
                {tc("brandName")}
              </span>
              <Icon name="water_drop" className="text-[14px]" />
            </div>
          </div>
          <div className="font-label mt-4 flex justify-center gap-6 text-[10px] tracking-[0.1em] text-slate-600 uppercase">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              {t("terms")}
            </Link>
            <Link
              href="/support"
              className="hover:text-foreground transition-colors"
            >
              {t("report")}
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
