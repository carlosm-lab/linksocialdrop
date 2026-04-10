"use client";

import { useState, useTransition, useRef } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { updateProfile, updateAvatar } from "@/actions/profile";
import { Database } from "@/types/database";
import Image from "next/image";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function AppearanceClient({
  initialProfile,
}: {
  initialProfile: Profile;
}) {
  const t = useTranslations("adminAppearance");

  const [isPending, startTransition] = useTransition();
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = async (field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field === "title" ? "full_name" : field]: value,
    }));
    startTransition(async () => {
      await updateProfile({ [field]: value });
    });
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
                placeholder="Digital Curator"
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
            <button className="bg-surface-container-highest border-outline-variant hover:bg-surface-container flex aspect-square w-full items-center justify-center rounded-full border transition-colors">
              <Icon name="add" className="text-xs" />
            </button>
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
