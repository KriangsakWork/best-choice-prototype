export type ProductCardData = {
  id: number;
  productName: string;
  platform: "Shopee" | "Lazada" | "TikTok";
  price: number;
  discountPrice: number;
  percent: number;
  rating: number;
  sold: number;
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
    src: "/assets/App/Platform=TikTok Shop.jpg",
    width: 54,
    label: "TikTok Shop"
  }
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const trendIsLower = product.trendLabel.includes("ลด");
  const platformBadge = platformBadges[product.platform];

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

      <div className="real-product-card__badges" aria-label={`จำหน่ายโดย ${product.platform}${product.freeShip ? " ส่งฟรี" : ""}`}>
        <img
          className="real-product-card__platform-badge"
          src={platformBadge.src}
          alt={platformBadge.label}
          width={platformBadge.width}
          height={16}
        />
        {product.freeShip && <span className="real-product-card__shipping">ส่งฟรี</span>}
      </div>

      <span className="real-product-card__heart" aria-label="อยู่ในรายการโปรด">
        <img src="/assets/SVG/Like/Property 1=Like.svg" alt="" width={17.44} height={16} />
      </span>

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

          <div className="real-product-card__meta">
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
        </div>
      </div>
    </article>
  );
}
