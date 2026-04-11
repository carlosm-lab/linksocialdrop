"use client";

import { Icon } from "@/components/ui/icon";
import { recordLinkClick } from "@/actions/analytics";
import { Database } from "@/types/database";
import { getContrastColor } from "@/lib/colors";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type LinkRow = Database["public"]["Tables"]["links"]["Row"];

interface PublicLinkItemProps {
  link: LinkRow;
  buttonStyle?: string | null;
  accentColor?: string | null;
  textColorClass?: string;
  bgColorClass?: string;
  layoutMode?: "list" | "bento" | string | null;
  index?: number;
}

export function PublicLinkItem({
  link,
  buttonStyle,
  accentColor,
  textColorClass = "text-primary-container",
  bgColorClass = "bg-surface-container-highest",
  layoutMode = "list",
  index = 0,
}: PublicLinkItemProps) {
  const t = useTranslations("profile");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // M-010: Prevent default <a> navigation to avoid double-tab opening
    e.preventDefault();

    // SCALE-004: Fire and forget — redirect user immediately without waiting for analytics
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

  const isBento = layoutMode === "bento";

  // Decide grid class span for bento based on index if bento is true.
  // This is a simple pattern: first item large, next normal, etc. But we assume the parent grid will manage columns if using display: grid.
  // Actually, we can just apply classes here or let the parent control it.
  const bentoClasses = isBento
    ? "flex-col items-start justify-between h-32 md:h-40 glass-panel bg-noise"
    : "flex-row h-auto";

  return (
    <motion.a
      href={link.url}
      onClick={handleClick}
      aria-label={t("visitLink", { title: link.title })}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`group focus-visible:ring-primary focus-visible:ring-offset-background relative flex w-full p-4 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${roundedClass} ${accentColor ? "hover:brightness-90" : "bg-surface-container-low hover:bg-surface-container-high"} ${bentoClasses} ${isBento && !accentColor ? "border-outline-variant/30 border" : ""}`}
      style={customStyles}
    >
      <div
        className={`${accentColor ? "" : bgColorClass + " " + textColorClass} group-hover:luminous-gradient group-hover:text-on-primary-fixed flex items-center justify-center transition-colors ${roundedClass} ${isBento ? "mb-2 h-10 w-10" : "h-12 w-12"}`}
        style={iconStyle}
      >
        <Icon name={link.icon || "link"} size={isBento ? 20 : 24} />
      </div>
      <span
        className={`font-label font-medium tracking-tight ${isBento ? "mt-auto line-clamp-2 text-lg md:text-xl" : "ml-4 text-lg"}`}
      >
        {link.title}
      </span>
      {!isBento && (
        <Icon
          name="arrow_forward"
          className={`${accentColor ? "" : textColorClass} ml-auto opacity-0 transition-opacity group-hover:opacity-100`}
        />
      )}
      {isBento && (
        <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
          <Icon
            name="arrow_outward"
            size={20}
            className={accentColor ? "" : textColorClass}
          />
        </div>
      )}
    </motion.a>
  );
}
