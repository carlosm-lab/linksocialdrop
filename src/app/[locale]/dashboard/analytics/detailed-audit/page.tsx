import { Icon } from "@/components/ui/icon";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: `Detailed Audit | ${t("title")}` };
}

export default async function DetailedAuditPage() {
  const t = await getTranslations("adminAnalytics");

  return (
    <main className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 pt-32 pb-32 text-center">
      <div className="bg-primary-container/10 mb-8 flex h-20 w-20 items-center justify-center rounded-2xl">
        <Icon name="query_stats" className="text-primary-container text-4xl" />
      </div>
      <h2 className="font-headline text-on-surface mb-4 text-4xl font-black tracking-tighter">
        {t("viewDetailedAudit")}
      </h2>
      <p className="text-on-surface-variant mb-10 max-w-md leading-relaxed">
        Próximamente podrás ver informes detallados de rendimiento, tráfico por
        dispositivo, referrers y más.
      </p>
      <Link
        href="/dashboard/analytics"
        className="text-primary-container inline-flex items-center gap-2 text-sm font-bold transition-all hover:gap-4"
      >
        <Icon name="arrow_back" className="text-sm" />
        {t("title")}
      </Link>
    </main>
  );
}
