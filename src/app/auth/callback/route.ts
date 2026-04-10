import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

// Handler for GET requests to /auth/callback
// Exchanges an OAuth code for a session
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/es/admin/links";

  // Use NEXT_PUBLIC_APP_URL for production, fallback to request origin
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Ensure the redirect path starts with /
      const redirectPath = next.startsWith("/") ? next : `/${next}`;
      return NextResponse.redirect(`${baseUrl}${redirectPath}`);
    }
  }

  // Extract locale from the next param or default to 'es'
  const localeMatch = next.match(/^\/(es|en)\//);
  const locale = localeMatch ? localeMatch[1] : "es";

  return NextResponse.redirect(
    `${baseUrl}/${locale}/login?error=auth_callback_error`
  );
}
