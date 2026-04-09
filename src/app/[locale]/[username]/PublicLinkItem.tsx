"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { recordLinkClick } from "@/actions/analytics";
import { Database } from "@/types/database";

type LinkRow = Database["public"]["Tables"]["links"]["Row"];

interface PublicLinkItemProps {
  link: LinkRow;
  buttonStyle?: string | null;
  textColorClass?: string;
  bgColorClass?: string;
}

export function PublicLinkItem({
  link,
  buttonStyle,
  textColorClass = "text-primary-container",
  bgColorClass = "bg-surface-container-highest",
}: PublicLinkItemProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsNavigating(true);

    try {
      // Registrar click
      await recordLinkClick({
        link_id: link.id,
        user_id: link.user_id,
        referrer: document.referrer,
      });
    } catch (e) {
      console.error(e);
    } finally {
      // Redirigir siempre, incluso si falla la analítica
      window.open(link.url, "_blank", "noopener,noreferrer");
      setIsNavigating(false);
    }
  };

  // Convert schema button style to tailwind border-radius class
  let roundedClass = "rounded-full"; // pill (default)
  if (buttonStyle === "rounded") roundedClass = "rounded-xl";
  if (buttonStyle === "square") roundedClass = "rounded-none";

  return (
    <a
      href={link.url}
      onClick={handleClick}
      className={`group bg-surface-container-low hover:bg-surface-container-high relative flex w-full items-center p-4 transition-all duration-300 active:scale-[0.98] ${roundedClass}`}
    >
      <div
        className={`${bgColorClass} ${textColorClass} group-hover:luminous-gradient group-hover:text-on-primary-fixed flex h-12 w-12 items-center justify-center transition-colors ${roundedClass}`}
      >
        <Icon name={link.icon || "link"} />
      </div>
      <span className="font-label ml-4 text-lg font-medium tracking-tight">
        {link.title}
      </span>
      {isNavigating ? (
        <span className={`${textColorClass} ml-auto animate-pulse text-sm`}>
          ...
        </span>
      ) : (
        <Icon
          name="arrow_forward"
          className={`${textColorClass} ml-auto opacity-0 transition-opacity group-hover:opacity-100`}
        />
      )}
    </a>
  );
}
