import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Best Choice — Smart Price Comparison",
    short_name: "Best Choice",
    description: "ค้นหา เปรียบเทียบ และติดตามราคาสินค้าจากหลายแพลตฟอร์ม",
    start_url: "/",
    display: "standalone",
    background_color: "#fefcfb",
    theme_color: "#fefcfb",
    icons: [
      {
        src: "/icon.png",
        sizes: "1200x1200",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icon.png",
        sizes: "1200x1200",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
