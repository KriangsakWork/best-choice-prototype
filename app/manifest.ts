import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Best Choice — Smart Price Comparison",
    short_name: "Best Choice",
    description: "ค้นหา เปรียบเทียบ และติดตามราคาสินค้าใน Prototype ที่สร้างจาก Figma",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fefcfb",
    theme_color: "#eb3b0c",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
