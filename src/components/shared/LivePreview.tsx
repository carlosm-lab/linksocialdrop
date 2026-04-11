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
      {/* Header row mimicking Mac OS traffic lights and uppercase typography */}
      <div className="mb-6 flex items-center justify-between px-2">
        <h3 className="text-on-surface-variant text-sm font-bold tracking-[0.2em] uppercase">
          {t("title") || "LIVE PREVIEW"}
        </h3>
        <div className="flex gap-2">
          {username ? (
            <a
              href={`/${username}`}
              target="_blank"
              className="group flex cursor-pointer items-center gap-1"
            >
              <span className="bg-error h-2 w-2 rounded-full transition-all group-hover:scale-110"></span>
              <span className="bg-tertiary-fixed-dim h-2 w-2 rounded-full transition-all group-hover:scale-110"></span>
              <span className="bg-primary-container h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,245,255,0.6)] transition-all group-hover:scale-110"></span>
            </a>
          ) : (
            <>
              <span className="bg-error h-2 w-2 rounded-full"></span>
              <span className="bg-tertiary-fixed-dim h-2 w-2 rounded-full"></span>
              <span className="bg-primary-container h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,245,255,0.6)]"></span>
            </>
          )}
        </div>
      </div>

      {/* Phone Frame - Abstract Layered Frame from Prototype */}
      <div className="bg-surface-container-highest border-surface-container-low relative aspect-[9/18] overflow-hidden rounded-[3rem] border-[8px] p-4 shadow-2xl">
        {/* Glass Content Canvas */}
        <div className="custom-scrollbar relative h-full w-full overflow-y-auto rounded-[2.2rem] bg-[#111316]">
          {/* Static Gradient Overlay (matching background from prototype to prevent plain solid black) */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a1c1f] to-[#111316]"></div>

          {/* Dynamic Content Layer */}
          <div
            className="text-foreground relative z-10 flex h-full w-full flex-col items-center p-8 pt-10"
            style={{ ...(themeVars as React.CSSProperties), fontFamily }}
          >
            {/* Avatar */}
            <div className="border-primary-container relative mb-4 h-20 w-20 overflow-hidden rounded-full border-2 shadow-[0_0_20px_rgba(0,245,255,0.2)]">
              <Image
                alt="Avatar"
                className="h-full w-full object-cover"
                src={avatarUrl}
                width={80}
                height={80}
                sizes="80px"
              />
            </div>

            {/* Name */}
            <h4 className="font-headline mb-2 text-xl font-bold tracking-tighter text-white">
              {displayName}
            </h4>

            {/* Bio */}
            <p className="text-on-surface-variant/80 mt-2 max-w-[200px] text-center text-xs">
              {bio}
            </p>

            {/* Default Links mimicking the prototype static visual but dynamically mapping real links */}
            <div className="mt-10 w-full space-y-3">
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

            {/* Dummy Social Preview (Hardcoded for aesthetics matching prototype) */}
            <div className="mt-12 flex gap-4">
              <div className="bg-surface-container-low text-primary-container border-primary-container/10 flex h-10 w-10 items-center justify-center rounded-full border">
                <Icon name="share" className="text-lg" />
              </div>
              <div className="bg-surface-container-low text-primary-container border-primary-container/10 flex h-10 w-10 items-center justify-center rounded-full border">
                <Icon name="rss_feed" className="text-lg" />
              </div>
            </div>

            <p className="font-headline text-on-surface-variant mt-20 text-[10px] font-black tracking-[0.3em] opacity-40">
              LINKSOCIALDROP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
