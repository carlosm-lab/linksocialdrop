import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
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

  const pathname = request.nextUrl.pathname;

  // Route classification
  const isDashboardRoute =
    pathname.match(/^\/(es|en)\/dashboard/) ||
    pathname.startsWith("/dashboard");
  const isAdminRoute =
    pathname.match(/^\/(es|en)\/admin/) || pathname.startsWith("/admin");
  const isLoginRoute =
    pathname.match(/^\/(es|en)\/login/) || pathname.startsWith("/login");
  const isAuthRoute = pathname.startsWith("/auth");

  // Protected routes: redirect unauthenticated users from /dashboard
  if (!user && isDashboardRoute) {
    const localeMatch = pathname.match(/^\/(es|en)\//);
    const locale = localeMatch ? localeMatch[1] : "es";
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // Protected routes: /admin requires auth + ADMIN_EMAIL
  if (isAdminRoute) {
    if (!user) {
      const localeMatch = pathname.match(/^\/(es|en)\//);
      const locale = localeMatch ? localeMatch[1] : "es";
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }

    // User is authenticated but not the admin — redirect to dashboard, not login
    const adminEmail = process.env.ADMIN_EMAIL;
    const userEmail = user.email || (user as Record<string, unknown>).sub;

    // We need to get the actual email from Supabase user
    const {
      data: { user: fullUser },
    } = await supabase.auth.getUser();

    if (!fullUser || fullUser.email !== adminEmail) {
      const localeMatch = pathname.match(/^\/(es|en)\//);
      const locale = localeMatch ? localeMatch[1] : "es";
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/dashboard`;
      return NextResponse.redirect(url);
    }
  }

  // If user is logged in and trying to access login page, redirect to dashboard
  if (user && isLoginRoute) {
    const localeMatch = pathname.match(/^\/(es|en)\//);
    const locale = localeMatch ? localeMatch[1] : "es";
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/dashboard/links`;
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
