import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Handler for GET requests to /auth/confirm
// Exchanges a token_hash (from email confirmation) for a session
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // Detect locale from Accept-Language header, default to 'es'
  const acceptLang = request.headers.get("accept-language") || "";
  const preferredLocale = acceptLang.toLowerCase().startsWith("en")
    ? "en"
    : "es";

  const next =
    searchParams.get("next") ?? `/${preferredLocale}/dashboard/links`;

  // Build redirect URL using production URL if available
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      const redirectPath = next.startsWith("/") ? next : `/${next}`;
      return NextResponse.redirect(`${baseUrl}${redirectPath}`);
    }
  }

  // Extract locale from the next param or fallback to detected locale
  const localeMatch = next.match(/^\/(es|en)\//);
  const locale = localeMatch ? localeMatch[1] : preferredLocale;
  return NextResponse.redirect(
    `${baseUrl}/${locale}/login?error=auth_confirm_error`
  );
}
