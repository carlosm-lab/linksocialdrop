"use client";

import { useAction } from "next-safe-action/hooks";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { Button } from "@/components/ui/button";
import { getContrastColor } from "@/lib/colors";

export function NewsletterForm({
  profileId,
  accentColor,
  texts,
}: {
  profileId: string;
  accentColor: string | null;
  texts: {
    title: string;
    description: string;
    placeholder: string;
    button: string;
    success: string;
  };
}) {
  const { execute, status } = useAction(subscribeToNewsletter);

  const isPending = status === "executing";
  const isSuccess = status === "hasSucceeded";

  const customAccentStyle = accentColor ? { color: accentColor } : {};
  const buttonStyle = accentColor
    ? {
        backgroundColor: accentColor,
        color: getContrastColor(accentColor),
      }
    : {};

  if (isSuccess) {
    return (
      <div className="bg-surface-container-low border-outline-variant/10 relative overflow-hidden rounded-2xl border p-6 text-center">
        <h3
          className="relative z-10 mb-2 text-lg font-bold tracking-tight text-green-500"
          style={customAccentStyle}
        >
          {texts.success}
        </h3>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low border-outline-variant/10 relative overflow-hidden rounded-2xl border p-6">
      <div className="luminous-gradient pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-10 blur-3xl"></div>
      <h3
        className="relative z-10 mb-2 text-lg font-bold tracking-tight"
        style={customAccentStyle}
      >
        {texts.title}
      </h3>
      <p className="text-on-surface-variant relative z-10 mb-4 text-sm">
        {texts.description}
      </p>
      <form
        action={(formData) => {
          const email = formData.get("email") as string;
          if (email) {
            execute({ email, profileId });
          }
        }}
        className="relative z-10 flex gap-2"
      >
        <input
          name="email"
          required
          aria-label={texts.title}
          className="bg-surface-container-highest text-on-surface focus-visible:ring-primary-container focus-visible:ring-offset-background flex-1 rounded-lg border-none px-3 text-sm outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-offset-2"
          placeholder={texts.placeholder}
          type="email"
          disabled={isPending}
        />
        <Button
          size="pill"
          type="submit"
          disabled={isPending}
          className="text-on-primary-fixed font-bold shadow-none disabled:opacity-50"
          style={buttonStyle}
        >
          {isPending ? "..." : texts.button}
        </Button>
      </form>
    </div>
  );
}
