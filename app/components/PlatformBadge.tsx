import type { CSSProperties } from "react";

export type PlatformBadgeName = "Lazada" | "Shopee" | "TikTok" | "MALL";

const platformBadgeVisuals: Record<
  PlatformBadgeName,
  { src: string; label: string; width: number; height: number }
> = {
  Lazada: {
    src: "/assets/App/Platform=Lazada.jpg",
    label: "Lazada",
    width: 56,
    height: 20
  },
  Shopee: {
    src: "/assets/App/Platform=Shopee.jpg",
    label: "Shopee",
    width: 57,
    height: 20
  },
  TikTok: {
    src: "/assets/App/Platform=TikTok Shop.jpg",
    label: "TikTok",
    width: 52,
    height: 20
  },
  MALL: {
    src: "/assets/App/Platform=MALL.jpg",
    label: "MALL",
    width: 46,
    height: 16
  }
};

export function PlatformBadge({ platform }: { platform: PlatformBadgeName }) {
  const visual = platformBadgeVisuals[platform];
  const style = {
    "--platform-badge-width": `${visual.width}px`,
    "--platform-badge-height": `${visual.height}px`
  } as CSSProperties;

  return (
    <span className="platform-badge-crop" style={style}>
      <img src={visual.src} alt={visual.label} />
    </span>
  );
}
