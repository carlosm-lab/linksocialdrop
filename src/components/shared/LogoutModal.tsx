"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { useTranslations } from "next-intl";
import { signOut } from "@/actions/auth";

interface LogoutModalProps {
  /** Render prop — receives the function to open the modal */
  trigger: (open: () => void) => React.ReactNode;
}

/**
 * Confirmation modal before signing out.
 * Uses a render-prop pattern so the parent controls the trigger button style.
 *
 * @example
 * <LogoutModal trigger={(open) => (
 *   <button onClick={open}>Sign out</button>
 * )} />
 */
export function LogoutModal({ trigger }: LogoutModalProps) {
  const t = useTranslations("logout");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
  };

  return (
    <>
      {trigger(() => setIsOpen(true))}

      {isOpen && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-label={t("confirmTitle")}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isLoading && setIsOpen(false)}
            aria-label="Close"
          />
          <div className="bg-surface-container-low border-outline-variant/20 relative mx-4 w-full max-w-sm space-y-6 rounded-2xl border p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                <Icon name="logout" className="text-2xl text-red-400" />
              </div>
              <h3 className="font-headline text-xl font-bold text-white">
                {t("confirmTitle")}
              </h3>
              <p className="text-on-surface-variant mt-2 text-sm">
                {t("confirmDescription")}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="bg-surface-container-highest hover:bg-surface-container-high flex-1 rounded-xl py-3 text-sm font-bold text-slate-300 transition-colors disabled:opacity-50"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleSignOut}
                disabled={isLoading}
                className="flex-1 rounded-xl bg-red-500/80 py-3 text-sm font-bold text-white transition-colors hover:bg-red-500 disabled:opacity-50"
              >
                {isLoading ? "..." : t("confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
