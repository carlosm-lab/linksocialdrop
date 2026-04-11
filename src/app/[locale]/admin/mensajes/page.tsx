import { getMessages } from "@/actions/admin";
import { MessagesClient } from "./MessagesClient";
import { getTranslations } from "next-intl/server";

export default async function MensajesPage() {
  const messages = await getMessages();
  const t = await getTranslations("adminMessages");

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-headline text-4xl font-black tracking-tight text-white">
          {t("supportMessagesTitle")}
        </h1>
        <p className="text-on-surface-variant mt-2 text-lg">
          {t("supportMessagesDesc")}
        </p>
      </div>

      <MessagesClient initialMessages={messages} />
    </div>
  );
}
