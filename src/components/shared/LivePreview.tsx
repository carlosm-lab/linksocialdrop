"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { getContrastColor } from "@/lib/colors";
import { Icon } from "@/components/ui/icon";
import { Database } from "@/types/database";
import { generateThemeColors } from "@/lib/colors";
import { SmartBentoGrid } from "@/components/layout/SmartBentoGrid";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type LinkRow = Database["public"]["Tables"]["links"]["Row"];

interface LivePreviewProps {
  profile?: Partial<ProfileRow> | null;
  links?: Partial<LinkRow>[] | null;
}

/** Maps font family names to CSS variables set in layout.tsx */
const FONT_FAMILY_MAP: Record<string, string> = {
  Inter: "var(--font-inter)",
  Epilogue: "var(--font-epilogue)",
  Poppins: "var(--font-poppins)",
  Outfit: "var(--font-outfit)",
  "Space Grotesk": "var(--font-space-grotesk)",
  "DM Sans": "var(--font-dm-sans)",
  "Playfair Display": "var(--font-playfair)",
  Roboto: "var(--font-roboto)",
};

/** Returns Tailwind border radius classes per button_style value */
function getButtonRadius(buttonStyle?: string | null): string {
  switch (buttonStyle) {
    case "square":
      return "rounded-none";
    case "rounded":
      return "rounded-xl";
    case "glassmorphism":
      return "rounded-xl";
    case "neon":
      return "rounded-xl";
    case "outline":
      return "rounded-xl";
    case "pill":
    default:
      return "rounded-full";
  }
}

function PreviewLinkButton({
  link,
  buttonStyle,
  isBento,
}: {
  link: Partial<LinkRow> & { highlight?: boolean };
  buttonStyle: string | null | undefined;
  isBento: boolean;
}) {
  const radClass = getButtonRadius(buttonStyle);

  const baseClasses = isBento
    ? "flex-col items-start justify-between h-24 glass-panel bg-noise border border-border/50 shadow-sm"
    : "flex-row h-auto border border-border/30 bg-card text-card-foreground shadow-sm";

  return (
    <div
      className={`relative flex w-full p-3 transition-all ${radClass} ${baseClasses} ${
        link.highlight ? "ring-primary bg-primary/5 ring-2" : ""
      }`}
    >
      <div
        className={`bg-secondary text-secondary-foreground flex items-center justify-center transition-colors ${radClass} ${
          isBento ? "mb-1 h-7 w-7" : "h-8 w-8"
        }`}
      >
        <Icon name={link.icon || "link"} size={isBento ? 14 : 16} />
      </div>
      <span
        className={`font-label mt-auto font-medium tracking-tight ${
          isBento ? "line-clamp-2 text-xs" : "ml-3 text-xs"
        }`}
      >
        {link.title}
      </span>
      {!isBento && (
        <Icon name="arrow_forward" className="ml-auto opacity-50" size={14} />
      )}
      {isBento && (
        <div className="absolute top-3 right-3 opacity-50">
          <Icon name="arrow_outward" size={14} />
        </div>
      )}
    </div>
  );
}

export function LivePreview({ profile, links }: LivePreviewProps) {
  const t = useTranslations("livePreview");

  const displayName = profile?.full_name || "Digital Manager";
  const username = profile?.username || "manager_studio";
  const avatarUrl = profile?.avatar_url || "/images/avatar-placeholder.png";
  const bio =
    profile?.bio ||
    "Synthesizing modern aesthetics with functional digital architecture.";
  const accentColor = profile?.accent_color || "#00f5ff";
  const backgroundColor = profile?.background_color || "#111316";
  const customTextColor = (profile as any)?.custom_text_color;

  const buttonStyle = profile?.button_style || "pill";
  const layoutMode = profile?.layout_mode || "list";
  const isBento = layoutMode === "bento";

  const fontFamilyValue = profile?.font_family || "Inter";
  const fontFamily = FONT_FAMILY_MAP[fontFamilyValue] || FONT_FAMILY_MAP.Inter;

  const themeVars = generateThemeColors(
    accentColor,
    backgroundColor,
    customTextColor
  );

  type PreviewLink = Partial<LinkRow> & { highlight?: boolean };

  const defaultLinks: PreviewLink[] = [
    { id: "1", title: "Portfolio Reel" },
    { id: "2", title: "Read the Manifesto" },
    { id: "3", title: "Book a Consultation", highlight: true },
  ];

  let activeLinks: PreviewLink[] = [];
  if (Array.isArray(links) && links.length > 0) {
    activeLinks = links.filter((l) => l.visible !== false);
  } else if (!links) {
    activeLinks = defaultLinks;
  }

  return (
    <div className="mx-auto w-full max-w-xs">
      {/* Header row */}
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-headline text-2xl font-bold tracking-tight text-white">
          {t("title")}
        </h2>
        {username ? (
          <a
            href={`/${username}`}
            target="_blank"
            className="text-primary-container bg-primary-container/10 hover:bg-primary-container/20 flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors"
          >
            {t("status")} <Icon name="external_link" className="text-xs" />
          </a>
        ) : (
          <span className="text-xs font-semibold tracking-widest text-[#00F5FF]/60 uppercase">
            {t("status")}
          </span>
        )}
      </div>

      {/* Phone Frame */}
      <div className="relative mx-auto aspect-[9/19.5] w-full overflow-hidden rounded-[3rem] border-[8px] border-[#333538] bg-[#0c0e11] shadow-2xl ring-1 ring-white/5">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-[#333538]" />

        {/* Profile content layer dynamically adopting theme */}
        <div
          className="bg-background text-foreground relative flex h-full w-full flex-col items-center overflow-y-auto p-4 pt-10 pb-8"
          style={{ ...(themeVars as React.CSSProperties), fontFamily }}
        >
          {/* Avatar */}
          <div className="border-primary/30 relative mb-2 h-16 w-16 rounded-full border-2 p-0.5">
            <div className="luminous-gradient pointer-events-none absolute inset-0 scale-110 rounded-full opacity-20 blur-xl"></div>
            <div className="ring-primary/20 relative z-10 h-full w-full overflow-hidden rounded-full ring-2">
              <Image
                alt="Avatar"
                className="h-full w-full rounded-full object-cover"
                src={avatarUrl}
                width={64}
                height={64}
                sizes="64px"
              />
            </div>
          </div>

          {/* Name */}
          <h3 className="text-foreground mb-0.5 text-center text-sm leading-tight font-extrabold">
            {displayName}
          </h3>

          {/* Username */}
          <p className="text-primary mb-1.5 text-[10px] tracking-wide">
            @{username}
          </p>

          {/* Bio */}
          <p className="text-muted-foreground mb-4 line-clamp-3 text-center text-[10px] leading-relaxed">
            {bio}
          </p>

          {/* Links grid/list */}
          <div className="w-full">
            <SmartBentoGrid isBento={isBento}>
              {activeLinks.length > 0 ? (
                activeLinks.map((link, idx) => (
                  <PreviewLinkButton
                    key={link.id || idx}
                    link={link}
                    buttonStyle={buttonStyle}
                    isBento={isBento}
                  />
                ))
              ) : (
                <div className="text-muted-foreground col-span-2 w-full py-4 text-center text-[10px]">
                  {t("noActiveLinks")}
                </div>
              )}
            </SmartBentoGrid>
          </div>

          {/* Bottom watermark */}
          <div className="mt-auto flex items-center gap-1 pt-6">
            <span className="text-[8px] tracking-widest text-white/20 uppercase">
              linksocialdrop
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
