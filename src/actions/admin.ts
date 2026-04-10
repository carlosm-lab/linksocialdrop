"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";

/**
 * Get global admin dashboard stats.
 * Uses service_role to bypass RLS.
 */
export async function getAdminStats() {
  const supabase = createAdminClient();

  const [profilesResult, linksResult, clicksResult, messagesResult] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("links").select("id", { count: "exact", head: true }),
      supabase.from("link_clicks").select("id", { count: "exact", head: true }),
      supabase.from("support_messages").select("id, read"),
    ]);

  const totalUsers = profilesResult.count ?? 0;
  const totalLinks = linksResult.count ?? 0;
  const totalClicks = clicksResult.count ?? 0;

  const messages = messagesResult.data ?? [];
  const totalMessages = messages.length;
  const unreadMessages = messages.filter((m) => !m.read).length;

  return {
    totalUsers,
    totalLinks,
    totalClicks,
    totalMessages,
    unreadMessages,
  };
}

/**
 * Get all support messages ordered by date (newest first).
 * Uses service_role to bypass RLS.
 */
export async function getMessages() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("support_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Error al obtener los mensajes");
  }

  return data;
}

/**
 * Mark a support message as read.
 * Uses service_role to bypass RLS.
 */
export const markMessageAsRead = actionClient
  .schema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("support_messages")
      .update({ read: true })
      .eq("id", parsedInput.id);

    if (error) {
      throw new Error("Error al actualizar el mensaje");
    }

    return { success: true };
  });
