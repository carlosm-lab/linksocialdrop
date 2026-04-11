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
    <div className="bg-surface text-on-surface flex h-screen w-full flex-col items-center justify-center p-4 text-center">
      <h2 className="text-error mb-2 text-2xl font-bold">
        {t("somethingWentWrong")}
      </h2>
      <p className="text-on-surface-variant mb-6 max-w-md">
        {t("unexpectedError")}
      </p>
      <button
        onClick={() => reset()}
        className="bg-primary-container text-on-primary-container hover:bg-primary-container/90 rounded-xl px-6 py-2.5 font-bold transition-colors"
      >
        {t("tryAgain")}
      </button>
    </div>
  );
}
