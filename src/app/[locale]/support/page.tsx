"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { submitSupportMessage } from "@/actions/support";
import { useTranslations } from "next-intl";

export default function SupportPage() {
  const t = useTranslations("support");
  const tc = useTranslations("common");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageLength, setMessageLength] = useState(0);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    try {
      const result = await submitSupportMessage({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
      });

      if (result?.serverError) {
        setError(result.serverError);
      } else if (result?.validationErrors) {
        const fieldErrors = Object.values(result.validationErrors).flat();
        setError((fieldErrors[0] as string) || "Error de validación");
      } else if (result?.data?.success) {
        setSubmitted(true);
      }
    } catch {
      setError("Error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container/30 relative min-h-screen">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="bg-primary-container/5 absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-[120px]" />
        <div className="bg-primary-container/3 absolute top-[20%] -right-[5%] h-[50%] w-[30%] rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24">
        {/* Brand */}
        <header className="mb-10 text-center">
          <Link
            href="/"
            className="font-headline text-primary-container mb-2 inline-flex items-center gap-2 text-2xl font-black tracking-tighter"
          >
            <Icon name="grid_view" className="text-2xl" />
            {tc("brandName")}
          </Link>
        </header>

        {submitted ? (
          /* Success State */
          <section className="w-full max-w-md text-center">
            <div className="bg-surface-container-low border-outline-variant/10 overflow-hidden rounded-xl border p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] md:p-12">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <Icon
                  name="check_circle"
                  className="text-4xl text-emerald-400"
                />
              </div>
              <h1 className="font-headline mb-4 text-2xl font-bold text-white">
                {t("successTitle")}
              </h1>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                {t("successDescription")}
              </p>
              <Link href="/">
                <Button
                  variant="luminous"
                  size="pill"
                  className="text-on-primary-fixed"
                >
                  {t("backToHome")}
                </Button>
              </Link>
            </div>
          </section>
        ) : (
          /* Form */
          <section className="w-full max-w-lg">
            <div className="bg-surface-container-low border-outline-variant/10 relative overflow-hidden rounded-xl border p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] md:p-12">
              <div className="bg-primary-container/5 pointer-events-none absolute top-0 right-0 h-32 w-32 blur-3xl" />

              <div className="relative z-10">
                <div className="bg-primary-container/10 mb-6 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Icon
                    name="support_agent"
                    className="text-primary-container text-2xl"
                  />
                </div>

                <h1 className="font-headline mb-2 text-2xl font-bold text-white">
                  {t("title")}
                </h1>
                <p className="text-on-surface-variant mb-8 text-sm leading-relaxed">
                  {t("description")}
                </p>

                {error && (
                  <div className="bg-error/10 border-error/20 text-error mb-6 rounded-lg border p-3 text-sm">
                    {error}
                  </div>
                )}

                <form action={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="font-label text-outline ml-1 text-xs font-semibold tracking-wider uppercase"
                    >
                      {t("nameLabel")}
                    </label>
                    <div className="relative">
                      <Icon
                        name="person"
                        className="text-outline pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-xl"
                      />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        disabled={loading}
                        placeholder={t("namePlaceholder")}
                        className="bg-surface-container-high text-on-surface placeholder:text-outline/40 focus:ring-primary-container/40 w-full rounded-lg border-none py-3.5 pr-4 pl-12 transition-all outline-none focus:ring-1"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="support-email"
                      className="font-label text-outline ml-1 text-xs font-semibold tracking-wider uppercase"
                    >
                      {t("emailLabel")}
                    </label>
                    <div className="relative">
                      <Icon
                        name="mail"
                        className="text-outline pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-xl"
                      />
                      <input
                        id="support-email"
                        name="email"
                        type="email"
                        required
                        disabled={loading}
                        placeholder={t("emailPlaceholder")}
                        className="bg-surface-container-high text-on-surface placeholder:text-outline/40 focus:ring-primary-container/40 w-full rounded-lg border-none py-3.5 pr-4 pl-12 transition-all outline-none focus:ring-1"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="subject"
                      className="font-label text-outline ml-1 text-xs font-semibold tracking-wider uppercase"
                    >
                      {t("subjectLabel")}
                    </label>
                    <div className="relative">
                      <Icon
                        name="subject"
                        className="text-outline pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-xl"
                      />
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        disabled={loading}
                        placeholder={t("subjectPlaceholder")}
                        className="bg-surface-container-high text-on-surface placeholder:text-outline/40 focus:ring-primary-container/40 w-full rounded-lg border-none py-3.5 pr-4 pl-12 transition-all outline-none focus:ring-1"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="message"
                        className="font-label text-outline ml-1 text-xs font-semibold tracking-wider uppercase"
                      >
                        {t("messageLabel")}
                      </label>
                      <span
                        className={`font-label text-xs tabular-nums ${
                          messageLength > 450
                            ? messageLength > 500
                              ? "text-red-400"
                              : "text-amber-400"
                            : "text-outline"
                        }`}
                      >
                        {messageLength}/500
                      </span>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      required
                      disabled={loading}
                      maxLength={500}
                      rows={5}
                      placeholder={t("messagePlaceholder")}
                      onChange={(e) => setMessageLength(e.target.value.length)}
                      className="bg-surface-container-high text-on-surface placeholder:text-outline/40 focus:ring-primary-container/40 w-full resize-none rounded-lg border-none p-4 transition-all outline-none focus:ring-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="luminous"
                    size="pill"
                    className="text-on-primary-fixed font-headline shadow-primary-container/20 mt-2 w-full py-4 font-bold shadow-lg disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "..." : t("submit")}
                  </Button>
                </form>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
