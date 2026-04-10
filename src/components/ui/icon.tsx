import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";
import { createElement } from "react";
import type React from "react";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Icon name — supports legacy Material Symbol names and Lucide names */
  name: string;
  /** Explicit size in pixels (overrides CSS-based sizing) */
  size?: number;
}

/**
 * Universal Icon component powered by Lucide React.
 *
 * Uses `width: 1em; height: 1em` by default so it inherits size from
 * Tailwind text utilities like `text-2xl`, `text-sm`, etc.
 *
 * @example
 * <Icon name="link" className="text-2xl text-cyan-400" />
 * <Icon name="settings" size={20} />
 */
export function Icon({ name, className, size, style, ...props }: IconProps) {
  const iconComponent = getIcon(name);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        className
      )}
      aria-hidden="true"
      style={style}
      {...props}
    >
      {createElement(iconComponent, {
        size,
        className: !size ? "h-[1em] w-[1em]" : undefined,
        strokeWidth: 2,
      })}
    </span>
  );
}
