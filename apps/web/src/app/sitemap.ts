import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

const routes = [
  "",
  "/cong-cu",
  "/cong-cu/chuyen-so-thanh-chu",
  "/gioi-thieu",
  "/lien-he",
  "/chinh-sach-bao-mat",
  "/dieu-khoan-su-dung",
] as const;
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: new URL(route || "/", siteConfig.url).toString(),
    lastModified: new Date(),
    changeFrequency: route.includes("chuyen-so") ? "monthly" : "yearly",
    priority: route === "" ? 1 : route.includes("chuyen-so") ? 0.9 : 0.6,
  }));
}
