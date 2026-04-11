import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AdminThemesClient } from "./AdminThemesClient";

export default async function AdminThemesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  const t = await getTranslations("adminThemes");

  // Fetch all themes
  const { data: themes } = await supabase
    .from("themes")
    .select("*")
    .order("created_at", { ascending: false });

  // Count users per theme (simple approach, or just full list if small)
  // For admin, a query like this is okay if user base is small. For massive scale, better to use an RPC.
  const { data: userThemes } = await supabase
    .from("user_themes")
    .select("theme_id");

  const themeUserCounts: Record<string, number> = {};
  if (userThemes) {
    for (const ut of userThemes) {
      themeUserCounts[ut.theme_id] = (themeUserCounts[ut.theme_id] || 0) + 1;
    }
  }

  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">{t("title")}</h1>
        <p className="text-sm text-slate-400">{t("description")}</p>
      </div>
      <AdminThemesClient
        themes={themes || []}
        themeUserCounts={themeUserCounts}
      />
    </div>
  );
}
