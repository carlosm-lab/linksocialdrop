"use client";

import { Icon } from "@/components/ui/icon";
import { recordLinkClick } from "@/actions/analytics";
import { Database } from "@/types/database";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type LinkRow = Database["public"]["Tables"]["links"]["Row"];

interface PublicLinkItemProps {
  link: LinkRow;
  buttonStyle?: string | null;
  layoutMode?: "list" | "bento" | string | null;
  index?: number;
}

export function PublicLinkItem({
  link,
  buttonStyle,
  layoutMode = "list",
  index = 0,
}: PublicLinkItemProps) {
  const t = useTranslations("profile");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.open(link.url, "_blank", "noopener,noreferrer");
    recordLinkClick({
      link_id: link.id,
      user_id: link.user_id,
      referrer: document.referrer,
    }).catch(console.error);
  };

  let roundedClass = "rounded-full"; // pill (default)
  if (buttonStyle === "rounded") roundedClass = "rounded-xl";
  if (buttonStyle === "square") roundedClass = "rounded-none";

  const isBento = layoutMode === "bento";

  const baseClasses = isBento
    ? "flex-col items-start justify-between h-32 md:h-40 glass-panel bg-noise border border-border/50 shadow-sm"
    : "flex-row h-auto border border-border/30 bg-card text-card-foreground shadow-sm hover:shadow-md";

  return (
    <motion.a
      href={link.url}
      onClick={handleClick}
      aria-label={t("visitLink", { title: link.title })}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay: index * 0.05,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group focus-visible:ring-primary focus-visible:ring-offset-background relative flex w-full p-4 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${roundedClass} ${baseClasses} hover:bg-primary hover:text-primary-foreground hover:border-primary`}
    >
      <div
        className={`bg-secondary text-secondary-foreground group-hover:bg-primary-foreground group-hover:text-primary flex items-center justify-center transition-colors ${roundedClass} ${isBento ? "mb-2 h-10 w-10" : "h-12 w-12"}`}
      >
        <Icon name={link.icon || "link"} size={isBento ? 20 : 24} />
      </div>
      <span
        className={`font-label font-medium tracking-tight transition-colors ${isBento ? "mt-auto line-clamp-2 text-lg md:text-xl" : "ml-4 text-lg"}`}
      >
        {link.title}
      </span>
      {!isBento && (
        <Icon
          name="arrow_forward"
          className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
        />
      )}
      {isBento && (
        <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
          <Icon name="arrow_outward" size={20} />
        </div>
      )}
    </motion.a>
  );
}
