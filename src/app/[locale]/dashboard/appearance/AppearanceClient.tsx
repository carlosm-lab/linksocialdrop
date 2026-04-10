"use client";

import { useState, useTransition, useRef, useEffect, useCallback } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { updateProfile, updateAvatar } from "@/actions/profile";
import { checkUsernameForUser, claimUsername } from "@/actions/username";
import { Database } from "@/types/database";
import Image from "next/image";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

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

  // Username change state
  const [newUsername, setNewUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");
  const [isChangingUsername, setIsChangingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const checkAvailability = useCallback(
    async (value: string) => {
      const regex = /^[a-zA-Z0-9._]+$/;
      if (value.length < 3 || value.length > 30 || !regex.test(value)) {
        setUsernameStatus("invalid");
        return;
      }
      // If it's the same as current username, skip
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
    const timer = setTimeout(() => checkAvailability(newUsername), 500);
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
      setUsernameError("Error updating username");
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
    setProfile((prev) => ({
      ...prev,
      accent_color: value,
    }));

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
    "#00F5FF": "Cyan",
    "#FFD700": "Gold",
    "#FF6B6B": "Coral",
    "#A061FF": "Purple",
    "#4ECDC4": "Teal",
    "#FF8C42": "Orange",
    "#FFFFFF": "White",
  };

  const TYPOGRAPHY_OPTIONS = [
    { value: "Epilogue", class: "font-headline font-bold" },
    { value: "Inter", class: "font-body font-medium" },
    { value: "Roboto", class: "font-sans font-medium" },
  ];

  const BUTTON_STYLES = [
    { value: "pill", label: t("pill"), roundedClass: "rounded-full" },
    { value: "rounded", label: t("rounded"), roundedClass: "rounded-lg" },
    { value: "square", label: t("square"), roundedClass: "rounded-none" },
  ];

  return (
    <div className="space-y-8 lg:col-span-7">
      <header>
        <h2 className="font-headline mb-2 text-4xl font-black tracking-tighter">
          {t("title")}
        </h2>
        <p className="text-on-surface-variant font-light">{t("description")}</p>
      </header>

      {/* Username Section */}
      <section className="bg-surface-container-low space-y-4 rounded-xl p-8">
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
              className="bg-surface-container-highest text-on-surface placeholder:text-outline/40 focus:ring-primary-container/40 w-full rounded-lg border-none py-3 pr-12 pl-10 outline-none focus:ring-1"
            />
            {usernameStatus === "checking" && (
              <div className="absolute top-1/2 right-4 -translate-y-1/2">
                <div className="border-primary-container h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              </div>
            )}
            {usernameStatus === "available" && (
              <Icon
                name="check_circle"
                className="absolute top-1/2 right-4 -translate-y-1/2 text-lg text-emerald-400"
              />
            )}
            {usernameStatus === "taken" && (
              <Icon
                name="cancel"
                className="absolute top-1/2 right-4 -translate-y-1/2 text-lg text-red-400"
              />
            )}
            {usernameStatus === "invalid" && newUsername.length >= 3 && (
              <Icon
                name="error"
                className="absolute top-1/2 right-4 -translate-y-1/2 text-lg text-amber-400"
              />
            )}
          </div>
          {usernameStatus !== "idle" && usernameStatus !== "checking" && (
            <p className={`ml-1 text-xs font-medium ${usernameStatusColor}`}>
              {usernameStatus === "available"
                ? tu("available")
                : usernameStatus === "taken"
                  ? tu("taken")
                  : tu("invalid")}
            </p>
          )}
          {usernameStatus === "checking" && (
            <p className="ml-1 text-xs text-slate-500">{tu("checking")}</p>
          )}
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
          {isChangingUsername ? tc("saving") : tc("save")}
        </Button>
      </section>

      <section className="bg-surface-container-low transform-gpu space-y-6 rounded-xl p-8 transition-all">
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
            className="border-outline-variant/30 hover:bg-surface-container-highest rounded-full border px-6 py-2 text-sm font-medium transition-all disabled:opacity-50"
          >
            {isUploading ? "..." : t("pickImage")}
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="group relative">
            <div className="bg-surface-container-highest border-primary-container/20 flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2">
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
          <div className="flex-1 space-y-4">
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
                placeholder="Digital Manager"
              />
            </div>
            <div className="bg-surface-container-highest/30 border-primary/10 focus-within:bg-surface-container-highest/50 rounded-lg border-b px-4 py-3 transition-colors">
              <label
                htmlFor="bio-desc"
                className="text-primary-container mb-1 block text-[10px] font-bold tracking-widest uppercase"
              >
                {t("bioDescription")}
              </label>
              <textarea
                id="bio-desc"
                className="text-on-surface-variant w-full resize-none border-none bg-transparent p-0 text-sm outline-none focus:ring-0"
                rows={2}
                value={profile.bio || ""}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                onBlur={(e) => handleUpdate("bio", e.target.value)}
                placeholder="Synthesizing modern aesthetics with functional digital architecture."
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="bg-surface-container-low space-y-6 rounded-xl p-8">
          <h3 className="font-headline text-lg font-bold">
            {t("accentColor")}
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {PRESET_COLORS.map((color) => {
              const isSelected =
                profile.accent_color === color ||
                (!profile.accent_color && color === "#FFFFFF");
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleUpdate("accent_color", color)}
                  className={`aspect-square w-full rounded-full transition-transform hover:scale-105 ${
                    isSelected
                      ? "ring-offset-surface-container-low ring-2 ring-offset-4"
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
        </section>

        <section className="bg-surface-container-low space-y-6 rounded-xl p-8">
          <h3 className="font-headline text-lg font-bold">{t("typography")}</h3>
          <div className="space-y-3">
            {TYPOGRAPHY_OPTIONS.map((typo) => {
              const isSelected =
                profile.font_family === typo.value ||
                (!profile.font_family && typo.value === "Inter");
              return (
                <button
                  key={typo.value}
                  type="button"
                  onClick={() => handleUpdate("font_family", typo.value)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 transition-colors ${
                    isSelected
                      ? "bg-surface-container-highest border-primary-container/30 border"
                      : "bg-surface-container-highest/40 hover:bg-surface-container-highest"
                  }`}
                >
                  <span className={typo.class}>{typo.value}</span>
                  {isSelected && (
                    <Icon
                      name="check_circle"
                      className="text-primary-container text-sm"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <section className="bg-surface-container-low space-y-6 rounded-xl p-8">
        <h3 className="font-headline text-lg font-bold">Layout Mode</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: "list", label: "Classic List", icon: "view_list" },
            { value: "bento", label: "Bento Grid", icon: "grid_view" },
          ].map((layout) => {
            const isSelected =
              profile.layout_mode === layout.value ||
              (!profile.layout_mode && layout.value === "list");
            return (
              <button
                key={layout.value}
                type="button"
                onClick={() => handleUpdate("layout_mode", layout.value)}
                className={`flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all ${
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
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-surface-container-low space-y-6 rounded-xl p-8">
        <h3 className="font-headline text-lg font-bold">
          {t("buttonArchitecture")}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {BUTTON_STYLES.map((style) => {
            const isSelected =
              profile.button_style === style.value ||
              (!profile.button_style && style.value === "pill");
            return (
              <button
                key={style.value}
                type="button"
                onClick={() => handleUpdate("button_style", style.value)}
                className={`flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                  isSelected
                    ? "bg-surface-container-highest border-primary-container"
                    : "bg-surface-container-highest/40 hover:bg-surface-container-highest border-transparent"
                }`}
              >
                <div
                  className={`h-8 w-full border ${style.roundedClass} ${
                    isSelected
                      ? "bg-primary-container/20 border-primary-container"
                      : "bg-on-surface-variant/20 border-on-surface-variant/30"
                  }`}
                ></div>
                <span
                  className={`text-[10px] font-bold tracking-widest uppercase ${
                    isSelected
                      ? "text-primary-container"
                      : "text-on-surface-variant"
                  }`}
                >
                  {style.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
