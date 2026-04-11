import { OnboardingFlow } from "@/components/OnboardingFlow";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: `Onboarding | ${t("title")}` };
}

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "onboarding" });

  return (
    <div className="bg-surface text-on-surface relative flex min-h-[100dvh] flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/20 hover:bg-primary/30 absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/3 rounded-full blur-[120px] transition-colors duration-1000"></div>
        <div className="bg-secondary/10 absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/3 translate-y-1/3 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 mb-10 w-full max-w-md text-center">
        <span className="bg-surface-container border-outline-variant text-primary mb-4 inline-block rounded-full border px-3 py-1 text-xs font-bold tracking-wider">
          {t("welcomeBadge")}
        </span>
        <h1 className="font-headline text-on-surface text-3xl font-bold tracking-tight sm:text-4xl">
          {t("welcomeTitle")}
        </h1>
        <p className="text-on-surface-variant mt-2 text-base">
          {t("welcomeDesc")}
        </p>
      </div>

      <OnboardingFlow />
    </div>
  );
}
