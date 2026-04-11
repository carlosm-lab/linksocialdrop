"use client";

import { useState, useTransition, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { updateProfile, updateAvatar } from "@/actions/profile";
import { checkUsernameForUser, claimUsername } from "@/actions/username";
import { Database } from "@/types/database";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Loader2,
  AlertCircle,
  Sparkles,
  ChevronRight,
} from "lucide-react";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// --- Typography preview font-family mapping ---
const FONT_CSS_VAR: Record<string, string> = {
  Inter: "var(--font-inter)",
  Epilogue: "var(--font-epilogue)",
  Poppins: "var(--font-poppins)",
  Outfit: "var(--font-outfit)",
  "Space Grotesk": "var(--font-space-grotesk)",
  "DM Sans": "var(--font-dm-sans)",
  "Playfair Display": "var(--font-playfair)",
  Roboto: "var(--font-roboto)",
};

export function AppearanceClient({
  initialProfile,
}: {
  initialProfile: Profile;
}) {
  const t = useTranslations("adminAppearance");
  const tu = useTranslations("username");
  const tc = useTranslations("common");

  const [isPending, startTransition] = useTransition();
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Username change ---
  const [newUsername, setNewUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");
  const [isChangingUsername, setIsChangingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  // --- Bio counter ---
  const bioCount = (profile.bio || "").length;
  const bioCountColor =
    bioCount > 130
      ? "text-red-400"
      : bioCount > 110
        ? "text-yellow-400"
        : "text-slate-600";

  const checkAvailability = useCallback(
    async (value: string) => {
      const regex = /^[a-zA-Z0-9._]+$/;
      if (value.length < 3 || value.length > 30 || !regex.test(value)) {
        setUsernameStatus("invalid");
        return;
      }
      if (value.toLowerCase() === profile.username?.toLowerCase()) {
        setUsernameStatus("idle");
        return;
      }
      setUsernameStatus("checking");
      try {
        const result = await checkUsernameForUser({
          username: value,
          userId: profile.id,
        });
        setUsernameStatus(result?.data?.available ? "available" : "taken");
      } catch {
        setUsernameStatus("invalid");
      }
    },
    [profile.id, profile.username]
  );

  useEffect(() => {
    if (!newUsername || newUsername.length < 3) {
      setUsernameStatus("idle");
      return;
    }
    const timer = setTimeout(() => checkAvailability(newUsername), 600);
    return () => clearTimeout(timer);
  }, [newUsername, checkAvailability]);

  const handleChangeUsername = async () => {
    if (usernameStatus !== "available") return;
    setIsChangingUsername(true);
    setUsernameError("");
    try {
      const result = await claimUsername({ username: newUsername });
      if (result?.serverError) {
        setUsernameError(result.serverError);
      } else if (result?.data?.success) {
        setProfile((prev) => ({
          ...prev,
          username: result.data!.username,
        }));
        setNewUsername("");
        setUsernameStatus("idle");
      }
    } catch {
      setUsernameError(t("errorUpdatingUsername"));
    } finally {
      setIsChangingUsername(false);
    }
  };

  const usernameStatusColor =
    usernameStatus === "available"
      ? "text-emerald-400"
      : usernameStatus === "taken"
        ? "text-red-400"
        : usernameStatus === "invalid"
          ? "text-amber-400"
          : "text-slate-500";

  const handleUpdate = async (field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field === "title" ? "full_name" : field]: value,
    }));
    startTransition(async () => {
      await updateProfile({ [field]: value });
    });
  };

  const colorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleColorChange = (value: string) => {
    setProfile((prev) => ({ ...prev, accent_color: value }));
    if (colorTimeoutRef.current) clearTimeout(colorTimeoutRef.current);
    colorTimeoutRef.current = setTimeout(() => {
      startTransition(async () => {
        await updateProfile({ accent_color: value });
      });
    }, 500);
  };

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await updateAvatar(formData);
    if (res?.data?.success && res.data.avatar_url) {
      setProfile((prev) => ({ ...prev, avatar_url: res.data!.avatar_url }));
    }
    setIsUploading(false);
  };

  // --- Presets ---
  const PRESET_COLORS = [
    "#00F5FF",
    "#FFD700",
    "#FF6B6B",
    "#A061FF",
    "#4ECDC4",
    "#FF8C42",
    "#FFFFFF",
  ];

  const COLOR_NAMES: Record<string, string> = {
    "#00F5FF": t("colorCyan"),
    "#FFD700": t("colorGold"),
    "#FF6B6B": t("colorCoral"),
    "#A061FF": t("colorPurple"),
    "#4ECDC4": t("colorTeal"),
    "#FF8C42": t("colorOrange"),
    "#FFFFFF": t("colorWhite"),
  };

  const TYPOGRAPHY_OPTIONS = [
    { value: "Inter", weight: "font-medium", sample: "Clean & Modern" },
    { value: "Epilogue", weight: "font-bold", sample: "Sharp Headlines" },
    { value: "Poppins", weight: "font-semibold", sample: "Friendly & Bold" },
    { value: "Outfit", weight: "font-medium", sample: "Geometric Style" },
    {
      value: "Space Grotesk",
      weight: "font-medium",
      sample: "Tech & Minimal",
    },
    { value: "DM Sans", weight: "font-medium", sample: "Editorial Feel" },
    {
      value: "Playfair Display",
      weight: "font-bold",
      sample: "Elegant Serif",
    },
    { value: "Roboto", weight: "font-normal", sample: "Classic & Clear" },
  ];

  const BUTTON_STYLES = [
    {
      value: "pill",
      label: t("pill"),
      roundedClass: "rounded-full",
    },
    {
      value: "rounded",
      label: t("rounded"),
      roundedClass: "rounded-xl",
    },
    {
      value: "square",
      label: t("square"),
      roundedClass: "rounded-none",
    },
    {
      value: "glassmorphism",
      label: t("glassmorphism"),
      roundedClass: "rounded-xl",
      extra: "glass",
    },
    {
      value: "neon",
      label: t("neon"),
      roundedClass: "rounded-xl",
      extra: "neon",
    },
    {
      value: "outline",
      label: t("outline"),
      roundedClass: "rounded-xl",
      extra: "outline-only",
    },
  ];

  return (
    <div className="space-y-8 lg:col-span-7">
      <header>
        <h2 className="font-headline mb-2 text-4xl font-black tracking-tighter">
          {t("title")}
        </h2>
        <p className="text-on-surface-variant font-light">{t("description")}</p>
      </header>

      {/* Auto-save indicator */}
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-xs font-medium text-slate-500"
          >
            <Loader2 size={12} className="animate-spin" /> Guardando cambios...
          </motion.div>
        )}
      </AnimatePresence>

      {/* === USERNAME SECTION === */}
      <section className="bg-surface-container-low space-y-4 rounded-xl p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-lg font-bold">{tu("change")}</h3>
          <p className="text-on-surface-variant text-xs">
            {tu("currentUrl")}:{" "}
            <span className="text-primary-container font-mono font-bold">
              /{profile.username}
            </span>
          </p>
        </div>
        <div className="space-y-2">
          <div className="relative">
            <span className="text-outline pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm font-medium">
              @
            </span>
            <input
              type="text"
              value={newUsername}
              onChange={(e) =>
                setNewUsername(e.target.value.toLowerCase().replace(/\s/g, ""))
              }
              maxLength={30}
              autoComplete="off"
              placeholder={profile.username || tu("placeholder")}
              className={`bg-surface-container-highest text-on-surface placeholder:text-outline/40 w-full rounded-lg border py-3 pr-12 pl-10 transition-all outline-none focus:ring-1 ${
                usernameStatus === "available"
                  ? "border-green-500 focus:ring-green-500/40"
                  : usernameStatus === "taken" || usernameStatus === "invalid"
                    ? "border-red-500 focus:ring-red-500/40"
                    : "focus:ring-primary-container/40 border-white/5"
              }`}
            />
            <div className="absolute top-1/2 right-4 -translate-y-1/2">
              {usernameStatus === "checking" && (
                <Loader2 size={16} className="animate-spin text-slate-500" />
              )}
              {usernameStatus === "available" && (
                <Check size={16} className="text-emerald-400" />
              )}
              {usernameStatus === "taken" && (
                <AlertCircle size={16} className="text-red-400" />
              )}
              {usernameStatus === "invalid" && newUsername.length >= 3 && (
                <AlertCircle size={16} className="text-amber-400" />
              )}
            </div>
          </div>
          <AnimatePresence>
            {usernameStatus !== "idle" && usernameStatus !== "checking" && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`ml-1 text-xs font-medium ${usernameStatusColor}`}
              >
                {usernameStatus === "available"
                  ? tu("available")
                  : usernameStatus === "taken"
                    ? tu("taken")
                    : tu("invalid")}
              </motion.p>
            )}
          </AnimatePresence>
          {usernameError && (
            <p className="ml-1 text-xs text-red-400">{usernameError}</p>
          )}
        </div>
        <Button
          type="button"
          variant="luminous"
          size="pill"
          className="text-on-primary-fixed w-full py-3 text-sm font-bold disabled:opacity-50"
          disabled={
            isChangingUsername ||
            usernameStatus !== "available" ||
            newUsername.length < 3
          }
          onClick={handleChangeUsername}
        >
          {isChangingUsername ? (
            <span className="flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> {tc("saving")}
            </span>
          ) : (
            tc("save")
          )}
        </Button>
      </section>

      {/* === THEMES & MARKETPLACE === */}
      <section className="bg-noise glass-panel relative overflow-hidden rounded-xl p-6 sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="luminous-gradient flex h-8 w-8 items-center justify-center rounded-lg">
                <Sparkles className="h-4 w-4 text-[#003739]" />
              </div>
              <h3 className="font-headline text-lg font-bold text-white">
                Themes & Templates
              </h3>
            </div>
            <p className="text-on-surface-variant max-w-md text-sm">
              Discover premium templates in the marketplace to instantly
              transform your profile&apos;s aesthetic.
            </p>
          </div>
          <Link
            href="/dashboard/marketplace"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:w-auto"
          >
            Explore Marketplace
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Glow effect */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#00F5FF]/10 blur-3xl" />
      </section>

      {/* === PROFILE IDENTITY === */}
      <section className="bg-surface-container-low transform-gpu space-y-6 rounded-xl p-6 transition-all sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-headline mb-1 text-lg font-bold">
              {t("profileIdentity")}
            </h3>
            <p className="text-on-surface-variant text-sm">
              {t("updateAvatarBio")}
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleAvatarSelect}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="border-outline-variant/30 hover:bg-surface-container-highest rounded-full border px-5 py-2 text-sm font-medium transition-all disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 size={14} className="mx-auto animate-spin" />
            ) : (
              t("pickImage")
            )}
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="group relative shrink-0">
            <div className="bg-surface-container-highest border-primary-container/20 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2">
              {profile.avatar_url ? (
                <Image
                  alt="Preview Avatar"
                  className="h-full w-full object-cover"
                  src={profile.avatar_url}
                  width={96}
                  height={96}
                  sizes="96px"
                />
              ) : (
                <Icon
                  name="person"
                  className="text-on-surface-variant/50 text-4xl"
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label={t("pickImage")}
              className="bg-surface/60 absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center rounded-full border-none opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Icon name="upload" className="text-white" />
            </button>
          </div>

          <div className="flex-1 space-y-3">
            {/* Full name */}
            <div className="bg-surface-container-highest/30 border-primary/10 focus-within:bg-surface-container-highest/50 rounded-lg border-b px-4 py-3 transition-colors">
              <label
                htmlFor="profile-title"
                className="text-primary-container mb-1 block text-[10px] font-bold tracking-widest uppercase"
              >
                {t("profileTitle")}
              </label>
              <input
                id="profile-title"
                className="font-headline w-full border-none bg-transparent p-0 text-lg font-bold text-white outline-none focus:ring-0"
                type="text"
                value={profile.full_name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                onBlur={(e) => handleUpdate("title", e.target.value)}
                placeholder={t("profileTitlePlaceholder")}
              />
            </div>

            {/* Bio with counter */}
            <div className="bg-surface-container-highest/30 border-primary/10 focus-within:bg-surface-container-highest/50 rounded-lg border-b px-4 py-3 transition-colors">
              <div className="mb-1 flex items-center justify-between">
                <label
                  htmlFor="bio-desc"
                  className="text-primary-container text-[10px] font-bold tracking-widest uppercase"
                >
                  {t("bioDescription")}
                </label>
                <span className={`text-xs font-medium ${bioCountColor}`}>
                  {bioCount}/150
                </span>
              </div>
              <textarea
                id="bio-desc"
                className="text-on-surface-variant w-full resize-none border-none bg-transparent p-0 text-sm outline-none focus:ring-0"
                rows={2}
                maxLength={150}
                value={profile.bio || ""}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                onBlur={(e) => handleUpdate("bio", e.target.value)}
                placeholder={t("bioPlaceholder")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* === ACCENT COLOR + TYPOGRAPHY (side by side on md) === */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Accent Color */}
        <section className="bg-surface-container-low space-y-5 rounded-xl p-6 sm:p-8">
          <h3 className="font-headline text-lg font-bold">
            {t("accentColor")}
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {PRESET_COLORS.map((color) => {
              const isSelected =
                profile.accent_color === color ||
                (!profile.accent_color && color === "#FFFFFF");
              return (
                <motion.button
                  key={color}
                  type="button"
                  onClick={() => handleUpdate("accent_color", color)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`aspect-square w-full rounded-full transition-all ${
                    isSelected
                      ? "ring-offset-surface-container-low scale-105 ring-2 ring-offset-4"
                      : ""
                  }`}
                  style={
                    {
                      backgroundColor: color,
                      borderColor: color === "#FFFFFF" ? "#e2e8f0" : undefined,
                      borderWidth:
                        color === "#FFFFFF" && !isSelected ? "1px" : "0",
                      "--tw-ring-color": color,
                    } as React.CSSProperties
                  }
                  aria-label={`Color ${COLOR_NAMES[color] || color}`}
                />
              );
            })}
            {/* Custom color picker */}
            <label className="bg-surface-container-highest border-outline-variant hover:bg-surface-container relative flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border transition-colors">
              <input
                type="color"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                value={profile.accent_color || "#00F5FF"}
                onChange={(e) => handleColorChange(e.target.value)}
              />
              <Icon name="color_lens" className="text-xs" />
            </label>
          </div>
          {/* Active color preview */}
          {profile.accent_color && (
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full border border-white/10"
                style={{ backgroundColor: profile.accent_color }}
              />
              <span className="font-mono text-xs text-slate-500">
                {profile.accent_color}
              </span>
            </div>
          )}

          {/* Custom Text Color (Brand Mode / Escape Hatch) */}
          <div className="mt-6 border-t border-white/5 pt-6">
            <h4 className="font-headline mb-1 text-sm font-bold opacity-80">
              Advanced Brand Mode (Custom Text)
            </h4>
            <p className="text-on-surface-variant mb-4 text-xs">
              Override the automatic APCA contrast color with a custom hex.
            </p>
            <div className="flex items-center gap-3">
              <label className="bg-surface-container-highest border-outline-variant hover:bg-surface-container relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border transition-colors">
                <input
                  type="color"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  value={profile.custom_text_color || "#ffffff"}
                  onChange={(e) => {
                    setProfile((prev) => ({
                      ...prev,
                      custom_text_color: e.target.value,
                    }));
                    if (colorTimeoutRef.current)
                      clearTimeout(colorTimeoutRef.current);
                    colorTimeoutRef.current = setTimeout(() => {
                      startTransition(async () => {
                        await updateProfile({
                          custom_text_color: e.target.value,
                        });
                      });
                    }, 500);
                  }}
                />
                <Icon name="palette" className="text-sm opacity-50" />
              </label>

              <div className="flex flex-col">
                <span className="bg-surface-container-highest rounded-md px-3 py-1.5 font-mono text-xs text-slate-500">
                  {profile.custom_text_color || "Automatic (APCA)"}
                </span>
                {profile.custom_text_color && (
                  <button
                    onClick={() => {
                      setProfile((prev) => ({
                        ...prev,
                        custom_text_color: null,
                      }));
                      startTransition(async () => {
                        await updateProfile({ custom_text_color: null });
                      });
                    }}
                    className="mt-1 text-left text-[10px] font-medium text-red-400 hover:underline"
                  >
                    Reset to Automatic
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Typography — 8 fonts */}
        <section className="bg-surface-container-low space-y-4 rounded-xl p-6 sm:p-8">
          <h3 className="font-headline text-lg font-bold">{t("typography")}</h3>
          <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700 max-h-56 space-y-2 overflow-y-auto pr-1">
            {TYPOGRAPHY_OPTIONS.map((typo) => {
              const isSelected =
                profile.font_family === typo.value ||
                (!profile.font_family && typo.value === "Inter");
              return (
                <motion.button
                  key={typo.value}
                  type="button"
                  onClick={() => handleUpdate("font_family", typo.value)}
                  whileHover={{ x: 2 }}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors ${
                    isSelected
                      ? "bg-surface-container-highest border-primary-container/30 border"
                      : "bg-surface-container-highest/40 hover:bg-surface-container-highest"
                  }`}
                >
                  <div>
                    <p
                      className={`${typo.weight} text-sm leading-tight text-white`}
                      style={{ fontFamily: FONT_CSS_VAR[typo.value] }}
                    >
                      {typo.value}
                    </p>
                    <p
                      className="text-[11px] text-slate-500"
                      style={{ fontFamily: FONT_CSS_VAR[typo.value] }}
                    >
                      {typo.sample}
                    </p>
                  </div>
                  {isSelected && (
                    <Check
                      size={15}
                      className="text-primary-container shrink-0"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>
      </div>

      {/* === LAYOUT MODE === */}
      <section className="bg-surface-container-low space-y-5 rounded-xl p-6 sm:p-8">
        <h3 className="font-headline text-lg font-bold">{t("layoutMode")}</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: "list", label: t("classicList"), icon: "view_list" },
            { value: "bento", label: t("bentoGrid"), icon: "grid_view" },
          ].map((layout) => {
            const isSelected =
              profile.layout_mode === layout.value ||
              (!profile.layout_mode && layout.value === "list");
            return (
              <motion.button
                key={layout.value}
                type="button"
                onClick={() => handleUpdate("layout_mode", layout.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all ${
                  isSelected
                    ? "bg-surface-container-highest border-primary-container"
                    : "bg-surface-container-highest/40 hover:bg-surface-container-highest border-transparent"
                }`}
              >
                <Icon
                  name={layout.icon}
                  className={`text-4xl ${isSelected ? "text-primary-container" : "text-on-surface-variant"}`}
                />
                <span
                  className={`text-[10px] font-bold tracking-widest uppercase ${
                    isSelected
                      ? "text-primary-container"
                      : "text-on-surface-variant"
                  }`}
                >
                  {layout.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* === BUTTON STYLE — 6 options === */}
      <section className="bg-surface-container-low space-y-5 rounded-xl p-6 sm:p-8">
        <h3 className="font-headline text-lg font-bold">
          {t("buttonArchitecture")}
        </h3>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {BUTTON_STYLES.map((style) => {
            const isSelected =
              profile.button_style === style.value ||
              (!profile.button_style && style.value === "pill");
            return (
              <motion.button
                key={style.value}
                type="button"
                onClick={() => handleUpdate("button_style", style.value)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`flex flex-col items-center gap-3 rounded-xl border-2 p-3 transition-all ${
                  isSelected
                    ? "bg-surface-container-highest border-primary-container"
                    : "bg-surface-container-highest/40 hover:bg-surface-container-highest border-transparent"
                }`}
              >
                {/* Button shape preview */}
                <div className="w-full">
                  <div
                    className={`h-7 w-full border ${style.roundedClass} ${
                      style.extra === "glass"
                        ? "border-white/20 bg-white/10 backdrop-blur-sm"
                        : style.extra === "neon"
                          ? "border-cyan-400 bg-transparent shadow-[0_0_8px_rgba(0,245,255,0.5)]"
                          : style.extra === "outline-only"
                            ? "border-white/60 bg-transparent"
                            : isSelected
                              ? "bg-primary-container/20 border-primary-container"
                              : "bg-on-surface-variant/20 border-on-surface-variant/30"
                    }`}
                  />
                </div>
                <span
                  className={`text-center text-[9px] leading-tight font-bold tracking-wider uppercase ${
                    isSelected
                      ? "text-primary-container"
                      : "text-on-surface-variant"
                  }`}
                >
                  {style.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
