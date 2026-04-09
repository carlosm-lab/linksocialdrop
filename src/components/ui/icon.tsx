import { cn } from "@/lib/utils";
import React from "react";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The exact name of the Material Symbol (e.g., 'home', 'settings') */
  name: string;
}

export function Icon({ name, className, ...props }: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined select-none", className)}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
}
