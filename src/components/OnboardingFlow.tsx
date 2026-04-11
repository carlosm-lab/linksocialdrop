"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAction } from "next-safe-action/hooks";
import { completeOnboarding } from "@/actions/onboarding";
import { updateAvatar } from "@/actions/profile";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { getIconNameByUrl } from "@/lib/icons";
import Image from "next/image";
import {
  Loader2,
  ArrowRight,
  User,
  Link as LinkIcon,
  CheckCircle2,
  Camera,
  Check,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Icon } from "@/components/ui/icon";

// --- Username validation hook with debounce ---
function useUsernameStatus(username: string) {
  const [status, setStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");

  useEffect(() => {
    if (!username) return;

    const isValidFormat = /^[a-zA-Z0-9._]{3,30}$/.test(username);

    // Schedule async check or mark invalid — do NOT call setState before the timeout
    const timer = setTimeout(async () => {
      if (!isValidFormat) {
        setStatus(username.length >= 3 ? "invalid" : "idle");
        return;
      }
      setStatus("checking");
      try {
        const res = await fetch(
          `/api/check-username?username=${encodeURIComponent(username)}`
        );
        const data = await res.json();
        setStatus(data.available ? "available" : "taken");
      } catch {
        // If API doesn't exist yet, fall back to 'available' for dev
        setStatus("available");
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      // Reset to idle on cleanup so stale status doesn't flash
      setStatus("idle");
    };
  }, [username]);

  return status;
}

// --- Welcome screen (step 0 — shown before step 1) ---
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const t = useTranslations("onboarding");
  return (
    <motion.div
      key="welcome"
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.92, opacity: 0 }}
      transition={{ type: "spring", stiffness: 250, damping: 25 }}
      className="space-y-6 text-center"
    >
      <div className="relative mx-auto h-20 w-20">
        <div className="luminous-gradient h-full w-full rounded-full opacity-20 blur-2xl" />
        <div className="luminous-gradient absolute inset-0 flex items-center justify-center rounded-full">
          <Sparkles className="h-8 w-8 text-black" />
        </div>
      </div>
      <div className="space-y-1">
        <span className="text-primary-container bg-primary-container/10 rounded-full px-3 py-1 text-xs font-bold tracking-widest uppercase">
          {t("welcomeBadge")}
        </span>
        <h2 className="font-headline text-on-surface mt-3 text-3xl font-extrabold tracking-tight">
          {t("welcomeTitle")}
        </h2>
        <p className="text-on-surface-variant text-sm">{t("welcomeDesc")}</p>
      </div>
      <button
        onClick={onStart}
        className="bg-primary text-on-primary hover:bg-primary/90 shadow-primary/20 mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-bold shadow-lg transition-all hover:shadow-xl"
      >
        {t("continue")} <ArrowRight size={18} />
      </button>
    </motion.div>
  );
}

// --- Celebration screen (after step 3 completes) ---
function CelebrationScreen() {
  const t = useTranslations("onboarding");
  return (
    <motion.div
      key="celebration"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="flex min-h-[320px] flex-col items-center justify-center space-y-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="relative mx-auto h-24 w-24">
          <div className="luminous-gradient h-full w-full rounded-full opacity-40 blur-3xl" />
          <div className="bg-primary-container absolute inset-0 flex items-center justify-center rounded-full">
            <CheckCircle2 className="h-12 w-12 text-black" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="space-y-2"
      >
        <h2 className="font-headline text-on-surface text-3xl font-extrabold">
          {t("profileReady")}
        </h2>
        <p className="text-on-surface-variant text-sm">{t("redirecting")}</p>
      </motion.div>

      {/* Particle dots */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-primary-container absolute h-2 w-2 rounded-full"
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos((i * Math.PI * 2) / 8) * 70,
            y: Math.sin((i * Math.PI * 2) / 8) * 70,
          }}
          transition={{ delay: 0.1 + i * 0.05, duration: 0.7 }}
        />
      ))}
    </motion.div>
  );
}

