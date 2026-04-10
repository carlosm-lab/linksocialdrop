import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/i18n/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const locale = await getLocale();

  // Double-check: only ADMIN_EMAIL can access
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container relative min-h-screen">
      {/* Admin Top Bar */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#111316]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Icon
              name="admin_panel_settings"
              className="flex-shrink-0 text-2xl text-amber-400"
            />
            <Link
              href="/admin"
              className="font-headline text-xl font-black tracking-tighter text-amber-400"
            >
              Admin Panel
            </Link>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="/admin"
              className="text-slate-400 transition-colors hover:text-amber-300"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/mensajes"
              className="text-slate-400 transition-colors hover:text-amber-300"
            >
              Mensajes
            </Link>
            <Link
              href="/dashboard/links"
              className="text-slate-400 transition-colors hover:text-slate-200"
            >
              ← Volver al Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-20">{children}</main>
    </div>
  );
}
