import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("common");

  return (
    <div className="bg-background flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        <p className="text-muted-foreground text-sm font-medium">
          {t("loading")}
        </p>
      </div>
    </div>
  );
}
