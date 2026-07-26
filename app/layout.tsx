import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/noto-sans-thai";
import "./globals.css";
import "./search-animation.css";
import "./catalog-flow.css";
import { CatalogFlowFigma } from "./components/CatalogFlowFigma";

export const metadata: Metadata = {
  title: "Best Choice — Smart Price Comparison",
  description: "Interactive price-comparison prototype recreated from Figma.",
  applicationName: "Best Choice",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Best Choice"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#fefcfb"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>
        {children}
        <CatalogFlowFigma />
      </body>
    </html>
  );
}
