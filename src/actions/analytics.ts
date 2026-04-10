"use server";

import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";
import {
  recordLinkClickSchema,
  recordPageViewSchema,
} from "@/schemas/analytics";

// En Next.js App Router, podemos extraer headers como user-agent para device/browser.
import { headers } from "next/headers";

export const recordPageView = actionClient
  .schema(recordPageViewSchema)
  .action(async ({ parsedInput }) => {
    // Para registrar visitas no necesitamos estar autenticados,
    // de hecho, el RLS de page_views debe permitir inserts anónimos.

    // Cookie-based Rate Limiting (SCALE-003): Prevent DB spam from reloads
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const rateLimitCookieName = `pv_${parsedInput.profile_id}`;

    if (cookieStore.has(rateLimitCookieName)) {
      // Ya registramos una visita a este perfil recientemente (mismo dispositivo)
      return { success: true };
    }

    const supabase = await createClient();

    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const country = headersList.get("x-vercel-ip-country") || null; // Feature de Vercel (si se despliega ahí)

    // Un parsing básico de user agent, idealmente usar ua-parser-js
    let browser = "Unknown";
    let device = "Desktop";

    if (/mobile/i.test(userAgent)) device = "Mobile";
    else if (/tablet/i.test(userAgent)) device = "Tablet";

    if (/chrome|crios/i.test(userAgent)) browser = "Chrome";
    else if (/firefox|fxios/i.test(userAgent)) browser = "Firefox";
    else if (
      /safari/i.test(userAgent) &&
      !/chrome|crios|android/i.test(userAgent)
    )
      browser = "Safari";
    else if (/edg/i.test(userAgent)) browser = "Edge";

    const { error } = await supabase.from("page_views").insert({
      profile_id: parsedInput.profile_id,
      referrer: parsedInput.referrer || null,
      country,
      device,
      browser,
    });

    if (error) {
      console.error("Error recording page view:", error);
      // No lanzamos error para no romper la UI pública si falla la analítica
      return { success: false };
    }

    // Set cookie to expire in 1 hour (3600 seconds)
    cookieStore.set(rateLimitCookieName, "1", { maxAge: 3600, httpOnly: true });

    return { success: true };
  });

export const recordLinkClick = actionClient
  .schema(recordLinkClickSchema)
  .action(async ({ parsedInput }) => {
    // Cookie-based Rate Limiting (SCALE-003): Prevent DB spam from reloads
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const rateLimitCookieName = `click_${parsedInput.link_id}`;

    if (cookieStore.has(rateLimitCookieName)) {
      return { success: true };
    }

    const supabase = await createClient();

    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const country = headersList.get("x-vercel-ip-country") || null;

    let browser = "Unknown";
    let device = "Desktop";

    if (/mobile/i.test(userAgent)) device = "Mobile";
    else if (/tablet/i.test(userAgent)) device = "Tablet";

    if (/chrome|crios/i.test(userAgent)) browser = "Chrome";
    else if (/firefox|fxios/i.test(userAgent)) browser = "Firefox";
    else if (
      /safari/i.test(userAgent) &&
      !/chrome|crios|android/i.test(userAgent)
    )
      browser = "Safari";
    else if (/edg/i.test(userAgent)) browser = "Edge";

    const { error } = await supabase.from("link_clicks").insert({
      link_id: parsedInput.link_id,
      user_id: parsedInput.user_id,
      referrer: parsedInput.referrer || null,
      country,
      device,
      browser,
    });

    if (error) {
      console.error("Error recording click:", error);
      return { success: false };
    }

    // Set cookie to expire in 1 hour (3600 seconds)
    cookieStore.set(rateLimitCookieName, "1", { maxAge: 3600, httpOnly: true });

    return { success: true };
  });

export async function getAnalyticsDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");

  // Fetch count de clicks
  const { count: clicksCount, error: clicksError } = await supabase
    .from("link_clicks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Fetch count de vistas
  const { count: viewsCount, error: viewsError } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", user.id);

  if (clicksError || viewsError) {
    throw new Error("Error obteniendo analíticas");
  }

  // Traer clicks por link para el leaderboard usando RPC optimizado
  const { data: leaderboardData, error: leaderboardError } = await supabase.rpc(
    "get_user_link_leaderboard",
    { p_user_id: user.id }
  );

  if (leaderboardError) {
    console.error("Error fetching leaderboard:", leaderboardError);
  }

  const leaderboard = leaderboardData || [];

  return {
    views: viewsCount || 0,
    clicks: clicksCount || 0,
    leaderboard,
  };
}
