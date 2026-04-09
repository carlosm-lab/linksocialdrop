"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useTranslations } from "next-intl";
import { login, signup, signInWithGoogle } from "@/actions/auth";

export default function LoginPage() {
  const t = useTranslations("login");
  const tc = useTranslations("common");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    try {
      const action = isSignUp ? signup : login;
      const result = await action(formData);

      if (result?.error) {
        if ("general" in result.error) {
          setError(
            (result.error as { general: string[] }).general[0] ||
              "An error occurred"
          );
        } else {
          const fieldErrors = Object.values(result.error).flat();
          setError(fieldErrors[0] as string);
        }
      }
    } catch {
      // redirect throws an error in Server Actions — that's expected behavior
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
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Icon
                        name={showPassword ? "visibility_off" : "visibility"}
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
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="bg-surface-container-highest hover:bg-surface-bright text-on-surface border-outline-variant/5 flex items-center justify-center gap-3 rounded-lg border py-3.5 transition-all disabled:opacity-50"
                >
                  <img
                    alt="Google"
                    className="h-5 w-5"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqun8tMiSkqxxt8FN8RrRla4zfV3BY3iCDlla7rZnLPVaiPezHDUYdr0bYLx46sQ-matxsFlzDgBMfz9ozz6d9rNHHIIluFdKHSm0_x5nvPBZrzcBW4DkGWLXRK9jUh-c4PTC6XoEiU_h5k-J4CbWdVcEfapRwbvbeDGZrol5snkPbnyM5pkGddPt-P4Hel0gh8D8LPteLHVJG7p823nbcphgBEVcM9uuVFTOd6PdKd82dEiLehCVQd64KRucCru2pI7nKAg2n2Hs"
                  />
                  <span className="text-sm font-medium">Google</span>
                </button>
                <button
                  disabled={loading}
                  className="bg-surface-container-highest hover:bg-surface-bright text-on-surface border-outline-variant/5 flex items-center justify-center gap-3 rounded-lg border py-3.5 transition-all disabled:opacity-50"
                >
                  <Icon name="terminal" className="text-xl" />
                  <span className="text-sm font-medium">GitHub</span>
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
            </div>
          </div>
        </section>

        {/* Support Link */}
        <footer className="mt-12">
          <Link
            href="#"
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
