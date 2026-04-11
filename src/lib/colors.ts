import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";

extend([a11yPlugin]);

// APCA-lite contrast validation
export function getContrastColor(
  hexColor: string | null | undefined,
  customOverride?: string | null
): string {
  if (customOverride) return customOverride;
  if (!hexColor) return "#0f172a"; // slate-900 fallback

  const c = colord(hexColor);
  const luminance = c.luminance();

  // Adjusted threshold for better modern contrast balancing (similar to APCA)
  return luminance > 0.45 ? "#0f172a" : "#ffffff";
}

// Helper to convert colord to Shadcn spaced HSL values: "H S% L%"
function toHslValue(c: ReturnType<typeof colord>) {
  const { h, s, l } = c.toHsl();
  return `${Number(h.toFixed(1))} ${Number(s.toFixed(1))}% ${Number(l.toFixed(1))}%`;
}

// Dynamic Theme Generator
export function generateThemeColors(
  accentHex: string,
  bgHex?: string | null,
  customTextHex?: string | null
) {
  const accent = colord(accentHex || "#00f5ff");
  const bg = colord(bgHex || "#111316");
  const isDark = bg.luminance() < 0.5;

  const getHslContrast = (base: ReturnType<typeof colord>) => {
    if (customTextHex) return toHslValue(colord(customTextHex));
    return base.luminance() > 0.45
      ? toHslValue(colord("#0f172a"))
      : toHslValue(colord("#ffffff"));
  };

  return {
    "--background": toHslValue(bg),
    "--foreground": getHslContrast(bg),
    "--card": toHslValue(isDark ? bg.lighten(0.03) : bg.darken(0.03)),
    "--card-foreground": getHslContrast(
      isDark ? bg.lighten(0.03) : bg.darken(0.03)
    ),
    "--popover": toHslValue(isDark ? bg.lighten(0.05) : bg.darken(0.05)),
    "--popover-foreground": getHslContrast(
      isDark ? bg.lighten(0.05) : bg.darken(0.05)
    ),
    "--primary": toHslValue(accent),
    "--primary-foreground": getHslContrast(accent),
    "--secondary": toHslValue(
      isDark ? accent.darken(0.4) : accent.lighten(0.4)
    ),
    "--secondary-foreground": getHslContrast(
      isDark ? accent.darken(0.4) : accent.lighten(0.4)
    ),
    "--muted": toHslValue(isDark ? bg.lighten(0.08) : bg.darken(0.08)),
    "--muted-foreground": isDark ? "215 20.2% 65.1%" : "215 16.3% 46.9%", // slate-400/500
    "--accent": toHslValue(isDark ? accent.darken(0.2) : accent.lighten(0.2)),
    "--accent-foreground": getHslContrast(
      isDark ? accent.darken(0.2) : accent.lighten(0.2)
    ),
    "--destructive": "0 84.2% 60.2%",
    "--destructive-foreground": "0 0% 100%",
    "--border": toHslValue(isDark ? bg.lighten(0.12) : bg.darken(0.12)),
    "--input": toHslValue(isDark ? bg.lighten(0.12) : bg.darken(0.12)),
    "--ring": toHslValue(accent),
  } as React.CSSProperties;
}
