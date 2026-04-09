import { useTranslations } from "next-intl";

export default function PrivacyPage() {
  const t = useTranslations("common");

  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="font-headline text-on-surface mb-8 text-4xl font-black">
        Privacy Policy
      </h1>
      <p className="text-slate-400">Contenido próximamente...</p>
    </main>
  );
}
