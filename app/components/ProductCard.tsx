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
  return value.toLocaleString("en-US");
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const trendIsLower = product.trendLabel.includes("ลด");

  return (
    <article className="real-product-card" aria-label={`${product.productName} ราคา ${formatPrice(product.discountPrice)} บาท`}>
      <div className="real-product-card__media">
        <img
          className="real-product-card__photo"
          src={product.imageUrl}
          alt={product.productName}
          referrerPolicy="no-referrer"
        />
        <div className="real-product-card__badges" aria-label={`จำหน่ายโดย ${product.platform}${product.freeShip ? " ส่งฟรี" : ""}`}>
          <span className="real-product-card__platform">
            {product.platform === "Shopee" && (
              <img src="/assets/product-card/shopee-mark.svg" alt="" aria-hidden="true" />
            )}
            {product.platform}
          </span>
          {product.freeShip && <span className="real-product-card__shipping">ส่งฟรี</span>}
        </div>
        <span className="real-product-card__heart" aria-label="อยู่ในรายการโปรด">
          <img src="/assets/product-card/heart-filled.svg" alt="" />
        </span>
      </div>

      <div className="real-product-card__info">
        <h3>{product.productName}</h3>

        <div className="real-product-card__price-row">
          <strong>฿{formatPrice(product.discountPrice)}</strong>
          <del>฿{formatPrice(product.price)}</del>
        </div>

        <div className={`real-product-card__trend ${trendIsLower ? "is-lower" : ""}`}>
          <img src="/assets/product-card/trend-up.svg" alt="" aria-hidden="true" />
          <span>{product.trendLabel}</span>
          <b>{product.trendPercent}%</b>
        </div>

        <div className="real-product-card__meta">
          <span className="real-product-card__rating">
            <img src="/assets/product-card/star.svg" alt="" aria-hidden="true" />
            {product.rating}
          </span>
          <span className="real-product-card__separator" aria-hidden="true">|</span>
          <span>ขายแล้ว</span>
          <span>{product.sold}</span>
          <span>ชิ้น</span>
        </div>
      </div>
    </article>
  );
}
