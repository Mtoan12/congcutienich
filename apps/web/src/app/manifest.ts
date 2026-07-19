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
        src: "/icon.png",
        sizes: "1254x1254",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
