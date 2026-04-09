# Architecture Decision Records (ADR)

This document tracks important architectural decisions made during the project lifecycle.
**CRITICAL RULE:** Whenever you (the AI agent) decide on a significant technical approach (e.g., state management structure, API integration pattern, routing changes), you MUST document it here.

## Template for new decisions:

### Format

**Date:** YYYY-MM-DD
**Decision:** [What was decided?]
**Context:** [Why was this decided? What problem does it solve?]
**Consequences:** [What are the trade-offs or things to keep in mind moving forward?]

---

## Logged Decisions

_(Add new decisions below this line)_

### ADR-001: Internationalization with next-intl + locale prefix routing

**Date:** 2026-04-09
**Decision:** Implemented i18n using `next-intl` with `localePrefix: 'always'` strategy. All routes are nested under `src/app/[locale]/`. The default locale is `es` (Spanish) with `en` (English) as alternate.
**Context:** The client requires bilingual support (ES/EN) with URL-based locale prefixes (`/es/`, `/en/`) for optimal SEO. This approach gives each language its own canonical URL, which is the gold standard for international SEO.
**Consequences:**
- All internal navigation MUST use `Link` from `@/i18n/navigation` (not `next/link`) to auto-prefix locale.
- All client components using `usePathname` or `useRouter` MUST import from `@/i18n/navigation` (not `next/navigation`) — the i18n version strips the locale prefix automatically.
- The `proxy.ts` (Next.js 16 renamed from `middleware.ts`) handles locale detection, redirects root `/` → `/es/`, and URL rewriting.
- All user-facing text MUST be in `messages/es.json` and `messages/en.json`. No hardcoded strings in pages.
- Server components use `useTranslations()` from `next-intl`; no special setup needed thanks to `next-intl/plugin` in `next.config.mjs`.
- `setRequestLocale(locale)` should be called in layouts/pages to maintain static rendering.

### ADR-002: Next.js 16 proxy.ts convention

**Date:** 2026-04-09
**Decision:** Using `proxy.ts` instead of `middleware.ts` as Next.js 16 renamed this convention.
**Context:** Next.js 16 deprecated `middleware.ts` in favor of `proxy.ts`. The functionality is identical but the naming better reflects its purpose (network-boundary request interception).
**Consequences:** Any future middleware-like logic must go in `src/proxy.ts`. The `config.matcher` pattern remains the same.

### ADR-003: Supabase SSR Authentication

**Date:** 2026-04-09
**Decision:** Using `@supabase/ssr` with cookie-based auth for full Server Component support. Three client utilities: `client.ts` (browser), `server.ts` (Server Components/Actions/Route Handlers), `proxy.ts` (request-time token refresh).
**Context:** Supabase requires different client instances for browser and server contexts. The `@supabase/ssr` package provides `createBrowserClient` and `createServerClient` with cookie-based session management for seamless SSR auth.
**Consequences:**
- Browser components must use `createClient()` from `@/lib/supabase/client`.
- Server Components, Server Actions, and Route Handlers must use `createClient()` from `@/lib/supabase/server`.
- `src/proxy.ts` chains Supabase session refresh + next-intl locale routing. Supabase runs first for auth token refresh.
- `getClaims()` is called in proxy to refresh tokens — never remove this call or users may be randomly logged out.
- Protected routes (`/admin/*`) redirect unauthenticated users to `/login`.

### ADR-004: Database Schema Design

**Date:** 2026-04-09
**Decision:** Four core tables: `profiles` (extends auth.users), `links` (user link items), `link_clicks` (click analytics), `page_views` (visit analytics). Auto-profile creation via trigger on `auth.users` INSERT.
**Context:** LinkSocialDrop needs user profiles with customizable appearance settings, ordered link lists with visibility toggles, and comprehensive click/page view analytics.
**Consequences:**
- `profiles.username` must be unique with format `[a-zA-Z0-9_-]` (min 3 chars). Default username derived from email.
- `links` have `position` field for drag-to-reorder and `visible` toggle.
- `link_clicks` and `page_views` are append-only analytics tables with denormalized device/browser/country fields.
- `handle_new_user()` trigger auto-creates profile from `auth.users` metadata (full_name, avatar_url).
- `handle_updated_at()` trigger auto-updates `updated_at` on profiles and links.

### ADR-005: Row Level Security (RLS) Policies

**Date:** 2026-04-09
**Decision:** All tables have RLS enabled. Uses `(SELECT auth.uid())` pattern for performance (per Supabase best practices). Analytics tables allow inserts only for valid existing records.
**Context:** RLS is mandatory for security. Uses optimized `(SELECT auth.uid())` instead of bare `auth.uid()` to avoid re-evaluating the function per row.
**Consequences:**
- Public profiles and visible links are readable by everyone (needed for `[username]` public pages).
- Users can only CRUD their own data.
- Analytics inserts are validated against foreign key existence (prevents spam).
- Storage bucket `avatars` is public-read, authenticated-write, owner-only update/delete.

### ADR-006: Server Actions Architecture

**Date:** 2026-04-09
**Decision:** All auth operations (login, signup, Google OAuth, signout) are Server Actions in `src/actions/auth.ts`. Validation schemas live in `src/schemas/auth.ts`. No Server Actions inside component files.
**Context:** Project convention (AGENTS.md §9) prohibits inline `use server` in Client Components.
**Consequences:**
- Auth forms use the `action` prop with Server Actions.
- Zod schemas validate input before hitting Supabase.
- Auth routes: `/auth/confirm` (email OTP), `/auth/callback` (OAuth code exchange).
- `redirect()` is used after successful auth operations (throws intentionally in Server Actions).

