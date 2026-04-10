import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

// Handler for GET requests to /auth/callback
// Exchanges an OAuth code for a session
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/es/admin/links";

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${baseUrl}${next}`);
    }
  }

  // Extract locale from the next param or default to 'es'
  const localeMatch = next.match(/^\/(es|en)\//);
  const locale = localeMatch ? localeMatch[1] : "es";

  return NextResponse.redirect(
    `${baseUrl}/${locale}/login?error=auth_callback_error`
  );
}
