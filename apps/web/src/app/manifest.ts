import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VietTools",
    short_name: "VietTools",
    description: "Công cụ trực tuyến miễn phí dành cho người Việt",
    start_url: "/",
    display: "standalone",
    background_color: "#f8faf9",
    theme_color: "#087f72",
    lang: "vi",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
