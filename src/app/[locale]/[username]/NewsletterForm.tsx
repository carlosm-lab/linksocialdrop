"use client";

import { useAction } from "next-safe-action/hooks";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function NewsletterForm({
  profileId,
  texts,
}: {
  profileId: string;
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

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card glass-panel border-border/50 relative overflow-hidden rounded-2xl border p-6 text-center shadow-sm"
      >
        <h3 className="text-primary relative z-10 mb-2 text-lg font-bold tracking-tight">
          {texts.success}
        </h3>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card glass-panel border-border/50 bg-noise relative overflow-hidden rounded-2xl border p-6 shadow-sm"
    >
      <div className="bg-primary/20 pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl"></div>
      <h3 className="text-primary relative z-10 mb-2 text-lg font-bold tracking-tight">
        {texts.title}
      </h3>
      <p className="text-muted-foreground relative z-10 mb-4 text-sm">
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
          className="bg-secondary text-secondary-foreground focus-visible:ring-primary focus-visible:ring-offset-background placeholder:text-muted-foreground flex-1 rounded-lg border-none px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          placeholder={texts.placeholder}
          type="email"
          disabled={isPending}
        />
        <Button
          size="default"
          type="submit"
          disabled={isPending}
          className="font-bold shadow-sm disabled:opacity-50"
        >
          {isPending ? "..." : texts.button}
        </Button>
      </form>
    </motion.div>
  );
}
