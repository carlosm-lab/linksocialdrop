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

    return { success: true };
  });

export const recordLinkClick = actionClient
  .schema(recordLinkClickSchema)
  .action(async ({ parsedInput }) => {
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

  // Traer clicks por link para el leaderboard
  // En Supabase/Postgres puro esto sería un GROUP BY,
  // via JS SDK a veces es más fácil un fetch y agrupar o un RPC.
  // Como no hay RPC, traemos todos (o los más recientes) y agrupamos en memoria
  // (Ojo: performance para arrays súper grandes, pero para el MVP servirá)

  const { data: allClicks } = await supabase
    .from("link_clicks")
    .select("link_id")
    .eq("user_id", user.id);

  const clicksByLink: Record<string, number> = {};
  allClicks?.forEach((c) => {
    clicksByLink[c.link_id] = (clicksByLink[c.link_id] || 0) + 1;
  });

  // Solo para obtener info de los links en leaderboard
  const { data: currentLinks } = await supabase
    .from("links")
    .select("id, title, url")
    .eq("user_id", user.id);

  const leaderboard = (currentLinks || [])
    .map((l) => ({
      ...l,
      clicks: clicksByLink[l.id] || 0,
    }))
    .sort((a, b) => b.clicks - a.clicks);

  return {
    views: viewsCount || 0,
    clicks: clicksCount || 0,
    leaderboard,
  };
}
