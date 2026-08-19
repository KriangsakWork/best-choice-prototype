export type ResultPlatform = "Shopee" | "Lazada" | "TikTok";

export type ResultCardData = {
  id: number;
  productName: string;
  imageUrl: string;
  mainPlatform: ResultPlatform;
  otherPlatforms?: ResultPlatform[];
  price: number;
  originalPrice: number;
  rating: number;
  savings: number;
  storeCount: number;
};

const PLATFORM_ORDER: ResultPlatform[] = ["Shopee", "Lazada", "TikTok"];

const platformMeta: Record<ResultPlatform, { badge: string; icon: string; label: string }> = {
  Shopee: { badge: "/assets/product-card/shopee-badge.png", icon: "/assets/product-card/shopee-icon.png", label: "Shopee" },
  Lazada: { badge: "/assets/product-card/lazada-badge.png", icon: "/assets/product-card/lazada-icon.png", label: "Lazada" },
  TikTok: { badge: "/assets/product-card/tiktok-badge.png", icon: "/assets/product-card/tiktok-icon.png", label: "TikTok" }
};

function formatBaht(value: number) {
  return `฿${value.toLocaleString("en-US")}`;
}

export function ResultCard({
  product,
  favorite = false,
  onFavoriteToggle,
  onOpen
}: {
  product: ResultCardData;
  favorite?: boolean;
  onFavoriteToggle?: () => void;
  onOpen?: () => void;
}) {
  const otherPlatforms = product.otherPlatforms
    ?? PLATFORM_ORDER.filter((platform) => platform !== product.mainPlatform);

  return (
    <article className="result-card">
      <div
        className="result-card__body"
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          onOpen?.();
        }}
        aria-label={`${product.productName} ${formatBaht(product.price)} ดูราคาทั้งหมด`}
      >
        <div className="result-card__media">
          <img src={product.imageUrl} alt={product.productName} referrerPolicy="no-referrer" />
        </div>

        <div className="result-card__info">
          <h3>{product.productName}</h3>

          <div className="result-card__tags">
            <span className="result-card__score">
              <img src="/assets/product-card/star.svg" alt="" width={11} height={11} aria-hidden="true" />
              {product.rating}
            </span>

            <img
              className="result-card__platform-badge"
              src={platformMeta[product.mainPlatform].badge}
              alt={platformMeta[product.mainPlatform].label}
            />

            {otherPlatforms.map((platform) => (
              <img
                key={platform}
                className="result-card__platform-icon"
                src={platformMeta[platform].icon}
                alt={platformMeta[platform].label}
              />
            ))}
          </div>

          <div className="result-card__price">
            <strong>{formatBaht(product.price)}</strong>
            <del>{formatBaht(product.originalPrice)}</del>
          </div>

          <p className="result-card__savings">
            <span className="result-card__save">ประหยัด {formatBaht(product.savings)}</span>
            {` · เทียบ ${product.storeCount} ร้าน`}
          </p>

          <div className="result-card__divider" />

          <span className="result-card__cta">ดูราคาทั้งหมด ›</span>
        </div>
      </div>

      {onFavoriteToggle && (
        <button
          className="result-card__heart"
          type="button"
          aria-label={favorite ? "นำออกจากรายการสนใจ" : "เพิ่มในรายการสนใจ"}
          aria-pressed={favorite}
          onClick={(event) => {
            event.stopPropagation();
            onFavoriteToggle();
          }}
        >
          <img
            src={favorite ? "/assets/SVG/Like/Property 1=Like.svg" : "/assets/SVG/Like/Property 1=Normal.svg"}
            alt=""
            width={17.44}
            height={16}
          />
        </button>
      )}
    </article>
  );
}
