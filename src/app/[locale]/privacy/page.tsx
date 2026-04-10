import { useTranslations } from "next-intl";

export default function PrivacyPage() {
  const t = useTranslations("legal");

  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="font-headline text-on-surface mb-8 text-4xl font-black">
        {t("privacyTitle")}
      </h1>
      <p className="mb-6 text-slate-400">{t("privacyLastUpdated")}</p>
      <div className="space-y-4 text-slate-300">
        <p>{t("privacyContent1")}</p>
        <p>{t("privacyContent2")}</p>
      </div>
    </main>
  );
}
