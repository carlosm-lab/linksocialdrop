import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <div className="bg-background flex h-screen w-full flex-col items-center justify-center p-4 text-center">
      <h2 className="text-foreground mb-2 text-9xl font-extrabold">404</h2>
      <p className="text-muted-foreground mb-6 text-lg font-medium">
        {t("notFound")}
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-2.5 font-medium transition-colors"
      >
        {t("goHome")}
      </Link>
    </div>
  );
}
