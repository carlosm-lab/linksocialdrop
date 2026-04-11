import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { MarketplaceClient } from "./MarketplaceClient";

export default async function MarketplacePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const t = await getTranslations("marketplace");

  // Fetch all active themes
  const { data: themes } = await supabase
    .from("themes")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true });

  // Fetch user's acquired themes
  const { data: userThemes } = await supabase
    .from("user_themes")
    .select("theme_id, is_active")
    .eq("user_id", user.id);

  // Fetch user's active_theme_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("active_theme_id")
    .eq("id", user.id)
    .single();

  return (
    <main className="mx-auto max-w-7xl px-6 pt-24 pb-32">
      <MarketplaceClient
        themes={themes || []}
        userThemes={userThemes || []}
        activeThemeId={profile?.active_theme_id || null}
      />
    </main>
  );
}
