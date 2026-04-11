"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { applyTheme } from "@/actions/themes";
import { Database, Json } from "@/types/database";
import { getContrastColor } from "@/lib/colors";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Crown, Loader2 } from "lucide-react";

type ThemeRow = Database["public"]["Tables"]["themes"]["Row"];

interface ThemeConfig {
  accent_color?: string;
  button_style?: string;
  font_family?: string;
  background_color?: string;
  layout_mode?: string;
}

interface MarketplaceClientProps {
  themes: ThemeRow[];
  userThemes: { theme_id: string; is_active: boolean }[];
  activeThemeId: string | null;
}

type FilterType = "all" | "free" | "premium";

export function MarketplaceClient({
  themes,
  userThemes,
  activeThemeId,
}: MarketplaceClientProps) {
  const t = useTranslations("marketplace");
  const [filter, setFilter] = useState<FilterType>("all");
  const [isPending, startTransition] = useTransition();
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(activeThemeId);
  const router = useRouter();

  const filtered = themes.filter((th) => {
    if (filter === "free") return th.price === 0;
    if (filter === "premium") return th.price > 0;
    return true;
  });

  const userThemeIds = new Set(userThemes.map((ut) => ut.theme_id));

  const handleApply = (themeId: string) => {
    setApplyingId(themeId);
    startTransition(async () => {
      try {
        await applyTheme({ theme_id: themeId });
        setAppliedId(themeId);
        router.refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setApplyingId(null);
      }
    });
  };

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: "all", label: t("filterAll") },
    { key: "free", label: t("filterFree") },
    { key: "premium", label: t("filterPremium") },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="mb-2 flex items-center gap-3">
          <div className="luminous-gradient flex h-10 w-10 items-center justify-center rounded-xl">
            <Sparkles className="h-5 w-5 text-[#003739]" />
          </div>
          <h1 className="font-headline text-3xl font-black tracking-tighter text-white">
            {t("title")}
          </h1>
        </div>
        <p className="text-on-surface-variant max-w-xl text-sm leading-relaxed">
          {t("description")}
        </p>
      </div>

      {/* Filter Pills */}
      <div className="mb-8 flex gap-2">
        {filterButtons.map((fb) => (
          <button
            key={fb.key}
            onClick={() => setFilter(fb.key)}
            className={`rounded-full px-5 py-2 text-xs font-bold tracking-wide uppercase transition-all ${
              filter === fb.key
                ? "bg-primary-container text-on-primary-container shadow-lg shadow-[#00F5FF]/20"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            {fb.label}
          </button>
        ))}
      </div>

      {/* Grid de Themes */}
      <motion.div
        layout
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((theme) => {
            const config = (theme.config || {}) as ThemeConfig;
            const isActive = appliedId === theme.id;
            const isOwned = userThemeIds.has(theme.id) || theme.price === 0;
            const isFree = theme.price === 0;
            const isApplying = applyingId === theme.id;

            return (
              <motion.div
                key={theme.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`bg-noise glass-panel group relative overflow-hidden rounded-2xl transition-all ${
                  isActive
                    ? "ring-2 ring-[#00F5FF] ring-offset-2 ring-offset-[#111316]"
                    : "hover:ring-1 hover:ring-white/20"
                }`}
              >
                {/* Preview */}
                <div
                  className="relative flex h-48 items-end overflow-hidden p-4"
                  style={{
                    background: `linear-gradient(135deg, ${config.background_color || "#111316"} 0%, ${config.accent_color || "#00F5FF"}15 100%)`,
                  }}
                >
                  {/* Mini phone mockup */}
                  <div className="absolute top-4 right-4 h-32 w-16 overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm">
                    <div className="flex flex-col items-center p-2 pt-4">
                      <div
                        className="mb-1.5 h-5 w-5 rounded-full"
                        style={{
                          background: config.accent_color || "#00F5FF",
                        }}
                      />
                      <div className="mb-1 h-1 w-8 rounded-full bg-white/40" />
                      <div className="mb-2 h-0.5 w-6 rounded-full bg-white/20" />
                      {/* mini buttons */}
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="mb-1 h-2.5 w-11 opacity-80"
                          style={{
                            background:
                              i === 3
                                ? config.accent_color || "#00F5FF"
                                : "rgba(255,255,255,0.1)",
                            borderRadius:
                              config.button_style === "square"
                                ? "0"
                                : config.button_style === "rounded"
                                  ? "4px"
                                  : "999px",
                            border:
                              config.button_style === "neon"
                                ? `1px solid ${config.accent_color || "#00F5FF"}`
                                : config.button_style === "outline"
                                  ? "1px solid rgba(255,255,255,0.3)"
                                  : "none",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="relative z-10 flex gap-2">
                    {isFree ? (
                      <span className="rounded-full bg-emerald-500/90 px-3 py-1 text-[10px] font-extrabold tracking-widest text-white uppercase backdrop-blur-sm">
                        {t("free")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-amber-500/90 px-3 py-1 text-[10px] font-extrabold tracking-widest text-white uppercase backdrop-blur-sm">
                        <Crown className="h-3 w-3" />${theme.price}
                      </span>
                    )}
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 rounded-full bg-[#00F5FF]/90 px-3 py-1 text-[10px] font-extrabold tracking-widest text-[#003739] uppercase backdrop-blur-sm"
                      >
                        <Check className="h-3 w-3" />
                        {t("active")}
                      </motion.span>
                    )}
                  </div>

                  {/* Accent glow */}
                  <div
                    className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full opacity-30 blur-3xl"
                    style={{
                      background: config.accent_color || "#00F5FF",
                    }}
                  />
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="mb-1 text-lg font-bold tracking-tight text-white">
                    {theme.name}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-400">
                    {theme.description}
                  </p>

                  {/* Style tokens tags */}
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {config.font_family && (
                      <span className="rounded-md bg-white/5 px-2 py-0.5 text-[9px] tracking-wider text-white/50 uppercase">
                        {config.font_family}
                      </span>
                    )}
                    {config.button_style && (
                      <span className="rounded-md bg-white/5 px-2 py-0.5 text-[9px] tracking-wider text-white/50 uppercase">
                        {config.button_style}
                      </span>
                    )}
                    {config.layout_mode && (
                      <span className="rounded-md bg-white/5 px-2 py-0.5 text-[9px] tracking-wider text-white/50 uppercase">
                        {config.layout_mode}
                      </span>
                    )}
                  </div>

                  {/* Action button */}
                  {isActive ? (
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-[#00F5FF]/10 py-3 text-xs font-bold text-[#00F5FF]">
                      <Check className="h-4 w-4" />
                      {t("currentTheme")}
                    </div>
                  ) : isFree || isOwned ? (
                    <button
                      onClick={() => handleApply(theme.id)}
                      disabled={isPending}
                      className="bg-primary-container text-on-primary-container w-full rounded-xl py-3 text-xs font-bold transition-all hover:shadow-lg hover:shadow-[#00F5FF]/20 disabled:opacity-50"
                    >
                      {isApplying ? (
                        <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                      ) : (
                        t("apply")
                      )}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-amber-500/30 bg-amber-500/10 py-3 text-xs font-bold text-amber-400 opacity-70"
                    >
                      <Crown className="mr-1 inline h-3.5 w-3.5" />
                      {t("buyComingSoon")}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-sm text-slate-500">
          {t("noThemes")}
        </div>
      )}
    </div>
  );
}
