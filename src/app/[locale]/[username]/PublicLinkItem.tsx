"use client";

import { Icon } from "@/components/ui/icon";
import { recordLinkClick } from "@/actions/analytics";
import { Database } from "@/types/database";
import { getContrastColor } from "@/lib/colors";

type LinkRow = Database["public"]["Tables"]["links"]["Row"];

interface PublicLinkItemProps {
  link: LinkRow;
  buttonStyle?: string | null;
  accentColor?: string | null;
  textColorClass?: string;
  bgColorClass?: string;
}

export function PublicLinkItem({
  link,
  buttonStyle,
  accentColor,
  textColorClass = "text-primary-container",
  bgColorClass = "bg-surface-container-highest",
}: PublicLinkItemProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // SCALE-004: Eventos bloqueantes (Fire and forget)
    // Redirigimos al usuario inmediatamente sin esperar a que responda analytics
    window.open(link.url, "_blank", "noopener,noreferrer");

    // Registramos en background
    recordLinkClick({
      link_id: link.id,
      user_id: link.user_id,
      referrer: document.referrer,
    }).catch(console.error);
  };

  // Convert schema button style to tailwind border-radius class
  let roundedClass = "rounded-full"; // pill (default)
  if (buttonStyle === "rounded") roundedClass = "rounded-xl";
  if (buttonStyle === "square") roundedClass = "rounded-none";

  const contrastColor = accentColor ? getContrastColor(accentColor) : undefined;
  // Apply a separate dark hover effect manually if we override the background
  const customStyles = accentColor
    ? { backgroundColor: accentColor, color: contrastColor }
    : {};

  // For the icon background - we might just leave it transparent or slightly dark
  const iconStyle = accentColor ? { color: contrastColor } : {};

  return (
    <a
      href={link.url}
      onClick={handleClick}
      aria-label={`Visit link to ${link.title}`}
      className={`group focus-visible:ring-primary focus-visible:ring-offset-background relative flex w-full items-center p-4 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] ${roundedClass} ${accentColor ? "hover:brightness-90" : "bg-surface-container-low hover:bg-surface-container-high"}`}
      style={customStyles}
    >
      <div
        className={`${accentColor ? "" : bgColorClass + " " + textColorClass} group-hover:luminous-gradient group-hover:text-on-primary-fixed flex h-12 w-12 items-center justify-center transition-colors ${roundedClass}`}
        style={iconStyle}
      >
        <Icon name={link.icon || "link"} />
      </div>
      <span className="font-label ml-4 text-lg font-medium tracking-tight">
        {link.title}
      </span>
      <Icon
        name="arrow_forward"
        className={`${accentColor ? "" : textColorClass} ml-auto opacity-0 transition-opacity group-hover:opacity-100`}
      />
    </a>
  );
}
