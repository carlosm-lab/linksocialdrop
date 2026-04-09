import { type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { updateSession } from "@/lib/supabase/proxy";

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1. Run Supabase session refresh + route protection first
  const supabaseResponse = await updateSession(request);

  // If Supabase returned a redirect (e.g., to login), use it directly
  if (supabaseResponse.headers.get("location")) {
    return supabaseResponse;
  }

  // 2. Run next-intl middleware for locale routing
  const intlResponse = intlMiddleware(request);

  // 3. Copy Supabase's auth cookies into the intl response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
