import { getTranslations } from "next-intl/server";
import { LivePreview } from "@/components/shared/LivePreview";
import { LinksClient } from "./LinksClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLinksEditorPage() {
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

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("position", { ascending: true });

  const t = await getTranslations("adminLinks");

  return (
    <>
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pt-24 pb-32 lg:grid-cols-12">
        {/* Preview Section — sticky with vertical centering */}
        <section className="relative order-1 flex flex-col items-center justify-start lg:order-2 lg:col-span-5">
          <div className="w-full lg:sticky lg:top-24 lg:flex lg:items-center lg:justify-center">
            <LivePreview profile={profile} links={links || []} />
          </div>
        </section>

        {/* Editor Section */}
        <section className="order-2 lg:order-1 lg:col-span-7">
          <div className="mb-10">
            <h2 className="font-headline mb-2 text-5xl font-black tracking-tighter text-white italic">
              {t("title")}
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-slate-400">
              {t("description")}
            </p>
          </div>

          <LinksClient
            initialLinks={links || []}
            profile={profile || { username: null }}
          />
        </section>
      </main>
    </>
  );
}
