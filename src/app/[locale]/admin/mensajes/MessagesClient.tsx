"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { markMessageAsRead } from "@/actions/admin";
import { useTranslations } from "next-intl";

interface SupportMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface MessagesClientProps {
  initialMessages: SupportMessage[];
}

export function MessagesClient({ initialMessages }: MessagesClientProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const t = useTranslations("adminMessages");

  async function handleMarkAsRead(id: string) {
    const result = await markMessageAsRead({ id });
    if (result?.data?.success) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m))
      );
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      {/* Summary */}
      <div className="mb-6 flex items-center gap-4">
        <span className="text-on-surface-variant text-sm">
          {t("total", { count: messages.length })}
        </span>
        {unreadCount > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            {t("unread", { count: unreadCount })}
          </span>
        )}
      </div>

      {/* Messages List */}
      {messages.length === 0 ? (
        <div className="bg-surface-container-high flex flex-col items-center justify-center rounded-xl border border-white/5 py-20">
          <Icon
            name="inbox"
            className="text-on-surface-variant mb-4 text-5xl"
          />
          <p className="text-on-surface-variant text-lg">{t("empty")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "bg-surface-container-high group relative overflow-hidden rounded-xl border transition-all duration-200",
                msg.read
                  ? "border-white/5"
                  : "border-amber-500/20 bg-amber-500/[0.02]"
              )}
            >
              <button
                onClick={() =>
                  setExpandedId(expandedId === msg.id ? null : msg.id)
                }
                className="flex w-full items-center gap-4 px-6 py-4 text-left"
              >
                {/* Read indicator */}
                <div
                  className={cn(
                    "h-2.5 w-2.5 flex-shrink-0 rounded-full transition-colors",
                    msg.read ? "bg-slate-600" : "bg-amber-400"
                  )}
                />

                {/* Content preview */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="truncate font-semibold text-white">
                      {msg.name}
                    </span>
                    <span className="text-on-surface-variant truncate text-xs">
                      {msg.email}
                    </span>
                  </div>
                  <div className="text-on-surface-variant mt-1 truncate text-sm">
                    <span className="font-medium text-slate-300">
                      {msg.subject}
                    </span>
                    {" — "}
                    {msg.message}
                  </div>
                </div>

                {/* Date */}
                <div className="text-on-surface-variant flex-shrink-0 text-xs">
                  {new Date(msg.created_at).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                {/* Expand icon */}
                <Icon
                  name={expandedId === msg.id ? "expand_less" : "expand_more"}
                  className="text-on-surface-variant flex-shrink-0"
                />
              </button>

              {/* Expanded content */}
              {expandedId === msg.id && (
                <div className="border-t border-white/5 px-6 py-5">
                  <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <span className="text-on-surface-variant text-xs font-semibold tracking-wider uppercase">
                        {t("name")}
                      </span>
                      <p className="mt-1 text-sm text-white">{msg.name}</p>
                    </div>
                    <div>
                      <span className="text-on-surface-variant text-xs font-semibold tracking-wider uppercase">
                        {t("email")}
                      </span>
                      <p className="mt-1 text-sm text-white">{msg.email}</p>
                    </div>
                    <div>
                      <span className="text-on-surface-variant text-xs font-semibold tracking-wider uppercase">
                        {t("subject")}
                      </span>
                      <p className="mt-1 text-sm text-white">{msg.subject}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-on-surface-variant text-xs font-semibold tracking-wider uppercase">
                      {t("message")}
                    </span>
                    <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-slate-300">
                      {msg.message}
                    </p>
                  </div>

                  {!msg.read && (
                    <button
                      onClick={() => handleMarkAsRead(msg.id)}
                      className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
                    >
                      <Icon name="done" className="text-base" />
                      {t("markAsRead")}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
