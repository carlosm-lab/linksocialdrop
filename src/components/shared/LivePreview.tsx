"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { getContrastColor } from "@/lib/colors";
import { Icon } from "@/components/ui/icon";
import { Database } from "@/types/database";

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

/** Renders a single link button in the preview respecting button_style and per-link colors */
function PreviewLinkButton({
  link,
  accentColor,
  buttonStyle,
  isLast,
}: {
  link: Partial<LinkRow> & { highlight?: boolean };
  accentColor: string;
  buttonStyle: string | null | undefined;
  isLast: boolean;
}) {
  const radClass = getButtonRadius(buttonStyle);
  const textOnAccent = getContrastColor(accentColor);

  // Per-link custom colors override everything
  const hasBg = !!link.bg_color;
  const hasText = !!link.text_color;
  const effectiveBg = hasBg ? link.bg_color! : undefined;
  const effectiveText = hasText
    ? link.text_color!
    : hasBg
      ? getContrastColor(link.bg_color!)
      : undefined;

  // Glassmorphism style
  if (buttonStyle === "glassmorphism" && !hasBg) {
    return (
      <div
        className={`w-full ${radClass} border border-white/20 px-4 py-3 text-center text-[11px] font-bold text-white`}
        style={{
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)",
          color: effectiveText,
        }}
      >
        {link.title}
      </div>
    );
  }

  // Neon style
  if (buttonStyle === "neon" && !hasBg) {
    return (
      <div
        className={`w-full ${radClass} border px-4 py-3 text-center text-[11px] font-bold`}
        style={{
          borderColor: accentColor,
          color: accentColor,
          boxShadow: `0 0 12px ${accentColor}60, inset 0 0 8px ${accentColor}20`,
          background: "transparent",
        }}
      >
        {link.title}
      </div>
    );
  }

  // Outline style
  if (buttonStyle === "outline" && !hasBg) {
    return (
      <div
        className={`w-full ${radClass} border px-4 py-3 text-center text-[11px] font-medium`}
        style={{
          borderColor: "rgba(255,255,255,0.4)",
          color: "rgba(255,255,255,0.85)",
          background: "transparent",
        }}
      >
        {link.title}
      </div>
    );
  }

  // Last/highlighted link: accent color (or custom)
  if (isLast || link.highlight) {
    return (
      <div
        className={`w-full ${radClass} px-4 py-3 text-center text-[11px] font-bold shadow-lg`}
        style={{
          backgroundColor: effectiveBg || accentColor,
          color: effectiveText || textOnAccent,
          boxShadow: `0 8px 20px -4px ${effectiveBg || accentColor}50`,
        }}
      >
        {link.title}
      </div>
    );
  }

  // Default: dark card (or custom per-link)
  return (
    <div
      className={`w-full ${radClass} border border-white/5 px-4 py-3 text-center text-[11px] font-medium`}
      style={{
        backgroundColor: effectiveBg || "#1e2023",
        color: effectiveText || "#e2e8f0",
      }}
    >
      {link.title}
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
  const accentColor = profile?.accent_color || "#00F5FF";
  const buttonStyle = profile?.button_style || "pill";
  const fontFamilyValue = profile?.font_family || "Inter";
  const fontFamily = FONT_FAMILY_MAP[fontFamilyValue] || FONT_FAMILY_MAP.Inter;

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

        {/* Profile content */}
        <div
          className="relative flex h-full w-full flex-col items-center overflow-y-auto p-6 pt-14 pb-8"
          style={{ fontFamily }}
        >
          {/* Avatar */}
          <div
            className="ring-opacity-30 mb-3 h-16 w-16 rounded-full p-0.5 ring-4"
            style={{ ringColor: accentColor }}
          >
            <div
              className="ring-opacity-20 h-full w-full overflow-hidden rounded-full ring-2"
              style={{ boxShadow: `0 0 0 2px ${accentColor}33` }}
            >
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
          <h3 className="mb-0.5 text-center text-sm leading-tight font-extrabold text-white">
            {displayName}
          </h3>

          {/* Username */}
          <p
            className="mb-1.5 text-[10px] tracking-wide"
            style={{ color: accentColor }}
          >
            @{username}
          </p>

          {/* Bio */}
          <p className="mb-5 line-clamp-3 text-center text-[10px] leading-relaxed text-slate-400">
            {bio}
          </p>

          {/* Links */}
          <div className="w-full space-y-2">
            {activeLinks.length > 0 ? (
              activeLinks.map((link, idx) => (
                <PreviewLinkButton
                  key={link.id || idx}
                  link={link}
                  accentColor={accentColor}
                  buttonStyle={buttonStyle}
                  isLast={idx === activeLinks.length - 1}
                />
              ))
            ) : (
              <div className="text-center text-[10px] text-white/40">
                {t("noActiveLinks")}
              </div>
            )}
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
