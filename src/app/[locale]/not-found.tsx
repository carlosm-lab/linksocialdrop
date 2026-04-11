import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <div className="bg-surface text-on-surface flex h-screen w-full flex-col items-center justify-center p-4 text-center">
      <h2 className="text-primary-container mb-2 text-9xl font-extrabold tracking-tighter">
        404
      </h2>
      <p className="text-on-surface-variant mb-6 text-lg font-medium">
        {t("notFound")}
      </p>
      <Link
        href="/"
        className="bg-primary-container text-on-primary-container hover:bg-primary-container/90 rounded-xl px-6 py-2.5 font-bold transition-colors"
      >
        {t("goHome")}
      </Link>
    </div>
  );
}
