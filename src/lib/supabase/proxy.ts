import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Guard: skip Supabase if env vars are not configured
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard
  // to debug issues with users being randomly logged out.

  // IMPORTANT: Avoid removing getClaims here.
  // It refreshes the auth token and prevents random logouts.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  // Protected routes: redirect unauthenticated users from /admin
  const pathname = request.nextUrl.pathname;
  const isAdminRoute =
    pathname.match(/^\/(es|en)\/admin/) || pathname.startsWith("/admin");
  const isLoginRoute =
    pathname.match(/^\/(es|en)\/login/) || pathname.startsWith("/login");
  const isAuthRoute = pathname.startsWith("/auth");

  if (!user && isAdminRoute) {
    // Extract the locale from the URL for proper redirect
    const localeMatch = pathname.match(/^\/(es|en)\//);
    const locale = localeMatch ? localeMatch[1] : "es";
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // If user is logged in and trying to access login page, redirect to admin
  if (user && isLoginRoute) {
    const localeMatch = pathname.match(/^\/(es|en)\//);
    const locale = localeMatch ? localeMatch[1] : "es";
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/admin/links`;
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as is.
  // If you're creating a new response object with NextResponse.next()
  // make sure to:
  // 1. Pass the request in it
  // 2. Copy over the cookies
  // 3. Change the myNewResponse object to fit your needs
  // 4. Return it
  return supabaseResponse;
}
