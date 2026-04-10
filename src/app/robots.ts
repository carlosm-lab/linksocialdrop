import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/es/admin/",
        "/en/admin/",
        "/dashboard/",
        "/es/dashboard/",
        "/en/dashboard/",
        "/login",
        "/es/login",
        "/en/login",
        "/sandbox",
        "/auth/",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
