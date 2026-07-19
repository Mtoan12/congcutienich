const fallbackUrl = "http://localhost:3000";

function optionalValue(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

function optionalHttpUrl(value: string | undefined): string | undefined {
  const normalized = optionalValue(value);
  if (!normalized) return undefined;
  try {
    const url = new URL(normalized);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function optionalEmail(value: string | undefined): string | undefined {
  const normalized = optionalValue(value);
  return normalized && /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(normalized)
    ? normalized
    : undefined;
}

function getSiteUrl(): URL {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? fallbackUrl);
    if (process.env.VERCEL_ENV === "production" && url.protocol !== "https:") {
      throw new Error("Production site URL must use HTTPS");
    }
    return url;
  } catch {
    if (process.env.VERCEL_ENV === "production") {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL must be a valid HTTPS URL in production",
      );
    }
    return new URL(fallbackUrl);
  }
}

export const siteConfig = {
  name: optionalValue(process.env.NEXT_PUBLIC_SITE_NAME) || "VietTools",
  tagline: "Công cụ trực tuyến miễn phí dành cho người Việt",
  url: getSiteUrl(),
  contactEmail: optionalEmail(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  githubUrl: optionalHttpUrl(process.env.NEXT_PUBLIC_GITHUB_URL),
} as const;
