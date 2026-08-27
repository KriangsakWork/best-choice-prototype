"use client";

import { useState } from "react";

export type ProductCategory = "รองเท้า" | "Accessory";

export type ProductCardData = {
  id: number;
  productName: string;
  category?: ProductCategory;
  platform: "Shopee" | "Lazada" | "TikTok";
  price: number;
  discountPrice: number;
  percent: number;
  rating: number;
  sold: number | string;
  freeShip: boolean;
  mall: boolean;
  imageUrl: string;
  productUrl: string;
  averagePrice: number;
  trendLabel: string;
  trendPercent: number;
};

function formatPrice(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

const platformBadges: Record<ProductCardData["platform"], { src: string; width: number; label: string }> = {
  Lazada: {
    src: "/assets/App/Platform=Lazada.jpg",
    width: 58,
    label: "Lazada"
  },
  Shopee: {
    src: "/assets/App/Platform=Shopee.jpg",
    width: 59,
    label: "Shopee"
  },
  TikTok: {
    src: "/assets/App/Platform=TikTok-Shop.jpg",
    width: 54,
    label: "TikTok Shop"
  }
};

function HeartButton({ favorite, onToggle }: { favorite: boolean; onToggle: () => void }) {
  const [bumpKey, setBumpKey] = useState(0);
  return (
    <button
      className={`real-product-card__heart${bumpKey > 0 ? " is-bumping" : ""}`}
      type="button"
      aria-label={favorite ? "นำออกจากรายการสนใจ" : "เพิ่มในรายการสนใจ"}
      aria-pressed={favorite}
      onClick={(event) => {
        event.stopPropagation();
        setBumpKey((k) => k + 1);
        onToggle();
      }}
    >
      <img
        key={`heart-${bumpKey}`}
        src={favorite ? "/assets/SVG/Like/Property-1=Like.svg" : "/assets/SVG/Like/Property-1=Normal.svg"}
        alt=""
        width={17.44}
        height={16}
      />
    </button>
  );
}

export function ProductBadges({
  product,
  showMall = false,
  className = ""
}: {
  product: ProductCardData;
  showMall?: boolean;
  className?: string;
}) {
  const platformBadge = platformBadges[product.platform];

  return (
    <div
      className={className}
      aria-label={`จำหน่ายโดย ${product.platform}${product.mall ? " Mall" : ""}${product.freeShip ? " ส่งฟรี" : ""}`}
    >
      {showMall && product.mall && (
        <img
          className="real-product-card__platform-badge"
          src="/assets/App/Platform=MALL.jpg"
          alt="MALL"
          width={46}
          height={16}
        />
      )}
      <img
        className="real-product-card__platform-badge"
        src={platformBadge.src}
        alt={platformBadge.label}
        width={platformBadge.width}
        height={16}
      />
      {product.freeShip && <span className="real-product-card__shipping">ส่งฟรี</span>}
    </div>
  );
}

export function ProductMeta({
  product,
  className = ""
}: {
  product: ProductCardData;
  className?: string;
}) {
  return (
    <div className={`real-product-card__meta ${className}`.trim()}>
      <span className="real-product-card__rating">
        <img src="/assets/product-card/star.svg" alt="" width={12} height={12} aria-hidden="true" />
        {product.rating}
      </span>
      <span className="real-product-card__separator" aria-hidden="true">|</span>
      <span className="real-product-card__sales">
        <span>ขายแล้ว</span>
        <span>{product.sold}</span>
        <span>ชิ้น</span>
      </span>
    </div>
  );
}

export function ProductCard({
  product,
  favorite = true,
  onFavoriteToggle
}: {
  product: ProductCardData;
  favorite?: boolean;
  onFavoriteToggle?: () => void;
}) {
  const trendIsLower = product.trendLabel.includes("ลด");

  return (
    <article className="real-product-card" aria-label={`${product.productName} ราคา ${formatPrice(product.discountPrice)} บาท`}>
      <div className="real-product-card__media">
        <img
          className="real-product-card__photo"
          src={product.imageUrl}
          alt={product.productName}
          width={362}
          height={246}
          referrerPolicy="no-referrer"
        />
      </div>

      <ProductBadges product={product} className="real-product-card__badges" />

      {onFavoriteToggle ? (
        <HeartButton favorite={favorite} onToggle={onFavoriteToggle} />
      ) : (
        <span className="real-product-card__heart" aria-label="อยู่ในรายการสนใจ">
          <img src="/assets/SVG/Like/Property-1=Like.svg" alt="" width={17.44} height={16} />
        </span>
      )}

      <div className="real-product-card__info">
        <h3>{product.productName}</h3>

        <div className="real-product-card__price-row">
          <strong>฿{formatPrice(product.discountPrice)}</strong>
          <del>฿{formatPrice(product.price)}</del>
        </div>

        <div className="real-product-card__rating-sales">
          <div className={`real-product-card__trend ${trendIsLower ? "is-lower" : ""}`}>
            <img src="/assets/product-card/trend-up.svg" alt="" width={12} height={12} aria-hidden="true" />
            <span>{product.trendLabel}</span>
            <b>{product.trendPercent}%</b>
          </div>

          <ProductMeta product={product} />
        </div>
      </div>
    </article>
  );
}
