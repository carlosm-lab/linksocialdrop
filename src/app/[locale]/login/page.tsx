"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useTranslations } from "next-intl";
import { login, signup, signInWithGoogle } from "@/actions/auth";
import { checkUsername, claimUsername } from "@/actions/username";

type Step = "auth" | "username";

export default function LoginPage() {
  const t = useTranslations("login");
  const tc = useTranslations("common");
  const tu = useTranslations("username");
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("auth");

  // Username step state
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    try {
      const action = isSignUp ? signup : login;
      const result = await action(formData);

      if (result?.serverError) {
        setError(result.serverError);
      } else if (result?.validationErrors) {
        const fieldErrors = Object.values(result.validationErrors).flat();
        setError((fieldErrors[0] as string) || tc("invalidInput"));
      } else if (result?.data?.success) {
        if (isSignUp) {
          // After signup, go to username selection step
          setStep("username");
        } else {
          router.push("/dashboard/links");
        }
      }
    } catch {
      // Handle potential errors
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      // redirect throws
    } finally {
      setLoading(false);
    }
  }

  // Debounced username check
  const checkUsernameAvailability = useCallback(async (value: string) => {
    const regex = /^[a-zA-Z0-9._]+$/;
    if (value.length < 3 || value.length > 30 || !regex.test(value)) {
      setUsernameStatus("invalid");
      return;
    }

    setUsernameStatus("checking");
    try {
      const result = await checkUsername({ username: value });
      if (result?.data?.available) {
        setUsernameStatus("available");
      } else {
        setUsernameStatus("taken");
      }
    } catch {
      setUsernameStatus("invalid");
    }
  }, []);

  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    const timer = setTimeout(() => {
      checkUsernameAvailability(username);
    }, 500);

    return () => clearTimeout(timer);
  }, [username, checkUsernameAvailability]);

  async function handleClaimUsername() {
    if (usernameStatus !== "available") return;
    setLoading(true);
    setError(null);

    try {
      const result = await claimUsername({ username });
      if (result?.serverError) {
        setError(result.serverError);
      } else if (result?.data?.success) {
        router.push("/dashboard/links");
      }
    } catch {
      setError(t("errorSettingUsername") ?? tc("unexpectedError"));
    } finally {
      setLoading(false);
    }
  }

  const statusColor =
    usernameStatus === "available"
      ? "text-emerald-400"
      : usernameStatus === "taken"
        ? "text-red-400"
        : usernameStatus === "invalid"
          ? "text-amber-400"
          : "text-slate-500";

  const statusIcon =
    usernameStatus === "available"
      ? "check_circle"
      : usernameStatus === "taken"
        ? "cancel"
        : usernameStatus === "invalid"
          ? "error"
          : null;

  const statusText =
    usernameStatus === "available"
      ? tu("available")
      : usernameStatus === "taken"
        ? tu("taken")
        : usernameStatus === "invalid"
          ? tu("invalid")
          : usernameStatus === "checking"
            ? tu("checking")
            : null;

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container/30 relative min-h-screen">
      {/* Background Texture */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="bg-primary-container/5 absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-[120px]"></div>
        <div className="bg-primary-container/3 absolute top-[20%] -right-[5%] h-[50%] w-[30%] rounded-full blur-[100px]"></div>
      </div>

      {/* Main Content Canvas */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        {/* Brand Anchor */}
        <header className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Icon name="link" className="text-primary-container text-4xl" />
          </div>
          <h1 className="font-headline text-primary-container mb-2 text-5xl font-black tracking-tighter">
            {tc("brandName")}
          </h1>
          <p className="font-label text-outline text-sm tracking-[0.2em] uppercase opacity-80">
            {t("tagline")}
          </p>
        </header>

        {/* Auth Card */}
        <section className="w-full max-w-md">
          <div className="bg-surface-container-low border-outline-variant/10 relative overflow-hidden rounded-xl border p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] md:p-12">
            {/* Subtle Spotlight Effect */}
            <div className="bg-primary-container/5 pointer-events-none absolute top-0 right-0 h-32 w-32 blur-3xl"></div>

            <div className="relative z-10">
              {step === "auth" ? (
                <>
                  <h2 className="font-headline mb-8 text-2xl font-bold tracking-tight text-white">
                    {isSignUp ? t("createAccount") : t("welcomeBack")}
                  </h2>

                  {/* Error Display */}
                  {error && (
                    <div className="bg-error/10 border-error/20 text-error mb-6 rounded-lg border p-3 text-sm">
                      {error}
                    </div>
                  )}

                  <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                      <label
                        className="font-label text-outline ml-1 text-xs font-semibold tracking-wider uppercase"
                        htmlFor="email"
                      >
                        {t("emailLabel")}
                      </label>
                      <div className="relative">
                        <Icon
                          name="mail"
                          className="text-outline pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-xl"
                        />
                        <input
                          className="bg-surface-container-high text-on-surface placeholder:text-outline/40 focus:ring-primary-container/40 w-full rounded-lg border-none py-4 pr-4 pl-12 transition-all outline-none focus:ring-1"
                          id="email"
                          name="email"
                          placeholder={t("emailPlaceholder")}
                          type="email"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        className="font-label text-outline ml-1 text-xs font-semibold tracking-wider uppercase"
                        htmlFor="password"
                      >
                        {t("passwordLabel")}
                      </label>
                      <div className="relative">
                        <Icon
                          name="lock"
                          className="text-outline pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-xl"
                        />
                        <input
                          className="bg-surface-container-high text-on-surface placeholder:text-outline/40 focus:ring-primary-container/40 w-full rounded-lg border-none py-4 pr-12 pl-12 transition-all outline-none focus:ring-1"
                          id="password"
                          name="password"
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          required
                          minLength={6}
                          disabled={loading}
                        />
                        <button
                          className="text-outline hover:text-primary-container absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                          type="button"
                          aria-pressed={showPassword}
                          aria-label={t("togglePasswordVisibility")}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon
                            name={
                              showPassword ? "visibility_off" : "visibility"
                            }
                            className="text-xl"
                          />
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="luminous"
                      size="pill"
                      className="text-on-primary-fixed font-headline shadow-primary-container/20 mt-4 w-full py-4 font-bold shadow-lg disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? "..." : isSignUp ? t("signUp") : t("signIn")}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-10 flex items-center">
                    <div className="border-outline-variant/20 flex-grow border-t"></div>
                    <span className="font-label text-outline mx-4 text-xs tracking-widest uppercase">
                      {t("orContinueWith")}
                    </span>
                    <div className="border-outline-variant/20 flex-grow border-t"></div>
                  </div>

                  {/* OAuth Buttons */}
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="bg-surface-container-highest hover:bg-surface-bright text-on-surface border-outline-variant/5 flex items-center justify-center gap-3 rounded-lg border py-3.5 transition-all disabled:opacity-50"
                    >
                      <Image
                        alt="Google"
                        className="h-5 w-5"
                        src="/icons/google.svg"
                        width={20}
                        height={20}
                      />
                      <span className="text-sm font-medium">Google</span>
                    </button>
                  </div>

                  {/* Toggle Footer */}
                  <div className="mt-10 text-center">
                    <p className="text-outline text-sm">
                      {isSignUp ? t("hasAccount") : t("noAccount")}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(!isSignUp);
                          setError(null);
                        }}
                        className="text-primary-container decoration-primary-container/30 ml-1 font-semibold underline-offset-4 hover:underline"
                      >
                        {isSignUp ? t("signIn") : t("signUp")}
                      </button>
                    </p>
                  </div>
                </>
              ) : (
                /* Step 2: Username Selection */
                <>
                  <div className="mb-2 text-center">
                    <div className="bg-primary-container/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                      <Icon
                        name="person"
                        className="text-primary-container text-3xl"
                      />
                    </div>
                    <h2 className="font-headline mb-2 text-2xl font-bold tracking-tight text-white">
                      {tu("chooseTitle")}
                    </h2>
                    <p className="text-outline text-sm">
                      {tu("chooseDescription")}
                    </p>
                  </div>

                  {error && (
                    <div className="bg-error/10 border-error/20 text-error mb-6 rounded-lg border p-3 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="mt-8 space-y-4">
                    <div className="space-y-1.5">
                      <label
                        className="font-label text-outline ml-1 text-xs font-semibold tracking-wider uppercase"
                        htmlFor="username"
                      >
                        {tu("label")}
                      </label>
                      <div className="relative">
                        <span className="text-outline pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm font-medium">
                          @
                        </span>
                        <input
                          className="bg-surface-container-high text-on-surface placeholder:text-outline/40 focus:ring-primary-container/40 w-full rounded-lg border-none py-4 pr-12 pl-10 transition-all outline-none focus:ring-1"
                          id="username"
                          name="username"
                          placeholder={tu("placeholder")}
                          type="text"
                          autoComplete="off"
                          maxLength={30}
                          value={username}
                          onChange={(e) =>
                            setUsername(
                              e.target.value.toLowerCase().replace(/\s/g, "")
                            )
                          }
                          disabled={loading}
                        />
                        {usernameStatus === "checking" && (
                          <div className="absolute top-1/2 right-4 -translate-y-1/2">
                            <div className="border-primary-container h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
                          </div>
                        )}
                        {statusIcon && usernameStatus !== "checking" && (
                          <Icon
                            name={statusIcon}
                            className={`absolute top-1/2 right-4 -translate-y-1/2 text-xl ${statusColor}`}
                          />
                        )}
                      </div>
                      {statusText && usernameStatus !== "idle" && (
                        <p
                          className={`mt-1 ml-1 text-xs font-medium ${statusColor}`}
                        >
                          {statusText}
                        </p>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="luminous"
                      size="pill"
                      className="text-on-primary-fixed font-headline shadow-primary-container/20 mt-4 w-full py-4 font-bold shadow-lg disabled:opacity-50"
                      disabled={
                        loading ||
                        usernameStatus !== "available" ||
                        username.length < 3
                      }
                      onClick={handleClaimUsername}
                    >
                      {loading ? "..." : tu("claim")}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Support Link */}
        <footer className="mt-12">
          <Link
            href="/support"
            className="font-label text-outline flex items-center gap-2 text-xs tracking-[0.2em] uppercase transition-colors hover:text-white"
          >
            <Icon name="help_outline" className="text-sm" />
            {t("needHelp")}
          </Link>
        </footer>
      </main>

      {/* Ghost Element for Interaction Feel */}
      <div className="pointer-events-none fixed right-8 bottom-8 hidden opacity-20 md:block">
        <div className="font-headline text-surface-container-highest text-8xl font-black select-none">
          DROP
        </div>
      </div>
    </div>
  );
}
