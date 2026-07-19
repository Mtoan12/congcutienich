const fallbackUrl = "http://localhost:3000";

function getSiteUrl(): URL {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? fallbackUrl);
  } catch {
    return new URL(fallbackUrl);
  }
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "VietTools",
  tagline: "Công cụ trực tuyến miễn phí dành cho người Việt",
  url: getSiteUrl(),
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "tranminhtoan1281@gmail.com",
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/",
} as const;
