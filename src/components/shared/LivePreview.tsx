import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { getContrastColor } from "@/lib/colors";

interface LivePreviewProps {
  profile?: any;
  links?: any[];
}

export function LivePreview({ profile, links }: LivePreviewProps) {
  const t = useTranslations("livePreview");

  const displayName = profile?.full_name || "Digital Manager";
  const username = profile?.username || "manager_studio";
  const avatarUrl =
    profile?.avatar_url ||
    "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

  const bio =
    profile?.bio ||
    "Synthesizing modern aesthetics with functional digital architecture.";
  const accentColor = profile?.accent_color || "#00F5FF";
  const buttonStyle = profile?.button_style || "pill";
  const fontFamilyValue = profile?.font_family || "Inter";

  const roundedClass =
    buttonStyle === "square"
      ? "rounded-none"
      : buttonStyle === "rounded"
        ? "rounded-lg"
        : "rounded-xl"; // Default to pill/xl

  // Map font families to classes roughly
  const fontClass =
    fontFamilyValue === "Epilogue"
      ? "font-headline"
      : fontFamilyValue === "Roboto"
        ? "font-sans"
        : "font-body";

  const defaultLinks = [
    { id: "1", title: "Portfolio Reel" },
    { id: "2", title: "Read the Manifesto" },
    { id: "3", title: "Book a Consultation", highlight: true },
  ];

  let activeLinks: any[] = [];
  if (Array.isArray(links) && links.length > 0) {
    activeLinks = links.filter((l) => l.visible !== false);
  } else if (!links) {
    // If links is completely undefined/null, show defaults to help visualize
    activeLinks = defaultLinks;
  }
  // If links is [], we respect that the user has explicitly 0 links.

  return (
    <div className="mx-auto w-full max-w-xs">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-headline text-2xl font-bold tracking-tight text-white">
          {t("title")}
        </h2>
        <span className="text-xs font-semibold tracking-widest text-[#00F5FF]/60 uppercase">
          {t("status")}
        </span>
      </div>

      {/* Phone Frame */}
      <div className="relative mx-auto aspect-[9/19.5] w-full overflow-hidden rounded-[3rem] border-[8px] border-[#333538] bg-[#0c0e11] shadow-2xl ring-1 ring-white/5">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-[#333538]"></div>

        {/* Profile Content inside Preview */}
        <div className="relative flex h-full w-full flex-col items-center p-8 pt-16">
          <div className="mb-4 h-20 w-20 rounded-full p-1 ring-4 ring-[#00F5FF]/20">
            <Image
              alt="Avatar"
              className="h-full w-full rounded-full object-cover"
              src={avatarUrl}
              width={80}
              height={80}
              sizes="80px"
            />
          </div>
          <h3 className={`mb-1 text-xl font-extrabold text-white ${fontClass}`}>
            {displayName}
          </h3>
          <p className="mb-2 text-xs tracking-wide text-slate-400">
            @{username}
          </p>
          <p className="mb-8 text-center text-xs text-slate-300">{bio}</p>

          <div className="w-full space-y-3">
            {activeLinks.length > 0 ? (
              activeLinks.map((link: any, idx: number) => {
                if (link.highlight || idx === activeLinks.length - 1) {
                  return (
                    <div
                      key={link.id}
                      className={`w-full ${roundedClass} px-4 py-3 text-center text-sm font-bold shadow-lg`}
                      style={{
                        backgroundColor: accentColor,
                        color: getContrastColor(accentColor),
                        boxShadow: `0 10px 15px -3px ${accentColor}33`,
                      }}
                    >
                      {link.title}
                    </div>
                  );
                }
                return (
                  <div
                    key={link.id}
                    className={`w-full ${roundedClass} border border-white/5 bg-[#282a2d] px-4 py-3 text-center text-sm font-medium text-white`}
                  >
                    {link.title}
                  </div>
                );
              })
            ) : (
              <div className="text-center text-xs text-white/50">
                No active links
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
