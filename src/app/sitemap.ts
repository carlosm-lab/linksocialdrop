import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("username, updated_at")
    .eq("is_public", true);

  const locales = ["es", "en"];
  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: `${siteConfig.url}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/${locale}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/${locale}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/${locale}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]);

  const profileRoutes: MetadataRoute.Sitemap = (profiles || []).flatMap(
    (profile) =>
      locales.map((locale) => ({
        url: `${siteConfig.url}/${locale}/${profile.username}`,
        lastModified: profile.updated_at
          ? new Date(profile.updated_at)
          : new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      }))
  );

  return [...staticRoutes, ...profileRoutes];
}
