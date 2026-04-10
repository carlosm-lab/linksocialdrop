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

  // Fetch profile data for the avatar
  let avatarUrl: string | undefined;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();
    avatarUrl = profile?.avatar_url ?? user.user_metadata?.avatar_url;
  }

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container relative min-h-screen">
      <TopAppBar isAuthenticated={!!user} avatarUrl={avatarUrl} />
      {children}
      <BottomNavBar />
    </div>
  );
}
