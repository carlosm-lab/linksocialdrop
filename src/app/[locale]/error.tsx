"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background flex h-screen w-full flex-col items-center justify-center p-4 text-center">
      <h2 className="text-destructive mb-2 text-2xl font-bold">
        {t("somethingWentWrong")}
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {t("unexpectedError")}
      </p>
      <button
        onClick={() => reset()}
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-2.5 font-medium transition-colors"
      >
        {t("tryAgain")}
      </button>
    </div>
  );
}
