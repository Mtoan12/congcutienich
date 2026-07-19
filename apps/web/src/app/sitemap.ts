import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { availableTools } from "@/lib/tool-registry";

const routes = [
  "",
  "/cong-cu",
  "/gioi-thieu",
  "/lien-he",
  "/chinh-sach-bao-mat",
  "/dieu-khoan-su-dung",
] as const;
export default function sitemap(): MetadataRoute.Sitemap {
  return [...routes, ...availableTools.map((tool) => tool.path)].map(
    (route) => ({
      url: new URL(route || "/", siteConfig.url).toString(),
      lastModified: new Date(),
      changeFrequency: route.startsWith("/cong-cu/") ? "monthly" : "yearly",
      priority: route === "" ? 1 : route.startsWith("/cong-cu/") ? 0.9 : 0.6,
    }),
  );
}
