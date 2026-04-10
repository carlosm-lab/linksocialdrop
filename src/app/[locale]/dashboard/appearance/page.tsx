import { LivePreview } from "@/components/shared/LivePreview";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import { AppearanceClient } from "./AppearanceClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminAppearancePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Handling error or edge case scenario when profile is missing
    return <div>Error loading profile.</div>;
  }

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  const t = await getTranslations("adminAppearance");

  return (
    <main className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pt-24 pb-32 lg:grid-cols-12">
      <AppearanceClient initialProfile={profile} />

      <aside className="relative lg:col-span-5">
        <div className="space-y-6 lg:sticky lg:top-24">
          <LivePreview profile={profile} links={links || []} />

          <div className="mt-8 flex gap-4">
            <button className="bg-surface-container-low border-outline-variant/30 hover:bg-surface-container-highest flex-1 rounded-xl border py-4 text-sm font-bold transition-all">
              {t("resetChanges")}
            </button>
            <Button
              variant="luminous"
              className="text-on-primary-fixed font-headline h-auto flex-1 rounded-xl py-4 text-sm font-black tracking-tighter shadow-none hover:shadow-[0_0_30px_rgba(0,245,255,0.4)]"
            >
              {t("publishLive")}
            </Button>
          </div>
        </div>
      </aside>
    </main>
  );
}
