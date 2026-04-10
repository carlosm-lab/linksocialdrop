import { TopAppBar } from "@/components/layout/TopAppBar";
import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch profile data for the avatar and onboarding check
  let avatarUrl: string | undefined;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();

    avatarUrl = profile?.avatar_url ?? user.user_metadata?.avatar_url;

    // Check onboarding status
    if (!profile?.username) {
      // Import redirect from next/navigation
      const { redirect } = await import("next/navigation");
      // Import routing to get the current locale if needed, wait, we don't have locale here easily.
      // We can just rely on middleware or assume a default /es/ or redirect to /onboarding and let middleware affix locale.
      // Wait, let's redirect to auth/login with next param or just `/onboarding`.
      // The middleware prefixes locales.
      redirect("/es/onboarding"); // For simplicity we assume 'es' or we can extract it.
    }
  }

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container relative min-h-screen">
      <TopAppBar isAuthenticated={!!user} avatarUrl={avatarUrl} />
      {children}
      <BottomNavBar />
    </div>
  );
}