export function OnboardingFlow() {
  const [step, setStep] = useState(0); // 0 = welcome, 1-3 = steps, 4 = celebration
  const router = useRouter();
  const t = useTranslations("onboarding");

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
    link_title: "",
    link_url: "",
  });

  // Avatar state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Social icon detection for step 3
  const detectedIcon = formData.link_url
    ? getIconNameByUrl(formData.link_url)
    : null;
  const hasHttpsWarning =
    formData.link_url.length > 5 &&
    !formData.link_url.startsWith("http://") &&
    !formData.link_url.startsWith("https://");

  // Platform detection name
  const platformName = formData.link_url
    ? formData.link_url.includes("youtube")
      ? "YouTube"
      : formData.link_url.includes("instagram")
        ? "Instagram"
        : formData.link_url.includes("tiktok")
          ? "TikTok"
          : formData.link_url.includes("twitter") ||
              formData.link_url.includes("x.com")
            ? "Twitter/X"
            : formData.link_url.includes("linkedin")
              ? "LinkedIn"
              : formData.link_url.includes("twitch")
                ? "Twitch"
                : formData.link_url.includes("spotify")
                  ? "Spotify"
                  : formData.link_url.includes("github")
                    ? "GitHub"
                    : null
    : null;

  const usernameStatus = useUsernameStatus(formData.username);

  const { execute: executeOnboarding, status: onboardingStatus } = useAction(
    completeOnboarding,
    {
      onSuccess: () => {
        setStep(4);
        setTimeout(() => {
          router.push("/dashboard/links");
        }, 2500);
      },
    }
  );

  const { execute: executeAvatar } = useAction(updateAvatar);

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleComplete = useCallback(async () => {
    let finalUrl = formData.link_url;
    if (
      finalUrl &&
      !finalUrl.startsWith("http://") &&
      !finalUrl.startsWith("https://")
    ) {
      finalUrl = "https://" + finalUrl;
    }

    // Upload avatar first if selected
    if (avatarFile) {
      const fd = new FormData();
      fd.append("file", avatarFile);
      await executeAvatar(fd as never);
    }

    executeOnboarding({ ...formData, link_url: finalUrl });
  }, [formData, avatarFile, executeOnboarding, executeAvatar]);

  const isStep1Valid =
    formData.username.length >= 3 &&
    (usernameStatus === "available" || usernameStatus === "idle");
  const isStep2Valid = formData.full_name.length >= 1;
  const checkUrl = formData.link_url.startsWith("http")
    ? formData.link_url
    : "https://" + formData.link_url;
  const isStep3Valid =
    formData.link_title.length >= 1 &&
    formData.link_url.length > 3 &&
    checkUrl.includes(".");

  const bioCount = formData.bio.length;
  const bioColor =
    bioCount > 130
      ? "text-red-400"
      : bioCount > 110
        ? "text-yellow-400"
        : "text-on-surface-variant/60";

  return (
    <div className="glass-panel bg-noise relative mx-auto w-full max-w-md overflow-hidden rounded-3xl p-8 shadow-2xl">
      {/* Progress dots — only shown for steps 1–3 */}
      <AnimatePresence>
        {step >= 1 && step <= 3 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative z-10 mb-8 flex items-center justify-between"
          >
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === step
                      ? "bg-primary w-8"
                      : i < step
                        ? "bg-primary/60 w-6"
                        : "bg-outline-variant/30 w-4"
                  }`}
                />
              ))}
            </div>
            <span className="text-outline text-sm font-medium">
              {t("stepOf", { step, total: 3 })}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 min-h-[320px]">
        <AnimatePresence mode="wait">
          {/* === WELCOME SCREEN === */}
          {step === 0 && <WelcomeScreen onStart={() => setStep(1)} />}

          {/* === STEP 1: Username === */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-headline text-on-surface mb-2 text-3xl font-extrabold tracking-tight">
                  {t("claimLink")}
                </h2>
                <p className="text-on-surface-variant text-base">
                  {t("claimLinkDesc")}
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-on-surface text-sm font-medium"
                >
                  {t("usernameLabel")}
                </label>
                <div className="relative flex items-center">
                  <div
                    className={`bg-surface-container-highest flex w-full items-center overflow-hidden rounded-xl border transition-all ${
                      usernameStatus === "available"
                        ? "border-green-500 ring-1 ring-green-500/40"
                        : usernameStatus === "taken" ||
                            usernameStatus === "invalid"
                          ? "border-red-500 ring-1 ring-red-500/40"
                          : "border-outline-variant focus-within:border-primary focus-within:ring-primary/40 focus-within:ring-1"
                    }`}
                  >
                    <span className="text-on-surface-variant shrink-0 pl-4 text-xs font-medium">
                      {siteConfig.url.replace("https://", "")}/
                    </span>
                    <input
                      id="username"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="text-on-surface w-full border-none bg-transparent py-3 pr-10 pl-1 outline-none"
                      placeholder={t("usernamePlaceholder")}
                      autoComplete="off"
                    />
                    <div className="absolute right-3 flex items-center">
                      {usernameStatus === "checking" && (
                        <Loader2
                          size={16}
                          className="text-outline animate-spin"
                        />
                      )}
                      {usernameStatus === "available" && (
                        <Check size={16} className="text-green-400" />
                      )}
                      {(usernameStatus === "taken" ||
                        usernameStatus === "invalid") && (
                        <AlertCircle size={16} className="text-red-400" />
                      )}
                    </div>
                  </div>
                </div>
                <AnimatePresence>
                  {usernameStatus === "available" && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1 text-xs font-medium text-green-400"
                    >
                      ✓ {t("usernameAvailable")}
                    </motion.p>
                  )}
                  {usernameStatus === "taken" && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-error mt-1 text-xs font-medium"
                    >
                      ✕ {t("usernameTaken")}
                    </motion.p>
                  )}
                  {usernameStatus === "invalid" && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1 text-xs text-yellow-400"
                    >
                      Solo letras, números, puntos y guiones bajos (3-30 chars)
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleNext}
                disabled={!isStep1Valid || usernameStatus === "checking"}
                className="bg-primary text-on-primary hover:bg-primary/90 shadow-primary/20 mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-bold shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("continue")} <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {/* === STEP 2: Profile Photo + Bio === */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-headline text-on-surface mb-2 text-3xl font-extrabold tracking-tight">
                  {t("introduce")}
                </h2>
                <p className="text-on-surface-variant text-base">
                  {t("introduceDesc")}
                </p>
              </div>

              {/* Avatar upload */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="group relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-full"
                  aria-label={t("uploadPhoto")}
                >
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-surface-container-highest border-outline-variant/30 flex h-full w-full items-center justify-center rounded-full border-2 border-dashed">
                      <User
                        className="text-on-surface-variant group-hover:text-primary transition-colors"
                        size={28}
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </button>
                <div>
                  <p className="text-on-surface text-sm font-medium">
                    {avatarPreview ? t("changePhoto") : t("uploadPhoto")}
                  </p>
                  <p className="text-on-surface-variant text-xs">
                    JPG, PNG o WebP · máx 5MB
                  </p>
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="full_name"
                    className="text-on-surface text-sm font-medium"
                  >
                    {t("displayName")}
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="text-on-surface-variant absolute top-1/2 left-3 -translate-y-1/2"
                    />
                    <input
                      id="full_name"
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="bg-surface-container-highest border-outline-variant focus:border-primary text-on-surface focus:ring-primary w-full rounded-xl border py-3 pr-4 pl-10 transition-all outline-none focus:ring-1"
                      placeholder={t("displayNamePlaceholder")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="bio"
                      className="text-on-surface text-sm font-medium"
                    >
                      {t("bio")}{" "}
                      <span className="text-outline text-xs font-normal">
                        ({t("optional")})
                      </span>
                    </label>
                    <span className={`text-xs font-medium ${bioColor}`}>
                      {bioCount}/150
                    </span>
                  </div>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    maxLength={150}
                    className="bg-surface-container-highest border-outline-variant focus:border-primary text-on-surface focus:ring-primary h-24 w-full resize-none rounded-xl border px-4 py-3 transition-all outline-none focus:ring-1"
                    placeholder={t("bioPlaceholder")}
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleBack}
                  className="border-outline-variant text-on-surface hover:bg-surface-container rounded-xl border px-4 py-3 font-medium transition-colors"
                >
                  {t("back")}
                </button>
                <button
                  onClick={handleNext}
                  disabled={!isStep2Valid}
                  className="bg-primary text-on-primary hover:bg-primary/90 shadow-primary/20 flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("nextStep")} <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* === STEP 3: First Link === */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-headline text-on-surface mb-2 text-3xl font-extrabold tracking-tight">
                  {t("firstLink")}
                </h2>
                <p className="text-on-surface-variant text-base">
                  {t("firstLinkDesc")}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="link_title"
                    className="text-on-surface text-sm font-medium"
                  >
                    {t("linkTitle")}
                  </label>
                  <input
                    id="link_title"
                    type="text"
                    name="link_title"
                    value={formData.link_title}
                    onChange={handleChange}
                    className="bg-surface-container-highest border-outline-variant focus:border-primary text-on-surface focus:ring-primary w-full rounded-xl border px-4 py-3 transition-all outline-none focus:ring-1"
                    placeholder={t("linkTitlePlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="link_url"
                    className="text-on-surface text-sm font-medium"
                  >
                    URL
                  </label>
                  <div className="relative">
                    {/* Auto-detected icon with animation */}
                    <AnimatePresence mode="wait">
                      {detectedIcon ? (
                        <motion.div
                          key={detectedIcon}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="absolute top-1/2 left-3 -translate-y-1/2"
                        >
                          <Icon
                            name={detectedIcon}
                            className="text-primary-container text-lg"
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="link-icon"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="absolute top-1/2 left-3 -translate-y-1/2"
                        >
                          <LinkIcon
                            size={18}
                            className="text-on-surface-variant"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <input
                      id="link_url"
                      type="text"
                      name="link_url"
                      value={formData.link_url}
                      onChange={handleChange}
                      className="bg-surface-container-highest border-outline-variant focus:border-primary text-on-surface focus:ring-primary w-full rounded-xl border py-3 pr-4 pl-10 transition-all outline-none focus:ring-1"
                      placeholder={t("linkUrlPlaceholder")}
                    />
                  </div>

                  {/* Platform detected badge */}
                  <AnimatePresence>
                    {platformName && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.95 }}
                        className="bg-primary-container/10 border-primary-container/20 mt-1 flex items-center gap-2 rounded-lg border px-3 py-1.5"
                      >
                        <ExternalLink
                          size={12}
                          className="text-primary-container"
                        />
                        <span className="text-primary-container text-xs font-medium">
                          {t("socialDetected", { platform: platformName })}
                        </span>
                      </motion.div>
                    )}
                    {hasHttpsWarning && !platformName && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-1 flex items-center gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5"
                      >
                        <AlertCircle size={12} className="text-yellow-400" />
                        <span className="text-xs text-yellow-400">
                          {t("missingHttps")}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleBack}
                  disabled={onboardingStatus === "executing"}
                  className="border-outline-variant text-on-surface hover:bg-surface-container rounded-xl border px-4 py-3 font-medium transition-colors disabled:opacity-50"
                >
                  {t("back")}
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!isStep3Valid || onboardingStatus === "executing"}
                  className="bg-primary text-on-primary hover:bg-primary/90 shadow-primary/20 flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {onboardingStatus === "executing" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />{" "}
                      {t("creating")}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} /> {t("ready")}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* === CELEBRATION === */}
          {step === 4 && <CelebrationScreen />}
        </AnimatePresence>
      </div>
    </div>
  );
}
